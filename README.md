# Bitcoin Price Tracker

Приложение для отслеживания и визуализации цен на биткоин, построенное с использованием Nuxt.js и PostgreSQL.

## Функциональность

- Отображение графика цен на биткоин
- Выбор периода отображения данных (день, неделя, месяц, год)
- Возможность выбора пользовательского периода
- Автоматическое обновление данных каждые 5 минут

## Технологии

- Nuxt.js 3
- PostgreSQL
- Chart.js
- Docker & Docker Compose
- Node.js

## Предварительные требования

### Установка Node.js

1. **Для Windows:**
   - Скачайте и установите Node.js с официального сайта: https://nodejs.org/
   - Выберите LTS (Long Term Support) версию
   - После установки перезагрузите компьютер

2. **Для macOS:**
   - Установите через Homebrew:
     ```bash
     brew install node
     ```
   - Или скачайте установщик с официального сайта: https://nodejs.org/

3. **Для Linux (Ubuntu/Debian):**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

### Проверка установки Node.js

```bash
node --version
npm --version
```

### Установка Docker и Docker Compose

1. **Для Windows:**
   - Скачайте и установите Docker Desktop с официального сайта: https://www.docker.com/products/docker-desktop
   - При установке убедитесь, что опция "WSL 2" включена
   - После установки перезагрузите компьютер

2. **Для macOS:**
   - Скачайте и установите Docker Desktop с официального сайта: https://www.docker.com/products/docker-desktop
   - После установки запустите Docker Desktop из папки Applications

3. **Для Linux (Ubuntu/Debian):**
   ```bash
   # Установка Docker
   sudo apt update
   sudo apt install docker.io
   
   # Установка Docker Compose
   sudo apt install docker-compose
   
   # Добавление пользователя в группу docker
   sudo usermod -aG docker $USER
   ```
   После выполнения этих команд перезагрузите компьютер.

### Проверка установки

Откройте терминал и выполните следующие команды:
```bash
docker --version
docker-compose --version
```

Если команды выполняются без ошибок, значит установка прошла успешно.

## Структура проекта

```
bitcoin_prices/
├── .env                  # Файл с переменными окружения
├── docker-compose.yml    # Настройки Docker Compose
├── README.md             # Документация проекта
│
├── nuxt-app/             # Frontend приложение
│   ├── Dockerfile        # Настройки сборки для frontend
│   ├── app.vue           # Основной компонент Vue
│   ├── nuxt.config.ts    # Конфигурация Nuxt.js
│   ├── package.json      # Зависимости frontend
│   └── server/           # Серверная часть Nuxt
│       └── api/          # API эндпоинты
│           └── prices.get.js  # Эндпоинт для получения цен
│
└── price-service/        # Сервис для сбора цен
    ├── Dockerfile        # Настройки сборки для price-service
    ├── package.json      # Зависимости price-service
    └── src/              # Исходный код сервиса
        └── index.js      # Основной файл сервиса
```

## Зависимости проекта

### Frontend (nuxt-app)

Основные зависимости:
```json
{
  "dependencies": {
    "chart.js": "^4.4.1",
    "dotenv": "^16.4.1",
    "nuxt": "^3.10.1",
    "postgres": "^3.4.5",
    "vue-chartjs": "^5.3.0"
  },
  "devDependencies": {
    "@nuxtjs/tailwindcss": "^6.11.4",
    "@types/pg": "^8.11.11"
  }
}
```

### Backend (price-service)

Основные зависимости:
```json
{
  "dependencies": {
    "axios": "^1.6.7",
    "pg": "^8.11.3",
    "node-cron": "^3.0.3",
    "dotenv": "^16.4.1",
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
```

### База данных

- PostgreSQL 15
- Создается автоматически через Docker Compose

## Установка и запуск проекта

1. **Клонирование репозитория:**
   ```bash
   # Создайте папку для проекта
   mkdir bitcoin-prices
   cd bitcoin-prices
   
   # Скопируйте все файлы проекта в эту папку
   # (если вы скачали архив, распакуйте его сюда)
   ```

2. **Создание файла .env:**
   ```bash
   # Создайте файл .env в корневой папке проекта
   touch .env
   ```
   
   Добавьте в файл `.env` следующую строку:
   ```
   DATABASE_URL=postgresql://postgres:postgres@postgres:5432/bitcoin_prices
   ```

3. **Запуск проекта с использованием Docker:**
   ```bash
   # Остановите все запущенные контейнеры, если они есть
   docker-compose down
   
   # Очистите кэш Nuxt, если возникают проблемы с импортом модулей
   cd nuxt-app
   npx nuxi cleanup
   cd ..
   
   # Запустите все сервисы заново
   docker-compose up --build
   ```
   
   При первом запуске это может занять несколько минут, так как Docker будет скачивать необходимые образы и устанавливать зависимости.

4. **Проверка работы:**
   - Откройте браузер
   - Перейдите по адресу: http://localhost:3000
   - Вы должны увидеть интерфейс приложения с графиком цен на биткоин

## Возможные проблемы и их решение

1. **Ошибка импорта модулей:**
   - Если вы видите ошибки импорта CommonJS модулей (например, pg), очистите кэш Nuxt:
     ```bash
     cd nuxt-app
     npx nuxi cleanup
     cd ..
     docker-compose down
     docker-compose up --build
     ```

2. **Ошибка "Port 3000 is already in use":**
   - Остановите все запущенные контейнеры:
     ```bash
     docker-compose down
     ```
   - Проверьте, не запущено ли что-то еще на порту 3000
   - Попробуйте запустить снова

3. **Ошибка подключения к базе данных:**
   - Убедитесь, что файл `.env` создан и содержит правильную строку подключения
   - Проверьте, что все контейнеры запущены:
     ```bash
     docker-compose ps
     ```
   - Перезапустите контейнеры:
     ```bash
     docker-compose down
     docker-compose up --build
     ```

4. **График не отображается:**
   - Подождите несколько минут, пока сервис соберет первые данные
   - Проверьте консоль браузера на наличие ошибок (F12 -> Console)

## Разработка без Docker

Если вы хотите разрабатывать без использования Docker:

1. **Установка PostgreSQL:**
   - Установите PostgreSQL 15 на ваш компьютер
   - Создайте базу данных `bitcoin_prices`
   - Настройте в `.env` строку подключения к локальной базе данных

2. **Запуск frontend:**
   ```bash
   cd nuxt-app
   npm install
   npm run dev
   ```

3. **Запуск price-service:**
   ```bash
   cd price-service
   npm install
   npm start
   ```

## Примечания

- В проекте используется Nuxt.js 3, который работает с ESM (ECMAScript модулями)
- При работе с CommonJS модулями (например, pg) используйте рекомендуемый синтаксис:
  ```javascript
  import pkg from 'pg';
  const { Pool } = pkg;
  ```
- Если вам нужно добавить новые зависимости, уточните их версии для лучшей совместимости 