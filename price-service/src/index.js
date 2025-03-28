require('dotenv').config();
const axios = require('axios');
const { Pool } = require('pg');
const cron = require('node-cron');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Создание таблицы, если она не существует
async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS bitcoin_prices (
        id SERIAL PRIMARY KEY,
        price DECIMAL NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
  }
}

// Получение текущей цены биткоина
async function fetchBitcoinPrice() {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
    return parseFloat(response.data.price);
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    return null;
  }
}

// Сохранение цены в базу данных
async function savePrice(price) {
  const client = await pool.connect();
  try {
    await client.query(
      'INSERT INTO bitcoin_prices (price) VALUES ($1)',
      [price]
    );
    console.log(`Price ${price} saved successfully`);
  } catch (err) {
    console.error('Error saving price:', err);
  } finally {
    client.release();
  }
}

// API эндпоинт для получения цен
app.get('/api/prices', async (req, res) => {
  try {
    console.log('Received request to /api/prices');
    const { period = 'day', start, end } = req.query;
    console.log('Query parameters:', { period, start, end });
    
    let query = 'SELECT price, timestamp FROM bitcoin_prices';
    let params = [];
    
    if (start && end) {
      query += ' WHERE timestamp BETWEEN $1 AND $2';
      params = [start, end];
    } else {
      const now = new Date();
      let startDate;
      
      switch (period) {
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default: // day
          startDate = new Date(now.setDate(now.getDate() - 1));
      }
      
      query += ' WHERE timestamp >= $1';
      params = [startDate];
    }
    
    query += ' ORDER BY timestamp ASC';
    console.log('Executing query:', query);
    console.log('Query parameters:', params);
    
    const result = await pool.query(query, params);
    console.log(`Query returned ${result.rows.length} rows`);
    res.json(result.rows);
  } catch (err) {
    console.error('Detailed error in /api/prices:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      error: true, 
      message: 'Server Error',
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Основная функция для сбора данных
async function collectPrice() {
  const price = await fetchBitcoinPrice();
  if (price) {
    await savePrice(price);
  }
}

// Инициализация базы данных и запуск сбора данных
async function start() {
  await initDatabase();
  
  // Сбор данных каждые 5 минут
  cron.schedule('*/5 * * * *', collectPrice);
  
  // Сбор данных сразу при запуске
  await collectPrice();
  
  // Запуск Express сервера
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Price service API running on port ${port}`);
  });
  
  console.log('Price collection service started');
}

start().catch(console.error); 