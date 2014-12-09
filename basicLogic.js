

// (in board) -1 :: Empty Space 
// (-1) : Initial empty arrays 

/////// SETUP DATABASE FOR RESULTS ///////

var shortName = 'Isolation-Local'; 
var version = '1.0'; 
var displayName = 'Isolation-Local'; 
var maxSize = 65535; 
if (!window.openDatabase){ 
     alert('!! Databases are not supported in this Device !! \n\n We are sorry for the inconvenience and are currently working on a version that will work on your phone'); 
}
db = openDatabase(shortName, version, displayName,maxSize);
createAllTables(db);

writeMovesToFile("New Game", "New Game");

function createAllTables(db){
    db.transaction(function(transaction){
        transaction.executeSql("CREATE TABLE IF NOT EXISTS IsolationMoves(id INTEGER PRIMARY KEY AUTOINCREMENT,userEval TEXT, userModel TEXT)");
	});
}


//////GLOBAL VARIABLES //////

var RANDOM_AGENT = 0;
var HEURISTIC_AGENT = 1;
var MODELLING_AGENT = 2;
var agent_type = -1;

var LOSERS=0;
var xscore=0; var vscore=0; var oscore=0;
//AI Variables
var averageUserModel = 50; //Average difficulty level of the player


var n = 8;
var board = [];
for(var i=0; i<n; i++){
	board[i]=[];
	for(var j=0; j<n; j++){
		board[i][j] = -1;
	}
}

var ERR1 = 0;		//If the square has been filled before and the user keeps clicking it. 
var TURN = 0;
var x1y1=[], x2y2=[];
x1y1[0]=x1y1[1]=-1; x2y2[0]=x2y2[1]=-1;

var EARLIER_POS = [], CURRENT_POS = [];
for(var i=0;i<3; i++){ 
	EARLIER_POS[i]=-1; CURRENT_POS[i]=-1;
}

/////////////  HELPERS  ///////////////

function convertToRowCol (index) {
	var count=-1;

	if(index == -1){
		return [-1,-1];
	}

	for(var i=0; i<n; i++){
		for(var j=0; j<n; j++){
			count++;
			if(count == index){
				var temp = []; temp[0]=i; temp[1]=j;
				return temp;
			}
		}
	}
}

