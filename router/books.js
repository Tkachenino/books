const express = require('express');
const router = express.Router();
const {Book} = require('../models');
const BookBD = require('../schema/Book');
const {fileMiddleware} = require('../middleware');
const fs = require('fs/promises');
const path = require('path');
const {counterMiddleware} = require('../middleware');

router.get('/', async (req, res) => {
  try {
  const books = await BookBD.find();
  res.render('index', { books })
  } catch (error) {
    res.status(404).redirect('/not-found');
  }
});

router.get('/not-found', (req, res) => {
  res.render('not-found-page');
});

router.get('/create', (req, res) => {
  res.render('create');
});

router.get('/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const book = await BookBD.findById(id);
    if (book === null) {
      throw Error('Resurce not found')
    }
    const incCount = await counterMiddleware.incCounter(id);
    res.render('book', { book, counter: incCount })
  } catch (error) {
    res.status(404).redirect('/not-found');
  }
});

router.post('/:id', fileMiddleware.none(), async (req, res) => {
  try {
    const {id} = req.params;
    const {title, description, authors, favorite} = req.body;
    const book = await BookBD.findById(id);
    const patchItem = {...book, title, description, authors, favorite };
    await BookBD.updateOne({_id: id}, {...patchItem});
    res.redirect(`/${id}`);
  } catch (error) {
    res.status(404).redirect('/not-found');
  }
});

router.get('/:id/update', async (req, res) => {
  try {
    const {id} = req.params;
    const book = await BookBD.findById(id);
    res.render('bookUpdate', { book })
  } catch (error) {
    res.status(404).redirect('/not-found');
  }
});

router.get('/:id/download', async (req, res) => {
  try {
    const {id} = req.params;
    const book = await BookBD.findById(id);
    const pathBook = path.join(__dirname, '../', '/public', '/books', book.fileBook);
    res.download(pathBook);
  } catch (error) {
    res.status(404).redirect('/not-found'); 
  }
});

const manyFiiles = fileMiddleware.fields([{ name: 'fileCover', maxCount: 1 }, { name: 'fileBook', maxCount: 1 }]);

router.post('/', manyFiiles, async (req, res) => {
  try {
    let fileBook = '';
    let fileCover = '';
    if(req.files['fileCover']?.[0]) {
      fileCover = req.files['fileCover'][0].filename;
    }
    
    if (req.files['fileBook']?.[0]) {
      console.log(req.files['fileBook'][0])
      fileBook = req.files['fileBook'][0].filename;
    }
    const {title, description, authors, favorite, fileName} = req.body;
  
    const newBook = new BookBD({title, description, authors, favorite, fileCover, fileName, fileBook});
    await newBook.save();
    res.status(201).redirect(`/${newBook._id}`);
  } catch (error) {
    res.status(404).redirect('/not-found'); 
  }
});

router.post('/:id/delete', async (req, res) => {
  try {
    const {id} = req.params;
    const book = await BookBD.findById(id);
    const pathCover = path.join(__dirname, '../', '/public', '/books', book.fileCover);
    const pathBook = path.join(__dirname, '../', '/public', '/books', book.fileBook);
    if(book.fileCover) {
    await fs.unlink(pathCover);
    }

    if(item.fileBook) {
      await fs.unlink(pathBook);
    }

    await BookBD.findByIdAndDelete(id);
    res.status(200).redirect('/');
  } catch (error) {
    res.status(404).redirect('/not-found');
  }
});

module.exports = router;