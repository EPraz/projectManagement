export function validateEnvironment(env: Record<string, unknown>) {
  for (const name of [
    'DATABASE_URL',
    'DIRECT_URL',
    'JWT_SECRET',
    'CLIENT_URL',
  ]) {
    if (typeof env[name] !== 'string' || !env[name])
      throw new Error(`Missing environment variable: ${name}`);
  }
  if ((env.JWT_SECRET as string).length < 32)
    throw new Error('JWT_SECRET must contain at least 32 characters');
  for (const name of ['DATABASE_URL', 'DIRECT_URL']) {
    const url = new URL(env[name] as string);
    if (!['postgres:', 'postgresql:'].includes(url.protocol))
      throw new Error(`${name} must be a PostgreSQL URL`);
  }
  const origin = new URL(env.CLIENT_URL as string);
  if (
    !['http:', 'https:'].includes(origin.protocol) ||
    origin.origin !== env.CLIENT_URL
  ) {
    throw new Error(
      'CLIENT_URL must be one exact HTTP(S) origin without a trailing slash',
    );
  }
  return env;
}
