"use strict";

var _cardImageExtension = 'png';
var _pathToCardImages = '/images/cards/';

insertNewCards(true, true);

function removeExistingCards() {
	$('.card-image').each(function() {
		$(this).remove();
	});
}

//colorDefault = boolean, orange if true, blue if false
//typeDefault = boolean, hollow if true, full if false
function insertNewCards(colorDefault, typeDefault) {
	var color = colorDefault ? 'orange' : 'blue';
	var type = typeDefault ? 'hollow' : 'full';

	//remove existing cards, if any
	removeExistingCards();

	$('.card').not('.detailed').each(function(index,element) {
		//make new img
		var cardImageElement = new Image();

		//get card content from id of this particular div
		let cardId = element.id;
		let cardContent = cardId.substr(cardId.indexOf("card-") + 5);

		//make card string
		let cardImage = 'card-' + type + "-" + color + "-" + cardContent + "." + _cardImageExtension;
		//set src and class
		cardImageElement.src = _pathToCardImages + cardImage;
		cardImageElement.className  = 'card-image';

		//onload, append div with img tag
		cardImageElement.onload = function() {
			element.appendChild(cardImageElement);
		};
	});
}

//detail-grid and general-grid, toggle hide and fill in the data of the card to detail-grid
$('.card').click(function(e) {
	let clickedElement = $(this);

 	let cardImageElement = clickedElement.find('img')[0].cloneNode(true);
 	let detailGrid = $('#detail-grid');
 	let generalGrid = $('#general-grid');

	 //if card is clicked and generalgrid is hidden, show it and hide detailgrid, and vice versa
	var count = $(this).length;
	if (generalGrid.is(':hidden')) {
		//in this case, clicked element is the detail grid card

		//add flipped to the detail card as it's clicked
		clickedElement.addClass("flippedback");

		$(this).one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
			if ( --count == 0) {
				//switch the visibility of the grids
				generalGrid.show();
				detailGrid.hide();

				//remove the detail card, as it should be empty if hidden (in prep for next detail card)
				$(".detailed").empty();

				//remove flipped again, as the transition is done
				clickedElement.removeClass("flippedback");
			}
		});
	} else {
		//in this case, clicked element is the general grid card

		//first, put in the right image into the detail grid card
		$(".detailed").append(cardImageElement);

		//second, add the class on the clicked element, in this case the general card
		clickedElement.addClass("flipped");

		$(this).one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
			if ( --count == 0) {
				//switch the visibility of the grids
				generalGrid.hide();
				detailGrid.show();

				//remove flipped again, as the transition is done
				clickedElement.removeClass("flipped");
			}
		});
	}
});

$('#colorToggle').change(function(e) {
	console.log("activated toggle");

	let headerTitle = $('.header_title');

	if (!this.checked) {
		headerTitle.removeClass("header--reversed");

		insertNewCards(true, true); //make 'em orange
	} else {
		headerTitle.addClass("header--reversed");
		insertNewCards(false, true); //make 'em blue
	}
});

