//////GLOBAL VARIABLES //////

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


function checkIfLegal (index, turnVal) {
	//console.log("Inside Check Legal");
	// debugger;
	var legal = false;
	switch(turnVal){
		case "X":
			//console.log(x1y1, x2y2);
			x1y1  = convertToRowCol(EARLIER_POS[0]);
			x2y2 = convertToRowCol(index);

			//console.log(x1y1, x2y2);
			break;
		case "O":
			x1y1 = convertToRowCol(EARLIER_POS[1]);
			x2y2 = convertToRowCol(index);
			break;
		case "V":
			x1y1 = convertToRowCol(EARLIER_POS[2]);
			x2y2 = convertToRowCol(index);
			break;
	}

	if (x1y1[0]==-1){
		 return true;
	}
	else { 
		var x1 = x1y1[0], y1=x1y1[1], x2=x2y2[0], y2=x2y2[1];

		for(var i=1; i<=8; i++){

			if((x1+i) < 8) {									//check that the increasing diagonal doesn't leave the board
				if(checkIfEmpty(convertToIndex((x1+i), y1), turnVal)){		//check if all the cells between the two moves are empty
					if((x1+i)==x2 && y1==y2){
						return true;
					}
				}
				else 
					return false;
			}
			if((x1-i) >= 0) {									//check that the increasing diagonal doesn't leave the board
				if(checkIfEmpty(convertToIndex((x1-i), y1), turnVal)){		//check if all the cells between the two moves are empty
					if((x1-i)==x2 && y1==y2){
						return true;
					}
				}
				else 
					return false;
			}

			if((y1+i) < 8) {									//check that the increasing diagonal doesn't leave the board
				if(checkIfEmpty(convertToIndex(x1, (y1+i)), turnVal)){		//check if all the cells between the two moves are empty
					if((x1+i)==x2 && y1==y2){
						return true;
					}
				}
				else 
					return false;
			}
			if((y1-i) >= 0) {									//check that the increasing diagonal doesn't leave the board
				if(checkIfEmpty(convertToIndex(x1, (y1-i)), turnVal)){		//check if all the cells between the two moves are empty
					if((x1-i)==x2 && y1==y2){
						return true;
					}
				}
				else 
					return false;
			}
			
			// if(x2y2[0]==x1y1[0] || x2y2[1]==x1y1[1]){
			// 	return true;		//without checking for barricades
			// }
			// else {
				
				// console.log(x1, y1, " --------> ", x2, y2);
					if( ((x1+i) < 8) && ((y1+i) < 8)){									//check that the increasing diagonal doesn't leave the board
						if(checkIfEmpty(convertToIndex((x1+i), (y1+i)), turnVal)){		//check if all the cells between the two moves are empty
							if(((x1+i)==x2) && ((y1+i)==y2)){							//check if the new cell is on the diagonal
								return true;
							}	
						}
						else{											//there was a barricade in the middle
							// legal = false;
							return false;
						}
					}

					if( (x1-i) >= 0 && (y1+i) < 8 ) {			//check the upper-right bounds
						if(checkIfEmpty(convertToIndex((x1-i), (y1+i)), turnVal)){		//check if all the cells between the two moves are empty
							if(((x1-i)==x2) && ((y1+i)==y2)){							//check if the new cell is on the diagonal
								return true;	
							}
						}
						else{											//there was a barricade in the middle
							// legal = false;
							return false;
						}
					}
					// debugger;
					if( ((x1+i) < 8) && ((y1-i) >= 0)){			//check the lower-left bounds
						if(checkIfEmpty(convertToIndex((x1+i), (y1-i)), turnVal)){		//check if all the cells between the two moves are empty
							if(((x1+i)==x2) && ((y1-i)==y2)) {							//check if the new cell is on the diagonal
								return true;
							}
						}
						else{
																		//there was a barricade in the middle
							// legal = false;
							return false;
						}
					}
					if( (x1-i) >= 0 && (y1-i) >= 0 ){			//check the upper-left bounds
						if(checkIfEmpty(convertToIndex((x1-i), (y1-i)), turnVal)){		//check if all the cells between the two moves are empty
							if(((x1-i)==x2) && ((y1-i)==y2)){							//check if the new cell is on the diagonal
								return true;
							}
						}
						else{											//there was a barricade in the middle
							// legal = false;
							return false;
						}
					}
				

			// }
		}
	}
	return legal;
}


function checkIfEmpty(index, turnVal) {
	
	$("#chess div").text(function(index2){
		if(index2 == index){
			el=this;
		}
	});
	// console.log(el);
	var contains = el.textContent;

	// console.log("Is there a move in here", contains.length);
	if (contains=="") {			//the square is empty, can be filled 
		console.log("Empty cell, ", convertToRowCol(index));
		return true;
		
	}
	else {
		console.log("Filled cell, ", convertToRowCol(index));
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
			console.log("Give up and try another. Don't be petty.");
			break;
		case "Not Legal":
			console.log("Not a legal move. You can only move horizontally, vertically or diagonally from your current position");
			break;
	}
}

$(document).ready(function() {
	$("#chess div").click(function() {
		var index = $("#chess div").index(this);
		//console.log(index, " being tried");
		var turnVal = whoseTurn();					//check whose turn it is

		if(checkIfEmpty(index, turnVal)){

			var tempPos = EARLIER_POS; console.log("Earlier : ", EARLIER_POS)
			EARLIER_POS = CURRENT_POS; console.log("New : ", CURRENT_POS)
			
			if(checkIfLegal(index, turnVal)){
			
				//marks the cell with X/O/V and crosses out old cells
				$("#chess div").text(function(index2){			//iterating through all the squares
					if (index2 == index){						//if the sq == the sq that was clicked on, then increment the turn, and print X/O/V
						TURN += 1;

						switch(turnVal){
							case "X":
								// //console.log(EARLIER_POS[0], CURRENT_POS[0]);
								EARLIER_POS[0] = CURRENT_POS[0];
								CURRENT_POS[0] = index;
								// //console.log(EARLIER_POS[0], CURRENT_POS[0]);
								break;
							case "O":
								EARLIER_POS[1] = CURRENT_POS[1];
								CURRENT_POS[1]=index;
								break;
							case "V":
								EARLIER_POS[2] = CURRENT_POS[2];
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
				// CURRENT_POS = EARLIER_POS;
				EARLIER_POS = tempPos;
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