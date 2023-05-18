const express = require('express');
const tagsRouter = express.Router();
const { getAllTags } = require('../db');

tagsRouter.get('/', (req, res) => {
  // Call getAllTags from the database
  getAllTags()
    .then((tags) => {
      // Return the result as an object
      res.json({ tags });
    })
    .catch((err) => {
      console.error('Error getting tags', err);
      res.status(500).json({ error: 'Failed to retrieve tags' });
    });
});

module.exports = tagsRouter;