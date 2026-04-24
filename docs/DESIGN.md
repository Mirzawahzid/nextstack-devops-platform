# NextStack – Design Document

## 1. Overview

NextStack is a single-page web application (SPA) served by a lightweight Node.js/Express backend. It is containerized with Docker and deployed on Kubernetes with 2 replicas for high availability.

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Internet                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Ingress   │  nginx ingress controller
                    │ nextstack   │  nextstack.local → :80
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Service   │  ClusterIP :80 → :3000
                    └──────┬──────┘
                    ┌──────┴──────┐
             ┌──────▼──────┐ ┌───▼──────────┐
             │   Pod 1     │ │   Pod 2       │   2 Replicas
             │  nextstack  │ │  nextstack    │
             │  :3000      │ │  :3000        │
             └─────────────┘ └──────────────┘
                    │
         ┌──────────┼────────────┐
         │          │            │
   ┌─────▼──┐ ┌─────▼──┐ ┌──────▼──┐
   │ConfigMap│ │Secret 1│ │Secret 2 │
   │ config  │ │app-sec │ │db-sec   │
   └─────────┘ └────────┘ └─────────┘
```

---

## 3. Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js 20, Express.js |
| Container | Docker (multi-stage, Alpine base) |
| Orchestration | Kubernetes (Namespace, Deployment, Service, Ingress, ConfigMap, Secret) |
| Monitoring | Prometheus + Grafana (7-tile dashboard) |
| Version Control | Git + GitHub |

---

## 4. Kubernetes Component Design

### Namespace
- Isolated namespace `nextstack` separates the app from other workloads in the cluster.

### ConfigMap (`nextstack-config`)
- Stores non-sensitive runtime config: `PORT`, `APP_ENV`, `APP_NAME`, `APP_VERSION`, `LOG_LEVEL`
- Injected via `envFrom.configMapRef`

### Secrets
Two separate secrets for separation of concerns:

| Secret | Purpose |
|--------|---------|
| `nextstack-app-secret` | `SESSION_SECRET`, `API_KEY` |
| `nextstack-db-secret` | `DB_USER`, `DB_PASSWORD`, `DB_URI` |

### Deployment
- **2 replicas** for high availability
- **Liveness probe** on `GET /healthz` — restarts pod if app is unhealthy
- **Readiness probe** on `GET /ready` — removes pod from load balancer until ready
- Resource requests/limits set to prevent noisy-neighbour issues

### Service
- `ClusterIP` type — internal only, exposed externally via Ingress

### Ingress
- Routes `nextstack.local` → `nextstack-service:80`
- SSL redirect annotation ready for TLS termination

---

## 5. Health Probe Design

```
Kubernetes kubelet
      │
      ├── livenessProbe  → GET /healthz  (every 20s, restarts on 3 failures)
      │                    "Is the process alive?"
      │
      └── readinessProbe → GET /ready    (every 10s, removes from LB on 3 failures)
                           "Is the app ready to handle traffic?"
```

**Why two probes?**
- A pod can be alive (process running) but not ready (still warming up, overloaded)
- Separating them prevents traffic from hitting an overwhelmed pod without killing it

---

## 6. Security Design

- Non-root Docker user (`nextstack`) inside the container
- Secrets stored as Kubernetes Secrets (base64), never in ConfigMaps or source code
- `.gitignore` excludes `.env` and `node_modules`
- Ingress has SSL redirect annotation for HTTPS enforcement

---

## 7. Monitoring Design

Grafana dashboard (`grafana/dashboard.json`) connects to Prometheus and provides 7 tiles:

| Tile | Metric | Alert Threshold |
|------|--------|----------------|
| HTTP Request Rate | `http_requests_total` | — |
| HTTP Error Rate | 4xx/5xx ratio | > 5% = red |
| Pod CPU Usage | `container_cpu_usage_seconds_total` | > 90% = red |
| Pod Memory Usage | `container_memory_working_set_bytes` | > 240MB = red |
| Pod Availability | `kube_pod_status_phase` | < 2 = red |
| P95 Response Time | `http_request_duration_milliseconds_bucket` | > 500ms = red |
| Health Probe Status | `kube_pod_container_status_ready` | 0 = red |
