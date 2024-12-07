export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  frontUrl: process.env.FRONT_END_URL,
});
