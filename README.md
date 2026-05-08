# Bitcoin Price Tracker

An application for tracking and visualizing Bitcoin prices, built with Nuxt.js and PostgreSQL.

## Features

- Bitcoin price chart.
- Period selection: day, week, month, and year.
- Custom date range selection.
- Automatic data updates every 5 minutes.

## Technologies

- Nuxt.js 3.
- PostgreSQL.
- Chart.js.
- Docker and Docker Compose.
- Node.js.

## Prerequisites

### Node.js

Install Node.js from https://nodejs.org/ and use the LTS version.

Check the installation:

```bash
node --version
npm --version
```

### Docker and Docker Compose

Install Docker Desktop on Windows or macOS, or install Docker packages on Linux.

Check the installation:

```bash
docker --version
docker-compose --version
```

## Project Structure

```text
bitcoin_prices/
|-- .env
|-- docker-compose.yml
|-- README.md
|-- nuxt-app/
|   |-- Dockerfile
|   |-- app.vue
|   |-- nuxt.config.ts
|   |-- package.json
|   +-- server/
|       +-- api/
|           +-- prices.get.js
+-- price-service/
    |-- Dockerfile
    |-- package.json
    +-- src/
        +-- index.js
```

## Dependencies

Frontend:

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

Backend price service:

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

Database:

- PostgreSQL 15.
- Created automatically through Docker Compose.

## Installation and Running

1. Create a project folder and copy the files into it.

2. Add the contents of the related repository `price_tracker_nuxt` to the project root when needed:

   ```text
   https://github.com/romanshablio/price_tracker_nuxt
   ```

3. Create a `.env` file in the project root:

   ```bash
   touch .env
   ```

4. Add the database URL:

   ```text
   DATABASE_URL=postgresql://postgres:postgres@postgres:5432/bitcoin_prices
   ```

5. Start all services:

   ```bash
   docker-compose down
   docker-compose up --build
   ```

6. Open the application:

   ```text
   http://localhost:3000
   ```

## Troubleshooting

### Module Import Errors

If Nuxt reports CommonJS import errors, clear the Nuxt cache:

```bash
cd nuxt-app
npx nuxi cleanup
cd ../
docker-compose down
docker-compose up --build
```

### Port 3000 Is Already in Use

Stop existing containers:

```bash
docker-compose down
```

Then check whether another process is using port 3000 and start the project again.

### Database Connection Error

- Make sure the `.env` file exists and contains the correct connection string.
- Check running containers:

  ```bash
  docker-compose ps
  ```

- Restart containers:

  ```bash
  docker-compose down
  docker-compose up --build
  ```
