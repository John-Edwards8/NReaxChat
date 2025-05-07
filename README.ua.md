# NReaxChat
[![ru](https://img.shields.io/badge/lang-ru-red.svg)](https://github.com/John-Edwards8/NReaxChat/blob/main/README.md)
[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/John-Edwards8/NReaxChat/blob/main/README.en.md)
[![de](https://img.shields.io/badge/lang-de-yellow.svg)](https://github.com/John-Edwards8/NReaxChat/blob/main/README.de.md)

Це веб-застосунок для обміну повідомленнями в режимі реального часу, натхненний інтерфейсом Telegram Web. Проект реалізований з використанням Java Spring з реактивним підходом (Reactive Programming), що забезпечує швидку та асинхронну роботу з даними. Фронтенд створено на React. Система підтримує збереження даних у MongoDB.
Архітектура побудована на мікросервісній моделі.

---

## Стек технологій

- **Backend**: Java (Reactive Spring Boot + Project Reactor)
- **Frontend**: ReactJS (Vite)
- **База даних**: MongoDB
- **Контейнеризація**: Docker, Docker Compose
- **Оркестрація конфігурацій**: `.env` файли
- **Вебсокети / API Gateway**: STOMP

---

## Архітектура проекту

- `auth-service`: сервіс аутентифікації та авторизації
- `chat-service`: сервіс управління чатами та повідомленнями
- `client`: клієнтська частина на React

Всі послуги упаковані у контейнери та взаємодіють один з одним через внутрішню docker-мережу.

---

## Як запустити проект локально

1. **Клонувати репозиторій**

```bash
git clone https://github.com/John-Edwards8/NReaxChat.git
cd NReaxChat
```

2. **Створити `.env` файл**

Копіювати приклад та налаштувати змінні оточення:
```bash
cp .env.example .env
```

3. **Запустити програму**

Режим розробки:

```bash
docker compose up --build
```

Режим prodaction:

```bash
docker compose -f docker-compose.yml up --build
```

Відкриється за адресою:

- Frontend: `http://localhost:3000`
- API сервіси: `http://localhost:8080`, `http://localhost:8081` (або як вкажете)

---

## Скріншоти

(Будуть додані)

---

## Ліцензія

Цей проект розповсюджується під ліцензією MIT. Докладніше у файлі LICENSE.