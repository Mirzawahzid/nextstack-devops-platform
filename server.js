require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_ENV = process.env.APP_ENV || 'development';

// ── Health & Readiness Probes ─────────────────────────────────────────────────
// Liveness probe  → Kubernetes restarts pod if this fails (app is alive?)
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'alive', env: APP_ENV, timestamp: new Date().toISOString() });
});

// Readiness probe → Kubernetes stops sending traffic if this fails (app ready to serve?)
app.get('/ready', (req, res) => {
  res.status(200).json({ status: 'ready', env: APP_ENV, timestamp: new Date().toISOString() });
});

// ── Static Files ──────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`NextStack running on port ${PORT} [${APP_ENV}]`);
});
