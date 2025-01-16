const {
  PORT = 3000,
  NEXT_JS_URL,
  ASTRO_JS_URL,
  SECRET_KEY,
  NODE_ENV = 'development',
  ACCESS_TOKEN_EXPIRATION = '15m',
  REFRESH_TOKEN_EXPIRATION = '7d',
} = process.env;
export default () => ({
  port: PORT,
  nextJs: NEXT_JS_URL,
  astroJs: ASTRO_JS_URL,
  secretKey: SECRET_KEY,
  env: NODE_ENV,
  accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
  refreshTokenExpiration: REFRESH_TOKEN_EXPIRATION,
});
