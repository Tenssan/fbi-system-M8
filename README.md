# FBI Authentication System

This project is a Node.js application that handles authentication and access control for an FBI system. It includes functionalities to sign in and access restricted areas based on JSON Web Token (JWT) authentication.

## Prerequisites

- Node.js installed on your machine and to log in use an account from data/agentes.js

## Installation

1. Clone the repository to your local machine
   
3. Install the required dependencies:

    ```bash
    npm install
    ```
4. Create a `.env` file in the root directory and add your secret key:

    ```bash
    SECRET_KEY=your_secret_key
    ```

## Usage

1. Start the application:

    ```bash
    node server.js
    ```

2. Open your browser and navigate to `http://localhost:3000` to interact with the web interface.

## API Endpoints

### Sign In

- **URL:** `/SignIn`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "agent@example.com",
    "password": "password"
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:** HTML content with JWT token stored in sessionStorage

### Restricted Area

- **URL:** `/restricted`
- **Method:** `GET`
- **Query Parameter:** `token` (JWT token)
- **Success Response:**
  - **Code:** 200
  - **Content:** HTML content displaying restricted information

## Functions

- `POST /SignIn`: Authenticates the agent and returns a JWT token.
- `GET /restricted`: Validates the JWT token and grants access to the restricted area.
