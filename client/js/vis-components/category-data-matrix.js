function CategoryDataMatrix(mainElementName, mainJsonData, xAxisElementName, xAxisJsonData, yAxisElementName, yAxisJsonData) {
	var dataMatrix_Main;
	var dataMatrix_XAxis;
	var dataMatrix_YAxis;
	var selectedCells_Main;
	var selectedCells_XAxis;
	var selectedCells_YAxis;
	
	this.initCategoryDataMatrix = function() {
		selectedCells_Main = createDefaultSelectedCells(8, 8);
		selectedCells_XAxis = createDefaultSelectedCells(1, 8);
		selectedCells_YAxis = createDefaultSelectedCells(8, 1);
		//console.log("OMT: " + selectedCells_Main);
		
		//var jsonDataForMainMatrix = mainJsonData;
		if(mainJsonData == null)
		{
			mainJsonData = createMainDummyData(10, 15);
		}
		
		if(xAxisJsonData == null)
		{
			xAxisJsonData = createXAxisDummyData(15);
		}
		
		if(yAxisJsonData == null)
		{
			yAxisJsonData = createYAxisDummyData(10);
		}
		
		dataMatrix_Main = new HeatchartMatrix(mainElementName, mainJsonData, 300, 300, HeatchartMatrix.Axis.AxisType_None, this.cellSelectedCallback);
		dataMatrix_Main.initDataMatrix();
		dataMatrix_XAxis = new HeatchartMatrix(xAxisElementName, xAxisJsonData, 300, 37.5, HeatchartMatrix.Axis.AxisType_X, this.cellSelectedCallback);
		dataMatrix_XAxis.initDataMatrix();
		dataMatrix_YAxis = new HeatchartMatrix(yAxisElementName, yAxisJsonData, 37.5, 300, HeatchartMatrix.Axis.AxisType_Y, this.cellSelectedCallback);
		dataMatrix_YAxis.initDataMatrix();
		
		
	}
/*
	===========================================
				SELECTED CELLS
	===========================================
	*/
	this.cellSelectedCallback = function(axisType, cellElement, data) {
		if (axisType == HeatchartMatrix.Axis.AxisType_None) {
			//cell selection for main heatchart matrix
			toggleCellSelection(dataMatrix_Main, selectedCells_Main, cellElement, data);
		} else if (axisType == HeatchartMatrix.Axis.AxisType_X) {
			//cell selection for x axis heatchart matrix
			toggleCellSelection(dataMatrix_XAxis, selectedCells_XAxis, cellElement, data);
		
			//if the cell is selected, then select the whole column
		/*
	if (selectedCells_XAxis[data.row][data.col] == true) {
				for (row = 0; row < selectedCells_Main.length; row++) {
					dataMatrix_Main.selectCellInMatrix(row, data.col);
				}
			} else {
				for (row = 0; row < selectedCells_Main.length; row++) {
					dataMatrix_Main.unselectCellInMatrix(row, data.col);
				}
			}
*/
		} else if (axisType == HeatchartMatrix.Axis.AxisType_Y) {
			//cell selection for y axis heatchart matrix
			toggleCellSelection(dataMatrix_YAxis, selectedCells_YAxis, cellElement, data);
			//if the cell is selected, then select the whole row
	/*
		if (selectedCells_YAxis[data.row][data.col] == true) {
				for (col = 0; col < selectedCells_Main[0].length; col++) {
					dataMatrix_Main.selectCellInMatrix(data.row, col);
				}
			} else {
				for (col = 0; col < selectedCells_Main[0].length; col++) {
					console.log(col);
					dataMatrix_Main.unselectCellInMatrix(data.row, col);
				}
			}
*/
		}
	}
	var toggleCellSelection = function(dataMatrix, selectedCells, cell, data) {
			//console.log(selectedCells);
			if (selectedCells[data.row][data.col] == false) {
				dataMatrix.selectCellWithCellData(cell, data);
				selectedCells[data.row][data.col] = true;
			} else {
				dataMatrix.unselectCellWithCellData(cell, data);
				selectedCells[data.row][data.col] = false;
			}
		}
	var createDefaultSelectedCells = function(numRows, numCols) {
			selectedCells = new Array(numRows);
			for (i = 0; i < numRows; i++) {
				selectedCells[i] = new Array(numCols);
				for (j = 0; j < numCols; j++) {
					selectedCells[i][j] = false;
				}
			}
			return selectedCells;
		}
		
	this.updateMain = function(newData){
		//console.log(newData);
		dataMatrix_Main.updateDataset(newData);
		dataMatrix_Main.updateHeatchart();
		
	}
	
	var createYAxisDummyData = function(numOfWeatherCategories){
		var parentJSONObject = {};
		parentJSONObject["data_group_id"] = 2;
		//create an array for storing weather category data
		parentJSONObject["category_data"] = [];
		weatherCategoriesArray = parentJSONObject["category_data"];
		
		for(weatherCategoryCount = 0; weatherCategoryCount < numOfWeatherCategories; weatherCategoryCount++)
		{
			var weatherCategoryJsonObject = {};
			weatherCategoryJsonObject["num_of_fatalities"] = 0;
			weatherCategoryJsonObject["num_of_fatalities_law_allowed"] = 0;
			weatherCategoryJsonObject["num_of_fatalities_law_prohibited"] = 0;
			weatherCategoryJsonObject["category_weather"] = "loading"+weatherCategoryCount;
			weatherCategoriesArray.push(weatherCategoryJsonObject);	
		}
		
		return parentJSONObject;
	}
	
	var createXAxisDummyData = function(numOfLocationCategories){
		var parentJSONObject = {};
		parentJSONObject["data_group_id"] = 2;
		//create an array for storing weather category data
		parentJSONObject["category_data"] = [];
		locationCategoriesArray = parentJSONObject["category_data"];
		
		for(locationCategoryCount = 0; locationCategoryCount < numOfLocationCategories; locationCategoryCount++)
		{
			var locationCategoryJsonObject = {};
			locationCategoryJsonObject["num_of_fatalities"] = 0;
			locationCategoryJsonObject["num_of_fatalities_law_allowed"] = 0;
			locationCategoryJsonObject["num_of_fatalities_law_prohibited"] = 0;
			locationCategoryJsonObject["category_location"] = "loading"+locationCategoryCount;
			locationCategoriesArray.push(locationCategoryJsonObject);	
		}
		
		return parentJSONObject;
	}
	
	
	var createMainDummyData = function(numOfWeatherCategories, numOfLocationCategories){
	
		var parentJSONObject = {};
		parentJSONObject["data_group_id"] = 2;
		//create an array for storing weather category data
		parentJSONObject["category_data"] = [];
		weatherCategoriesArray = parentJSONObject["category_data"];
	
		for(weatherCategoryCount = 0; weatherCategoryCount < numOfWeatherCategories; weatherCategoryCount++)
		{
			var weatherCategoryJsonObject = {};
			weatherCategoryJsonObject["category_weather"] = "loading";
			
			weatherCategoryJsonObject["category_data"] = [];			
			locationCategoriesArray = weatherCategoryJsonObject["category_data"];
			
			for(locationCategoryCount = 0; locationCategoryCount < numOfLocationCategories; locationCategoryCount++)
			{
				var locationCategoryJsonObject = {};
				locationCategoryJsonObject["num_of_fatalities"] = 0;
				locationCategoryJsonObject["num_of_fatalities_law_allowed"] = 0;
				locationCategoryJsonObject["num_of_fatalities_law_prohibited"] = 0;
				locationCategoryJsonObject["category_location"] = "loading";
				locationCategoriesArray.push(locationCategoryJsonObject);
			}
			
			weatherCategoriesArray.push(weatherCategoryJsonObject);
		}
		
		//console.log(parentJSONObject);
		return parentJSONObject;
	}
	
	this.initCategoryDataMatrix();
}

