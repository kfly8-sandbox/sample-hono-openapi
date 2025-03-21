import { describe, test, it, expect } from 'bun:test';

import app from './bar';
describe('barHandler', () => {

  test('GET /bar', async () => {

    it('should return a greeting message', async () => {
      const res = await app.request('/bar?bar="world"')
      expect(res.status).toEqual(200)
      expect(await res.json()).toEqual({ "message": 'Hello, "world"!' })
    })

    it('should return bad request', async () => {
      const res = await app.request('/bar')
      expect(res.status).toEqual(400)
    })
  })
})
