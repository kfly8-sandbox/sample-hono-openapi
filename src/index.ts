import { Hono } from 'hono'

import { sValidator } from '@hono/standard-validator';

import * as v from 'valibot'
import { z } from 'zod'
import { type } from 'arktype'

const app = new Hono()

app.get('/', (c) => {
	return c.text('Hello Hono!')
})

// valibot
const _apiUserRequestByValibot = v.object({
	limit: v.optional(v.pipe(
		v.string(),
		v.transform((value) => {
			const num = Number(value);
			if (isNaN(num) || !isFinite(num)) {
				return new Error('Invalid number');
			}
			return num;
		}),
		v.number(),
	))
});

// zod
const _apiUserRequestByZod = z.object({
	limit: z.coerce.number().optional()
});

// arktype
const _apiUserRequestByArktype = type({
	limit: "string.integer.parse?",
});

app.get('/api/user',
	sValidator('query', _apiUserRequestByValibot),
	(c) => {
		const { limit } = c.req.valid('query');

		return c.json({ limit });
	}
);

export default {
	port: 3000,
	fetch: app.fetch
}
