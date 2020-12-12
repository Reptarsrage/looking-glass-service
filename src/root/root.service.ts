import registeredControllers from '../base/registeredControllers'
import Module from '../dto/moduleResponse'

function getModules(baseUrl: string): Module[] {
  const modules = registeredControllers.getAll()

  return modules
    .map((moduleId) => registeredControllers.get(moduleId).definition)
    .map((definition) => ({
      ...definition,
      icon: `${baseUrl}${definition.icon}`,
    }))
}

export default {
  getModules,
}
