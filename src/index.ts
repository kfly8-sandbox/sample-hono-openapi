import { Hono } from 'hono'

import { vValidator } from '@hono/valibot-validator';

import * as v from 'valibot'

const app = new Hono()

app.get('/', (c) => {
	return c.text('Hello Hono!')
})

const _apiUserRequest = v.object({
	limit: v.optional(v.number())
});

app.get('/api/user',
	vValidator('query', _apiUserRequest),
	(c) => {
		const { limit } = c.req.valid('query');

		return c.json({ limit });
	}
);

export default {
	port: 3000,
	fetch: app.fetch
}
