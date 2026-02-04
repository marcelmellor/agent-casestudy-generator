import OpenAI from 'openai';

// GPT-4o - Das neueste und leistungsstärkste OpenAI Modell
const MODEL = 'gpt-4o';

// Prüfe, ob wir in Produktion sind (Netlify)
const isProduction = () => {
  return !import.meta.env.VITE_OPENAI_API_KEY;
};

// Initialisiere den OpenAI Client (nur für Entwicklung)
const getOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_OPENAI_API_KEY nicht gefunden. Bitte erstellen Sie eine .env Datei mit Ihrem API-Key.');
  }

  return new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Nur für Entwicklung!
  });
};

/**
 * Generiert Case Study über Netlify Function (Produktion)
 */
const generateViaNetlifyFunction = async (systemPrompt, userPrompt) => {
  const response = await fetch('/.netlify/functions/generate-casestudy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      provider: 'openai',
      systemPrompt,
      userPrompt
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Netlify Function error');
  }

  return await response.json();
};

/**
 * Generiert Case Study direkt über OpenAI (Entwicklung)
 */
const generateViaDirect = async (systemPrompt, userPrompt) => {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 1,
    max_tokens: 8000,
    response_format: { type: "json_object" }
  });

  const text = response.choices[0]?.message?.content || '';
  const caseStudy = JSON.parse(text);

  return {
    success: true,
    data: caseStudy,
    model: MODEL,
    usage: {
      inputTokens: response.usage.prompt_tokens,
      outputTokens: response.usage.completion_tokens,
      totalTokens: response.usage.total_tokens
    }
  };
};

/**
 * Generiert eine Case Study mit GPT-4o
 * @param {string} systemPrompt - Der System-Prompt mit allen Anweisungen
 * @param {string} userPrompt - Der User-Prompt mit den spezifischen Anforderungen
 * @returns {Promise<Object>} Die generierte Case Study als JSON-Objekt
 */
export const generateCaseStudy = async (systemPrompt, userPrompt) => {
  try {
    // In Produktion (Netlify): Nutze sichere Backend-Function
    // In Entwicklung: Direkter API-Aufruf
    if (isProduction()) {
      return await generateViaNetlifyFunction(systemPrompt, userPrompt);
    } else {
      return await generateViaDirect(systemPrompt, userPrompt);
    }
  } catch (error) {
    console.error('Fehler bei der Case Study Generierung:', error);

    return {
      success: false,
      error: error.message || 'Unbekannter Fehler bei der API-Anfrage',
      details: error
    };
  }
};

/**
 * Überprüft, ob der API-Key konfiguriert ist
 * @returns {boolean}
 */
export const isApiKeyConfigured = () => {
  // In Produktion ist der Key auf dem Server, nicht im Client
  // In Entwicklung prüfen wir die VITE_ Variable
  return isProduction() || !!import.meta.env.VITE_OPENAI_API_KEY;
};

/**
 * Gibt Informationen über das verwendete Modell zurück
 * @returns {Object}
 */
export const getModelInfo = () => {
  return {
    name: 'GPT-4o',
    id: MODEL,
    description: 'OpenAI\'s neuestes und leistungsstärkstes Modell',
    releaseDate: '2024'
  };
};
