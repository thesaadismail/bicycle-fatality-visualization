var dataMatrix;

function init() {
	randomData = generateRandomDataForCategoryDataMatrix(8, 8, 1500, 300);
	dataMatrix = new CategoryDataMatrix("#data-matrix-container", randomData, 300);
	dataMatrix.initDataMatrix();
	
	initTimeSlider();
}

function updateClicked() {
	dataMatrix.matrixDataset = generateRandomDataForCategoryDataMatrix(8, 8, 1500, 300);
	dataMatrix.updateHeatchart();
	
	updateTimeSlider();
}