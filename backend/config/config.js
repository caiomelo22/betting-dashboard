require('dotenv').config(); // Load environment variables from .env file

module.exports = {
  development: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE,
    host: process.env.DATABASE_HOST,
    dialect: 'mysql'
  },
  // Other environments...
};