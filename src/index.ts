import { Hono } from 'hono'

import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const app = new Hono()

app.get('/', (c) => {
	return c.text('Hello Hono!')
})

const _apiUserRequest = z.object({
	limit: z.number().optional()
});

app.get('/api/user',
	zValidator('query', _apiUserRequest),
	(c) => {
		const { limit } = c.req.valid('query');

		return c.json({ limit });
	}
);

export default {
	port: 3000,
	fetch: app.fetch
}
