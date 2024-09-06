const express = require('express');
const router = express.Router();
let connection;

function setConnectionServiceRequest(conn) {
  connection = conn;
  console.log(connection);
}

function validateUserData(req, res, next) {
  const { requesttype, requeststatus } = req.body;
  if (!requesttype || !requeststatus) {
    return res.status(400).send('RequestType and RequestStatus are required');
  }
  next(); 
}

router.post('/submit', validateUserData, (req, res) => {
  const { requesttype, requeststatus } = req.body;

  if (!connection) {
    return res.status(500).send('No database connection');
  }

  const query = `INSERT INTO servicerequesttt (RequestType, RequestStatus) VALUES (?, ?)`;

  connection.query(query, [requesttype, requeststatus], (error, results) => {
    if (error) {
      console.error('Database error:', error.message);
      return res.status(500).send('Database error');
    }
    res.status(201).send('Service request submitted successfully');
  });
});

module.exports = { router, setConnectionServiceRequest };
