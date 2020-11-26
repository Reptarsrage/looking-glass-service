import { ModuleControllerBase } from 'src/base/base.controller'
import AuthType from 'src/dto/authType'
import ModuleResponse from 'src/dto/moduleResponse'
import registeredControllers from 'src/base/registeredControllers'
import rootService from '../root.service'

class TestController extends ModuleControllerBase {}

describe('app.service.ts', () => {
  describe('getModules', () => {
    it('returns empty module definitions', () => {
      const actual = rootService.getModules('BASE URL')
      expect(actual).toEqual([])
    })

    it('returns module definitions', () => {
      // arrange
      const expected: ModuleResponse = {
        id: 'EXPECTED ID',
        name: 'EXPECTED NAME',
        description: 'EXPECTED DESCRIPTION',
        supportsAuthorFilter: true,
        supportsItemFilters: true,
        supportsSourceFilter: true,
        authType: AuthType.None,
        icon: '/EXPECTED ICON',
        filters: [],
        sort: [],
      }

      registeredControllers.add(TestController, expected)

      // act
      const actual = rootService.getModules('BASE URL')

      // assert
      expect(actual).toEqual([{ ...expected, icon: 'BASE URL/EXPECTED ICON' }])
    })
  })
})
