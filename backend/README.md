# E-Commerce Backend

This directory contains the backend services for the e-commerce application, built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v18.x recommended, to match Dockerfile)
- npm
- MongoDB (local instance or connection string to a hosted one)

## Local Development Setup

1.  **Clone the repository (if not already done):**
    ```bash
    git clone <repository-url>
    cd <repository-name>/backend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```
    Or, for cleaner installs if `package-lock.json` is reliable:
    ```bash
    npm ci
    ```

3.  **Set Up Environment Variables:**
    *   Create a `.env` file in this `backend` directory by copying the example:
        ```bash
        cp .env.example .env 
        ```
        (If `.env.example` is not provided, create `.env` manually).
    *   Update the `.env` file with your local configuration:
        ```
        PORT=5000
        MONGODB_URI=mongodb://localhost:27017/ecommerceDB_dev  # Your local MongoDB URI
        NODE_ENV=development
        JWT_SECRET=yourLocalJwtSecretKeyChangeThis
        JWT_EXPIRES_IN=1h 
        # Add any other variables required by the application
        ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    This typically uses `nodemon` for automatic server restarts on file changes. The server will usually be available at `http://localhost:5000`.

5.  **Alternative: Start without Nodemon:**
    ```bash
    npm start
    ```

## Available Scripts

-   `npm start`: Starts the server in production mode (or as defined).
-   `npm run dev`: Starts the server in development mode with `nodemon`.
-   `npm test`: (If tests are configured) Runs the test suite.
-   `npm run lint`: (If linter is configured) Lints the codebase.

## API Endpoints

Refer to the API documentation or Postman collection for details on available endpoints (e.g., `/api/auth`, `/api/products`, `/api/cart`).

## Docker Setup (for running with Docker)

1.  **Build the Docker Image:**
    From the project root directory:
    ```bash
    docker build -t ecommerce-backend ./backend
    ```
    Or, if you are inside the `backend` directory:
    ```bash
    docker build -t ecommerce-backend .
    ```

2.  **Run the Docker Container (stand-alone, without Docker Compose):**
    ```bash
    docker run -p 5000:5000 \
      -e PORT=5000 \
      -e MONGODB_URI="your_mongodb_connection_string" \
      -e NODE_ENV="development" \
      -e JWT_SECRET="yourDockerJwtSecret" \
      # Add other necessary environment variables
      ecommerce-backend
    ```
    Note: For MongoDB connection from a Docker container to a local MongoDB instance, `localhost` in `MONGODB_URI` might not work directly. You might need to use your host machine's IP address or specific Docker networking configurations (e.g., `host.docker.internal` on some systems).

3.  **Using Docker Compose (Recommended for local multi-container setup):**
    From the project root directory (where `docker-compose.yml` is located):
    ```bash
    docker-compose up -d backend 
    ```
    Or to build and then run:
    ```bash
    docker-compose up --build -d backend
    ```
    To run all services defined in `docker-compose.yml` (backend, frontend, mongo):
    ```bash
    docker-compose up --build -d
    ```
    To view logs:
    ```bash
    docker-compose logs -f backend
    ```
    To stop services:
    ```bash
    docker-compose down
    ```

---

This README provides basic setup and run instructions. For more detailed information on project structure, specific features, or contribution guidelines, refer to the main project README or other relevant documentation.
