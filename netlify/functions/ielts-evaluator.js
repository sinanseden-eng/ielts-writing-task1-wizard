const DEFAULT_MODEL = 'gemini-3.8-flash';
const MAX_ATTEMPTS = 3;
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);

const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  }
});

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

class GeminiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'GeminiError';
    this.statusCode = statusCode;
  }
}

const getGeminiModel = () => process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;

async function requestGemini(apiKey, model, payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      }
    );

    const rawBody = await response.text();
    let data = {};

    try {
      data = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      throw new GeminiError('Gemini returned an unreadable response.', response.status || 502);
    }

    if (!response.ok) {
      const apiMessage = data?.error?.message || `Gemini returned HTTP ${response.status}.`;
      throw new GeminiError(apiMessage, response.status);
    }

    const generatedText = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join('\n')
      .trim();

    if (!generatedText) {
      const finishReason = data.candidates?.[0]?.finishReason;
      const detail = finishReason ? ` Finish reason: ${finishReason}.` : '';
      throw new GeminiError(`Gemini returned no feedback.${detail}`, 502);
    }

    return generatedText;
  } finally {
    clearTimeout(timeout);
  }
}

async function callGemini(systemInstruction, userPrompt) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    const error = new Error('GEMINI_API_KEY is not configured in Netlify.');
    error.code = 'GEMINI_KEY_MISSING';
    throw error;
  }

  const model = getGeminiModel();
  const payload = {
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] }
  };

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    try {
      return await requestGemini(apiKey, model, payload);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const isTransientNetworkError = error.name === 'AbortError' || error instanceof TypeError;
      const shouldRetry = isTransientNetworkError || RETRYABLE_STATUS_CODES.has(statusCode);

      if (!shouldRetry || attempt === MAX_ATTEMPTS - 1) throw error;

      const backoff = (1000 * (2 ** attempt)) + Math.floor(Math.random() * 250);
      await wait(backoff);
    }
  }

  throw new Error('Gemini request failed unexpectedly.');
}

function createPrompt(type, payload) {
  if (!payload || typeof payload !== 'object') return null;

  if (type === 'essay') {
    return {
      systemInstruction: `You are a strict, highly uncompromising, and incredibly sarcastic IELTS Examiner grading an Academic Writing Task 1 report.
First, count the words. If the essay is under 150 words, automatically apply a severe penalty and point this out in a witty, sarcastic manner.
Generate an 'Error Hit List' using symbols: Sp (Spelling), T (Tense), WW (Wrong Word), S-V (Subject-Verb agreement), and P (Punctuation).
Provide grading feedback strictly based on:
- Task Achievement (Must include a clear overview and supported key features with data)
- Coherence & Cohesion (Logically grouped body paragraphs, penalty for robotic linkers)
- Lexical Resource (Appropriate academic terminology, range of descriptors)
- Grammatical Range & Accuracy (Tenses, complex structures, passive voice if a process)
Adopt a professional yet humorous and mocking tone suitable for modern dry workplace humor. Format elegantly with Markdown.`,
      userPrompt: `Task Prompt: ${payload.promptDetails || ''}\n\nStudent Essay:\n${payload.essay || ''}`
    };
  }

  if (type === 'paraphrase') {
    return {
      systemInstruction: `You are a witty, highly sarcastic IELTS Writing tutor.
The student has tried to paraphrase an Academic Task 1 prompt.
Evaluate their grammar, range of vocabulary, and semantic equivalence.
State whether their attempt is Band 5 (dry, copied), Band 6 (awkward thesaurus vomiting), or Band 7+ (perfectly balanced).
Point out what they did correctly or where they made mistakes using dry office humor. Format in Markdown.`,
      userPrompt: `Original Prompt: "${payload.original || ''}"\n\nStudent's Paraphrase: "${payload.paraphrase || ''}"`
    };
  }

  if (type === 'deepdive') {
    return {
      systemInstruction: `You are an expert, sarcastic IELTS Academic Task 1 tutor evaluating a student's answer to a strategic guiding question.
Highlight if they missed any crucial metrics, timeline items, or dates.
Provide a model answer and grading feedback in a witty corporate-cynic persona. Format in Markdown.`,
      userPrompt: `Guiding Question: "${payload.question || ''}"\n\nStudent's Answer:\n${payload.answer || ''}`
    };
  }

  if (type === 'quiz') {
    return {
      systemInstruction: `You are a sarcastic IELTS examiner assessing a student's choice of a paraphrase.
The student selected a specific multiple-choice option for an original prompt.
In 3-4 concise, dry sentences, explain why their choice is either fantastic (Band 7+) or dreadful (for example, missing dates, locations, or oversimplifying). Format in Markdown.`,
      userPrompt: `Original Prompt: "${payload.prompt || ''}"\n\nStudent Selected Option: "${payload.optionText || ''}"`
    };
  }

  return null;
}

function publicError(error) {
  if (error.code === 'GEMINI_KEY_MISSING') {
    return {
      status: 500,
      code: error.code,
      message: 'AI feedback is not configured. Add GEMINI_API_KEY in Netlify environment variables and redeploy.'
    };
  }

  const statusCode = error.statusCode;
  if (statusCode === 400) {
    return { status: 502, code: 'GEMINI_BAD_REQUEST', message: 'Gemini rejected the request. Check the configured model and request format.' };
  }
  if (statusCode === 401 || statusCode === 403) {
    return { status: 502, code: 'GEMINI_AUTH_ERROR', message: 'Gemini rejected the API key or project access. Check GEMINI_API_KEY and its project permissions.' };
  }
  if (statusCode === 404) {
    return { status: 502, code: 'GEMINI_MODEL_UNAVAILABLE', message: `The configured Gemini model (${getGeminiModel()}) is unavailable for this API key.` };
  }
  if (statusCode === 429) {
    return { status: 503, code: 'GEMINI_QUOTA_EXCEEDED', message: 'Gemini quota or billing limit reached. Check the Gemini API project quota and billing status.' };
  }
  if (statusCode >= 500 || error.name === 'AbortError' || error instanceof TypeError) {
    return { status: 503, code: 'GEMINI_TEMPORARILY_UNAVAILABLE', message: 'Gemini is temporarily unavailable. Please try again shortly.' };
  }

  return { status: 500, code: 'INTERNAL_ERROR', message: 'AI feedback could not be generated. Check the Netlify function logs.' };
}

export default async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method Not Allowed', code: 'METHOD_NOT_ALLOWED' }, 405);
  }

  try {
    let requestBody;
    try {
      requestBody = await request.json();
    } catch {
      return jsonResponse({ error: 'The request body must be valid JSON.', code: 'INVALID_JSON' }, 400);
    }

    const prompt = createPrompt(requestBody?.type, requestBody?.payload);
    if (!prompt) {
      return jsonResponse({ error: 'Invalid request type or payload.', code: 'INVALID_REQUEST' }, 400);
    }

    const result = await callGemini(prompt.systemInstruction, prompt.userPrompt);
    return jsonResponse({ result, model: getGeminiModel() });
  } catch (error) {
    console.error('IELTS evaluator error:', {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode
    });

    const responseError = publicError(error);
    return jsonResponse({ error: responseError.message, code: responseError.code }, responseError.status);
  }
};

