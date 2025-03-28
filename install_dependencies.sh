#!/bin/bash

# Установка Nuxt 3.10.1
npm install nuxt@3.10.1

# Установка Chart.js и Vue-ChartJS
npm install chart.js@4.4.1
npm install vue-chartjs@5.3.0

# Установка dotenv и Nuxt dotenv
npm install @nuxtjs/dotenv
npm install dotenv@16.4.1

# Установка типов Node.js
npm install @types/node --save-dev

# Установка axios
npm install axios@1.6.7

# Установка PostgreSQL клиента
npm install pg@8.11.3

# Установка планировщика задач
npm install node-cron@3.0.3

echo "✅ Установка завершена!"

# Проверка на ошибки и наличие уязвимостей
npm audit
