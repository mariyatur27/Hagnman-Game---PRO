/**
 * TO DO:
 * 1. Game status to summarize what games have been lost and won
 * 2. Readme file
 * 3. Have a database of articles (from the same website) to select from
 * 4. Do confetti
 * 5. Do popup instructions for version 2
 */


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


let word_input_obj;
let score = document.getElementById('tries-left');
let used_letters_arr=[];
let secret_word;
let current_score;
let guessed_letters = 0;

const scoreTracker = (score, guessed_letters, correct_letter_guessed) => {
    if (score > 0){
        if(guessed_letters == correct_letter_guessed){
            setTimeout(() => {alert('Congratulations, you won!')}, 1500)
        }
    }
    if (score == 0){
        var inputs = document.getElementsByClassName('letter-box');
        for(var i = 0; i < inputs.length; i++){
            document.getElementById(inputs[i].id).readOnly = true;
        }
        setTimeout(() => {alert('Oooopsss, you lost :(')}, 1500)
    }

}

const checkInput = (id, word_arr) => {
    var input = document.getElementById(id).value;
    var correct_letter = word_input_obj[id];
    var acceptables_values = [...Array(26)].map((_, i) => String.fromCharCode(i + 97));

    if (acceptables_values.includes(input)){
        //check if the letter is wrong
        if (input != correct_letter){
            document.getElementById(id).value = '';
            document.getElementById(id).style.background='#ff6b6b'
            
            if (!used_letters_arr.includes(input)){
                let input_ele = document.createElement('h4'); input_ele.innerHTML = input;
                if (word_arr.includes(input)){
                    document.getElementById('halfcorrect-letters').appendChild(input_ele);
                }else{
                    document.getElementById('incorrect-letters').appendChild(input_ele);
                }
                used_letters_arr.push(input);
                current_score --;
                score.innerHTML = current_score;
            }
        }
        //if the letter is right
        else{
            guessed_letters++;
            //counting the number of times this letter occurs in a word
            var occurences = word_arr.filter(x => x == input).length;
            //looping through the object
            if (occurences != 0){
                for(const key in word_input_obj){
                    if (word_input_obj[key] == input){
                        document.getElementById(key).value = input;
                        document.getElementById(key).style.background='#91ff91'
                        document.getElementById(key).readOnly = true;
                    }
                }
            }

            document.getElementById(id).readOnly = true;
            document.getElementById(id).style.background='#91ff91'
            if (!used_letters_arr.includes(input)){
                used_letters_arr.push(input);
            }
        }
    }else{
        document.getElementById(id).value = '';
        alert('You can only use letters!')
    }

    let word_arr_no_duplicates = [...new Set(word_arr)].length
    
    scoreTracker(current_score , guessed_letters , word_arr_no_duplicates);
    
}

const createDataset = (word_arr) => {
    var inputs = document.getElementsByClassName('letter-box');
    var inputs_list=[];
    for(var i = 0; i < inputs.length; i++){
        inputs_list.push(inputs[i].id)
    }

    word_input_obj = Object.assign(...inputs_list.map((k, i) => ({ [k]: word_arr[i] })))
}

const buildScreen = (word) => {
    secret_word = word
    let container = document.createElement('div'); container.classList.add('word-container');
        for(var i = 0; i < word.length; i++){
            let letter_box = document.createElement('input'); letter_box.type='text'; 
            letter_box.classList.add('letter-box'); letter_box.setAttribute('maxlength', '1'); letter_box.id='letter'.concat(i);

            letter_box.addEventListener('input', function() {
                checkInput(letter_box.id, word.split(''))
            })

            container.appendChild(letter_box);
        }
    document.getElementById('game-screen').appendChild(container);
    document.getElementById('letter-screen').style.display='block';
    document.getElementById('letter-screen-2').style.display='block';
    document.getElementById('score-screen').style.display='block';
    current_score = secret_word.length + 2;
    score.innerHTML = current_score;

    createDataset(word.split(''));
    console.log(word)
}

const restartGame = () => {
    document.getElementById('game-screen').innerHTML = '';
    document.getElementById('incorrect-letters').innerHTML = '';
    document.getElementById('halfcorrect-letters').innerHTML = '';
    document.getElementById('tries-left').innerHTML = '';
    used_letters_arr=[];
    guessed_letters = 0;
    chooseWord();
}

const chooseWord = () => {
    if (word_bank.length == 600){
        var final_bank = word_bank.filter((item,
            index) => word_bank.indexOf(item) === index);
        var generated_word = final_bank[Math.floor(Math.random() * final_bank.length)]
        buildScreen(generated_word)
    }

    var play_btn = document.getElementById('start-game');
    var replay_btn = document.getElementById('replay-game');

    if(replay_btn.classList.contains('hide')) {
        play_btn.classList.toggle('hide');
        replay_btn.classList.toggle('hide');
        replay_btn.addEventListener('click', restartGame)
    }
}

