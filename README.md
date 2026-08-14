# 🚀 Full-Stack Enterprise Hub

[![Angular](https://shields.io)](https://angular.dev)
[![.NET](https://shields.io)](https://microsoft.com)
[![SQLite](https://shields.io)](https://sqlite.org)
[![Docker](https://shields.io)](https://docker.com)
[![Nginx](https://shields.io)](https://nginx.org)

An enterprise-ready, containerized full-stack application featuring a decoupled **Angular** reactive single-page app and a secured, controller-based **ASP.NET Core REST API** writing to an optimized persistent **SQLite** database. 

This repository showcases real-world architectural principles including multi-stage container deployments, clean state-management signals, custom security mid-stream guards, and the repository pattern.

---

## ⚡ Quick Start (One-Command Local Boot)

No local installation of Node.js or .NET SDKs required. The absolute entire multi-project ecosystem can be built, networked, and served locally within seconds using isolated production containers:

1. **Clone this repository:**
   ```bash
   git clone https://github.com
   cd angular-fullstack-hub
   ```

2. **Spin up the architecture:**
   ```bash
   docker compose up --build
   ```

3. **Access the application:**
   * **Frontend Dashboard Viewport:** `http://localhost:4200`
   * **Backend REST API Explorer:** `http://localhost:5165/api/products`
   * **Credentials:** User: `admin` | Password: `test123$`

---

## 🏗️ Architectural Features & Implementation Details

### 🎨 Frontend Client (`/DemoApp-Client`)
* **State Management Signals:** Leverages Angular native reactive signals (`signal<T>()`) to eliminate heavy lifecycle tracking and trigger instant data syncs on inventory updates.
* **Global HTTP Token Interceptor:** Intercepts outgoing requests to dynamically inject strict API key validation signatures into header arrays without polluting domain components.
* **Production Nginx Reverse Proxy:** Implements multi-stage Docker builds deploying lightweight static compiled assets over Nginx, routing data payloads seamlessly to the hidden backend container mesh.
* **Defensive Form Control:** Validates structures prior to network transport via specialized Reactive Forms arrays, flashing clean validation overlays inside modal layouts.

### ⚙️ Backend Web API (`/DemoApp.Api`)
* **The Repository Pattern:** Decouples core framework database mappings out of reception controllers via strict abstract interfaces (`IProductRepository`), optimizing code testability.
* **Deferred Database Aggregations:** Uses Entity Framework Core to execute optimized LINQ paging math (`.Skip().Take()`) and live query text containment filters directly inside the SQLite storage container layer.
* **Immutable Soft Deletion:** Implements logical structural safety flags (`IsDeleted`) to archive item records safely rather than executing hard SQL table purges.
* **Global Security Middleware Interceptor:** Intercepts incoming web targets, defending sensitive data records with customized server-side gatekeepers, returning structured problem dictionaries on parsing faults.

---

## 📁 Repository Directory Structure

```text
angular-fullstack-hub/
├── DemoApp-Client/     # Angular Production UI (Includes Dockerfile.client & nginx.conf)
├── DemoApp.Api/        # C# Web API Layer (Includes Dockerfile.api & database contexts)
└── docker-compose.yml  # Container Orchestrator mapping cross-container network ports
```

---

## 🛠️ Local Development (Alternative Manual Boot)

If running outside of Docker containers during feature engineering workflows:

### Backend Setup
```bash
cd DemoApp.Api
dotnet restore
dotnet run --launch-profile https
```

### Frontend Setup
```bash
cd DemoApp-Client
npm install --legacy-peer-deps
ng serve
```
