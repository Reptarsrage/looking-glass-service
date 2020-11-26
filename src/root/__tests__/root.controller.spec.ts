import { mocked } from 'ts-jest/utils'
import { FastifyRequest } from 'fastify'
import rootService from '../root.service'
import rootController from '../root.controller'

jest.mock('../root.service')

describe('root.controller.ts', () => {
  const mockedAppService = mocked(rootService)

  describe('getModules', () => {
    it('returns empty module definitions', () => {
      const mockRequest = {
        protocol: 'http',
        hostname: 'HOST',
      }

      mockedAppService.getModules.mockImplementation(() => [])

      const actual = rootController.getModules((mockRequest as unknown) as FastifyRequest)
      expect(mockedAppService.getModules).toHaveBeenCalledWith('http://HOST')
      expect(actual).toEqual([])
    })
  })
})
