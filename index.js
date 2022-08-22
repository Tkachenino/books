const express = require('express');
const {loggerMiddleware, notFoundMiddleware} = require('./middleware/index');
const userRouter = require('./router/user');
const booksRouter = require('./router/books');
const booksApiRouter = require('./router/api/books');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.set('view engine', 'hbs');

const MONGO_URL = `mongodb+srv://boris:${process.env.MONGO_PASSWORD || 'bZZWPZt9A2zjcNfj'}@cluster0.sl7ydfg.mongodb.net/?retryWrites=true&w=majority`;

app.use(express.static(__dirname + '/public'));
app.use(loggerMiddleware);
app.use('/', booksRouter);
app.use('/api/user', userRouter);
app.use('/api/books', booksApiRouter);
app.use(notFoundMiddleware);

const PORT = process.env.PORT || 3000;
(async () => {
    try {
    await mongoose.connect(MONGO_URL);
    app.listen(PORT, () => {
        console.log(`=== start server PORT ${PORT} ===`);
    });
    } catch (error) {
        console.log(error);
    }
})();

