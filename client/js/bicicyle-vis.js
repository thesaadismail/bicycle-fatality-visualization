var dataMatrix;

function init() {
	randomData = generateRandomDataForCategoryDataMatrix(8, 8, 1500, 300);
	dataMatrix = new CategoryDataMatrix("#heatchartContainer", randomData, 300);
	dataMatrix.initDataMatrix();
}

function updateClicked() {
	dataMatrix.matrixDataset = generateRandomDataForCategoryDataMatrix(8, 8, 1500, 300);
	dataMatrix.updateHeatchart();
}