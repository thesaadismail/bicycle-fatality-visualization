var dataMatrix;
var dataMatrixXAxis;

function init() {
	randomData = generateRandomDataForCategoryDataMatrix(null, 8, 8, 1500, 300);
	dataMatrix = new CategoryDataMatrix("#data-matrix-container", randomData, 300, 300, CategoryDataMatrix.Axis.AxisType_None);
	//dataMatrix.updateDataset(randomData);
	dataMatrix.initDataMatrix();
	
	randomDataForYAxis = generateRandomDataForCategoryDataMatrix(null, 8, 1, 1500, 300);
	dataMatrixYAxis = new CategoryDataMatrix("#data-matrix-yaxis-container", randomDataForYAxis, 37.5, 300, CategoryDataMatrix.Axis.AxisType_Y);
	//dataMatrix.updateDataset(randomDataForYAxis);
	dataMatrixYAxis.initDataMatrix();
	
	randomDataForXAxis = generateRandomDataForCategoryDataMatrix(null, 1, 8, 1500, 300);
	dataMatrixXAxis = new CategoryDataMatrix("#data-matrix-xaxis-container", randomDataForXAxis, 300, 37.5, CategoryDataMatrix.Axis.AxisType_X);
	//dataMatrix.updateDataset(randomDataForXAxis);
	dataMatrixXAxis.initDataMatrix();
	
	initTimeSlider();
	initTimeOfDay();
}

function updateClicked() {
	generateRandomDataForCategoryDataMatrix(dataMatrix.getDataset(), 8, 8, 1500, 300);
	dataMatrix.updateHeatchart();
	
	xAxisNewDataset = generateRandomDataForCategoryDataMatrix(dataMatrixXAxis.getDataset(), 1, 8, 37.5, 300);
	dataMatrixXAxis.updateHeatchart();
	
	yAxisNewDataset = generateRandomDataForCategoryDataMatrix(dataMatrixYAxis.getDataset(), 8, 1, 37.5, 300);
	dataMatrixYAxis.updateHeatchart();
	
	updateTimeSlider();
}