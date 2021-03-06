const randomWords = require('random-words');

// Helper functions

// Generate a random hex string
// to simulate MongoDB _id's (w/ length = 24)
// Code by Code Monk: https://codepen.io/code_monk/pen/FvpfI
function randHex (len) {
  let maxlen = 8,
      min = Math.pow(16, Math.min(len, maxlen) - 1)
      max = Math.pow(16, Math.min(len, maxlen)) - 1,
      n   = Math.floor( Math.random() * (max - min + 1) ) + min,
      r   = n.toString(16);
  while ( r.length < len ) {
     r = r + randHex( len - maxlen );
  }
  return r;
};

// Generate a random integer lesser than a given number
function randInt(lessThan) {
    return Math.floor(Math.random() * lessThan);
}

// Generate some random words
function generateSomeWords (wordCount) {
  let words = randomWords({
    exactly: 1,
    wordsPerString: wordCount,
    formatter: (word, index) => {
      return index === 0 ? word.slice(0,1).toUpperCase().concat(word.slice(1)) : word;
    }});
  return words[0];
}

const helper = {
  randHex: randHex,
  randInt: randInt,
  generateSomeWords: generateSomeWords
};

module.exports = helper;
