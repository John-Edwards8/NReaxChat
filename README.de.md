# NReaxChat
[![ru](https://img.shields.io/badge/lang-ru-red.svg)](https://github.com/John-Edwards8/NReaxChat/blob/main/README.md)
[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/John-Edwards8/NReaxChat/blob/main/README.en.md)
[![ua](https://img.shields.io/badge/lang-ua-blue.svg)](https://github.com/John-Edwards8/NReaxChat/blob/main/README.ua.md)

Es handelt sich um eine Echtzeit-Messaging-Webanwendung, die von der Telegram-Weboberfläche inspiriert ist. Das Projekt wird mit Java Spring mit einem reaktiven Ansatz (Reactive Programming) implementiert, der eine schnelle und asynchrone Arbeit mit Daten gewährleistet. Das Frontend basiert auf React. Das System unterstützt die Datensicherheit in MongoDB.
Die Architektur basiert auf einem Microservice-Modell.

---

## Technologie-Stack

- **Backend**: Java (Reactive Spring Boot + Project Reactor)
- **Frontend**: ReactJS (Vite)
- **Datenbank**: MongoDB
- **Containerisierung**: Docker, Docker Compose
- **Konfigurationsorchestrierung**: `.env`-Dateien
- **Websockets / API-Gateway**: STOMP

---

## Projektarchitektur

- `auth-service`: Authentifizierungs- und Autorisierungsdienst
- `chat-service`: Chat- und Nachrichtenverwaltungsdienst
- `client`: Client-Teil von React

Alle Dienste sind in Containern verpackt und interagieren über ein internes Docker-Netzwerk miteinander.

---

## So führen Sie ein Projekt lokal aus

1. **Repository klonen**

```bash
git clone https://github.com/John-Edwards8/NReaxChat.git
cd NReaxChat
```

2. **Erstellen Sie eine `.env`-Datei**

Kopieren Sie das Beispiel und legen Sie die Umgebungsvariablen fest:
```bash
cp .env.example .env
```

3. **Starten Sie die Anwendung**

```bash
docker compose up --build
```

Eröffnung:

- Frontend: `http://localhost:3000`
- API-Dienste: `http://localhost:8080`, `http://localhost:8081` (oder wie von Ihnen angegeben)

---

## Screenshots

(Wird hinzugefügt)

---

## Lizenz

Dieses Projekt wird unter der MIT-Lizenz vertrieben. Weitere Details in der LICENSE-Datei.