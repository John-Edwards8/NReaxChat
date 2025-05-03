# NReaxChat
[![ru](https://img.shields.io/badge/lang-ru-red.svg)](https://github.com/John-Edwards8/NReaxChat/blob/main/README.md)
[![ua](https://img.shields.io/badge/lang-ua-blue.svg)](https://github.com/John-Edwards8/NReaxChat/blob/main/README.ua.md)
[![de](https://img.shields.io/badge/lang-de-yellow.svg)](https://github.com/John-Edwards8/NReaxChat/blob/main/README.de.md)

This is a web application for real-time messaging, inspired by the Telegram Web interface. The project is implemented using Java Spring with a reactive approach (Reactive Programming), which ensures fast and asynchronous work with data. The frontend is built on React. The system supports data persistence in MongoDB.
The architecture is built on a microservice model.

---

## Tech stack

- **Backend**: Java (Reactive Spring Boot + Project Reactor)
- **Frontend**: ReactJS (Vite)
- **Database**: MongoDB
- **Containerization**: Docker, Docker Compose
- **Configuration orchestration**: `.env` files
- **Websockets / API Gateway**: STOMP

---

## Project architecture

- `auth-service`: authentication and authorization service
- `chat-service`: chat and message management service
- `client`: client part on React

All services are packed into containers and interact with each other via the internal docker network.

---

## How to run a project locally

1. **Clone a repository**

```bash
git clone https://github.com/John-Edwards8/NReaxChat.git
cd NReaxChat
```

2. **Create a `.env` file**

Copy the example and set up environment variables:
```bash
cp .env.example .env
```

3. **Run the application**

Development mode:

```bash
docker compose up --build
```

Prodaction mode:

```bash
docker compose -f docker-compose.yml up --build
```

Opens at:

- Frontend: `http://localhost:3000`
- API services: `http://localhost:8080`, `http://localhost:8081` (or as you specify)

---

## Screenshots

(Will be added)

---

## License

This project is distributed under the MIT license. More details in the LICENSE file.