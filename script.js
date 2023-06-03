const word_bank = [
    "alabama",
    "america",
    "school",
    "job",
    "racoon"
]

let word_input_obj;
let score = document.getElementById('tries-left');
let used_letters_arr=[];

const tries_left = () => {

}

const checkInput = (id, word_arr) => {
    var input = document.getElementById(id).value;
    var correct_letter = word_input_obj[id];
    var score = Object.keys(word_input_obj).length;

    //check if the letter is wrong
    if (input != correct_letter){
        document.getElementById(id).value = '';
        document.getElementById(id).style.background='#ff6b6b'
        if (!used_letters_arr.includes(input)){
            let input_ele = document.createElement('h4'); input_ele.innerHTML = input;
            document.getElementById('incorrect-letters').appendChild(input_ele);
            used_letters_arr.push(input);
        }
    }
    //if the letter is right
    else{
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
                checkInput(letter_box.id, word.split(''))
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