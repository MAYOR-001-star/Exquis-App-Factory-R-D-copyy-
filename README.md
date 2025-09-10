# Authentication gateway - Monorepo

## Overview
Authentication gateway is a **monorepo** containing both client and server implementations that provide a **unified authentication layer** for multiple backend APIs and microservices. It centralizes various authentication protocols and identity providers, offering a **single point of entry** for user authentication.

This service enhances security, streamlines user experience, and simplifies API integration by providing a consistent and reliable authentication mechanism across both client-side and server-side applications.

## Repository Structure
```
exquis-auth-gateway/
├── client/                 # Client-side authentication components and SDKs
│   ├── src/
│   ├── package.json
│   └── README.md
├── server/                 # Server-side authentication service (NestJS)
│   ├── src/
│   ├── package.json
│   └── README.md
└── README.md              # This file
```

## Supported Authentication Flows
AuthGateway supports a variety of industry-standard authentication methods across both client and server implementations:

* **OAuth 2.0 & OpenID Connect (OIDC)**
* **JSON Web Tokens (JWT)**
* **Okta Integration**
* **AWS Cognito Integration**
* **Custom Authentication Flows**
* **Multi-Factor Authentication (MFA)**
* **Social Login Providers** (Google, GitHub, etc.)

## Getting Started

### Prerequisites
- **Node.js** (v20 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ExquisAppFactory/exquis-auth-gateway.git
   cd exquis-auth-gateway
   ```

2. **Install dependencies for the entire monorepo:**
   ```bash
   npm install
   # This will install dependencies for client, server
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` in both `client/` and `server/` directories
   - Update the configuration files with your specific settings

### Development

#### Running Individual Components
```bash
# Server  (NestJS backend)
cd server
npm run start:dev

# Client  (React)
cd client
npm run dev


### For Client Applications
Client applications can integrate with AuthGateway using the provided client SDK or by redirecting users to the AuthGateway authentication endpoints. The client package provides:

- **Authentication hooks/components** for popular frameworks (React)
- **Token management utilities**
- **Logout and session management**

### For Backend Services
Backend APIs can validate tokens issued by AuthGateway either:
- **Via AuthGateway validation endpoints** (recommended for high security)
- **Locally using shared JWT verification** (for better performance)

Upon successful authentication, AuthGateway issues **secure tokens** (e.g., JWTs) which clients use to authorize requests to backend APIs.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both client and server in development mode |
| `npm run start:dev` | Start server development mode  |
| `npm run build` | Build both client and server |
| `npm run test` | Run tests across both client and server |
| `npm run lint` | Run linting across both client and server |

## Architecture

### Client
- **Framework-agnostic authentication library**
- **React specific components**
- **Token storage and management**
- **Authentication state management (zustand)**

### Server
- **NestJS-based authentication service**
- **Multiple identity provider integrations**
- **Token generation and validation**
- **User session management**

## Contributing

1. Pull the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes in the appropriate package (`client/`, `server/`)
4. Run tests: `npm run test`
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Documentation

For more detailed information:
- **[Server Documentation](./server/README.md)** - Backend API and service details
- **[Client Documentation](./client/README.md)** - Client SDK and integration guides
- **[Integration Guide](./docs/integration.md)** - Step-by-step integration examples
