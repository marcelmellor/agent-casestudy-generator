import Anthropic from '@anthropic-ai/sdk';

// Initialisiere den Anthropic Client
const getAnthropicClient = () => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_ANTHROPIC_API_KEY nicht gefunden. Bitte erstellen Sie eine .env Datei mit Ihrem API-Key.');
  }

  return new Anthropic({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Nur für Entwicklung! In Produktion über Backend
  });
};

// Claude Opus 4.5 - Das beste verfügbare Modell (Stand Januar 2025)
const MODEL = 'claude-opus-4-5-20251101';

/**
 * Generiert eine Case Study mit Claude Opus 4.5
 * @param {string} systemPrompt - Der System-Prompt mit allen Anweisungen
 * @param {string} userPrompt - Der User-Prompt mit den spezifischen Anforderungen
 * @returns {Promise<Object>} Die generierte Case Study als JSON-Objekt
 */
export const generateCaseStudy = async (systemPrompt, userPrompt) => {
  try {
    const client = getAnthropicClient();

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 8000,
      temperature: 1,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    // Extrahiere den Text aus der Response
    const text = response.content[0]?.text || '';

    // Versuche JSON zu parsen
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Keine gültige JSON-Antwort vom Modell erhalten');
    }

    const caseStudy = JSON.parse(jsonMatch[0]);

    return {
      success: true,
      data: caseStudy,
      model: MODEL,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens
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
  return !!import.meta.env.VITE_ANTHROPIC_API_KEY;
};

/**
 * Gibt Informationen über das verwendete Modell zurück
 * @returns {Object}
 */
export const getModelInfo = () => {
  return {
    name: 'Claude Opus 4.5',
    id: MODEL,
    description: 'Das leistungsstärkste Claude-Modell für komplexe Aufgaben',
    releaseDate: '2025-11-01'
  };
};
