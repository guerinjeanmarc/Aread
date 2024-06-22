const letters = 'abcdefghijklmnopqrstuvwxyz';
let currentLetter;
let correctAnswers = 0;
let remainingSquares = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const images = ['im1.png', 'im2.png', 'im3.png', 'im4.png', 'im5.png', 'im6.png', 'im7.png'];
let hasFailed = false;
let learnedLetters = new Set();

function getRandomLetter() {
    return letters[Math.floor(Math.random() * letters.length)];
}

function generateOptions(correct) {
    let options = [correct.toUpperCase()];
    while (options.length < 3) {
        let option = getRandomLetter().toUpperCase();
        if (!options.includes(option)) {
            options.push(option);
        }
    }
    return options.sort(() => Math.random() - 0.5);
}

function newRound() {
    currentLetter = getRandomLetter();
    document.getElementById('lowercase-letter').textContent = currentLetter;
    hasFailed = false;

    const options = generateOptions(currentLetter);
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => checkAnswer(option);
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedOption) {
    const button = event.target;
    if (selectedOption === currentLetter.toUpperCase()) {
        document.body.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
        correctAnswers++;
        updateImage();
        if (hasFailed) {
            addLearnedLetter();
        }
        setTimeout(() => {
            if (correctAnswers < 9) {
                document.body.style.backgroundColor = '#f0f0f0';
            }
            newRound();
        }, 1000);
    } else {
        document.body.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        button.disabled = true;
        hasFailed = true;
        setTimeout(() => {
            document.body.style.backgroundColor = '#f0f0f0';
        }, 1000);
    }
}

function updateImage() {
    const gameImage = document.getElementById('game-image');
    const coverSquares = document.querySelectorAll('.cover-square');
    const restartButton = document.getElementById('restart-button');
    
    if (remainingSquares.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingSquares.length);
        const squareToRemove = remainingSquares.splice(randomIndex, 1)[0];
        coverSquares[squareToRemove].style.opacity = '0';
    }
    
    if (correctAnswers === 9) {
        gameImage.style.filter = 'grayscale(0%)';
        restartButton.style.display = 'block';
    }
}

function addLearnedLetter() {
    if (!learnedLetters.has(currentLetter)) {
        learnedLetters.add(currentLetter);
        const learnedLettersDiv = document.getElementById('learned-letters');
        const letterPair = document.createElement('div');
        letterPair.textContent = `${currentLetter.toLowerCase()} = ${currentLetter.toUpperCase()}`;
        learnedLettersDiv.appendChild(letterPair);
    }
}

function initializeCoverGrid() {
    const coverGrid = document.getElementById('cover-grid');
    for (let i = 0; i < 9; i++) {
        const square = document.createElement('div');
        square.className = 'cover-square';
        coverGrid.appendChild(square);
    }
}

function selectRandomImage() {
    const randomIndex = Math.floor(Math.random() * images.length);
    const gameImage = document.getElementById('game-image');
    gameImage.src = 'images/' + images[randomIndex];
}

function restartGame() {
    correctAnswers = 0;
    remainingSquares = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    learnedLetters.clear();
    hasFailed = false;
    
    const gameImage = document.getElementById('game-image');
    gameImage.style.filter = 'grayscale(100%)';
    
    const coverSquares = document.querySelectorAll('.cover-square');
    coverSquares.forEach(square => square.style.opacity = '1');
    
    const learnedLettersDiv = document.getElementById('learned-letters');
    learnedLettersDiv.innerHTML = '';
    
    document.getElementById('restart-button').style.display = 'none';
    
    selectRandomImage();
    newRound();
}

initializeCoverGrid();
selectRandomImage();
newRound();

document.getElementById('restart-button').addEventListener('click', restartGame);