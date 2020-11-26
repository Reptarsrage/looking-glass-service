import { ModuleControllerBase } from './base.controller'
import Definition from '../dto/moduleResponse'

export type RegisteredController = {
  controller: ModuleControllerBase
  definition: Definition
}

const init = () => {
  const _allIds: string[] = []
  const _byId: Record<string, RegisteredController> = {}

  /**
   * add a registered controller
   * @param module
   * @param definition
   */
  function add(Controller: any, definition: Definition): void {
    _allIds.push(definition.id)
    _byId[definition.id] = {
      definition,
      controller: new Controller(),
    }
  }

  /**
   * get all controllers
   */
  function get(id: string): RegisteredController {
    return { ..._byId[id] }
  }

  /**
   * get all module definitions
   */
  function getAll(): string[] {
    return [..._allIds]
  }

  return {
    add,
    get,
    getAll,
  }
}

/**
 * provides access to registered module definitions
 */
const definitions = init()

/**
 * includes the decorated class as a module definition
 * @param definition
 */
export function Controller(definition: Definition): ClassDecorator {
  return (module: any) => {
    definitions.add(module, definition)
  }
}

export default definitions
