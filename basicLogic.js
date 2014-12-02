//////GLOBAL VARIABLES //////

var ERR1 = 0;		//If the square has been filled before and the user keeps clicking it. 
var TURN = 0;


var EARLIER_POS = [], CURRENT_POS = [];
for(var i=0;i<3; i++){ 
	EARLIER_POS[i]=-1; CURRENT_POS[i]==-1;
}

////////////////////////////

function convertToRowCol (index) {
	var count=-1;
	for(var i=0; i<8; i++){
		for(var j=0; j<8; j++){
			count++;
			if(count == index){
				return [i, j];
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

function checkIfLegal (index, turnVal) {
	var x1, x2, y1, y2;
	switch(turnVal){
		case "X":
			[x1, y1] = convertToRowCol(EARLIER_POS[0]);
			[x2, y2] = convertToRowCol(index);
			break;
		case "O":
			[x1, y1] = convertToRowCol(EARLIER_POS[1]);
			[x2, y2] = convertToRowCol(index);
			break;
		case "V":
			[x1, y1] = convertToRowCol(EARLIER_POS[2]);
			[x2, y2] = convertToRowCol(index);
			break;
	}
	console.log(x1, y1, " --- ", x2, y2);

	return true
}

function checkIfEmpty(el, index) {
	var contains = el.textContent;

	if (contains=="") {			//the square is empty, can be filled 
		return checkIfLegal(el, index)
		
	}
	else {
		return false;			//the square already has a player's move in it
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
			ERR1 += 1; 
			if (ERR1==3) {
				alert("That square has been played before! Give up and try another. Don't be petty."); ERR1 = 0;
			}
			break;
	}
}

$(document).ready(function() {
	$("#chess div").click(function() {
		var index = $("#chess div").index(this);

		if(checkIfEmpty(this, index)){
			var turnVal = whoseTurn();					//check whose turn it is

			if(checkIfLegal(index, turnVal)){
			
				//marks the cell with X/O/V and crosses out old cells
				$("#chess div").text(function(index2){			//iterating through all the squares
					if (index2 == index){						//if the sq == the sq that was clicked on, then increment the turn, and print X/O/V
						TURN += 1;

						switch(turnVal){
							case "X":
								CURRENT_POS[0]=index;
								break;
							case "O":
								CURRENT_POS[1]=index;
								break;
							case "V":
								CURRENT_POS[2]=index;
								break;
						}


						return turnVal;
					}
					else {
						//change the older X/O/V that exists to be displayed as a crossed out square
						return changeOldSquares(index2, this, turnVal);
					}
				});
			}
			else { 
				var error = "Not a legal move. You can only move horizontally, vertically or diagonally from your current position";
				notLegal(error);
			}
		}
		else {
			var error = "Square Filled"
			notLegal(error);
		}
	});

})