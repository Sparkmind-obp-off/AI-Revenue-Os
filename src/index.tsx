import { Hono } from 'hono'
import indexHtml from '../public/index.html?raw'

const app = new Hono()

app.get('/', (c) => c.html(indexHtml))

app.get('/api/health', (c) => c.json({
  status: 'ok',
  product: 'AI Revenue OS — Affiliate OS',
  environment: 'prototype',
  data: 'simulated'
}))

app.get('/favicon.ico', (c) => c.body(null, 204))
app.notFound((c) => c.json({ error: 'Not found', environment: 'prototype' }, 404))

export default app
