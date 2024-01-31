const fs = require("fs");

const data = fs.readFileSync("./bible.txt")
    .toString()
    .split(" ")
    .map(e=>e.replace(/[^\w\s]/gi, '').toLocaleLowerCase())
    .filter( e => e.match(/^[a-z]+$/));
const frequency = {};

let prevWord=null;
for ( const token of data ) {
    if ( token in frequency ) frequency[token]["freq"]++;
    else frequency[token] = { freq: 1, nextWorldFreq: {} }; 

    if ( prevWord != null ) {
        if ( token in frequency[prevWord]["nextWorldFreq"] )
            frequency[prevWord]["nextWorldFreq"][token]++;
        else
        frequency[prevWord]["nextWorldFreq"][token] = 1;
    }

    prevWord = token;
}

const twoWordSentences = [];

for ( const word in frequency ) {
    for ( const successor in frequency[word]["nextWorldFreq"] ) {
        twoWordSentences.push([`${word} ${successor}`, frequency[word]["nextWorldFreq"][successor]])
    }
}

const wordsWeights = {}

for ( const token in frequency ) {
    let weight = 1;
    weight += ((token.length)**2)/15;
    weight += Math.log(frequency[token]["freq"])
    weight += Math.log10(Object.keys(frequency[token]["nextWorldFreq"]).length)

    wordsWeights[token] = Math.ceil(weight) / 17 ; //normalized
}

twoWordSentences.sort((a,b) => b[1] - a[1])

// console.log(twoWordSentences)

fs.writeFileSync("./word_frequency.json", JSON.stringify(frequency, 0, 4, true))
fs.writeFileSync("./words_weights.json", JSON.stringify(wordsWeights, 0, 4, true))