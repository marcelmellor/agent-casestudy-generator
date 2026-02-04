import OpenAI from 'openai';

// Initialisiere den OpenAI Client
const getOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_OPENAI_API_KEY nicht gefunden. Bitte erstellen Sie eine .env Datei mit Ihrem API-Key.');
  }

  return new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Nur für Entwicklung! In Produktion über Backend
  });
};

// GPT-4o - Das neueste und leistungsstärkste OpenAI Modell
const MODEL = 'gpt-4o';

/**
 * Generiert eine Case Study mit GPT-4o
 * @param {string} systemPrompt - Der System-Prompt mit allen Anweisungen
 * @param {string} userPrompt - Der User-Prompt mit den spezifischen Anforderungen
 * @returns {Promise<Object>} Die generierte Case Study als JSON-Objekt
 */
export const generateCaseStudy = async (systemPrompt, userPrompt) => {
  try {
    const client = getOpenAIClient();

    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 1,
      max_tokens: 8000,
      response_format: { type: "json_object" } // Erzwingt JSON-Ausgabe
    });

    // Extrahiere den Text aus der Response
    const text = response.choices[0]?.message?.content || '';

    // Parse JSON
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
  return !!import.meta.env.VITE_OPENAI_API_KEY;
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
