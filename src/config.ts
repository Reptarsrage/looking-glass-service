import { config } from 'dotenv'

// configure environment variables and config
// see: https://github.com/motdotla/dotenv#dotenv
config()

/**
 * retrieves configuration values
 */
/**
 * get a configuration value (either custom configuration or process environment variable)
 * based on property path (you can use dot notation to traverse nested object, e.g. "database.host").
 * It returns a default value if the key does not exist.
 * @param propertyPath
 * @param defaultValue
 */
function get<T>(propertyPath: string, defaultValue?: T): T | undefined {
  const processValue = process.env[propertyPath]
  if (processValue === undefined) {
    return defaultValue
  }

  return (processValue as unknown) as T
}

export default { get }
