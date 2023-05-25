const express = require('express');
const tagsRouter = express.Router();
const { getAllTags } = require('../db');
const {getPostsByTagName} = require('../db');

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

tagsRouter.get('/:tagName/posts', async (req, res, next) => {

    // read the tagname from the params
    const {tagName} = req.params;
    try {

        const posts = await getPostsByTagName(tagName);


        const filteredPosts = posts.filter(post => {
            return post.active || (req.user && post.author.id === req.user.id);
          });
          
        res.json({posts});
        

        // use our method to get posts by tag name from the db
      // send out an object to the client { posts: // the posts }
    } catch ({ name, message }) {
      // forward the name and message to the error handler

      throw new Error('failed to fetch posts by tag name');
    }
  });

module.exports = tagsRouter;