const { PORT = 3000, FRONT_END_URL } = process.env;
export default () => ({
  port: PORT,
  frontUrl: FRONT_END_URL,
});
