// (in board) -1 :: Empty Space 
// (-1) : Initial empty arrays 

//////GLOBAL VARIABLES //////

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
				//console.log(i, j);
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
			// console.log("Check Row: ",x1,yi,checkIfEmpty(convertToIndex(x1,yi)))
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
		el.style.fontSize = 48;
		return turnVal;
		// return "<strike>"+turnVal+"</strike>"
	}


}

function notLegal (error) {
	switch(error){
		case "Square Filled":
			console.log("Give up and try another. Don't be petty.");
			break;
		case "Not Legal":
			console.log("Not a legal move. You can only move horizontally, vertically or diagonally from your current position");
			break;
	}
}

//Check if game is over for turnVal
//Not tested
function checkIfGameOver(turnVal,board){

	
	console.log(turnVal);
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
	for(var index = 0; index < n*n; index++){
		if (checkIfEmpty(index) && checkIfLegal(index,turnVal)) {
			legalPositions[legalPositions.length] = index;
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
		console.log("Game Over for ", turnVal);
		return -1;
	};
		
	console.log(turnVal, legalPositions);
	var index = legalPositions[Math.floor(Math.random()*legalPositions.length)];
	console.log("AI Pickes ",index);
	return index;
}

//Single player attempts to move to index
function singleGameLoop(turnVal, index){

	console.log(turnVal, " Turn");
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
									EARLIER_POS[0] = index
									board[x][y]=0;
									break;
								case "O":
									EARLIER_POS[1] = index;
									board[x][y]=1;
									break;
								case "V":
									EARLIER_POS[2] = index;
									board[x][y]=2;
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
					// pass;
				}
			}
			// else 
			{
				var error = "Square Filled"
				console.log("in here");
				notLegal(error);
			}	
		}
		else{

			TURN += 1;
			console.log("Game Over for ", turnVal);

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

		singleGameLoop(player1,index);
		var next_index = getNextIndexForPlayer(1);
		singleGameLoop(player2, next_index);
		next_index = getNextIndexForPlayer(2);
		singleGameLoop(player3, next_index);

		
	});
})