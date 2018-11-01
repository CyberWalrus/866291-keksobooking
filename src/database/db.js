'use strict';
console.log(`test`);
const {MongoClient} = require(`mongodb`);

const url = `mongodb://localhost:27017`;


module.exports = MongoClient.connect(url, {useNewUrlParser: true}).then((client) => client.db(`code-and-magick`)).catch((e) => {
  console.error(`Failed to connect to MongoDB`, e);
  process.exit(1);
});
