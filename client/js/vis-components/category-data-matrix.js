function CategoryDataMatrix(mainElementName, mainJsonData, xAxisElementName, xAxisJsonData, yAxisElementName, yAxisJsonData) {

var dataMatrix;
var dataMatrixXAxis;
var dataMatrixYAxis;

this.initCategoryDataMatrix = function() {
	
	dataMatrix = new HeatchartMatrix(mainElementName, mainJsonData, 300, 300, HeatchartMatrix.Axis.AxisType_None);
	dataMatrix.initDataMatrix();
	
	dataMatrixXAxis = new HeatchartMatrix(xAxisElementName, xAxisJsonData, 300, 37.5, HeatchartMatrix.Axis.AxisType_X);
	dataMatrixXAxis.initDataMatrix();
	
	dataMatrixYAxis = new HeatchartMatrix(yAxisElementName, yAxisJsonData, 37.5, 300, HeatchartMatrix.Axis.AxisType_Y);
	dataMatrixYAxis.initDataMatrix();
}

this.initCategoryDataMatrix();

}