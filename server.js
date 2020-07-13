const express = require('express');
const {MongoClient} = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;
const dbUrl = 'mongodb://localhost:27017/';
const dbName = 'test_db';

app.use(express.static('client/build')); 
app.use(bodyParser.json()); 
app.listen(port, () => console.log(`Listening at http://127.0.0.1:${port}`));

app.post('/api/ingredients', async (req, res) => {
    console.log('got post', req.body)
    res.setHeader('Content-Type', 'application/json');
    const ingredients = await getIngredients(req.body.name)
    return res.send(JSON.stringify(ingredients));
});

const getIngredients = async name => {
    const collectionName = 'ingredients';
    const client = new MongoClient(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const queryObject = name ? {name: new RegExp('^' + name, 'i')} : {};
    const searchResults = await client.db(dbName)
    .collection(collectionName)
    .find(queryObject) //If there is name query, search for records with name starting with this query
    .toArray();

    await client.close();

    const payload = searchResults.map(document => {
        const {_id, ...entriesToSend} = document; //filter _id key from respone
        return entriesToSend;
    });
    console.log(payload, 'payload')
    return payload;
};