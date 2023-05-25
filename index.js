require('dotenv').config();

const PORT = 3000;
const express = require('express');
const server = express();

const morgan = require('morgan');
server.use(morgan('dev'));

server.use(express.json());

const apiRouter = require('./api');
const postsRouter = require('./api/posts');
const tagsRouter = require('./api/tags');


server.use('/api', apiRouter);
server.use('/api/posts', postsRouter);
server.use('/api/tags', tagsRouter);

const { client } = require('./db');
client.connect();


  server.get('/add/:first/to/:second', (req, res, next) => {
    res.send(`<h1>${ req.params.first } + ${ req.params.second } = ${
      Number(req.params.first) + Number(req.params.second)
     }</h1>`);
  });

server.listen(PORT, () => {
  console.log('The server is up on port', PORT);
});
