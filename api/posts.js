const express = require('express');
const postsRouter = express.Router();
const { getAllPosts } = require('../db');

postsRouter.get('/', async (req, res) => {
  try {
    // Call getAllPosts from the database
    const posts = await getAllPosts();

    // Return the result as an object
    res.json({ posts });
  } catch (error) {
    console.error('Error getting posts', error);
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
});

module.exports = postsRouter;

