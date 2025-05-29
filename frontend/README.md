# E-Commerce Frontend

This directory contains the frontend for the e-commerce application, built with React, TypeScript, Redux Toolkit, Tailwind CSS, and React Query.

## Prerequisites

- Node.js (v18.x recommended, to match Dockerfile)
- npm

## Local Development Setup

1.  **Clone the repository (if not already done):**
    ```bash
    git clone <repository-url>
    cd <repository-name>/frontend
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
    *   The frontend typically uses environment variables prefixed with `REACT_APP_`.
    *   Create a `.env` file in this `frontend` directory if you need to override default development settings (e.g., the backend API URL).
        ```bash
        # Example: frontend/.env
        REACT_APP_API_URL=http://localhost:5000/api 
        # Ensure this matches where your backend is running during development
        ```
    *   By default, the application might assume the backend is at `http://localhost:5000/api`. Check `src/features/auth/api/authApi.ts` or similar API files for the base URL.

4.  **Run the Development Server:**
    ```bash
    npm start
    ```
    This will start the React development server, usually on `http://localhost:3000` (or another port if 3000 is busy). The page will automatically reload if you make edits. You will also see any lint errors in the console.

## Available Scripts

-   `npm start`: Runs the app in development mode.
-   `npm run build`: Builds the app for production to the `build` folder.
-   `npm test`: Launches the test runner in interactive watch mode. (Create React App default)
-   `npm run eject`: (Use with caution) Removes the single build dependency from your project.
-   `npm run lint`: (If configured, or rely on CRA's integrated ESLint via `npm start`/`npm test`) Lints the codebase.

## Docker Setup (for running with Docker)

1.  **Build the Docker Image:**
    From the project root directory:
    ```bash
    docker build -t ecommerce-frontend ./frontend
    ```
    Or, if you are inside the `frontend` directory:
    ```bash
    docker build -t ecommerce-frontend .
    ```
    If your build needs arguments like `REACT_APP_API_URL`:
    ```bash
    docker build --build-arg REACT_APP_API_URL=http://your-backend-api-url -t ecommerce-frontend ./frontend
    ```

2.  **Run the Docker Container (stand-alone, without Docker Compose):**
    ```bash
    docker run -p 3000:80 ecommerce-frontend
    ```
    This maps port 3000 on your host to port 80 in the container (where Nginx is serving). Access the app at `http://localhost:3000`.

3.  **Using Docker Compose (Recommended for local multi-container setup):**
    From the project root directory (where `docker-compose.yml` is located):
    ```bash
    docker-compose up -d frontend
    ```
    Or to build and then run:
    ```bash
    docker-compose up --build -d frontend
    ```
    To run all services defined in `docker-compose.yml` (backend, frontend, mongo):
    ```bash
    docker-compose up --build -d
    ```
    The frontend will typically be available on `http://localhost:3000` as per `docker-compose.yml` port mapping.
    To view logs:
    ```bash
    docker-compose logs -f frontend
    ```
    To stop services:
    ```bash
    docker-compose down
    ```

---

This README provides basic setup and run instructions for the frontend. For more detailed information on project structure, specific features, or contribution guidelines, refer to the main project README or other relevant documentation.
