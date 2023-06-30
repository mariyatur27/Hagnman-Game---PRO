

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


let word_input_obj;
let score = document.getElementById('tries-left');
let used_letters_arr=[];
let secret_word;
let current_score;
let guessed_letters = 0;
let score_list = [];
let word_list = [];

document.getElementById('game-tracker-btn').addEventListener('click', function() {
    document.getElementById('game-tracker-cont').classList.toggle('hide');
})


const gameTracker = () => {

    document.getElementById('tracking-cont').innerHTML = '';

    if (score_list.length != 0){
        for(var i = 0; i < score_list.length; i++){
            let row = document.createElement('div'); row.classList.add('cont-row');
                let cont1 = document.createElement('h4'); cont1.innerHTML = "Game ".concat(i + 1);
                row.appendChild(cont1);
                let cont2 = document.createElement('h4'); cont2.innerHTML = score_list[i];
                row.appendChild(cont2);
                let cont3 = document.createElement('h4'); cont3.innerHTML = "Word: ".concat(word_list[i]);
                row.appendChild(cont3);
            document.getElementById('tracking-cont').appendChild(row);
        }
    }
}

const scoreTracker = (score, guessed_letters, correct_letter_guessed, word) => {
    if (score > 0){
        if(guessed_letters == correct_letter_guessed){
            setTimeout(() => {alert('Congratulations, you won!')}, 2500)
            score_list.push('won');
            word_list.push(word.join(''));
            gameTracker();
            makeConfetti();
        }
    }
    if (score == 0){
        var inputs = document.getElementsByClassName('letter-box');
        for(var i = 0; i < inputs.length; i++){
            document.getElementById(inputs[i].id).readOnly = true;
        }
        setTimeout(() => {alert('Oooopsss, you lost :(')}, 1500)
        score_list.push('lost');
        word_list.push(word.join(''));
        gameTracker();
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
    
    scoreTracker(current_score , guessed_letters , word_arr_no_duplicates, word_arr);
    
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

