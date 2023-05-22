// form
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// for connectiong API
const {Configuration, OpenAIApi} = require('openai');
require('dotenv').config();

// body-parser
app.use(bodyParser.urlencoded({ extended: true }));
// static built-in middleware
app.use(express.static('public'));


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let history = [];

// POST
app.post('/huga', async (req, res) => {
    console.log(req.body);
    let conditions = "";

    for (var key in req.body) {
        let tmp = conditions;
        conditions = tmp + key + ":" + req.body[key] + ", ";           
    }

    const response = openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Make a travel plan suits below conditons. Answer should be a paragraphs of iteneraries for suggested days and json style array with keys(place, cost, transportation, currrency) at the end. Conditons are"+ conditions,
        max_tokens: 4000,
        temperature: 1,
    });

    response.then(function(result) {
        let resultText = result.data.choices[0].text;
        console.log(resultText);
        res.send(resultText);
    });
    
});


// Start Listenings
app.listen(3000, () => console.log('Listening on http://localhost:3000/...'))