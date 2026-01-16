interface Env {
  CEREBRAS_API_KEY: string;
  GEMINI_API_KEY: string;
  GROK_API_KEY: string;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

// Cerebras API
async function callCerebras(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  temperature: number,
  maxTokens: number
) {
  const supportedModels = [
    'llama-3.3-70b', 'llama3.1-8b', 'qwen-3-32b',
    'qwen-3-235b-a22b-instruct-2507', 'gpt-oss-120b',
  ];
  const modelId = supportedModels.includes(model) ? model : 'llama-3.3-70b';

  const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cerebras API error (${response.status}): ${error}`);
  }

  const data: any = await response.json();
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid Cerebras response');
  }
  return data.choices[0].message.content;
}

// Gemini API
async function callGemini(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  temperature: number,
  maxTokens: number
) {
  const supportedModels = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.5-pro'];
  const modelId = supportedModels.includes(model) ? model : 'gemini-2.5-flash';

  const systemMessage = messages.find(m => m.role === 'system');
  const chatMessages = messages.filter(m => m.role !== 'system');

  const contents = chatMessages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const adjustedMaxTokens = modelId.includes('2.5') ? maxTokens + 1024 : maxTokens;

  const requestBody: any = {
    contents,
    generationConfig: {
      temperature,
      maxOutputTokens: adjustedMaxTokens,
    },
  };

  if (systemMessage) {
    requestBody.systemInstruction = {
      parts: [{ text: systemMessage.content }],
    };
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${error}`);
  }

  const data: any = await response.json();
  const candidate = data.candidates?.[0];

  if (!candidate?.content?.parts?.[0]?.text) {
    if (candidate?.finishReason === 'SAFETY') {
      throw new Error('Gemini blocked due to safety filters');
    }
    throw new Error('Invalid Gemini response');
  }

  return candidate.content.parts[0].text;
}

// Grok API
async function callGrok(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  temperature: number,
  maxTokens: number
) {
  const supportedModels = [
    'grok-4-1-fast-reasoning', 'grok-4-1-fast-non-reasoning',
    'grok-4', 'grok-4-fast-non-reasoning', 'grok-code-fast-1',
    'grok-3', 'grok-3-fast', 'grok-3-mini', 'grok-3-mini-fast',
    'grok-2-1212', 'grok-2-vision-1212',
  ];
  const modelId = supportedModels.includes(model) ? model : 'grok-3-mini-fast';

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Grok API error (${response.status}): ${error}`);
  }

  const data: any = await response.json();
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid Grok response');
  }
  return data.choices[0].message.content;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const body: ChatRequest = await request.json();
    const { model, messages, temperature = 0.7, maxTokens = 1024, systemPrompt } = body;

    const allMessages: ChatMessage[] = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages;

    let content: string;

    const cerebrasModels = ['llama-3.3-70b', 'llama3.1-8b', 'qwen-3-32b', 'qwen-3-235b-a22b-instruct-2507', 'gpt-oss-120b'];
    const geminiModels = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.5-pro'];
    const grokModels = [
      'grok-4-1-fast-reasoning', 'grok-4-1-fast-non-reasoning',
      'grok-4', 'grok-4-fast-non-reasoning', 'grok-code-fast-1',
      'grok-3', 'grok-3-fast', 'grok-3-mini', 'grok-3-mini-fast',
      'grok-2-1212', 'grok-2-vision-1212',
    ];

    if (cerebrasModels.includes(model) || model.startsWith('llama') || model.startsWith('qwen') || model.startsWith('gpt-oss')) {
      content = await callCerebras(env.CEREBRAS_API_KEY, model, allMessages, temperature, maxTokens);
    } else if (geminiModels.includes(model) || model.startsWith('gemini')) {
      content = await callGemini(env.GEMINI_API_KEY, model, allMessages, temperature, maxTokens);
    } else if (grokModels.includes(model) || model.startsWith('grok')) {
      content = await callGrok(env.GROK_API_KEY, model, allMessages, temperature, maxTokens);
    } else {
      throw new Error(`Unsupported model: ${model}`);
    }

    return new Response(
      JSON.stringify({ success: true, content, model }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
