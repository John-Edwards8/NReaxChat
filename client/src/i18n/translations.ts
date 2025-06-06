export const translations = {
    en: {
        welcome: 'Welcome to NReaxChat',
        description: 'Secure and fast messaging. Connect with people easily.',
        login: 'Login',
        signup: 'Sign Up',
        features: {
            realtime: 'Real-time instant messaging',
            fast: 'Lightning-fast and always responsive',
            secure: 'Secure and private message storage',
        },
        settings: 'Settings',
        errors: {
            missingFields: 'Please enter username and password',
            missingUsername: 'Please enter username',
            missingPassword: 'Please enter password',
            login: {
                invalid: 'Invalid credentials',
            },
            register: {
                invalid: 'Failed to register',
            },
        },
        placeholders: {
            username: [
                "Type your username...",
                "Start chatting instantly!",
                "Enter your nickname...",
            ],
            password: [
                "Type your password...",
                "Use a secure password",
                "Don't forget it!",
            ],
        },
    },
    ru: {
        welcome: 'Добро пожаловать в NReaxChat',
        description: 'Безопасная и быстрая переписка. Общайтесь с лёгкостью.',
        login: 'Вход',
        signup: 'Регистрация',
        features: {
            realtime: 'Мгновенные сообщения в реальном времени',
            fast: 'Молниеносно и всегда отзывчиво',
            secure: 'Надёжное и приватное хранение сообщений',
        },
        settings: 'Настройки',
        errors: {
            missingFields: 'Введите имя пользователя и пароль',
            missingUsername: 'Введите имя пользователя',
            missingPassword: 'Введите пароль',
            login: {
                invalid: 'Неверные учетные данные',
            },
            register: {
                invalid: 'Не удалось зарегистрироваться',
            },
        },
        placeholders: {
            username: [
                "Введите имя пользователя...",
                "Начните общение прямо сейчас!",
                "Укажите ваш ник...",
            ],
            password: [
                "Введите пароль...",
                "Используйте надежный пароль",
                "Не забудьте его!",
            ],
        },
    },
    ua: {
        welcome: 'Ласкаво просимо до NReaxChat',
        description: 'Безпечні й швидкі повідомлення. Легко спілкуйтесь.',
        login: 'Увійти',
        signup: 'Зареєструватися',
        features: {
            realtime: 'Повідомлення в реальному часі',
            fast: 'Блискавично швидко та чуйно',
            secure: 'Безпечне зберігання повідомлень',
        },
        settings: 'Налаштування',
        errors: {
            missingFields: 'Введіть ім’я користувача та пароль',
            missingUsername: 'Введіть ім’я користувача',
            missingPassword: 'Введіть пароль',
            login: {
                invalid: 'Неправильні облікові дані',
            },
            register: {
                invalid: 'Не вдалося зареєструватися',
            },
        },
        placeholders: {
            username: [
                "Введіть ім'я користувача...",
                "Почніть спілкування прямо зараз!",
                "Вкажіть ваш нік...",
            ],
            password: [
                "Введіть пароль...",
                "Використовуйте надійний пароль",
                "Не забудьте його!",
            ],
        },
    },
    pl: {
        welcome: 'Witamy w NReaxChat',
        description: 'Bezpieczne i szybkie wiadomości. Łatwa komunikacja.',
        login: 'Zaloguj się',
        signup: 'Zarejestruj się',
        features: {
            realtime: 'Wiadomości w czasie rzeczywistym',
            fast: 'Błyskawicznie i responsywnie',
            secure: 'Bezpieczne przechowywanie wiadomości',
        },
        settings: 'Ustawienia',
        errors: {
            missingFields: 'Wprowadź nazwę użytkownika i hasło',
            missingUsername: 'Wprowadź nazwę użytkownika',
            missingPassword: 'Wprowadź hasło',
            login: {
                invalid: 'Nieprawidłowe dane logowania',
            },
            register: {
                invalid: 'Nie udało się zarejestrować',
            },
        },
        placeholders: {
            username: [
                "Wprowadź nazwę użytkownika...",
                "Rozpocznij czat już teraz!",
                "Wprowadź swój pseudonim...",
            ],
            password: [
                "Wprowadź swoje hasło...",
                "Użyj silnego hasła",
                "Nie zapomnij go!",
            ],
        },
    },
    de: {
        welcome: 'Willkommen bei NReaxChat',
        description: 'Sichere und schnelle Nachrichten. Einfach verbinden.',
        login: 'Anmelden',
        signup: 'Registrieren',
        features: {
            realtime: 'Nachrichten in Echtzeit',
            fast: 'Blitzschnell und reaktionsschnell',
            secure: 'Sichere Speicherung von Nachrichten',
        },
        settings: 'Einstellungen',
        errors: {
            missingFields: 'Bitte Benutzername und Passwort eingeben',
            missingUsername: 'Bitte Benutzernamen eingeben',
            missingPassword: 'Bitte Passwort eingeben',
            login: {
                invalid: 'Ungültige Anmeldedaten',
            },
            register: {
                invalid: 'Registrierung fehlgeschlagen',
            },
        },
        placeholders: {
            username: [
                "Benutzernamen eingeben…",
                "Jetzt chatten!",
                "Nickname eingeben…",
            ],
            password: [
                "Passwort eingeben…",
                "Sicheres Passwort verwenden",
                "Nicht vergessen!",
            ],
        },
    },
} as const;
export type Language = keyof typeof translations;