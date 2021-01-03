//To play the game install Live Server extension and launch the game with it.

const suits = ["♠", "♦", "♣", "♥"];
const freshCards = ["ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king"];
let MainDeck = [];
let Players = [];
let deckCount = 6;
let isGameFinished = false;
let Delay;

document.addEventListener("DOMContentLoaded", function(event) {
  startGame("kerem", 10);

  let Player1Name = document.getElementById("Player1Name");
  let stayButton = document.getElementById("stayButton");
  let drawButton = document.getElementById("drawButton");
  Player1Name.addEventListener("mouseout", () => {
    makeNameNormal(Player1Name);
  });
  Player1Name.addEventListener("mouseover", () => {
    makeNameCooler(Player1Name);
  });
  Player1Name.addEventListener("click", () => {
    changePlayerName(Player1Name);
  });
  stayButton.addEventListener("click", () => {
    stay();
  });
  drawButton.addEventListener("click", () => {
    dealCard();
  });
});
//Logical Functions

//The main function that launches the game is to refresh the deck and prepare the players. It gives both players two cards and hide the second card of the dealer. And also starts the countdown
const startGame = (playerName, delay) => {
  isGameFinished = false;
  Delay = delay;
  MainDeck = getFreshDeck();
  getPlayersReady();
  dealCard(2);
  createCountDown(false, delay);
  document.getElementById("Player2-Card2").innerHTML = `<h4>?</h4>
	<p>?</p>`;
  document.getElementById("Player1Name").innerHTML = playerName;
};
//It creates an object array by combining suits and freshCards arrays defined at the beginning of the program.
const getFreshDeck = () => {
  freshDeck = new Array();
  for (let i = 0; i < deckCount; i++) {
    suits.forEach((suit) => {
      freshCards.forEach((number) => {
        freshDeck.push({ suit, number });
      });
    });
  }
  return freshDeck;
};
//Creates an object array for both players in the game. Making default values for Name, Points which represents their cards total value and Cards that will represents players hands.Also changes Player2's name to Croupier.
const getPlayersReady = () => {
  for (let i = 1; i < 3; i++) {
    Players.push({ Name: "Player" + i, Points: 0, Cards: new Array() });
  }
  document.getElementById("Player1Name").innerHTML = Players[0].Name;
  document.getElementById("Player1Points").innerHTML = Players[0].Points;
  document.getElementById("Player2Name").innerHTML = "Croupier";
  document.getElementById("Player2Points").innerHTML = Players[1].Points;
};

//Function that deals cards.If the dealer has 2 cards at the begining he/she wont getting any when this function is called.Selects the current card by sending the main deck to the getAndRemoveCardFromDeck function.
//After selecting,card of the player in the loop is added to the Cards object array.Creates the HTML element after it is added. When the cycle is over, it sends it to the printCardValue function to calculate the players' current score.
//Also checks if the game is over or not by calling isGameOver function.
const dealCard = (count = 1) => {
  if (count == 1) {
    createCountDown(true, Delay);
    drawCard(Players[0], 0);
  } else {
    Players.forEach((player, value) => {
      while (player.Cards.length < 2) {
        drawCard(player, value);
      }
    });
  }
  printCardValue();
  isGameOver();
};
//Function that draws a card pushes it to players hand and creates html element.
const drawCard = (player, value) => {
  let currentCard = getAndRemoveCardFromDeck(MainDeck);
  player.Cards.push(currentCard);
  createCardView(currentCard, value);
};

//Assigns a random number as the base of the size of the main deck. Chooses the object from the main deck that is assigned to the current randomNumber.
//The card selected from the main deck is removed by filter and the remaining length of the main deck is printed on the HTML element.
const getAndRemoveCardFromDeck = () => {
  let randomNumber = Math.floor(Math.random() * MainDeck.length);
  let card = MainDeck[randomNumber];
  MainDeck = MainDeck.filter((x) => x != card);
  document.getElementById("DeckLength").innerHTML = MainDeck.length;
  return card;
};
//The loop inside the players array computes the values ​​of the cards in the current player's hands with the calculateCurrentPoints function, and then prints them to the corresponding HTML element.
const printCardValue = () => {
  Players.forEach((player, value) => {
    if (value == 0) {
      document.getElementById(
        "Player1Points"
      ).innerHTML = calculateCurrentPoints(player);
    } else {
      document.getElementById(
        "Player2Points"
      ).innerHTML = calculateCurrentPoints(player);
    }
  });
};

