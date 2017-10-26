var playerOneChoice;
var playerTwoChoice = "rock";
var playerOneWins = 0;
var playerTwoWins = 0;
var playerOneLosses = 0;
var playerTwoLosses = 0;


// Listen for player one play
$(".p1").on("click", function(){

	playerOneChoice = $(this).attr("data-one");

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

    $("#score-one").html("Wins: "+playerOneWins+" Losses: "+playerOneLosses);
    $("#score-two").html("Wins: "+playerTwoWins+" Losses: "+playerTwoLosses);
});