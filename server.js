import express from 'express';
import mysql from 'mysql2';
import {init} from './index.js'


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost', 
    user: 'root',
    password: 'Password123',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
);

app.get('/', (req, res) => {
    init(); 
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)});