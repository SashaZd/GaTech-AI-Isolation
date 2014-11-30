//////GLOBAL VARIABLES //////

var ERR1 = 0;		//If the square has been filled before and the user keeps clicking it. 
var TURN = 0;
var sow = new Array(64);
for (var i = sow.length - 1; i >= 0; i--) {
	sow[i] = "";
};

////////////////////////////

function print_sow () {
	for (var i = 0; i < sow.length; i++) {
		if (sow[i]!="") {
			console.log(i + " : " + sow[i])
		}
	};
}

function whoseTurn (index, el) {
	//Check if Legal Move (vertically, horizontally or diagonally)


	//If Legal What To Print 
	 
	switch(TURN%3){
		case 0 : 
			sow[index]="X";
			return "X";
		case 1 : 
			sow[index]="O";
			return "O";
		case 2 : 
			sow[index]="V";
			return "V";
	}
}

function checkIfLegal (el,index) {
	
	//for horizontal possible moves... 
	
	var hDiff = (index%8);

	var fromHDiff = index-hDiff; 
	var toHDiff = index+7-hDiff;

	// //Flash Legal Horizontal Moves
	// console.log(fromHDiff + " --- " + index + " --- " + toHDiff);
	
	// //iterating through all the squares
	// $("#chess div").text(function(index2){
	// 	if (index2 == index){
			
	// 	}
	// 	else {
	// 		if (index2 >= fromHDiff && index2 <= toHDiff){
	// 			return "legal";
	// 		}
	// 	}
	// });
	// setTimeout(function(){
	// 	$("#chess div").text(function(index2){
	// 		if (index2 == index){
				
	// 		}
	// 		else {
	// 			if (index2 >= fromHDiff && index2 <= toHDiff){
	// 				return "";
	// 			}
	// 		}
	// 	});
	// }, 3000);
	

	

	

	//for vertical possible moves...

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

			//iterating through all the squares
			$("#chess div").text(function(index2){

				//check whose turn it is
				var turnVal = whoseTurn(index, this);

				//if the sq == the sq that was clicked on, then increment the turn, and print X/O/V
				if (index2 == index){
					TURN += 1;
					return turnVal;
				}
				else {

					//change the older X/O/V that exists to be displayed as a crossed out square
					return changeOldSquares(index2, this, turnVal);
				}
			});
		}
		else {
			var error = "Square Filled"
			notLegal(error);
		}
	});

})