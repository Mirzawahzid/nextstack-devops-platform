# NextStack – Debug Drills

Two real failure scenarios encountered during Kubernetes deployment, with root cause analysis and fixes documented.

---

## Drill 1 – CrashLoopBackOff (Liveness Probe Failure)

### Symptom

After deploying, pods enter `CrashLoopBackOff` status:

```bash
kubectl get pods -n nextstack
```

```
NAME                                    READY   STATUS             RESTARTS   AGE
nextstack-deployment-6c9f7b8d5-x2kp9   0/1     CrashLoopBackOff   5          4m
nextstack-deployment-6c9f7b8d5-mp3ql   0/1     CrashLoopBackOff   5          4m
```

### Diagnosis Steps

**Step 1 – Check pod events:**
```bash
kubectl describe pod nextstack-deployment-6c9f7b8d5-x2kp9 -n nextstack
```

Output shows:
```
Liveness probe failed: HTTP probe failed with statuscode: 404
```

**Step 2 – Check logs:**
```bash
kubectl logs nextstack-deployment-6c9f7b8d5-x2kp9 -n nextstack
```

Output:
```
Error: Cannot find module 'express'
```

### Root Cause

The Docker image was built without running `npm install`, so `node_modules` is missing. The server crashes immediately on startup. Kubernetes liveness probe hits `/healthz`, gets no response, and restarts the pod repeatedly.

### Fix

**1. Add `npm install` to Dockerfile correctly:**

```dockerfile
# Before (broken)
COPY . .
CMD ["node", "server.js"]

# After (fixed)
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
CMD ["node", "server.js"]
```

**2. Rebuild and push the image:**
```bash
docker build -t mirzawahzid/nextstack:latest .
docker push mirzawahzid/nextstack:latest
```

**3. Restart the deployment:**
```bash
kubectl rollout restart deployment/nextstack-deployment -n nextstack
```

**4. Verify:**
```bash
kubectl get pods -n nextstack
# Both pods should show STATUS: Running, READY: 1/1
```

### Prevention
- Always run `docker build` and test locally before pushing
- Use `docker run` to verify the container starts successfully

---

## Drill 2 – Pods Stuck in Pending (Secret Not Found)

### Symptom

Pods stuck in `Pending` or `CreateContainerConfigError` state:

```bash
kubectl get pods -n nextstack
```

```
NAME                                    READY   STATUS                       RESTARTS   AGE
nextstack-deployment-7d4b9f6c1-ab12x   0/1     CreateContainerConfigError   0          2m
nextstack-deployment-7d4b9f6c1-cd34y   0/1     CreateContainerConfigError   0          2m
```

### Diagnosis Steps

**Step 1 – Describe the pod:**
```bash
kubectl describe pod nextstack-deployment-7d4b9f6c1-ab12x -n nextstack
```

Output shows:
```
Error: secret "nextstack-db-secret" not found
```

**Step 2 – List secrets in namespace:**
```bash
kubectl get secrets -n nextstack
```

Output:
```
NAME                    TYPE     DATA   AGE
nextstack-app-secret    Opaque   2      5m
```

Only `nextstack-app-secret` exists — `nextstack-db-secret` is missing.

### Root Cause

The `secret.yaml` file was applied before it was fully written (only the first secret block was saved). The deployment references `nextstack-db-secret` but it was never created in the cluster.

### Fix

**1. Check the secret file has both secrets:**
```bash
cat k8s/secret.yaml
# Should contain both nextstack-app-secret AND nextstack-db-secret
```

**2. Re-apply the full secret manifest:**
```bash
kubectl apply -f k8s/secret.yaml -n nextstack
```

**3. Verify both secrets exist:**
```bash
kubectl get secrets -n nextstack
```

Expected:
```
NAME                    TYPE     DATA   AGE
nextstack-app-secret    Opaque   2      6m
nextstack-db-secret     Opaque   3      10s
```

**4. Restart pods to pick up the new secret:**
```bash
kubectl rollout restart deployment/nextstack-deployment -n nextstack
```

**5. Verify:**
```bash
kubectl get pods -n nextstack
# Both pods: STATUS: Running, READY: 1/1
```

### Prevention
- Always apply manifests in order: `namespace → configmap → secret → deployment`
- Use `kubectl get secrets -n nextstack` to verify before applying the deployment
- Add a CI check that validates all referenced secrets exist before deploying
