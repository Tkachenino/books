const express = require('express');
const {loggerMiddleware, notFoundMiddleware} = require('./middleware/index');
const userRouter = require('./router/user');
const booksRouter = require('./router/books');
const booksApiRouter = require('./router/api/books');
const cors = require('cors');

const app = express();
app.use(cors());
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));
app.use(loggerMiddleware);
app.use('/', booksRouter);
app.use('/api/user', userRouter);
app.use('/api/books', booksApiRouter);
app.use(notFoundMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`=== start server PORT ${PORT} ===`);
});