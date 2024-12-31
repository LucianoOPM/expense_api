const {
  PORT = 3000,
  NEXT_JS_URL,
  ASTRO_JS_URL,
  SECRET_KEY,
  EXPIRATION_TIME,
} = process.env;
export default () => ({
  port: PORT,
  nextJs: NEXT_JS_URL,
  astroJs: ASTRO_JS_URL,
  secretKey: SECRET_KEY,
  expirationTime: EXPIRATION_TIME,
});
