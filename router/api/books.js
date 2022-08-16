const express = require('express');
const router = express.Router();
const {Book} = require('../../models');
const {fileMiddleware} = require('../../middleware');

const fakeDB = {
  data: []
};

 fakeDB.data = [1,2,3].map(i => {
 return new Book(`title ${i}`, `description ${i}`,`authors ${i}`, `favorite ${i}`, '', `fileName ${i}`)
});

router.get('/', (req, res) => {
  const {data} = fakeDB;
  res.json(data);
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
  res.status(201).redirect(`/api/books/view/${newBook.id}`);
});

router.get('/:id', (req, res) => {
  const {id} = req.params;
  const {data} = fakeDB;

  const item = data.find(i => {
    return i.id === id;
  })

  if(item === undefined) {
    res.status(404).send('404 | not found');
  }
  
  res.json(item);
});

router.put('/:id', fileMiddleware.single('fileBook'), (req, res) => {
  const {id} = req.params;
  const {data} = fakeDB;

  const item = data.find(i => {
    return i.id === id;
  })

  if(item === undefined) {
    res.status(404).send('404 | not found');
  }

  const filtredBDData = data.filter(i => {
    return i.id !== id;
  });

  let fileBook = '';
  if (req.file) {
    fileBook = req.file.filename;
  }

  const {title, description, authors, favorite, fileCover, fileName} = req.body;
  const updateBook = new Book(title, description, authors, favorite, fileCover, fileName, fileBook, id);
  filtredBDData.push(updateBook);
  fakeDB.data = filtredBDData;
  res.json(updateBook);
});

router.delete('/:id', (req, res) => {
  const {id} = req.params;
  const {data} = fakeDB;

  const item = data.find(i => {
    return i.id === id;
  })

  if(item === undefined) {
    res.status(404).send('404 | not found');
  }

  const filtredBDData = data.filter(i => {
    return i.id !== id;
  });

  fakeDB.data = filtredBDData;
  res.json('ok');
});



router.get('/:id/download', (req, res) => {
  const {id} = req.params;
  const {data} = fakeDB;

  const item = data.find(i => {
    return i.id === id;
  })

  if(item === undefined || !item.fileBook) {
    res.status(404).send('404 | not found');
  }

    res.download(`public/books/${item.fileBook}`);
});

module.exports = router;