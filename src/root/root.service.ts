import registeredControllers from 'src/base/registeredControllers'
import Module from 'src/dto/moduleResponse'

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
