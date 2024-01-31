const express = require("express");
const app = express();
const path = require("path")
const wordsWeights = require("./words_weights.json")

app.use(express.json());
app.use(express.static('public'))

function calculate_for_string(str) {
    const words = str.split(" ")
        .map(e=>e.replace(/[^\w\s]/gi, '').toLocaleLowerCase())
        .filter( e => e.match(/^[a-z]+$/));
    
    let sum = 0;
    for ( const word of words ) {
        if ( !(word in wordsWeights) ) sum -= ((words.length)**2) / 5;
        else sum += wordsWeights[word];
    }
    return sum / (words.length * 0.25);
}

app.post("/was-it/", (req, res) => {
    const text = req.body?.text;
    if ( !text ) {
        res.status(401).send({"error":"Bad request; no text content"});
        res.end();
        return;
    }

    if ( !(typeof text == "string") ) {
        res.status(401).send({"error":"Bad request; not string"});
        res.end();
        return;
    }

    if ( text.length > 500 ) {
        res.status(401).send({"error":"Text too long!"});
        res.end();
        return;
    }

    const result = calculate_for_string(text);

    res.status(200).send({ result })
    res.end();
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})

app.listen(80, ()=>{
    console.log("on port 80")
})