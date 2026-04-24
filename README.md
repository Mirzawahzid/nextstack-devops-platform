# NextStack – Tech Education Platform

> **Build. Conquer. Dominate the Digital!**

NextStack is a full-featured tech education platform offering courses, mock interviews, and AI-powered assessments. This repo contains the application source code, Kubernetes manifests, Grafana monitoring dashboard, and full documentation.

---

## Repository Structure

```
nextstack/
├── index.html              # Main frontend (single-page app)
├── style.css               # Styles
├── app.js                  # Frontend JavaScript
├── server.js               # Node.js/Express backend (health probes)
├── package.json
├── Dockerfile              # Multi-stage production Docker image
├── .env.example            # Environment variable template
├── .gitignore
│
├── k8s/                    # Kubernetes manifests
│   ├── namespace.yaml      # Namespace: nextstack
│   ├── configmap.yaml      # Non-sensitive config (PORT, ENV)
│   ├── secret.yaml         # Sensitive secrets (2 secrets)
│   ├── deployment.yaml     # 2 replicas, liveness + readiness probes
│   ├── service.yaml        # ClusterIP service on port 80
│   └── ingress.yaml        # Nginx ingress → nextstack.local
│
├── grafana/
│   └── dashboard.json      # Grafana dashboard (7 tiles)
│
└── docs/
    ├── USER-MANUAL.md      # End-user guide
    ├── DESIGN.md           # Architecture & design document
    └── DEBUG-DRILLS.md     # 2 failure scenarios + fixes
```

---

## Quick Start

### Prerequisites
- Node.js >= 18
- Docker
- kubectl + a running Kubernetes cluster (minikube / kind / EKS)

### Run Locally

```bash
git clone https://github.com/Mirzawahzid/nextstack.git
cd nextstack
npm install
cp .env.example .env
npm start
# → http://localhost:3000
```

### Build & Run with Docker

```bash
docker build -t mirzawahzid/nextstack:latest .
docker run -p 3000:3000 mirzawahzid/nextstack:latest
```

---

## Kubernetes Deployment

Apply manifests in order:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

Verify:

```bash
kubectl get all -n nextstack
kubectl get pods -n nextstack
```

---

## Health Probes

| Probe | Endpoint | Purpose |
|-------|----------|---------|
| **Liveness** | `GET /healthz` | Kubernetes restarts pod if this fails (app crashed/frozen) |
| **Readiness** | `GET /ready` | Kubernetes removes pod from traffic if this fails (not ready to serve) |

---

## Kubernetes Secrets

Two secrets are used:

| Secret Name | Keys | Purpose |
|-------------|------|---------|
| `nextstack-app-secret` | `SESSION_SECRET`, `API_KEY` | Application-level secrets |
| `nextstack-db-secret` | `DB_USER`, `DB_PASSWORD`, `DB_URI` | Database credentials |

---

## Scaling

The deployment runs **2 replicas** by default:

```bash
# Scale up
kubectl scale deployment nextstack-deployment --replicas=4 -n nextstack

# Scale back down
kubectl scale deployment nextstack-deployment --replicas=2 -n nextstack
```

---

## Grafana Dashboard

Import `grafana/dashboard.json` into Grafana (Datasource: Prometheus).

**7 Tiles:**
1. HTTP Request Rate (req/s)
2. HTTP Error Rate (4xx/5xx)
3. Pod CPU Usage (%)
4. Pod Memory Usage (MB)
5. Pod Availability (Running Pods)
6. API Response Time (P95 Latency)
7. Health Probe Status (Liveness & Readiness)

---

## Documentation

- [User Manual](docs/USER-MANUAL.md)
- [Design Document](docs/DESIGN.md)
- [Debug Drills](docs/DEBUG-DRILLS.md)

---

## Author

**Mirzawahzid** — [github.com/Mirzawahzid](https://github.com/Mirzawahzid)
