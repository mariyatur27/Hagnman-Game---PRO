const word_bank = [
    "country",
    "world",
    "school",
    "job",
    "computer"
]

let word_input_obj;
let score = document.getElementById('tries-left');

const tries_left = () => {

}

const checkInput = (id) => {
    var input = document.getElementById(id).value;
    var correct_letter = word_input_obj[id];
    var used_letters_arr=[];
    var score = Object.keys(word_input_obj).length;

    if (input != correct_letter){
        if (!used_letters_arr.includes(input)){
            document.getElementById(id).value = '';
            let input_ele = document.createElement('h4'); input_ele.innerHTML = input;
            document.getElementById('incorrect-letters').appendChild(input_ele);
            used_letters_arr.push(input);
        }
    }

    console.log(used_letters_arr)
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
    let container = document.createElement('div'); container.classList.add('word-container');
        for(var i = 0; i < word.length; i++){
            let letter_box = document.createElement('input'); letter_box.type='text'; 
            letter_box.classList.add('letter-box'); letter_box.setAttribute('maxlength', '1'); letter_box.id='letter'.concat(i);

            letter_box.addEventListener('input', function() {
                checkInput(letter_box.id)
            })

            container.appendChild(letter_box);
        }
    document.getElementById('game-screen').appendChild(container);
    document.getElementById('letter-screen').style.display='block';
    document.getElementById('score-screen').style.display='block';
    score.innerHTML = word.length;

    createDataset(word.split(''));
    console.log(word)
}

const chooseWord = () => {
    var generated_word = word_bank[Math.floor(Math.random() * word_bank.length)]
    buildScreen(generated_word)
}

document.getElementById('start-game').addEventListener('click', chooseWord)