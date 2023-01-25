const express = require('express'); // import express
const app = express(); // create an express app
require('dotenv').config();
apiKey="poopypoobuttpoopybuttpoo"
app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/api-key', function(req, res) {
    res.json({apiKey: apiKey});
});

app.listen(3000, function() {
    console.log('Server running on port 3000');
});

app.get('/client.js', function (req, res) {
    res.set('Content-Type', 'application/javascript');
    res.sendFile(__dirname + '/client.js');
});

//this is a live production key, totally fine to have here
const stripe = require('stripe')('pk_live_51MTEejFUIsXbM2H8hh6BwnehDT0pLlgc9bFMSwXFzxkjjtfjMl7mcLXRGKcI8h4xPxGV8FaXXJIauE1Sqgmc6JaH006i0crTpA');

app.post('/process-payment', async (req, res) => {
  try {
    // extract the payment token from the request body
    const paymentToken = req.body.paymentToken;
    // extract the total amount of the payment from the request body
    const amount = req.body.amount;

    // create a charge using the payment token and the total amount
    const charge = await stripe.charges.create({
      amount: amount,
      currency: 'usd',
      description: 'AI Image',
      source: paymentToken,
    });

    // return the charge details to the client
    res.json(charge);
  } catch (err) {
    // handle any errors that occurred during the charge creation
    res.status(500).json({ error: err.message });
  }
});








/*
app.use(bodyParser.json()); // use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true })); // use body-parser middleware

app.post('/submit-to-dalle', (req, res) => {
    // Get the form data from the request
    const prompt = req.body.prompt;
    const numImages = req.body.num_images;

    // Set up the options for the API request
    const options = {
        url: 'https://api.openai.com/v1/images/generations',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
        },
        json: {
            'prompt': prompt,
            'num_images': numImages
        }
    };

    // Make the request to the DALL·E API
    request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            // Send the generated images back to the client
            res.send(body.data.urls);
        } else {
            // Send an error message back to the client
            res.send({ error: 'An error occurred while processing your request' });
        }
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
*/