//Map function creates a new array which only contains numbers from player array,then reduce function calculates those values with the help of checkCurrentVal function.
const calculateCurrentPoints = (player) => {
  let currentPoints = player.Points;
  player.Cards.map((obj) => obj.number).reduce(
    (accumulator, currentValue) =>
      (currentPoints =
        checkCurrentVal(accumulator, currentPoints) +
        checkCurrentVal(currentValue, currentPoints))
  );
  return currentPoints;
};
//If the number is jack,queen or king function turns their value into 10,if it is ace it decides to turn it 1 or 11
const checkCurrentVal = (currentVal, currentPoints) => {
  if (currentVal == "jack" || currentVal == "queen" || currentVal == "king") {
    currentVal = parseInt("10");
  } else if (currentVal == "ace" && currentPoints < 11) {
    currentVal = parseInt("11");
  } else if (currentVal == "ace" && currentPoints > 11) {
    currentVal = parseInt("1");
  }
  return currentVal;
};
//If the user presses the stay button, it first opens the dealer's hand and runs the isGameOver function.
const stay = () => {
  openPlayerTwoHand();
  createCountDown(true, "Calculating");
  isGameFinished = true;
  new Promise((resolve, reject) => {
    setTimeout(resolve, 1000);
  }).then(() => {
    isGameOver(true);
  });
};
//If the player's score is greater than 21, the player loses directly, if the player's score is greater than the dealer, the player wins, if he is equal, they are draw, if his hand is lower, the player loses.
//Also checks if the dealers hand is lower than 17 or not. If so ıt draws for the dealer until sum of his card values is atleast 17.
const isGameOver = (isPlayerStayed = false) => {
  let alertText = "";
  if (isPlayerStayed == true) {
    while (
      calculateCurrentPoints(Players[1]) <= 17 &&
      calculateCurrentPoints(Players[1]) < calculateCurrentPoints(Players[0])
    ) {
      drawCard(Players[1], 1);
      printCardValue();
    }
  }
  if (calculateCurrentPoints(Players[0]) > 21) {
    openPlayerTwoHand();
    createCountDown(true, "Calculating");
    alertText = "You lost! Lets play another round ?";
    makeAlert(alertText);
  } else if (
    calculateCurrentPoints(Players[0]) > calculateCurrentPoints(Players[1]) &&
    isGameFinished == true &&
    calculateCurrentPoints(Players[0]) <= 21
  ) {
    openPlayerTwoHand();
    createCountDown(true, "Calculating");
    alertText = "Congratz! You won! Lets play another round ?";
    makeAlert(alertText);
  } else if (
    calculateCurrentPoints(Players[0]) == calculateCurrentPoints(Players[1]) &&
    isGameFinished == true
  ) {
    openPlayerTwoHand();
    createCountDown(true, "Calculating");
    alertText = "Its a draw :/ Lets play another round ?";
    makeAlert(alertText);
  } else if (
    calculateCurrentPoints(Players[0]) < calculateCurrentPoints(Players[1]) &&
    isGameFinished == true &&
    calculateCurrentPoints(Players[1]) <= 21
  ) {
    openPlayerTwoHand();
    createCountDown(true, "Calculating");
    alertText = "You lost! Lets play another round ?";
    makeAlert(alertText);
  } else if (
    calculateCurrentPoints(Players[0]) < calculateCurrentPoints(Players[1]) &&
    isGameFinished == true &&
    calculateCurrentPoints(Players[1]) >= 21
  ) {
    openPlayerTwoHand();
    createCountDown(true, "Calculating");
    alertText = "Congratz! You won! Lets play another round ?";
    makeAlert(alertText);
  }
};

//HTML Scripts

//Dynamically drawn cards are printed on the relevant places.
const createCardView = (card, value) => {
  let element = document.createElement("div");
  let cardHolder = document.getElementById(`cardHolder${value}`);
  element.classList.add("card");
  if (value == 1) {
    element.classList.add("ml-auto");
  }
  element.setAttribute("style", "width:160px");
  element.innerHTML = `<div id="${Players[value].Name + "-"}Card${
    Players[value].Cards.length
  }" class="card-body text-center">
	<h4>${card.suit}</h4>
	<p>${card.number}</p>
	</div> `;
  cardHolder.appendChild(element);
};
//Allows the player to change his name, null and empty validations are available.
const changePlayerName = (element) => {
  let person = prompt("Please enter your name:", "Enter your name here.");
  validatePersson = person.trim();
  if (validatePersson == null || validatePersson == "") {
    changePlayerName(element);
  } else {
    element.innerHTML = person;
  }
};
//Hovering over the name with the mouse adds the display-2 class from the bootstrap.
const makeNameCooler = (element) => {
  element.classList.add("display-2");
};
//Hovering out the name with the mouse removes the display-2 class from the bootstrap.
const makeNameNormal = (element) => {
  element.classList.remove("display-2");
};
//Creates an alert to display the game status at the end of the game.
const makeAlert = (text) => {
  new Promise((resolve, reject) => {
    setTimeout(resolve, 1000);
  }).then(() => {
    if (window.confirm(text)) {
      window.location.reload(true);
      createCountDown(true, "Calculating");
    } else {
      window.location.reload(true, "Calculating");
      createCountDown(true, "Calculating");
    }
  });
};
//Unmasks the Croupiers cards and his/her total points.
const openPlayerTwoHand = () => {
  document.getElementById(
    "Player2-Card2"
  ).innerHTML = `<h4>${Players[1].Cards[1].suit}</h4>
	<p>${Players[1].Cards[1].number}</p>`;
  document.getElementById("Player2Points").style.visibility = "visible";
};
//Creates a countdowntimer at the each round.
const createCountDown = (isPlayerDrawed = false, delay) => {
  counter = delay;
  let Timer = document.getElementById("timer");
  let interval = null;
  if (isPlayerDrawed === true) {
    clearInterval(interval);
  } else {
    interval = setInterval(() => {
      Timer.innerHTML = counter;

      if (counter <= 0) {
        clearInterval(interval);
        stay();
      }
      if (delay == "Calculating") {
        clearInterval(interval);
        Timer.innerHTML = "Calculating";
      } else {
        counter--;
      }
    }, 1000);
  }
};
