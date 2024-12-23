const { PORT = 3000, FRONT_END_URL, SECRET_KEY, EXPIRATION_TIME } = process.env;
export default () => ({
  port: PORT,
  frontUrl: FRONT_END_URL,
  secretKey: SECRET_KEY,
  expirationTime: EXPIRATION_TIME,
});
