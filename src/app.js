const outputWordDatabase = () => {
    const alphabet = [...Array(26)].map((_, i) => String.fromCharCode(i + 97));
    const word_bank = [];

    const format = (word, letter_arr) => {
        var clean_arr = [];
        letter_arr.forEach(letter => {
            if (alphabet.includes(letter.toLowerCase())){
                clean_arr.push(letter.toLowerCase());
            }
        })

        if(clean_arr.length == word.length) {
            var formatted_word = clean_arr.join('')
            if(formatted_word.length >= 3){
                word_bank.push(formatted_word)    
            }
        }

    }

    const wordsToLetters = (word_arr) => {
        word_arr.forEach(word => {
            const word_letters = word.split('')
            format(word, word_letters);
        })
        
    }

    fetch('http://localhost:8000/')
    .then(response => response.json())
    .then(data => {
        data.forEach(article => {
            const word_arr = String(article.paragraph).split(' ')
            wordsToLetters(word_arr);
        })
    })

    return word_bank;
}

// export const data = outputWordDatabase();

