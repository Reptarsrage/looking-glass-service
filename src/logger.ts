import pino from 'pino'

import config from './config'

// create the base logger
// see: https://getpino.io
export { Logger } from 'pino'
export default pino({ level: config.get('LOG_LEVEL', 'info') })