function convertToIndex (row, col) {
	var count=-1;
	for(var i=0; i<n; i++){
		for(var j=0; j<n; j++){
			count++;
			if(i==row && j==col){
				return count;
			}
		}
	}
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
////////////////////////////

//Returns string representaion of the player turn

function whoseTurn () {
	//Check if Legal Move (vertically, horizontally or diagonally)
	//If Legal What To Print 

	switch(TURN%3){
		case 0 : 
			return "X";
		case 1 : 
			return "O";
		case 2 : 
			return "V";
	}
}

//Returns bool true or false if index is legal
function checkIfLegal(index, turnVal){

	var x1, y1;
	[x2, y2] = convertToRowCol(index);

	switch(turnVal){
		case "X" : 
			[x1,y1] = convertToRowCol(EARLIER_POS[0]);
			break;
		case "O" : 
			[x1,y1] = convertToRowCol(EARLIER_POS[1]);
			break;
		case "V" : 
			[x1,y1] = convertToRowCol(EARLIER_POS[2]);
			break;
	}
		
	//If starting position
	if (x1 == -1){
		return true;
	}

	//If same row
	if(x1 == x2){
		var startY = (y2>y1)?(y1+1):(y2);
		var temp = Math.abs(y1-y2);
		for (var i = 1, yi = startY; i<temp; i++, yi++){
			if (!checkIfEmpty(convertToIndex(x1,yi))) {
				return false;
			}
		}
		return true;
	}

	//If same Column
	if(y1 == y2){
		var startX = (x2>x1)?(x1+1):x2;
		var temp = Math.abs(x1-x2);
		for (var i = 1, xi = startX; i<temp; i++, xi++){
			// console.log("Check Column: ",xi,y1,checkIfEmpty(convertToIndex(xi,y1)))
			if (!checkIfEmpty(convertToIndex(xi,y1))) {
				return false;
			}
		}
		return true;
	}

	//If diagonal
	if(Math.abs(x2-x1) == Math.abs(y2-y1)){

		var temp = Math.abs(x2-x1);				//Number of steps to check
		var xjump, yjump, startX, startY;

		xjump = (x2>x1)?1:-1;
		yjump = (y2>y1)?1:-1;

		startY = y1+yjump;
		startX = x1+xjump

		for (var i=1, xi = startX, yi=startY; i<temp; i++, xi=xi+xjump, yi=yi+yjump){
			// console.log("Check Diagonal: ",xi,yi,checkIfEmpty(convertToIndex(xi,yi)))
			if (!checkIfEmpty(convertToIndex(xi,yi))) {
				return false;
			}
		} 
		return true;
	}

	return false;
}


function checkIfEmpty(index) {
	
	if(index > -1){
		[x,y] = convertToRowCol(index);
	if(board[x][y]==-1){
		return true;
	}
	else {
		return false;
	}	
	}
	return false;
}

function changeOldSquares (index, el, turnVal) {
	
	if (el.textContent == turnVal){
		// el.style.setProperty("background-color", "grey");
		el.style.setProperty("text-decoration", "line-through");
		el.style.fontWeight= "bold";

		if (el.textContent == "X"){
			el.style.setProperty("color", "#D8F6CE");	
			el.style.backgroundColor = "#D8F6CE";
		}
		else if (el.textContent == "O"){
			el.style.setProperty("color", "#F6CECE");	
			el.style.backgroundColor = "#F6CECE";
		}
		else if (el.textContent == "V"){
			el.style.setProperty("color", "#D8CEF6");	
			el.style.backgroundColor = "#D8CEF6";
		}
		
		
		// el.style.fontSize = 48;
		return turnVal;
		// return "<strike>"+turnVal+"</strike>"
	}


}

function notLegal (error) {
	switch(error){
		case "Square Filled":
			// console.log("Give up and try another. Don't be petty.");
			break;
		case "Not Legal":
			// console.log("Not a legal move. You can only move horizontally, vertically or diagonally from your current position");
			break;
	}
}

//Check if game is over for turnVal
//Not tested
function checkIfGameOver(turnVal,board){

	
	// console.log(turnVal);
	var x,y,i,j;
	switch(turnVal){
		case "X":
			[x,y] = convertToRowCol(EARLIER_POS[0])
			break;
		case "O":
			[x,y] = convertToRowCol(EARLIER_POS[1])
			break;
		case "V":
			[x,y] = convertToRowCol(EARLIER_POS[2])
			break;
	}

	// console.log("Earlier position =",x,y);
	if (x==-1) {

		//First move. No end
		return false;
	};

	var legalPositions = getLegalMoves(turnVal);
	if (legalPositions.length == 0) {
		return true;
		
	};

	return false;

}

function getLegalMoves(turnVal){

	var playerIndex = -1; 
	switch(turnVal){
		case "X":
			playerIndex = 0;
			break;
		case "O":
			playerIndex = 1;
			break;
		case "V":
			playerIndex = 2;
			break;
	}

	previousIndex = EARLIER_POS[playerIndex];
	legalPositions = [];
	if (previousIndex != -1){
		for(var index = 0; index < n*n; index++){
		if (checkIfEmpty(index) && checkIfLegal(index,turnVal)) {
			legalPositions[legalPositions.length] = index;
			}
		}	
	}
	else{
		for(var index = 0; index < n*n; index++){
		if (checkIfEmpty(index)) {
			legalPositions[legalPositions.length] = index;
			}
		}
	}

	return legalPositions;
}

function getNextIndexForPlayer(playerIndex){

	var turnVal = whoseTurn();
	
	var legalPositions = getLegalMoves(turnVal);
	if (legalPositions.length == 0) {

		//No more legal positions
		//End of this player's game
		TURN += 1;

		switch(turnVal){
			case "X":
				document.getElementById('playerX').style.color = "grey";
				document.getElementById('playerX').style.setProperty("text-decoration", "line-through");
				alert("Game Over. You've boxed yourself in! Rate your experience.");

				if(agent_type==RANDOM_AGENT){
					var win = window.open("https://docs.google.com/forms/d/1qOql_UtjMuLeuvwUeXDTd3bF9-3MdEFOpeXTfXLBoKQ/viewform", '_blank');
					win.focus();
				}
				else{
					var win = window.open("https://docs.google.com/forms/d/1C3in9Iql5sO1L98GKPdApGSNU4sO3jqvE_HoLfMUFNU/viewform", '_blank');
					win.focus();
				}

				break;
			case "O":
				document.getElementById('playerO').style.color = "grey";
				document.getElementById('playerO').style.setProperty("text-decoration", "line-through");
				if(++LOSERS==2){
					alert("You Win. Game Over.");
				}
				break;
			case "V":
				document.getElementById('playerV').style.color = "grey";
				document.getElementById('playerV').style.setProperty("text-decoration", "line-through");
				if(++LOSERS==2){
					alert("You Win. Game Over.");
				}
				break;
		}

		
		return -1;
	};
		
	
	var index = -1;
	switch (agent_type){
		case RANDOM_AGENT:
			index = getIndexForRandomAgent(legalPositions);
			break;
		case HEURISTIC_AGENT:
			index = getIndexForHeuristicAgent(legalPositions);
			break;
		case MODELLING_AGENT:
			index = getIndexForModellingAgent(legalPositions);
			break;
	}	

	// console.log("AI Pickes ",index);
	return index;
}



function getIndexForRandomAgent(legalMoves){
	var index = legalMoves[Math.floor(Math.random()*legalMoves.length)];
	return index;
}


function getIndexForHeuristicAgent(legalMoves){
	return -1;
}


function getIndexForModellingAgent(legalMoves){
	var index = -1;
	var evalDiff = [];
	var evalarr = []; //js for logging

	var player = whoseTurn();
	if (legalMoves.length > 0){
		
		var min = 0;
		for (var i=0 ; i<legalMoves.length; i++){
			var pos = legalMoves[i];
			var eval = evalValueForPosition(pos, player);
			evalarr[i] = eval;
			evalDiff[i] = Math.abs(averageUserModel - eval);

			if (i==0 || min > evalDiff[i]){
				min = evalDiff[i];
				index = pos;
			}
		}//Got minimum diff
	}
	// console.log("Modelling Agent Heuristics: ", evalarr);
	// console.log("Modelling Agent Diff: ", evalDiff);
	//console.log(player, "picks move with eval =", evalarr[index]);
	return index;
}


function evalValueForPosition(index, player){

	var num_empty_board_positions = 0;
	var num_my_moves = 0;
	var num_their_moves = 0;

	for(var i=0; i<n; i++){
		for(var j=0; j<n; j++){
			if (board[i][j] == -1)
				num_empty_board_positions ++;
		}
	}

	var them1 = "";
	var them2 = "";
	switch(player){
		case "X":
			them1 = "O"; 
			them2 = "V";
			break;
		case "O":
			them1 = "X"; 
			them2 = "V";
			break;
		case "V":
			them1 = "O"; 
			them2 = "X";
			break;
	}


	//Assume You made the move
	var earlierPos = -1; //Temp store old one to reset
	var earlierBoard = -1;

	// console.log("Set to new position =", index,  " Earlier position =", earlierPos, earlierBoard);

	[x,y] = convertToRowCol(index);
	switch(player){
		case "X":
			earlierpos = EARLIER_POS[0];
			earlierBoard = board[x][y];
			EARLIER_POS[0] = index
			board[x][y]=0;
			break;
		case "O":
		earlierpos = EARLIER_POS[1];
			earlierBoard = board[x][y];
			EARLIER_POS[1] = index;
			board[x][y]=1;
			break;
		case "V":
		earlierpos = EARLIER_POS[2];
			earlierBoard = board[x][y];
			EARLIER_POS[2] = index;
			board[x][y]=2;
			break;
	}


	//My moves
	num_my_moves = getLegalMoves(player).length;
	num_their_moves = getLegalMoves(them1).length;
	num_their_moves = num_their_moves + getLegalMoves(them2).length;


	// console.log("New position =", EARLIER_POS, board);

	//Reset the board
	// EARLIER_POS = earlierPos;
	// board = earlierBoard;
	
	[x,y] = convertToRowCol(index);
	switch(player){
		case "X":
			EARLIER_POS[0] = earlierpos
			board[x][y]= earlierBoard;
			break;
		case "O":
			EARLIER_POS[1] = earlierpos
			board[x][y]= earlierBoard;
			break;
		case "V":
			EARLIER_POS[2] = earlierpos
			board[x][y]= earlierBoard;
			break;
	}


	// console.log("New position =", EARLIER_POS, board);

	// console.log(num_empty_board_positions, num_my_moves, num_their_moves);
	return num_empty_board_positions + num_my_moves - num_their_moves;
}

function printMovesFromDb(){
	db.transaction(function(transaction){
        var rowCount = 'SELECT * FROM Profile';
        transaction.executeSql(rowCount,[],function(transaction,result){
            if(result.rows.length == 0){
                console.log(result);
            }
        });
    });
}


function writeMovesToFile(userEval, userModel) {
	// localStorage.setItem("move", stringToWrite);

	db.transaction(function(transaction){
        transaction.executeSql("INSERT INTO IsolationMoves (userEval, userModel) VALUES('"+userEval+"','"+userModel+"')");
	});
}


//Single player attempts to move to index
function singleGameLoop(turnVal, index){

	// console.log(turnVal, " Turn");
		//Check if game over for this turnVal
		// if(!checkIfGameOver(turnVal,board))
		if(!(index == -1)) //Game Over (AI)
		{
			//If game not over, check if empty and legal
			if(checkIfEmpty(index)){
				// tempPos = EARLIER_POS;
					
				if(checkIfLegal(index, turnVal)){			
					//marks the cell with X/O/V and crosses out old cells
					$("#chess div").text(function(index2){			//iterating through all the squares
						if (index2 == index){						//if the sq == the sq that was clicked on, then increment the turn, and print X/O/V

							TURN += 1;
							[x,y] = convertToRowCol(index);

							switch(turnVal){
								case "X":

									//Update the player model
									var userEval = evalValueForPosition(index,turnVal);
									averageUserModel = (averageUserModel + userEval)/2;
									
									writeMovesToFile(userEval, averageUserModel);
									//"X pics move with eval =", userEval, "ANGERAGE: ",averageUserModel);
									
									//Make the move
									EARLIER_POS[0] = index
									board[x][y]=0;
									this.style.setProperty("color", "#21610B");
									xscore = parseInt(document.getElementById('x-score').innerHTML)+1;
									document.getElementById('x-score').innerHTML = xscore;


									break;
								case "O":
									EARLIER_POS[1] = index;
									board[x][y]=1;
									this.style.setProperty("color", "#8A0808");
									oscore = parseInt(document.getElementById('o-score').innerHTML)+1;
									document.getElementById('o-score').innerHTML = oscore;
									break;
								case "V":
									EARLIER_POS[2] = index;
									board[x][y]=2;
									this.style.setProperty("color", "#3A01DF");
									vscore = parseInt(document.getElementById('v-score').innerHTML)+1;
									document.getElementById('v-score').innerHTML = vscore;
									break;
							}

							return turnVal;			//actual marking of div done here
						}
						else {
							//change the older X/O/V that exists to be displayed as a crossed out square
							return changeOldSquares(index2, this, turnVal);
						}
					});
				}
				else { 
					var error = "Not Legal";
					notLegal(error);
					return -1; 
				}
			}
			// else 
			{
				var error = "Square Filled"
				notLegal(error);
			}	
		}
		else{
			TURN += 1;
		}
}


var tempPos;

$(document).ready(function() {
	$("#chess div").click(function() {
		var index = $("#chess div").index(this);

		// var turnVal = whoseTurn();					//check whose turn it is
		var player1 = "X";
		var player2 = "O";
		var player3 = "V";

		//Find last game agent type
		var retrieveAgentType = localStorage.getItem('agent_type');
		agent_type = (retrieveAgentType==RANDOM_AGENT)?MODELLING_AGENT:RANDOM_AGENT;
		localStorage.setItem('agent_type', agent_type);
		console.log("Agent Type : ",agent_type);

		var ret = singleGameLoop(player1,index);
		//If user made a legal move
		if (ret != -1){
			var next_index = getNextIndexForPlayer(1);
			var e1 = evalValueForPosition(next_index,"O");
			console.log("O pics move with eval =", e1);
			setTimeout(function(){ 
				singleGameLoop(player2, next_index); 
				next_index = getNextIndexForPlayer(2);
				e1 = evalValueForPosition(next_index,"O");
				console.log("V pics move with eval =", e1);
				setTimeout(function(){ singleGameLoop(player3, next_index); }, 250);
			}, 250);
		}
	});
})