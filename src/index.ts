import { Hono } from 'hono'
import { describeRoute, openAPISpecs } from "hono-openapi";
import { apiReference } from '@scalar/hono-api-reference'

//import { sValidator } from '@hono/standard-validator';
//import { validator, resolver } from "hono-openapi/arktype";
import { validator, resolver } from "hono-openapi/zod";

import * as v from 'valibot'
import { z } from 'zod'
import { type } from 'arktype'

const app = new Hono()

// zod
const _apiUserRequestByZod = z.object({
	limit: z.coerce.number().optional()
});

const _apiUserResponseByZod = z.object({
	limit: z.number(),
});

// arktype
const _apiUserRequestByArktype = type({
	limit: "string.integer.parse?",
});

const _apiUserResponseByArktype = type({
	limit: "number",
});

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


// Chose one of zod, arktype, valibot
const _apiUserRequest = _apiUserRequestByZod
const _apiUserResponse = _apiUserResponseByZod

app.get(
	'/test',
	describeRoute({
		description: "Say hello to the user",
		responses: {
		  200: {
			description: "Successful greeting response",
			content: {
			  "application/json": {
				schema: resolver(_apiUserResponse),
			  },
			},
		  },
		},
		validateResponse: true,
	}),
	validator('query', _apiUserRequest),
	(c) => {
		const { limit } = c.req.valid('query');
		return c.json({ limit });
	}
);

app.get(
	'/openapi',
	openAPISpecs(app, {
		documentation: {
			openapi: '3.1.0',
			info: {
				title: 'Sample OpenAPI',
				version: '0.0.1',
				description: 'test openapi',
			},
		},
	})
);

app.get(
	'/docs/api-reference',
	apiReference({
		theme: 'saturn',
		spec: { url: '/openapi' },
	})
);

export default {
	port: 3000,
	fetch: app.fetch
}
