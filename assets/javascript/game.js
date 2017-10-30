// set global variables
var playerNum = "";
var player;
var playerOneChoice;
var playerTwoChoice = "rock";
var playerOneWins = 0;
var playerTwoWins = 0;
var playerOneLosses = 0;
var playerTwoLosses = 0;
var oneChoices = "<div class='p1 rock' data-one='rock'>Rock</div><div class='p1 paper' data-one='paper'>Paper</div><div class='p1 scissors' data-one='scissors'>Scissors</div>";
var twoChoices = "<div class='p2 rock' data-one='rock'>Rock</div><div class='p2 paper' data-one='paper'>Paper</div><div class='p2 scissors' data-one='scissors'>Scissors</div>";

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
        getNum(player);
        console.log(playerNum+"!!!");
        greeting();

        
      });


// Function to determine winner and update win and loss
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

// Listen for player
$(".p1").on("click", function(){

	playerOneChoice = $(this).attr("data-one");

	console.log(playerOneChoice);

	database.ref("players/1").update({
    	choice: playerOneChoice
    })

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
  			
  			database.ref("players").update({
        	[playerNum]: {
        			losses: 0,
        			name: player,
        			wins: 0,
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

// Get player number from firebase

function getNum(name) {
   database.ref("players").on("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var currentName = childSnapshot.child("name").val();
      console.log("currentName:"+currentName);
      var currentNum = childSnapshot.key;
      console.log("currentNum:"+currentNum);
      console.log("getNum player:"+player);
      if (player === currentName){
        playerNum = currentNum;
      }})})};

// chat add
$("#chat-send").on("click", function(event) {
  // Prevent form from submitting
  event.preventDefault();

  var newChat = $("#chat").val();
  database.ref("chat").push({
    "name": player,
    "message": newChat,
    "number": playerNum
  });

  $('#chat').val('');

});

//update chat window
   database.ref("chat").on("value", function(snapshot) {
    $("#chat-display").empty();
    console.log("empty");
    snapshot.forEach(function(childSnapshot) {
      var chatLineId = $("#chat-display")
      var chatLine = $("<p>")
      var chatLineName = childSnapshot.child("name").val();
      var chatLineMessage = childSnapshot.child("message").val();
      chatLine.addClass("player-"+childSnapshot.child("number").val());
      chatLine.html(chatLineName+": "+chatLineMessage)
      chatLineId.prepend(chatLine);
    })
    });

   // get player number and show greeting

   function greeting() {
    database.ref("players").on("value", function(snapshot){
      if (snapshot.child("1").child("name").val() === player){
        $('#player-display').html("Hi "+player+"! You are player 1.");
        $(".chat-hide").show();
      }
      else if (snapshot.child("2").child("name").val() === player){
        $('#player-display').html("Hi "+player+"! You are player 2.");
        $(".chat-hide").show();
      }
    })
   }

   // Display score when updated

   database.ref().on("value", function(snapshot){
    var win1 = snapshot.child("players").child("1").child("wins").val();
    var win2 = snapshot.child("players").child("2").child("wins").val();
    var loss1 = snapshot.child("players").child("1").child("losses").val();
    var loss2 = snapshot.child("players").child("2").child("losses").val();
    if (win1 != null && win2 != null && loss1 != null && loss2 != null){
      $("#score-one").html("Wins: "+win1+" Losses: "+loss1);
      $("#score-two").html("Wins: "+win2+" Losses: "+loss2);
    }
   });


   // Display player info
   