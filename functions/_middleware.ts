const BASIC_USER = 'kaiwa_test';
const BASIC_PASS = 'kaiwa_pw';

function unauthorized(): Response {
  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="kaiwa"',
    },
  });
}

export async function onRequest(context: { request: Request; next: () => Promise<Response> }) {
  const { request, next } = context;

  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return unauthorized();
  }

  const base64Credentials = authHeader.slice(6);
  const credentials = atob(base64Credentials);
  const [username, password] = credentials.split(':');

  if (username !== BASIC_USER || password !== BASIC_PASS) {
    return unauthorized();
  }

  return next();
}
