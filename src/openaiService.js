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
const generateViaDirect = async (systemPrompt, userPrompt, retryCount = 0) => {
  const client = getOpenAIClient();
  const MAX_RETRIES = 2;

  try {
    console.log(`🚀 Sending request to OpenAI (Attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);

    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7, // Reduziert von 1 für schnellere, fokussiertere Antworten
      max_tokens: 16000,
      response_format: { type: "json_object" },
      timeout: 180000 // 3 Minuten Timeout (erhöht von 2 Minuten)
    });

    console.log('✅ Received response from OpenAI');
    console.log('📊 Tokens used:', response.usage.total_tokens);

    const text = response.choices[0]?.message?.content || '';

    // Prüfe ob die Antwort komplett ist
    if (response.choices[0]?.finish_reason === 'length') {
      console.warn('⚠️ Response was cut off due to token limit!');
      throw new Error('Die Antwort war zu lang und wurde abgeschnitten. Versuche es mit weniger Playbooks.');
    }

    // Bessere Fehlerbehandlung beim JSON-Parsing
    try {
      const caseStudy = JSON.parse(text);
      console.log('✅ Successfully parsed JSON');
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
    } catch (parseError) {
      console.error('❌ JSON Parse Error. Response length:', text.length);
      console.error('First 500 chars:', text.substring(0, 500));
      console.error('Last 500 chars:', text.substring(text.length - 500));

      // Retry bei Parse-Fehler
      if (retryCount < MAX_RETRIES) {
        console.log(`🔄 Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 Sekunden warten
        return generateViaDirect(systemPrompt, userPrompt, retryCount + 1);
      }

      throw new Error(`Ungültige JSON-Antwort von OpenAI nach ${MAX_RETRIES + 1} Versuchen. Bitte versuche es erneut.`);
    }
  } catch (apiError) {
    console.error('❌ OpenAI API Error:', apiError);
    console.error('Error status:', apiError.status);
    console.error('Error message:', apiError.message);

    // Retry bei 429 (Rate Limit)
    if (apiError.status === 429 && retryCount < MAX_RETRIES) {
      const waitTime = (retryCount + 1) * 3000; // 3, 6 Sekunden
      console.log(`⏱️ Rate limit hit. Waiting ${waitTime/1000}s before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return generateViaDirect(systemPrompt, userPrompt, retryCount + 1);
    }

    // Retry bei Server-Fehlern
    if ((apiError.status === 500 || apiError.status === 502 || apiError.status === 503) && retryCount < MAX_RETRIES) {
      console.log(`🔄 Server error. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return generateViaDirect(systemPrompt, userPrompt, retryCount + 1);
    }

    // Spezifische Fehlermeldungen
    if (apiError.status === 401) {
      throw new Error('❌ Ungültiger API-Key. Bitte erstellen Sie einen neuen Key auf platform.openai.com/api-keys');
    } else if (apiError.status === 429) {
      throw new Error('⏱️ Rate Limit erreicht. Bitte warten Sie 10-20 Sekunden und versuchen Sie es erneut.');
    } else if (apiError.status === 500 || apiError.status === 502 || apiError.status === 503) {
      throw new Error('🔧 OpenAI Server-Fehler nach mehreren Versuchen. Bitte versuchen Sie es später erneut.');
    } else if (apiError.message && apiError.message.includes('<HTML>')) {
      throw new Error('❌ API-Key Problem: OpenAI gibt HTML statt JSON zurück.');
    }

    throw new Error(`OpenAI API Fehler: ${apiError.message || 'Unbekannter Fehler'}`);
  }
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
    description: 'Höchste Qualität für professionelle Case Studies',
    releaseDate: '2024'
  };
};
