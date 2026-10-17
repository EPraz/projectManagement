export function validateEnvironment(env: Record<string, unknown>) {
  for (const name of ['DATABASE_URL', 'JWT_SECRET', 'CLIENT_URL']) {
    if (typeof env[name] !== 'string' || !env[name])
      throw new Error(`Missing environment variable: ${name}`);
  }
  if ((env.JWT_SECRET as string).length < 32)
    throw new Error('JWT_SECRET must contain at least 32 characters');
  let databaseUrl: URL;
  try {
    databaseUrl = new URL(env.DATABASE_URL as string);
  } catch {
    throw new Error('DATABASE_URL must be a PostgreSQL URL');
  }
  if (
    !['postgres:', 'postgresql:'].includes(databaseUrl.protocol) ||
    !databaseUrl.hostname ||
    !databaseUrl.pathname.slice(1)
  )
    throw new Error('DATABASE_URL must be a PostgreSQL URL');
  let origin: URL;
  try {
    origin = new URL(env.CLIENT_URL as string);
  } catch {
    throw new Error(
      'CLIENT_URL must be one exact HTTP(S) origin without a trailing slash',
    );
  }
  if (
    !['http:', 'https:'].includes(origin.protocol) ||
    origin.origin !== env.CLIENT_URL
  ) {
    throw new Error(
      'CLIENT_URL must be one exact HTTP(S) origin without a trailing slash',
    );
  }
  if (
    env.PORT !== undefined &&
    ((typeof env.PORT !== 'string' && typeof env.PORT !== 'number') ||
      !/^\d+$/.test(`${env.PORT}`) ||
      Number(env.PORT) < 1 ||
      Number(env.PORT) > 65535)
  ) {
    throw new Error('PORT must be an integer from 1 to 65535');
  }
  return env;
}
