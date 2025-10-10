# Central Authentication Service (CAS)

## Overview

The Central Authentication Service (CAS) provides a **unified authentication layer** for multiple backend APIs and microservices. It centralizes various authentication protocols and identity providers, offering a **single point of entry** for user authentication.

This service enhances security, streamlines user experience, and simplifies API integration by providing a consistent and reliable authentication mechanism.

## Supported Authentication Flows

CAS supports a variety of industry-standard authentication methods, including:

* **OAuth 2.0 & OpenID Connect (OIDC)**
* **JSON Web Tokens (JWT)**
* **Okta Integration**
* **AWS Cognito Integration**
* **Custom Authentication Flows**

## Getting Started

This project is built with **NestJS** and **Node.js**.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/ExquisAppFactory/central-auth-service.git](https://github.com/ExquisAppFactory/central-auth-service.git)
    cd central-auth-service
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure environment variables** in a `.env` file (refer to `.env.example`).
4.  **Run the service:**
    ```bash
    npm run start:dev # For development with hot-reloads
    # or
    npm run start     # For production build
    ```

# Server
PORT=""
NODE_ENV=""

# Database
MONGO_URI=""

# ZeptoMail
ZEPTO_HOST=""
ZEPTO_PORT=""
ZEPTO_USER=""
ZEPTO_PASS=""
ZEPTO_FROM=""


## Usage

Client applications redirect users to CAS for authentication. Upon successful login, CAS issues **secure tokens** (e.g., JWTs) which clients then use to authorize requests to backend APIs. Backend APIs can validate these tokens via CAS or locally.

---

For more detailed information, please refer to the project's documentation.