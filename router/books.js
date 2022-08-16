const express = require('express');
const router = express.Router();
const {Book} = require('../models');
const {fileMiddleware} = require('../middleware');
const fs = require('fs/promises');
const path = require('path');
const {counterMiddleware} = require('../middleware');

const fakeDB = {
  data: []
};

 fakeDB.data = [1,2,3].map(i => {
 return new Book(`title ${i}`, `description ${i}`,`authors ${i}`, `favorite ${i}`, '', `fileName ${i}`)
});

router.get('/', (req, res) => {
  const {data} = fakeDB;

  res.render('index', { books: data })
});

router.get('/not-found', (req, res) => {

  res.render('not-found-page');
});


router.get('/create', (req, res) => {

  res.render('create');
});

router.get('/:id', async (req, res) => {
  const {id} = req.params;
  const {data} = fakeDB;


  const item = data.find(i => {
    return i.id === id;
  })

  if(item === undefined) {
    res.status(404).redirect('/not-found');
  }

  const incCount = await counterMiddleware.incCounter(id);
  
  res.render('book', { book: item, counter: incCount })
});


router.post('/:id', fileMiddleware.none(), (req, res) => {
  const {id} = req.params;
  const {title, description, authors, favorite} = req.body;
  const {data} = fakeDB;

  const item = data.find(i => {
    return i.id === id;
  })

  if(item === undefined) {
    res.status(404).redirect('/not-found');
  }

  const patchItem = {...item, title, description, authors, favorite };
  console.log(patchItem);
  const filtredBDData = data.filter(i => {
    return i.id !== id;
  });
  
  filtredBDData.push(patchItem);
  fakeDB.data = filtredBDData;
  
  res.redirect(`/${id}`);
});

router.get('/:id/update', (req, res) => {
  const {id} = req.params;
  const {data} = fakeDB;


  const item = data.find(i => {
    return i.id === id;
  })

  if(item === undefined) {
    res.status(404).redirect('/not-found');
  }
  
  res.render('bookUpdate', { book: item })
});

router.get('/:id/download', (req, res) => {
  const {id} = req.params;
  const {data} = fakeDB;


  const item = data.find(i => {
    return i.id === id;
  })

  if(item === undefined) {
    res.status(404).redirect('/not-found');
  }
  
  res.download(item.fileBook.path);
});

const manyFiiles = fileMiddleware.fields([{ name: 'fileCover', maxCount: 1 }, { name: 'fileBook', maxCount: 1 }]);

router.post('/', manyFiiles, (req, res) => {
  let fileBook = '';
  let fileCover = '';
  if(req.files['fileCover']?.[0]) {
    fileCover = req.files['fileCover'][0].filename;
  }
  
  if (req.files['fileBook']?.[0]) {
    fileBook = req.files['fileBook'][0];
  }
  const {title, description, authors, favorite, fileName} = req.body;

  const newBook = new Book(title, description, authors, favorite, fileCover, fileName, fileBook);
  fakeDB.data.push(newBook);
  res.status(201).redirect(`/${newBook.id}`);
});

router.post('/:id/delete', async (req, res) => {
  const {id} = req.params;
  const {data} = fakeDB;

  const item = data.find(i => {
    return i.id === id;
  })

  if(item === undefined) {
    res.status(404).redirect('/not-found');
  }

  const pathCover = path.join(__dirname, '../', '/public', '/books', item.fileCover);
  const pathBook = path.join(__dirname, '../', '/public', '/books', item.fileBook);

  if(item.fileCover) {
    await fs.unlink(pathCover);
  }

  if(item.fileBook) {
    await fs.unlink(pathBook);
  }

  const filtredBDData = data.filter(i => {
    return i.id !== id;
  });

  fakeDB.data = filtredBDData;
  res.status(200).redirect('/');
});

module.exports = router;