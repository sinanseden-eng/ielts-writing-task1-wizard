const https = require('https');

// Helper to call Google Gemini API with Exponential Backoff
async function callGemini(systemInstruction, userPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
  const payload = JSON.stringify({
    contents: [{ parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] }
  });

  const makeRequest = () => {
    return new Promise((resolve, reject) => {
      const req = https.request(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (res) => {
        let responseData = '';
        res.on('data', (chunk) => { responseData += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const parsed = JSON.parse(responseData);
              const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
              resolve(text || "Error: No response generated.");
            } catch (err) {
              reject(new Error("Failed to parse Gemini response JSON."));
            }
          } else {
            reject(new Error(`API returned status code ${res.statusCode}: ${responseData}`));
          }
        });
      });

      req.on('error', (e) => reject(e));
      req.write(payload);
      req.end();
    });
  };

  let retries = 3;
  let delay = 1000;
  while (retries > 0) {
    try {
      return await makeRequest();
    } catch (error) {
      retries--;
      if (retries === 0) throw error;
      await new Promise((res) => setTimeout(res, delay));
      delay *= 2;
    }
  }
}

exports.handler = async (event, context) => {
  // Guard against non-POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { type, payload } = JSON.parse(event.body);

    let systemInstruction = '';
    let userPrompt = '';

    if (type === 'essay') {
      systemInstruction = `You are a strict, highly uncompromising, and incredibly sarcastic IELTS Examiner grading an Academic Writing Task 1 report. 
      First, count the words. If the essay is under 150 words, automatically apply a severe penalty and point this out in a witty, sarcastic manner.
      Generate an 'Error Hit List' using symbols: Sp (Spelling), T (Tense), WW (Wrong Word), S-V (Subject-Verb agreement), and P (Punctuation).
      Provide grading feedback strictly based on:
      - Task Achievement (Must include a clear overview and supported key features with data)
      - Coherence & Cohesion (Logically grouped body paragraphs, penalty for robotic linkers)
      - Lexical Resource (Appropriate academic terminology, range of descriptors)
      - Grammatical Range & Accuracy (Tenses, complex structures, passive voice if a process)
      Adopt a professional yet humorous and mocking tone suitable for modern dry workplace humor. Format elegantly with Markdown.`;
      userPrompt = `Task Prompt: ${payload.promptDetails}\n\nStudent Essay:\n${payload.essay}`;

    } else if (type === 'paraphrase') {
      systemInstruction = `You are a witty, highly sarcastic IELTS Writing tutor. 
      The student has tried to paraphrase an Academic Task 1 prompt. 
      Evaluate their grammar, range of vocabulary, and semantic equivalence. 
      State whether their attempt is Band 5 (dry, copied), Band 6 (awkward thesaurus vomiting), or Band 7+ (perfectly balanced). 
      Point out what they did correctly or where they made mistakes using dry office humor. Format in Markdown.`;
      userPrompt = `Original Prompt: "${payload.original}"\n\nStudent's Paraphrase: "${payload.paraphrase}"`;

    } else if (type === 'deepdive') {
      systemInstruction = `You are an expert, sarcastic IELTS Academic Task 1 tutor evaluating a student's answer to a strategic guiding question.
      Highlight if they missed any crucial metrics, timeline items, or dates. 
      Provide a model answer and grading feedback in a witty corporate-cynic persona. Format in Markdown.`;
      userPrompt = `Guiding Question: "${payload.question}"\n\nStudent's Answer:\n${payload.answer}`;

    } else if (type === 'quiz') {
      systemInstruction = `You are a sarcastic IELTS examiner assessing a student's choice of a paraphrase.
      The student selected a specific multiple-choice option for an original prompt.
      In 3-4 concise, dry sentences, explain why their choice is either fantastic (Band 7+) or dreadful (e.g. missing dates, locations, or oversimplifying). Format in Markdown.`;
      userPrompt = `Original Prompt: "${payload.prompt}"\n\nStudent Selected Option: "${payload.optionText}"`;

    } else {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid Request Type" }) };
    }

    const aiResponse = await callGemini(systemInstruction, userPrompt);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result: aiResponse })
    };

  } catch (error) {
    console.error("Netlify Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "The examiner had an existential breakdown. Please try again." })
    };
  }
};
