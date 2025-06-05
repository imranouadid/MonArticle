# 📰 Article Platform

This repository contains the source code and Docker configuration for the **Article Platform**, a web application consisting of a **backend (PHP)**, a **frontend**, and a **MongoDB database**, managed via Docker Compose.

---

## 📦 Project Structure

```
.
├── backend/                 # PHP backend application
├── frontend/                # Frontend application
├── docker/                  # Docker-specific config files
├── docker-compose.yml       # Docker Compose configuration
├── makefile                 # Useful development commands
```

---

## 🚀 Getting Started

Make sure you have the following installed:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Make](https://www.gnu.org/software/make/)

Then run the following command to start the app, that's all:

```bash
  make start
```

This will build and start the Docker containers for the full stack.
Try on browser http://localhost:3000/

## 👤 Demo Access

Access credentials:

```bash
  - Email: demo1@gmail.com 
  - Password: testPassword
```

```bash
  - Email: demo2@gmail.com 
  - Password: testPassword
```
---

## 🛠 Development Commands

Here’s a list of all available `make` commands to help manage and work with this project:

| Command                      | Description                               |
|-----------------------------|-------------------------------------------|
| `make start`                | Start the app                             |
| `make build`                | Build Docker images                       |
| `make up`                   | Start Docker stack                        |
| `make stop`                 | Stop running containers                   |
| `make restart`              | Restart the container stack               |
| `make down`                 | Stop and remove all containers            |
| `make backend-exec-cmd`     | Run a command inside the PHP container    |
| `make sh-backend`           | Open a shell inside the backend container |
| `make sh-db`                | Open a shell inside the MongoDB container |
| `make db-create-collections`| Create initial MongoDB collections        |
| `make create-demo-account`  | Create a demo user account                |
| `make cache-clear`          | Clear backend cache                       |
| `make install`              | Install backend dependencies              |
| `make nginx-exec-cmd`       | Run a command inside the Nginx container  |
| `make sh-nginx`             | Open a shell inside the Nginx container   |
| `make logs`                 | View container logs                       |
| `make debug-router`         | Display backend routes                    |
| `make help`                 | Show available commands                   |

---

## 🧹 Maintenance

- Clear cache:

```bash
  make cache-clear
```

- Rebuild and restart everything:

```bash
  make down
  make build
  make up
```