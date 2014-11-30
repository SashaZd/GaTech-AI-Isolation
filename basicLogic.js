//////GLOBAL VARIABLES //////

var ERR1 = 0;		//If the square has been filled before and the user keeps clicking it. 
var TURN = -1;
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

function checkIfEmpty(el) {
	var contains = el.textContent;

	if (contains=="") {			//the square is empty, can be filled 
		return true;
	}
	else {
		return false;			//the square already has a player's move in it
	}
}

function changeOldSquares (index, el, turnVal) {
	
	if (el.textContent == turnVal){
		el.style.setProperty("background-color", "grey");
		el.style.setProperty("text-decoration", "line-through");
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

		if(checkIfEmpty(this)){
			$("#chess div").text(function(index2){
				var turnVal = whoseTurn(index, this);
				if (index2 == index){
					TURN += 1;
					return turnVal;
				}
				else {
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