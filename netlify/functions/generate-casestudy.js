/**
 * Netlify Function: Case Study Generator Proxy
 *
 * Diese Funktion handhabt API-Anfragen an OpenAI und Anthropic Claude
 * und hält die API-Keys sicher auf dem Server.
 */

export default async (req, context) => {
  // Nur POST-Anfragen erlauben
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { provider, systemPrompt, userPrompt } = await req.json();

    // Provider validieren
    if (!['openai', 'claude'].includes(provider)) {
      return new Response(
        JSON.stringify({ error: 'Invalid provider. Use "openai" or "claude"' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prompts validieren
    if (!systemPrompt || !userPrompt) {
      return new Response(
        JSON.stringify({ error: 'systemPrompt and userPrompt are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let result;

    if (provider === 'openai') {
      result = await generateWithOpenAI(systemPrompt, userPrompt);
    } else {
      result = await generateWithClaude(systemPrompt, userPrompt);
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

/**
 * Generiert Case Study mit OpenAI GPT-4o
 */
async function generateWithOpenAI(systemPrompt, userPrompt) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY nicht konfiguriert');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 1,
      max_tokens: 8000,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI API error');
  }

  const data = await response.json();
  const text = data.choices[0]?.message?.content || '';
  const caseStudy = JSON.parse(text);

  return {
    success: true,
    data: caseStudy,
    model: 'gpt-4o',
    usage: {
      inputTokens: data.usage.prompt_tokens,
      outputTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens
    }
  };
}

/**
 * Generiert Case Study mit Anthropic Claude
 */
async function generateWithClaude(systemPrompt, userPrompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY nicht konfiguriert');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5-20251101',
      max_tokens: 8000,
      temperature: 1,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Claude API error');
  }

  const data = await response.json();
  const text = data.content[0]?.text || '';

  // Extrahiere JSON aus der Antwort
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Keine gültige JSON-Antwort von Claude erhalten');
  }

  const caseStudy = JSON.parse(jsonMatch[0]);

  return {
    success: true,
    data: caseStudy,
    model: 'claude-opus-4-5-20251101',
    usage: {
      inputTokens: data.usage.input_tokens,
      outputTokens: data.usage.output_tokens,
      totalTokens: data.usage.input_tokens + data.usage.output_tokens
    }
  };
}
