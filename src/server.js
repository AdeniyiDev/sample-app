const createApp = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;
const app = createApp();

app.listen(PORT, () => {
  logger.info(`sample-app listening on port ${PORT}`);
});