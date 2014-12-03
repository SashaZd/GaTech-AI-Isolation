// (in board) -1 :: Empty Space 
// (-1) : Initial empty arrays 

//////GLOBAL VARIABLES //////

var board = [];
for(var i=0; i<8; i++){
	board[i]=[];
	for(var j=0; j<8; j++){
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

////////////////////////////

function convertToRowCol (index) {
	var count=-1;

	if(index == -1){
		return [-1,-1];
	}

	for(var i=0; i<8; i++){
		for(var j=0; j<8; j++){
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
	for(var i=0; i<8; i++){
		for(var j=0; j<8; j++){
			count++;
			if(i==row && j==col){
				return count;
			}
		}
	}
}


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


function checkIfLegal(index, turnVal){

	// debugger;

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
		// var startX = 
		var temp = Math.abs(y1-y2);
		for (var i = 1, yi = Math.min(y1,y2); i<temp; i++, yi++){
			console.log("Check Row: ",x1,yi,checkIfEmpty(convertToIndex(x1,yi)))
			if (!checkIfEmpty(convertToIndex(x1,yi))) {
				return false;
			}
		}
		return true;
	}

	//If same Column
	if(y1 == y2){
		var temp = Math.abs(x1-x2);
		for (var i = 1, xi = Math.min(x1,x2); i<temp; i++, xi++){
			console.log("Check Column: ",xi,y1,checkIfEmpty(convertToIndex(xi,y1)))
			if (!checkIfEmpty(convertToIndex(xi,y1))) {
				return false;
			}
		}
		return true;
	}

	//If diagonal
	if(Math.abs(x2-x1) == Math.abs(y2-y1)){
		return false;
	}

	return false;
}


function checkIfEmpty(index) {
	
	[x,y] = convertToRowCol(index);

	if(board[x][y]==-1){
		return true;
	}
	else {
		return false;
	}
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
var tempPos;

$(document).ready(function() {
	$("#chess div").click(function() {
		var index = $("#chess div").index(this);

		var turnVal = whoseTurn();					//check whose turn it is

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
		else {
			var error = "Square Filled"
			console.log("in here");
			notLegal(error);
		}
	});

})