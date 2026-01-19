# Kubernetes Deployment Configuration

## Prerequisites
- Kubernetes cluster (EKS, GKE, AKS, or local minikube)
- kubectl installed and configured
- Docker images pushed to registry

## Quick Start

```bash
# Apply MongoDB deployment
kubectl apply -f k8s/mongodb-deployment.yaml

# Apply backend deployment
kubectl apply -f k8s/backend-deployment.yaml

# Apply frontend deployment
kubectl apply -f k8s/frontend-deployment.yaml

# Check status
kubectl get pods
kubectl get services
```

## Scaling

```bash
# Scale backend pods
kubectl scale deployment smart-hiring-backend --replicas=3

# Scale frontend pods
kubectl scale deployment smart-hiring-frontend --replicas=2
```

## Monitoring

```bash
# View logs
kubectl logs -f deployment/smart-hiring-backend
kubectl logs -f deployment/smart-hiring-frontend

# Port forward for local access
kubectl port-forward service/smart-hiring-backend 8000:8000
kubectl port-forward service/smart-hiring-frontend 3000:3000
```

## Production Considerations

1. **Secrets Management**: Use Kubernetes Secrets or external secret managers
2. **Persistent Storage**: Configure PersistentVolumes for MongoDB
3. **Ingress**: Set up Ingress controller for external access
4. **Monitoring**: Integrate Prometheus and Grafana
5. **Logging**: Set up centralized logging (ELK stack)
6. **Auto-scaling**: Configure HPA (Horizontal Pod Autoscaler)
