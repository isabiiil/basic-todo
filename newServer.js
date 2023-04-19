// soy-tower-235602:us-central1:fullstack-todo

'use strict';

const express = require('express');
// const mysql = require('promise-mysql');
const mysql = require("mysql2");
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.enable('trust proxy');

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.set('Content-Type', 'text/html');
  next();
});

// const config = {
//   connectionLimit: 5,
//   connectTimeout: 10000, // 10 seconds
//   acquireTimeout: 10000, // 10 seconds
//   waitForConnections: true, // Default: true
//   queueLimit: 0, // Default: 0
// };


// const db = mysql.createPool({
//   // host: process.env.DB_HOST,
//   // port: process.env.DB_PORT,
//   // user: process.env.DB_USER,
//   // password: process.env.DB_PASS,
//   // database: process.env.DB_NAME,
//   // socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
//   host: "127.0.0.1",
//   // host: "35.194.41.107",
//   port: "3306",
//   user: "root",
//   password: "0998",
//   database: "todo",
//   socketPath: "/cloudsql/soy-tower-235602:us-central1:fullstack-todo",
//   ...config,
// });

// db.getConnection((err, connection) => {
//   if (err) {
//     throw err;
//   }
//   console.log('Connected to database');
// });

const createTcpPool = async config => {
  // Establish a connection to the database
  return mysql.createPool({
    user: "root", // e.g. 'my-db-user'
    password: "0998", // e.g. 'my-db-password'
    database: "todo", // e.g. 'my-database'
    host: "127.0.0.1", // e.g. '127.0.0.1'
    port: "3306", // e.g. '3306'
    // ... Specify additional properties here.
    ...config,
  });
};

const createPool = async () => {
  const config = {
    connectionLimit: 5,
    connectTimeout: 10000, // 10 seconds
    acquireTimeout: 10000, // 10 seconds
    waitForConnections: true, // Default: true
    queueLimit: 0, // Default: 0
  };

  return createTcpPool(config);
};

const ensureSchema = async pool => {
  // Wait for tables to be created (if they don't already exist).
  await pool.query(
    `CREATE TABLE IF NOT EXISTS todolist
      ( taskID INT AUTO_INCREMENT, task VARCHAR(255) NOT NULL, status VARCHAR(255), priority INT, due DATE, PRIMARY KEY (taskID) );`,
  );
  console.log("Ensured that table 'todolist' exists");
};

const createPoolAndEnsureSchema = async () =>
  await createPool()
    .then(async pool => {
      await ensureSchema(pool);
      return pool;
    })
    .catch(err => {
      logger.error(err);
      throw err;
    });

let pool;

app.use(async (req, res, next) => {
  if (pool) {
    return next();
  }
  try {
    pool = await createPoolAndEnsureSchema();
    next();
  } catch (err) {
    logger.error(err);
    return next(err);
  }
});

app.get('/get', (req, res) => {
  db.query(
    `SELECT * FROM tasks`,
    (err, results) => {
      if (err) {
        throw err;
      }
      res.send(results);
    },
  );
  // return res;
});

app.post('/post', (req, res) => {
  db.query(
    `INSERT INTO todolist (task, status, priority, due) VALUES (?, ?, ?, ?)`,
    [req.body.task, req.body.status, req.body.priority, req.body.due],
    (err, results) => {
      if (err) {
        throw err;
      }
      res.send(results);
    },
  );
});

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

process.on('unhandledRejection', err => {
  console.error(err);
  throw err;
});

module.exports = server;