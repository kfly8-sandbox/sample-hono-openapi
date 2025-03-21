import { Hono } from 'hono'
import { openAPISpecs } from "hono-openapi";
import { apiReference } from '@scalar/hono-api-reference'

import fooHandlers from './handlers/foo'
import barHandlers from './handlers/bar'

const app = new Hono()

app.route('/', fooHandlers)
app.route('/', barHandlers)

app.get(
  '/docs/openapi',
  openAPISpecs(app, {
    documentation: {
      info: {
        title: 'My Sample API',
        version: '0.0.1',
        description: 'This is a sample API',
      }
    }
  }),
);

app.get(
  '/docs/openapi/reference',
  apiReference({
    theme: 'saturn',
    spec: { url: '/docs/openapi' },
  })
);

export default {
  port: 3000,
  fetch: app.fetch
}
