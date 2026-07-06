import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('essay');
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Sends data to your Netlify function at the proxied endpoint
      const response = await fetch('/api/ielts-evaluator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: activeTab, 
          payload: { essay: input, promptDetails: 'Standard Task 1 Prompt' } 
        }),
      });

      if (!response.ok) throw new Error('Failed to reach the examiner.');
      
      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-800 p-6">
      <div className="max-w-3xl mx-auto content-card p-8 rounded-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center font-lora">IELTS Task 1 Wizard</h1>
        
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          {['essay', 'paraphrase', 'deepdive'].map(tab => (
            <button 
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'tab-active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <textarea
          className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder={`Enter your ${activeTab} here...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full btn-glow"
        >
          {loading ? 'Examiner is thinking...' : 'Analyze My Work'}
        </button>

        {/* Results Display */}
        {error && <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}
        {result && (
          <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-gray-200 shadow-inner">
            <h3 className="font-bold mb-2">Examiner Feedback:</h3>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
