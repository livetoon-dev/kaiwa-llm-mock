interface Env {
  LIVETOON_TTS_URL?: string; // Optional: defaults to production URL
}

interface TTSRequest {
  text: string;
  voicepack?: string; // Voice profile: default, seiso, uranai, zange, yasaike
  alpha?: number;     // Style strength 0.0-1.0
  beta?: number;      // Emotion strength 0.0-1.0
  speed?: number;     // Speed 0.1-4.0
}

// Livetoon TTS API
// Production: https://livetoon-tts.dev-livetoon.com
const DEFAULT_TTS_URL = 'https://livetoon-tts.dev-livetoon.com';

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    const body: TTSRequest = await request.json();
    const { text, voicepack = 'default', alpha = 0.3, beta = 0.7, speed = 1.0 } = body;

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is empty' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const ttsUrl = env.LIVETOON_TTS_URL || DEFAULT_TTS_URL;

    const response = await fetch(`${ttsUrl}/speak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        voicepack: voicepack,
        alpha: alpha,
        beta: beta,
        speed: speed,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(
        JSON.stringify({ error: `Livetoon TTS error: ${error}` }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return audio stream (WAV format)
    return new Response(response.body, {
      headers: {
        'Content-Type': 'audio/wav',
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
