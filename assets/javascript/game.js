// set global variables
var playerNum = "";
var player;
var playerOneChoice;
var playerTwoChoice;
var playerOneWins = 0;
var playerTwoWins = 0;
var playerOneLosses = 0;
var playerTwoLosses = 0;
var oneChoices = "<div class='p1 Rock' data-one='Rock'>Rock</div><div class='p1 Paper' data-one='Paper'>Paper</div><div class='p1 Scissors' data-one='Scissors'>Scissors</div>";
var twoChoices = "<div class='p2 Rock' data-two='Rock'>Rock</div><div class='p2 Paper' data-two='Paper'>Paper</div><div class='p2 Scissors' data-two='Scissors'>Scissors</div>";


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

    sessionStorage.clear();

    sessionStorage.setItem("name", player);
    
    playerCheck();

    $('#player-display').html("Hi "+player+"! You are player "+sessionStorage.getItem("number")+".");

    $(".chat-hide").show();

  });


// Determine winner and update win and loss
// function determineWinner(){
  database.ref("players").on("value", function(snapshot){
    if(snapshot.child("1").child("choice").exists() && snapshot.child("2").child("choice").exists()){

      playerOneChoice = snapshot.child("1").child("choice").val();
      playerTwoChoice = snapshot.child("2").child("choice").val();
      console.log("playerOneChoice");
      console.log("playerTwoChoice");

    		if (playerOneChoice === playerTwoChoice) {
    		$("#results").html("It was a tie!");
    	}

    	else if(playerOneChoice==="Rock"){
            if(playerTwoChoice==="Scissors"){
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

        else if(playerOneChoice==="Paper"){
            if(playerTwoChoice==="Rock"){
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

        else if(playerOneChoice==="Scissors"){
            if(playerTwoChoice==="Rock"){
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

        

        var choice1 = snapshot.child("1").child("choice").val();
        $('#one-choices').html("<div class='"+choice1+"'>"+choice1+"</div>");
        var choice2 = snapshot.child("2").child("choice").val();
        $('#one-choices').html("<div class='"+choice2+"'>"+choice2+"</div>");

        

        setTimeout(function(){
          $("#results").empty();
          database.ref().update({turn: 1});
          database.ref("players").child("1").child("choice").remove();
          database.ref("players").child("2").child("choice").remove();

          database.ref("players/1").update({
          losses: playerOneLosses,
          wins: playerOneWins,
          });

        database.ref("players/2").update({
          losses: playerTwoLosses,
          wins: playerTwoWins,
          });
        }, 3000);
    }
  });
// };


// Listen for player 1 choice
$("#player-one-box").on("click", ".p1", function(){

	playerOneChoice = $(this).attr("data-one");

	database.ref("players/1").update({
    	choice: playerOneChoice
    });

  database.ref().update({
      turn: 2
    });

});

// Listen for player 2 choice
$("#player-two-box").on("click", ".p2", function(){

  playerTwoChoice = $(this).attr("data-two");

  database.ref("players/2").update({
      choice: playerTwoChoice
    });

    // database.ref().update({
    //   turn: 1
    // });

    // determineWinner();
});

// check to see how many players are connected

function playerCheck() {
	database.ref().once("value", function(snapshot) {
  		if (snapshot.child("players").numChildren() < 2){
  			if (snapshot.child("players").child("1").exists()) {
  				playerNum = 2;
          sessionStorage.setItem("number", playerNum);
  			}
  			else {
  				playerNum = 1;
          sessionStorage.setItem("number", playerNum);
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
        database.ref().child("turn").onDisconnect().remove();
        database.ref().child("turn").onDisconnect().remove();
			}
			else {
				database.ref().child("players/2").onDisconnect().remove();
        database.ref().child("turn").onDisconnect().remove();
			}
     

  		}
  else {
  	$('#player-display').html("Sorry, game is full. Try again later.");
  }

});

};

// Get player number from firebase

// function getNum(name) {
//    database.ref("players").on("value", function(snapshot) {
//     snapshot.forEach(function(childSnapshot) {
//       var currentName = childSnapshot.child("name").val();
//       var currentNum = childSnapshot.key;
//       if (player === currentName){
//         playerNum = currentNum;
//       }})})};

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

   // function greeting() {
   //  database.ref("players").on("value", function(snapshot){
   //    if (snapshot.child("1").child("name").val() === player){
   //      $('#player-display').html("Hi "+player+"! You are player 1.");
   //      $(".chat-hide").show();
   //    }
   //    else if (snapshot.child("2").child("name").val() === player){
   //      $('#player-display').html("Hi "+player+"! You are player 2.");
   //      $(".chat-hide").show();
   //    }
   //  })
   // }

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

   //Display player names in boxes
   database.ref().on("value", function(snapshot){
     if (snapshot.child("players").child("1").exists()){
        $('#player-one').html(snapshot.child("players").child("1").child("name").val());
     }
    if (snapshot.child("players").child("2").exists()){
        $('#player-two').html(snapshot.child("players").child("2").child("name").val());
     }

  });   


   // Display player info
   database.ref().on("value", function(snapshot){
     if (snapshot.child("players").numChildren() === 2 && snapshot.child("turn").exists() === false){
        database.ref().update({turn: 1
        })
     }

    });

    // Display player info
   database.ref().on("value", function(snapshot){
    playerNum = sessionStorage.getItem("number");

    if (playerNum == 1 && snapshot.child("turn").val() == 1){
        $('#one-choices').html(oneChoices);
        $('#turn-display').html("It's your turn!");
    }

    if (playerNum == 2 && snapshot.child("turn").val() == 1){
      $('#turn-display').html("Waiting on Player 1...");
      $('#two-choices').empty();
      $('#one-choices').empty();
    }

    if (playerNum == 1 && snapshot.child("turn").val() == 2){
        var choice = snapshot.child("players").child("1").child("choice").val();
        $('#one-choices').html("<div class='"+choice+"'>"+choice+"</div>");
        $('#turn-display').html("Waiting on Player 2...");
    }

    if (playerNum == 2 && snapshot.child("turn").val() == 2){
        $('#two-choices').html(twoChoices);
        $('#turn-display').html("It's your turn!");
    }

    });  

// display results