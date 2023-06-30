# Hangman-Game---PRO

I created two versions of the famous hangman game. In the first version, the user manually types in letters in the input fields that are generated
as the secret word is selected. When the correct letter is guessed, the input field turns green and becomes disabled. If the letter is incorrect, or correct but 
in the wrong spot, it gets displayed in one of the two rows below. When all the tries are used, all the input fields become disabled. After each game is completed,
it gets added to the game tracker which displays the status of the game and the word which was being guessed.
In the second version of the game, which is similar to the traditional game, the user clicks the buttons on the screen to guess the correct letters. Any used
button becomes instantly disabled, and it turns green or red depending on if the guess was correct or incorrect. If the guess was correct, the letter appear on
the screen in the input field.

To come up with a big and fun database of words, I built a server to scrape a long news article website. All the paragraphs in the article get converted to an
array of strings, which get filtered and added to a word database. This creates a fun dataset of about 350 words. And the best part is that this article website 
can be replaced by any other article from the same website.
