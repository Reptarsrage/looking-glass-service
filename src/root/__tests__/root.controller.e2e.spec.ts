import { FastifyInstance } from 'fastify'
import supertest from 'supertest'

import createServer from '../../server'
import AuthType from 'src/dto/authType'

jest.mock('pino')
jest.mock('src/config')
jest.mock('src/logger')

describe('AppController (e2e)', () => {
  let app: FastifyInstance

  beforeEach(async () => {
    app = createServer()
    await app.ready()
  })

  afterEach(() => {
    app.close()
  })

  describe('/ (GET)', () => {
    it('returns successful response', (done) => {
      supertest(app.server).get('/').expect(200).expect('Content-Type', /json/).end(done)
    })

    it('returns valid body', (done) => {
      supertest(app.server)
        .get('/')
        .expect((res) => {
          const { body } = res
          expect(body.length).toBeGreaterThan(0)
          body.forEach((module) => {
            expect(typeof module.id).toBe('string')
            expect(module.id.length).toBeGreaterThan(0)

            expect(typeof module.name).toBe('string')
            expect(module.name.length).toBeGreaterThan(0)

            expect(typeof module.description).toBe('string')
            expect(module.description.length).toBeGreaterThan(0)

            expect(typeof module.icon).toBe('string')
            expect(typeof module.description).toBe('string')

            expect(['string', 'undefined']).toContain(typeof module.oAuthUrl)

            expect(typeof module.supportsItemFilters).toBe('boolean')

            expect(typeof module.supportsAuthorFilter).toBe('boolean')

            expect(typeof module.supportsSourceFilter).toBe('boolean')

            expect(Array.isArray(module.filters)).toBe(true)
            expect(module.filters.length).toBeGreaterThan(0)

            expect(Array.isArray(module.sort)).toBe(true)
            expect(module.sort.length).toBeGreaterThan(0)

            expect(Object.values(AuthType)).toContain(module.authType)
          })
        })
        .end(done)
    })
  })
})
