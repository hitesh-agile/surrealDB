import { registerAs } from '@nestjs/config';

export default registerAs('express', () => ({
  env: process.env.APP_ENV,
  version: process.env.APP_VERSION,
  name: process.env.APP_NAME,
  description: 'Xcode Open API',
  url: process.env.APP_URL,
  port: process.env.APP_PORT,
  enableCors: process.env.APP_ENABLE_CORS,
  throttler: {
    ttlTime: process.env.APP_THROTTLER_TTL_TIME,
    requestCount: process.env.APP_THROTTLER_REQUEST_COUNT,
  },
  enableLog: process.env.ENABLED_LOG,
}));
