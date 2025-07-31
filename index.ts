import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();
app.use('*', cors());

type User = {
  email: string;
  password: string;
};

const FIREBASE_URL = 'https://zylos-test-default-rtdb.firebaseio.com';

app.post('/signup', async (c) => {
  const { email, password } = await c.req.json<User>();

  const res = await fetch(`${FIREBASE_URL}/users.json`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) return c.text('Signup failed', 500);

  return c.text('Signup success');
});

app.post('/login', async (c) => {
  const { email, password } = await c.req.json<User>();

  const res = await fetch(`${FIREBASE_URL}/users.json`);
  const data = await res.json();

  const found = Object.values(data || {}).find(
    (u: any) => u.email === email && u.password === password
  );

  return found ? c.text('Login success') : c.text('Invalid credentials', 401);
});

export default app;
