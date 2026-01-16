interface Env {
  FISH_AUDIO_API_KEY: string;
  FISH_AUDIO_MODEL_ID: string;
}

interface TTSRequest {
  text: string;
  modelId?: string; // Optional override for character-specific voices
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    const body: TTSRequest = await request.json();
    const { text, modelId } = body;

    if (!env.FISH_AUDIO_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'FISH_AUDIO_API_KEY not set' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is empty' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://api.fish.audio/v1/tts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.FISH_AUDIO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        reference_id: modelId || env.FISH_AUDIO_MODEL_ID,
        format: 'mp3',
        latency: 'balanced',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(
        JSON.stringify({ error: `Fish Audio error: ${error}` }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return audio stream
    return new Response(response.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
