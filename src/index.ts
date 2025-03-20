import { Hono } from 'hono'
import { type } from 'arktype';
import { arktypeValidator } from '@hono/arktype-validator'

const app = new Hono()

app.get('/', (c) => {
	return c.text('Hello Hono!')
})

const _apiUserRequest = type({
	limit: 'number?',
});

app.get('/api/user',
	arktypeValidator('query', _apiUserRequest),
	(c) => {
		const { limit } = c.req.valid('query');

		const users = [{  name: 'taro' }, { name: 'jiro' }];
		const filteredUsers = limit ? users.slice(0, limit) : users;

		return c.json(filteredUsers);
	}
);

export default {
	port: 3000,
	fetch: app.fetch
}
