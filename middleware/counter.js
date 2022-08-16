const fetch = require('node-fetch');

const getCounter = async (id) => {
 const res = await fetch(`http://counter:3000/counter/${id}`);
const count = await res.json();
 console.log(count)
 return {id, count};
};

const incCounter = async (id) => {
  try {
    const res = await fetch(`http://counter:3000/counter/${id}/incr`, {
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

