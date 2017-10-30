// set global variables
var playerNum = "";
var player;
var playerOneChoice;
var playerTwoChoice = "rock";
var playerOneWins = 0;
var playerTwoWins = 0;
var playerOneLosses = 0;
var playerTwoLosses = 0;


// Initialize Firebase
var config = {
	apiKey: "AIzaSyBxkiSDl4QQdH1lQk_j7DhwdoNPc-Z86io",
	authDomain: "rps-multiplayer-96045.firebaseapp.com",
	databaseURL: "https://rps-multiplayer-96045.firebaseio.com",
	projectId: "rps-multiplayer-96045",
	storageBucket: "rps-multiplayer-96045.appspot.com",
	messagingSenderId: "481414795010"
};

firebase.initializeApp(config);

var database = firebase.database();



// setup player in Firebase
$("#player-submit").on("click", function(event) {
        
        event.preventDefault();

        player = $("#player-name").val().trim();

        
        playerCheck();
        

        $('#player-display').html("Hi "+player+"! You are player 1.");
      });


// Function to determine winner
function determineWinner() {
		if (playerOneChoice === playerTwoChoice) {
		$("#results").html("It was a tie!");
	}

	else if(playerOneChoice==="rock"){
        if(playerTwoChoice==="scissors"){
            $("#results").html("Player 1 wins!");
            playerOneWins++;
            playerTwoLosses++;
        }
        else{
            $("#results").html("Player 2 wins!");
            playerTwoWins++;
            playerOneLosses++;
        }
    }

    else if(playerOneChoice==="paper"){
        if(playerTwoChoice==="rock"){
            $("#results").html("Player 1 wins!");
            playerOneWins++;
            playerTwoLosses++;
        }
        else{
            $("#results").html("Player 2 wins!");
            playerTwoWins++;
            playerOneLosses++;
        }
    }

    else if(playerOneChoice==="scissors"){
        if(playerTwoChoice==="rock"){
            $("#results").html("Player 2 wins!");
            playerTwoWins++;
            playerOneLosses++;
        }
        else{
            $("#results").html("Player 1 wins!");
            playerOneWins++;
            playerTwoLosses++;
        }
    }

    database.ref("players/1").update({
    	losses: playerOneLosses,
    	wins: playerOneWins,
    })

    database.ref("players/2").update({
    	losses: playerTwoLosses,
    	wins: playerTwoWins,
    })
};

// Listen for player one play
$(".p1").on("click", function(){

	playerOneChoice = $(this).attr("data-one");

	determineWinner();

    $("#score-one").html("Wins: "+playerOneWins+" Losses: "+playerOneLosses);
    $("#score-two").html("Wins: "+playerTwoWins+" Losses: "+playerTwoLosses);
});

// check to see how many players are connected

function playerCheck() {
	database.ref("players").once("value", function(snapshot) {
  		if (snapshot.numChildren() < 2){
  			if (snapshot.child("1").exists()) {
  				playerNum = 2;
  				console.log("YO");
  			}
  			else {
  				playerNum = 1;
  				console.log("LO");
  			}
  			console.log("player number:"+playerNum)
  			database.ref("players").update({
        	[playerNum]: {
        			losses: 0,
        			name: player,
        			wins: 0
        		}
        	
      	});

  			if (playerNum == 1){
				database.ref().child("players/1").onDisconnect().remove();
			}
			else {
				database.ref().child("players/2").onDisconnect().remove();
			}
  		}
  else {
  	$('#player-display').html("Sorry, game is full. Try again later.");
  }
});
	console.log(playerNum);
}


