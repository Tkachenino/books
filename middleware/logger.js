const fs = require('fs/promises');
const path =require('path');

const loggerMiddleware = async (req, res, next) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const {url, method} = req;
  const userAgent = req.get('user-agent');

  let data = `${day}-${month}-${year} ${hour}:${minutes}:${seconds} ${method}: ${url} user-agent: ${userAgent}\n`;

  const loggerPath = path.join(__dirname, '../', 'log.txt');
  await fs.appendFile(loggerPath, data, 'utf-8');
  next();
 }

 module.exports = loggerMiddleware;