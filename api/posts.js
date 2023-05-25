const express = require('express');
const postsRouter = express.Router();
const { getAllPosts } = require('../db');
const { getPostById } = require('../db');
const {updatePost} = require('../db');


const { requireUser } = require('./utils');

postsRouter.post('/', requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;

  const tagArr = tags.trim().split(/\s+/);
  const postData = {};

  // only send the tags if there are some to send
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    const authorId = req.user.id; // Get the authorId from the authenticated user
    
    // Add authorId, title, and content to postData object
    postData.authorId = authorId;
    postData.title = title;
    postData.content = content;

    // Call the createPost function with the postData
    const post = await createPost(postData);

    // Check if the post was created successfully
    if (post) {
      res.send({ post });
    } else {
      // If the post creation failed, throw an error
      throw Error('Failed to create post');
    }
  } catch (error) {
    // Handle any errors
    next(error);
  }
});

postsRouter.post('/', requireUser, async (req, res, next) => {
  res.send({ message: 'under construction' });
});

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


postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
    const { postId } = req.params;
    const { title, content, tags } = req.body;
  
    const updateFields = {};
  
    if (tags && tags.length > 0) {
      updateFields.tags = tags.trim().split(/\s+/);
    }
  
    if (title) {
      updateFields.title = title;
    }
  
    if (content) {
      updateFields.content = content;
    }
  
    try {
      const originalPost = await getPostById(postId);
  
      if (originalPost.author.id === req.user.id) {
        const updatedPost = await updatePost(postId, updateFields);
        res.send({ post: updatedPost })
      } else {
        next({
          name: 'UnauthorizedUserError',
          message: 'You cannot update a post that is not yours'
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

  postsRouter.delete('/:postId', requireUser, async (req, res, next) => {
    try {
      const post = await getPostById(req.params.postId);
  
      if (post && post.author.id === req.user.id) {
        const updatedPost = await updatePost(post.id, { active: false });
  
        res.send({ post: updatedPost });
      } else {
        // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
        next(post ? { 
          name: "UnauthorizedUserError",
          message: "You cannot delete a post which is not yours"
        } : {
          name: "PostNotFoundError",
          message: "That post does not exist"
        });
      }
  
    } catch ({ name, message }) {
      next({ name, message })
    }
  });


postsRouter.get('/', async (req, res, next) => {
    try {
      const allPosts = await getAllPosts();
  
      const posts = allPosts.filter(post => {
    return post.active || (req.user && post.author.id === req.user.id);
  });;
  
      res.send({
        posts
      });
    } catch ({ name, message }) {
      next({ name, message });
    }
  });



module.exports = postsRouter;


//token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJpYXQiOjE2ODQ0MDA5ODR9.4Rph9WaeiWTaKHG-X52s6uVjazR4eQVK87osCqSx6vg'






