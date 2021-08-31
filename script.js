const gameContainer = document.getElementById("game");
const startBtn = document.querySelector('#startBtn');
const restartBtn = document.querySelector('#restartBtn');
const scoreSpan = document.querySelector('#score');
const highscoreSpan = document.querySelector('#highscore');
const cardNumber = document.querySelector('input[name="cardNumber"]');
let COLORS;
let shuffledColors;

// controls flipped cards and game score
let flippedCards = [];
let score = 0;

//check if high score is in localStorage
let highscore = localStorage.getItem('highscore') ? localStorage.getItem('highscore') : 0
if (highscore > 0) highscoreSpan.innerHTML = highscore 

function generateColors(number) {
  const auxArray = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F']
  let colorsArray = []
  for (let i=0; i<number; i++) {
    let color = ''
    for (j=1;j<=6;j++) {
      color += auxArray[Math.floor(Math.random() * auxArray.length)]
    }
    colorsArray.push(color)
    colorsArray.push(color)
  }
  return colorsArray
}

// helper function to check whether number of cards is even and if so, 
// generates array of colors.
function validateNumberOfCards() {
  // const cardNumber = document.querySelector('input[name="cardNumber"]').value;
  if (cardNumber.value < 2 || cardNumber.value % 2 !== 0) {
    return false
  } else {
    COLORS = generateColors(cardNumber.value/2)
    shuffledColors = shuffle(COLORS);
    return true
  }
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}


function handleCardClick(event) {

  if (flippedCards.length === 2) return 
  if (flippedCards.includes(event.target)) return
  if (event.target.classList.contains('matched')) return

  flippedCards.push(event.target)
  event.target.style.backgroundColor = `#${event.target.classList[0]}`
  console.log("Cards Flipped", flippedCards)


  if ((flippedCards.length === 2) && 
    (flippedCards[0].classList[0] != flippedCards[1].classList[0])){
    setTimeout(() => {
      flippedCards[0].style.backgroundColor = "white"
      flippedCards[1].style.backgroundColor = "white"
      flippedCards = []

    }, 1000)

  } 

  if ((flippedCards.length === 2) && 
    (flippedCards[0].classList[0] == flippedCards[1].classList[0])){
      flippedCards[0].classList.add('matched')
      flippedCards[1].classList.add('matched')
      flippedCards = []
      score++
      scoreSpan.innerHTML = score

      //check for game over
      if (score == shuffledColors.length/2) {
        //update high score
        if (score > highscore) {
          localStorage.setItem('highscore', score)
          highscoreSpan.innerHTML = score
        }
        //enable restart button
        restartBtn.removeAttribute('disabled')
      }
    }

}

startBtn.addEventListener('click', function(){
  gameContainer.innerHTML = ''
  if (!validateNumberOfCards()) {
    alert('Invalid # of cards')
    return
  }
  createDivsForColors(shuffledColors);
  startBtn.setAttribute('disabled', 'true')
})

restartBtn.addEventListener('click', function() {
  gameContainer.innerHTML = ''
  score = 0
  scoreSpan.innerHTML = score
  if (!validateNumberOfCards()) {
    alert('Invalid # of cards')
    return
  }
  createDivsForColors(shuffledColors);
  restartBtn.setAttribute('disabled', 'true')
})
