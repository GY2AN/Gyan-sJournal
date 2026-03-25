// prisma/seed.ts
// prisma/seed.ts
import * as fs from "fs";
import * as path from "path";

// Manually load .env file since tsx doesn't auto-load it on Windows
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const val = trimmed.slice(eqIndex + 1).trim().replace(/^"|"$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const user = await prisma.user.upsert({
    where: { email: "gyan@example.com" },
    update: {},
    create: {
      email: "gyan@example.com",
      name: "Gyan Prakash",
      password: hashedPassword,
    },
  });

  console.log("Seeded user:", user.email);

  const journals = [
    {
      title: "Finally understood Kubernetes Ingress Controllers",
      slug: "kubernetes-ingress-controllers",
      content: `Today was one of those days where frustration turned into clarity. I spent about 3 hours debugging why my NGINX ingress controller wasn't routing traffic correctly to my backend service. After lots of \`kubectl describe\` and log tailing, I found the issue: I had specified the wrong namespace in my Ingress resource.

But here's the thing — the process of debugging taught me more than any tutorial. I now understand the full traffic flow: external request → cloud load balancer → ingress controller pod → service → pod.

## What I Discovered

The Ingress resource needs to be in the **same namespace** as the Service it routes to. This seems obvious in hindsight, but the error messages were cryptic enough to send me down completely wrong paths.

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app-ingress
  namespace: production  # Must match the Service namespace!
spec:
  rules:
    - host: myapp.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-app-service
                port:
                  number: 80
\`\`\`

After fixing the namespace, everything clicked. The traffic now flows perfectly.`,
      learnings:
        "How Ingress controllers work at the networking level, the importance of namespace consistency, and how to read ingress controller logs effectively.",
      challenges:
        "The error messages were incredibly cryptic. 'connection refused' could mean a thousand things in Kubernetes.",
      reflection:
        "Debugging slowly and methodically beats guessing randomly. Every dead end taught me something. I need to build a mental checklist for Kubernetes networking issues.",
      tags: ["Kubernetes", "Networking", "Debugging"],
    },
    {
      title: "Built my first Helm chart from scratch",
      slug: "first-helm-chart-from-scratch",
      content: `Templating clicked today. I stopped copying other people's Helm charts and built one from zero — a reusable chart for a Node.js app. It includes configmaps for env vars, an external secret reference, a horizontal pod autoscaler, and a proper liveness/readiness probe setup.

## The _helpers.tpl File

The \`_helpers.tpl\` file was confusing at first but now I see why it's powerful — it's like writing helper functions for your YAML templates.

\`\`\`yaml
{{- define "myapp.labels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
\`\`\`

## Key Structure

\`\`\`
my-chart/
├── Chart.yaml
├── values.yaml
├── templates/
│   ├── _helpers.tpl
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── hpa.yaml
│   └── configmap.yaml
\`\`\`

The chart is already deployed in my homelab and I can upgrade it with a single \`helm upgrade\` command.`,
      learnings:
        "Helm templating language, named templates, values.yaml structure, and how to validate charts with helm template and helm lint.",
      challenges:
        "YAML indentation errors inside Go templates are painful. The error messages don't always point to the right line.",
      reflection:
        "Building something real from scratch beats reading docs. I should start every learning session with a concrete project goal.",
      tags: ["Helm", "DevOps", "Kubernetes"],
    },
    {
      title: "Set up ArgoCD for GitOps deployment pipeline",
      slug: "argocd-gitops-pipeline",
      content: `This one felt like magic. I connected my GitHub monorepo to ArgoCD running inside my k3s cluster. Now, every time I push a Helm chart change to the \`/clusters\` directory, ArgoCD detects the drift and syncs the cluster to match. It's declarative infrastructure done right.

## App-of-Apps Pattern

I also configured the app-of-apps pattern so I can manage multiple ArgoCD Applications from a single parent application.

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: root-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/gyan/homelab
    targetRevision: HEAD
    path: clusters/apps
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
\`\`\`

## Secrets Management

The hardest part was handling secrets without storing them in git. I ended up using Sealed Secrets — you encrypt the secret with the cluster's public key and commit the encrypted version safely.`,
      learnings:
        "ArgoCD architecture, ApplicationSet controller, app-of-apps pattern, and how to manage secrets without storing them in git.",
      challenges:
        "Sealed Secrets setup for managing sensitive values was non-trivial. The bootstrap chicken-and-egg problem (you need ArgoCD to deploy Sealed Secrets, but you need Sealed Secrets to store ArgoCD secrets) took a while to figure out.",
      reflection:
        "GitOps fundamentally changes how you think about deployments. It's not a command you run — it's a state you declare. Everything should be version-controlled.",
      tags: ["ArgoCD", "GitOps", "DevOps"],
    },
  ];

  for (const journal of journals) {
    await prisma.journal.upsert({
      where: { slug: journal.slug },
      update: {},
      create: { ...journal, userId: user.id },
    });
    console.log("Seeded journal:", journal.title);
  }

  console.log("✅ Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
