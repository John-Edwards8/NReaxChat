# NReaxChat
[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/John-Edwards8/NReaxChat/blob/main/README.en.md)
[![ua](https://img.shields.io/badge/lang-ua-blue.svg)](https://github.com/John-Edwards8/NReaxChat/blob/main/README.ua.md)
[![de](https://img.shields.io/badge/lang-de-yellow.svg)](https://github.com/John-Edwards8/NReaxChat/blob/main/README.de.md)

Это веб-приложение для обмена сообщениями в режиме реального времени, вдохновленное интерфейсом Telegram Web. Проект реализован с использованием Java Spring с реактивным подходом (Reactive Programming), что обеспечивает быструю и асинхронную работу с данными. Фронтенд создан на React. Система поддерживает сохранность данных в MongoDB. 
Архитектура построена на микросервисной модели.

---

## Стек технологий

- **Backend**: Java (Reactive Spring Boot + Project Reactor)
- **Frontend**: ReactJS (Vite)
- **База данных**: MongoDB
- **Контейнеризация**: Docker, Docker Compose
- **Оркестрация конфигураций**: `.env` файлы
- **Вебсокеты / API Gateway**: STOMP

---

## Архитектура проекта

- `auth-service`: сервис аутентификации и авторизации
- `chat-service`: сервис управления чатами и сообщениями
- `client`: клиентская часть на React

Все сервисы упакованы в контейнеры и взаимодействуют друг с другом через внутреннюю docker-сеть.

---

## Как запустить проект локально

1. **Клонировать репозиторий**

```bash
git clone https://github.com/John-Edwards8/NReaxChat.git
cd NReaxChat
```

2. **Создать `.env` файл**

Скопировать пример и настроить переменные окружения:
```bash
cp .env.example .env
```

3. **Запустить приложение**

```bash
docker compose up --build
```

Откроется по адресу:

- Frontend: `http://localhost:3000`
- API сервисы: `http://localhost:8080`, `http://localhost:8081` (или как укажете)

---

## Скриншоты

(Будут добавлены)

---

## Лицензия

Этот проект распространяется под лицензией MIT. Подробнее в файле LICENSE.