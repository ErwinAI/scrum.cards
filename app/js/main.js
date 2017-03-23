"use strict";

//detail-grid and general-grid, toggle hide and fill in the data of the card to detail-grid
$('.card').click(function(e) {
	let cardValue = $(this).find('h1')[0].innerHTML;
	let detailGrid = $('#detail-grid');
	let generalGrid = $('#general-grid');

	//if card is clicked and generalgrid is hidden, show it and hide detailgrid, and vice versa
	if (generalGrid.is(':hidden')) {
		generalGrid.show();
		detailGrid.hide();
	} else {
		document.getElementById("detail-grid-value").innerHTML = cardValue;

		generalGrid.hide();
		detailGrid.show();
	}
});
