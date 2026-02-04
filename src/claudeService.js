import Anthropic from '@anthropic-ai/sdk';

// Claude Opus 4.5 - Das beste verfügbare Modell (Stand Januar 2025)
const MODEL = 'claude-opus-4-5-20251101';

// Prüfe, ob wir in Produktion sind (Netlify)
const isProduction = () => {
  return !import.meta.env.VITE_ANTHROPIC_API_KEY;
};

// Initialisiere den Anthropic Client (nur für Entwicklung)
const getAnthropicClient = () => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_ANTHROPIC_API_KEY nicht gefunden. Bitte erstellen Sie eine .env Datei mit Ihrem API-Key.');
  }

  return new Anthropic({
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
      provider: 'claude',
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
 * Generiert Case Study direkt über Anthropic (Entwicklung)
 */
const generateViaDirect = async (systemPrompt, userPrompt) => {
  const client = getAnthropicClient();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    temperature: 1,
    system: systemPrompt,
    messages: [
      { role: 'user', content: userPrompt }
    ]
  });

  const text = response.content[0]?.text || '';
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
};

/**
 * Generiert eine Case Study mit Claude Opus 4.5
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
  return isProduction() || !!import.meta.env.VITE_ANTHROPIC_API_KEY;
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
