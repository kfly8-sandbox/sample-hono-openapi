import { Hono } from 'hono';

import { describeRoute } from "hono-openapi";
import { validator, resolver } from "hono-openapi/zod";
import { z } from 'zod'

const app = new Hono();

const _GetRequest = z.object({
  foo: z.string(),
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
    const { foo } = c.req.valid('query');
    return c.json({ message: `Hello, ${foo}!` });
  }
);

export default app
