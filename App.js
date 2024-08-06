 import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import bodyParser from "body-parser";
import cors from 'cors';
const app = express();
dotenv.config();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    console.log('Received a request!');
    res.render('index');
});

app.post('/prompt', async (req, res) => {
    console.log("yes");

    const user_input = req.body["a-input"];
    const age_input = req.body["b-input"];
    const event_input = req.body["c-input"];
    const length_input = req.body["d-input"];
    const prompt = `
    I would like you to create a greeting for me according to the following definitions: The kind of blessing ${user_input}, The age of the blessed: ${age_input} the event for which the blessing: ${event_input} The length of the greeting: ${length_input} ,Do not write the length of the greeting in the response!
A short greeting - 5 words
Medium greeting - 15 words
A long greeting - at least 40 words, Do not return the words in the response: AI "creating", "creating in ai", "generating", "ai", "designing", "video".Please return a plain text response in Hebrew. You can add an emoji or a symbol, respectively.
    `;
    const options = {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'user', content: prompt }
        ],
        max_tokens: 190,
    };
    
    try {
        const response = await openai.chat.completions.create(options);
        console.log("API response:", response);
        const greeting = response.choices[0].message.content; // שמור את התוכן נכון 

        
        res.set('Content-Type', 'text/plain'); // או 'text/html' אם אתה מעדיף
        res.send(greeting); 
        } 
        catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send('An error occurred while processing your request');    }
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}...`);
});
