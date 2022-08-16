const fetch = require('node-fetch');
const host = process.env.DEV ? process.env.COUNTER_HOST_DOCKER : process.env.COUNTER_HOST_HEROKU;

const getCounter = async (id) => {
 const res = await fetch(`${host}/counter/${id}`);
const count = await res.json();
 console.log(count)
 return {id, count};
};

const incCounter = async (id) => {
  try {
    const res = await fetch(`${host}/counter/${id}/incr`, {
    method: 'POST'
  });
  const count = await res.json();
  return {id, count};

  } catch(e) {
    console.log(e)
  }
  return {id, count: {id, counter: undefined}};
  

};

module.exports = {
  getCounter,
  incCounter
}

