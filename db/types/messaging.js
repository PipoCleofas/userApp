const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

let connection;

function setConnectionMessaging(conn) {
  connection = conn;
}

function validateUserData(req, res, next) {
  const { message } = req.body;
  if (!message) {
    return res.status(400).send('Message required');
  }
  next(); 
}

router.post('/submit', validateUserData, (req, res) => {
    const { message } = req.body;
  
    if (!connection) {
      return res.status(500).send('No database connection');
    }
  
    const query = 'INSERT INTO messaging (message) VALUES (?)';
  
    connection.query(query, [message], (error, results) => {
      if (error) {
        console.error('Database error:', error.message);
        return res.status(500).send('Database error');
      }
      
      res.status(201).json({message: 'Message sent successfully'});
    });
  });

  router.get('/getMessage', (req, res) => {
    const verify = 'SELECT * FROM messaging';
  
    connection.query(verify, (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).send('Database error');
      }
  
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res.status(401).json({ message: 'No messages found.' });
      }
    });
  });

module.exports = { router, setConnectionMessaging };