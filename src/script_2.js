const makeConfetti = () => {
    const jsConfetti = new JSConfetti()
    jsConfetti.addConfetti({
        emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
     });
}


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

let word;
let tries_counter = document.getElementById('tries-count');
let tries = 0;
let guessed_letters = [];

const replayGame = () => {
    document.getElementById('letter-field').innerHTML = '';
    document.getElementById('letters-bank').innerHTML = '';
    selectWord();
    buildLetterScreen();
    guessed_letters = [];
}

const scoreManager = (current_tries, gussed_letters, correct_letters) => {
    var btns = document.getElementsByClassName('alphabet-btns');
    if(current_tries > 0){
        if (gussed_letters == correct_letters){
            for(var i = 0; i < btns.length; i++){
                document.getElementById(btns[i].id).disabled = true;
            }
            setTimeout(() => {alert('Congratulations, you won!')}, 2500)
            makeConfetti();
        }
    }
    if(current_tries == 0){
        for(var i = 0; i < btns.length; i++){
            document.getElementById(btns[i].id).disabled = true;
        }
        setTimeout(() => {alert('Oooopsss, you lost :(')}, 1500)
    }
}

const inputCheck = (input_letter) => {

    if (word.split('').includes(input_letter)){
        var fields = document.getElementsByClassName('field-' + input_letter);
        guessed_letters.push(input_letter);
        for(var i = 0; i < fields.length; i++){
            fields[i].innerHTML = input_letter;
            fields[i].classList.remove('extra-height');
        }
        document.getElementById('button-' + input_letter).style.borderColor = '#88f65c';
        document.getElementById('button-' + input_letter).disabled = true;
    }else{
        document.getElementById('button-' + input_letter).style.borderColor = '#eb6c54';
        document.getElementById('button-' + input_letter).disabled = true;
        tries--;
        console.log(tries);
        tries_counter.innerHTML = tries;
    }

    let word_arr_no_duplicates = [...new Set(word.split(''))].length
    scoreManager(tries, guessed_letters.length, word_arr_no_duplicates);
}

const buildLetterScreen = () => {
    var alphabet = [...Array(26)].map((_, i) => String.fromCharCode(i + 97));
    for (var i = 0; i < alphabet.length; i++){
        let button = document.createElement('button'); button.id = 'button-'.concat(alphabet[i]); button.classList.add('alphabet-btns');
        button.innerHTML = String(alphabet[i]).toUpperCase();
        button.addEventListener('click', function(){
            inputCheck(button.innerHTML.toLocaleLowerCase());
        })
        document.getElementById('letters-bank').appendChild(button);
    }
}

buildLetterScreen();

buildWordScreen = (word) => {
    var word_arr = word.split('');
    word_arr.forEach(i => {
        let letter_field = document.createElement('div'); letter_field.classList.add('letter-field'); letter_field.classList.add('field-'.concat(i));
        letter_field.classList.add('extra-height')
        document.getElementById('letter-field').appendChild(letter_field);
    })
}

const selectWord = () => {
    if (word_bank.length == 600){
        var final_bank = word_bank.filter((item, index) => word_bank.indexOf(item) === index);
        var generated_word = word_bank[Math.floor(Math.random() * final_bank.length)]
        word = generated_word;
        buildWordScreen(word);
        console.log(word)

        tries = generated_word.split('').length;
        tries_counter.innerHTML = tries;
    }

    var replay_btn = document.getElementById('replay-game');
    var play_btn = document.getElementById('start-game');

    if (replay_btn.classList.contains('hide')){
        play_btn.classList.toggle('hide');
        replay_btn.classList.toggle('hide');
        replay_btn.addEventListener('click', replayGame);
    }
}


