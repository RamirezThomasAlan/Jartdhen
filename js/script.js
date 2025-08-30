// Listas de palabras por longitud
const wordsByLength = {
    3: ["sol", "mar", "pan", "luz", "oso", "pez", "rio", "ala", "ola", "paz",
        "rey", "sal", "pie", "mes", "flor", "gato", "pez", "vaca", "oso", "ala"],
    4: ["casa", "pato", "luna", "rosa", "tren", "nube", "hoja", "agua", "fuego", "tierra",
        "aire", "boca", "nariz", "mano", "pie", "pelo", "dedo", "libro", "silla", "mesa"],
    5: ["perro", "gato", "arbol", "playa", "monte", "isla", "cielo", "nube", "hoja", "flor",
        "fruta", "verde", "azul", "blanco", "negro", "amarillo", "rojo", "rosa", "lila", "naranja"],
    6: ["elefante", "jirafa", "castillo", "caballo", "dragon", "bicicleta", "automovil", "computadora", 
        "ventana", "espejo", "cuchara", "tenedor", "caminata", "montaña", "paraguas", "relampago"],
    7: ["aventura", "misterio", "secretos", "tesoro", "pirata", "explorar", "planeta", "universo", 
        "galaxia", "estrella", "satelite", "cohete", "astronauta", "viajero", "camino", "sendero"],
    8: ["extraterrestre", "arqueologo", "biblioteca", "laboratorio", "magnifico", "nebulosa", "orquesta", 
        "veterinario", "xilofono", "zoologico", "arquitectura", "biodegradable", "criptografia"],
    9: ["electrodomestico", "fantasmagorico", "hipopotamo", "idiosincrasia", "kaleidoscopico", 
        "paralelepipedo", "quebradizo", "reconocimiento", "superficialmente", "transexualidad"],
    10: ["desoxirribonucleico", "caleidoscopio", "arqueologico", "extraterrestre", "fantasmagorico", 
         "hipopotamo", "idiosincrasia", "kaleidoscopico", "laboratorio", "magnifico"]
};

// Variables del juego
let selectedWord = "";
let guessedLetters = [];
let wrongAttempts = 0;
let maxAttempts = 6;
let correctWords = 0;
let totalWordsToWin = 20;
let gameActive = false;
let hintsAvailable = 0;
let currentWordLength = 3; // Empezamos con palabras de 3 letras

// Elementos del DOM
const wordDisplayElement = document.getElementById("word-display");
const messageElement = document.getElementById("message");
const attemptsElement = document.getElementById("attempts-left");
const correctWordsElement = document.getElementById("correct-words");
const playButton = document.getElementById("play-btn");
const hintButton = document.getElementById("hint-btn");
const keyboardElement = document.getElementById("keyboard");
const levelIndicator = document.getElementById("level-indicator");
const progressElement = document.getElementById("progress");
const hintCounterElement = document.getElementById("hint-counter");
const introModal = document.getElementById("intro-modal");
const startButton = document.getElementById("start-btn");

// Partes del ahorcado
const head = document.querySelector('.head');
const body = document.querySelector('.body');
const leftArm = document.querySelector('.left-arm');
const rightArm = document.querySelector('.right-arm');
const leftLeg = document.querySelector('.left-leg');
const rightLeg = document.querySelector('.right-leg');

// Mostrar modal de introducción al cargar la página
window.onload = function() {
    introModal.style.display = 'flex';
};

// Iniciar el juego desde el modal
startButton.addEventListener('click', function() {
    introModal.style.display = 'none';
    initGame();
});

// Actualizar la longitud de palabras según los aciertos
function updateWordLength() {
    if (correctWords < 3) {
        currentWordLength = 3;
        levelIndicator.textContent = "Nivel: Palabras de 3 letras";
    } else if (correctWords < 6) {
        currentWordLength = 4;
        levelIndicator.textContent = "Nivel: Palabras de 4 letras";
    } else if (correctWords < 9) {
        currentWordLength = 5;
        levelIndicator.textContent = "Nivel: Palabras de 5 letras";
    } else if (correctWords < 12) {
        currentWordLength = 6;
        levelIndicator.textContent = "Nivel: Palabras de 6 letras";
    } else if (correctWords < 15) {
        currentWordLength = 7;
        levelIndicator.textContent = "Nivel: Palabras de 7 letras";
    } else if (correctWords < 18) {
        currentWordLength = 8;
        levelIndicator.textContent = "Nivel: Palabras de 8 letras";
    } else {
        currentWordLength = 9;
        levelIndicator.textContent = "Nivel: Palabras de 9+ letras";
    }
}

// Inicializar el juego
function initGame() {
    // Actualizar la longitud de palabras según los aciertos
    updateWordLength();
    
    // Seleccionar una palabra al azar de la longitud actual
    const availableWords = wordsByLength[currentWordLength];
    selectedWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    guessedLetters = [];
    wrongAttempts = 0;
    gameActive = true;
    
    // Actualizar la interfaz
    updateWordDisplay();
    updateHangman();
    attemptsElement.textContent = maxAttempts - wrongAttempts;
    messageElement.textContent = "";
    
    // Crear teclado
    createKeyboard();
    
    // Actualizar progreso
    updateProgress();
    
    // Actualizar contador de pistas
    updateHintCounter();
    
    // Activar/desactivar botón de pista
    hintButton.disabled = hintsAvailable === 0;
}

