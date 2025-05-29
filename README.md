# Full-Stack E-Commerce Platform

This project is a comprehensive e-commerce platform featuring a React/TypeScript frontend and a Node.js/Express/MongoDB backend. It includes user authentication, product catalog, shopping cart functionality, and more.

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Local Development](#local-development)
  - [Dockerized Setup](#dockerized-setup)
- [Backend Details](#backend-details)
- [Frontend Details](#frontend-details)
- [Contributing](#contributing)
- [License](#license)

## Project Structure

The project is organized into two main directories:

-   `frontend/`: Contains the React/TypeScript client application.
-   `backend/`: Contains the Node.js/Express server application.

Each directory has its own README with specific setup and run instructions.

## Features

-   User Authentication (Registration, Login with JWT)
-   Product Catalog (List and Detail Views)
-   Shopping Cart Functionality (Add, Update, Remove, View Cart)
-   Dockerized environment for consistent development and deployment.
-   GitHub Actions for Continuous Integration (Linting, Building).
-   (Future features: Order Management, Payments, Admin Panel, etc.)

## Tech Stack

**Frontend:**

-   React.js (with Create React App)
-   TypeScript
-   Redux Toolkit (for global state management like auth)
-   React Query (for server state management - fetching products, cart)
-   Tailwind CSS (for styling)
-   React Hook Form & Zod (for form handling and validation)
-   React Router DOM (for navigation)

**Backend:**

-   Node.js
-   Express.js (web framework)
-   MongoDB (database with Mongoose ODM)
-   JSON Web Tokens (JWT) (for authentication)
-   `bcryptjs` (for password hashing)
-   `slugify` (for generating product slugs)
-   `cors`, `dotenv`

**DevOps & Tooling:**

-   Docker & Docker Compose
-   GitHub Actions (CI)
-   ESLint (for linting)
-   Nginx (for serving frontend build)

## Prerequisites

-   Node.js (v18.x or later recommended for both frontend and backend)
-   npm (usually comes with Node.js)
-   Docker Desktop (or Docker engine and Docker Compose CLI)
-   MongoDB (a local instance, a cloud-hosted instance like MongoDB Atlas, or run via Docker Compose as configured)
-   Git

## Getting Started

### Local Development (Without Docker)

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-repository-name>
    ```

2.  **Set up Backend:**
    -   Navigate to the backend directory: `cd backend`
    -   Follow the instructions in `backend/README.md`.

3.  **Set up Frontend:**
    -   Navigate to the frontend directory: `cd frontend` (from root)
    -   Follow the instructions in `frontend/README.md`.

4.  **Ensure your local MongoDB instance is running and accessible as per your backend `.env` configuration.**

### Dockerized Setup (Recommended for easy multi-service management)

This setup uses Docker Compose to run the frontend, backend, and a MongoDB database instance.

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-repository-name>
    ```

2.  **Environment Variables for Backend:**
    *   The `docker-compose.yml` file references environment variables for the backend service. For sensitive data like `JWT_SECRET` in a real scenario, you would use Docker secrets or a `.env` file that `docker-compose.yml` can read (though `.env` files are gitignored, so you'd need to create it).
    *   For local Docker Compose development, the provided `docker-compose.yml` has some defaults. You can customize `MONGODB_URI`, `JWT_SECRET` etc., directly in the `docker-compose.yml` for the backend service's `environment` section if needed, or modify it to use an env_file.
    *   Ensure the `MONGODB_URI` in `docker-compose.yml` points to the `mongo` service: `mongodb://mongo:27017/ecommerceDB`.

3.  **Environment Variables for Frontend (Build Time):**
    *   If your frontend requires build-time environment variables (like `REACT_APP_API_URL`), you can pass them as build arguments in the `docker-compose.yml` under the `frontend` service's `build` section.
    *   Example:
        ```yaml
        frontend:
          build:
            context: ./frontend
            args:
              REACT_APP_API_URL: http://localhost:5000/api # Adjust if your setup differs
        ```
    *   Note: The current frontend is built to call `http://localhost:5000/api`. When running via Docker Compose, `localhost` from the browser's perspective correctly maps to your host machine, and Docker Compose maps port 5000 on your host to the backend container.

4.  **Build and Run with Docker Compose:**
    From the project root directory:
    ```bash
    docker-compose up --build -d
    ```
    This command will:
    -   Build the Docker images for the frontend and backend (if they don't exist or if `--build` is specified).
    -   Start containers for frontend, backend, and MongoDB in detached mode (`-d`).
    -   The frontend should be accessible at `http://localhost:3000`.
    -   The backend API should be accessible at `http://localhost:5000`.

5.  **To Stop Services:**
    ```bash
    docker-compose down
    ```
    To remove volumes (like MongoDB data):
    ```bash
    docker-compose down -v
    ```

6.  **To View Logs:**
    ```bash
    docker-compose logs -f           # All services
    docker-compose logs -f frontend  # Specific service
    docker-compose logs -f backend
    ```

## Backend Details

For specific instructions on setting up, running, and understanding the backend, please see `backend/README.md`.

## Frontend Details

For specific instructions on setting up, running, and understanding the frontend, please see `frontend/README.md`.

## Contributing

Contributions are welcome! Please follow standard Git workflow: branch, commit, push, and create a Pull Request. (Further details on coding standards, testing, etc., can be added here).

## License

This project is licensed under the MIT License - see the LICENSE file for details (if a LICENSE file is added).
