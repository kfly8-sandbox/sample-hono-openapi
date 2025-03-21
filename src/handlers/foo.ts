import { Hono } from 'hono';

import { describeRoute } from "hono-openapi";
import { validator, resolver } from "hono-openapi/zod";
import { z } from 'zod'

const app = new Hono();

const _GetRequest = z.object({
  name: z.string(),
});

const _GetResponse = z.object({
  message: z.string(),
});

app.get(
  '/foo',
  describeRoute({
    description: "Get a greeting message",
    responses: {
      200: {
        description: "Successful greeting response",
        content: {
          "application/json": {
            schema: resolver(_GetResponse),
          },
        },
      },
    },
  }),
  validator('query', _GetRequest),
  async (c) => {
    const { name } = c.req.valid('query')
    return c.json({ message: `Hello, ${name}!` });
  }
);

export default app