// Mostrar la palabra con las letras adivinadas
function updateWordDisplay() {
    wordDisplayElement.innerHTML = selectedWord
        .split('')
        .map(letter => guessedLetters.includes(letter) ? letter : "_")
        .join(' ');
}

// Crear teclado
function createKeyboard() {
    keyboardElement.innerHTML = '';
    const letters = 'abcdefghijklmnñopqrstuvwxyz';
    
    letters.split('').forEach(letter => {
        const button = document.createElement('button');
        button.classList.add('letter-btn');
        button.textContent = letter;
        button.addEventListener('click', () => handleGuess(letter));
        keyboardElement.appendChild(button);
    });
}

// Manejar la adivinanza de una letra
function handleGuess(letter) {
    if (!gameActive) return;
    
    const button = Array.from(keyboardElement.children).find(btn => btn.textContent === letter);
    if (!button || button.disabled) return;
    
    button.disabled = true;
    
    if (selectedWord.includes(letter)) {
        // Letra correcta
        button.classList.add('correct');
        guessedLetters.push(letter);
        updateWordDisplay();
        
        // Verificar si ganó la palabra
        if (!wordDisplayElement.textContent.includes('_')) {
            correctWords++;
            correctWordsElement.textContent = correctWords;
            gameActive = false;
            messageElement.textContent = "¡Correcto! ¡Palabra adivinada!";
            messageElement.style.color = "#00aa00";
            
            // Verificar si ganó una pista (cada 5 palabras)
            if (correctWords % 5 === 0) {
                hintsAvailable++;
                updateHintCounter();
                messageElement.textContent += " ¡Ganaste una pista!";
            }
            
            // Actualizar barra de progreso
            updateProgress();
            
            // Verificar si ganó el juego
            if (correctWords >= totalWordsToWin) {
                messageElement.textContent = "¡Felicidades! ¡Has ganado el juego!";
                showConfetti();
            }
        }
    } else {
        // Letra incorrecta
        button.classList.add('incorrect');
        wrongAttempts++;
        attemptsElement.textContent = maxAttempts - wrongAttempts;
        updateHangman();
        
        // Verificar si perdió
        if (wrongAttempts >= maxAttempts) {
            gameActive = false;
            messageElement.textContent = `¡Perdiste! La palabra era: ${selectedWord}`;
            messageElement.style.color = "#ff3333";
        }
    }
}

// Actualizar el dibujo del ahorcado
function updateHangman() {
    // Ocultar todas las partes primero
    head.style.display = 'none';
    body.style.display = 'none';
    leftArm.style.display = 'none';
    rightArm.style.display = 'none';
    leftLeg.style.display = 'none';
    rightLeg.style.display = 'none';
    
    // Mostrar partes según los intentos fallidos
    if (wrongAttempts >= 1) head.style.display = 'block';
    if (wrongAttempts >= 2) body.style.display = 'block';
    if (wrongAttempts >= 3) leftArm.style.display = 'block';
    if (wrongAttempts >= 4) rightArm.style.display = 'block';
    if (wrongAttempts >= 5) leftLeg.style.display = 'block';
    if (wrongAttempts >= 6) rightLeg.style.display = 'block';
}

// Proporcionar una pista
function provideHint() {
    if (!gameActive || wrongAttempts >= maxAttempts - 1 || hintsAvailable <= 0) return;
    
    // Encontrar una letra no adivinada
    const availableLetters = selectedWord.split('').filter(letter => !guessedLetters.includes(letter));
    if (availableLetters.length > 0) {
        const hintLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
        
        // Usar la pista
        hintsAvailable--;
        updateHintCounter();
        
        // Desactivar botón si no hay más pistas
        if (hintsAvailable === 0) {
            hintButton.disabled = true;
        }
        
        // Encontrar y hacer clic en el botón de la letra
        const button = Array.from(keyboardElement.children).find(btn => btn.textContent === hintLetter);
        if (button && !button.disabled) {
            button.click();
        }
        
        messageElement.textContent = `Pista utilizada: ${hintLetter.toUpperCase()}`;
        messageElement.style.color = "#00aa00";
    }
}

// Actualizar barra de progreso
function updateProgress() {
    const progressPercentage = (correctWords / totalWordsToWin) * 100;
    progressElement.style.width = `${progressPercentage}%`;
}

// Actualizar contador de pistas
function updateHintCounter() {
    hintCounterElement.textContent = `Pistas disponibles: ${hintsAvailable}`;
}

// Mostrar confeti al ganar (efecto simple)
function showConfetti() {
    const hangmanContainer = document.querySelector('.hangman-container');
    hangmanContainer.innerHTML = '';
    hangmanContainer.innerHTML = '<div style="font-size:80px; margin-top:30px;">🎉🎊🥳</div>';
}

// Event listeners
playButton.addEventListener('click', initGame);
hintButton.addEventListener('click', provideHint);

// Permitir entrada desde teclado físico
document.addEventListener('keydown', function(event) {
    if (gameActive && event.key.match(/[a-zñ]/i)) {
        const letter = event.key.toLowerCase();
        handleGuess(letter);
    }
});