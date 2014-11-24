var dataMatrix;
var dataMatrixXAxis;
var dataMatrixYAxis;
var overviewTimeSlider;

function init() {
	randomData = generateRandomDataForCategoryDataMatrix(null, 8, 8, 1500, 300);
	dataMatrix = new CategoryDataMatrix("#data-matrix-container", sampleJsonDataForCDM, 300, 300, CategoryDataMatrix.Axis.AxisType_None);
	//dataMatrix.updateDataset(randomData);
	dataMatrix.initDataMatrix();
	
	randomDataForYAxis = generateRandomDataForCategoryDataMatrix(null, 8, 1, 1500, 300);
	dataMatrixYAxis = new CategoryDataMatrix("#data-matrix-yaxis-container", sampleJsonDataForCDM_YAxis, 37.5, 300, CategoryDataMatrix.Axis.AxisType_Y);
	//dataMatrix.updateDataset(randomDataForYAxis);
	dataMatrixYAxis.initDataMatrix();
	
	randomDataForXAxis = generateRandomDataForCategoryDataMatrix(null, 1, 8, 1500, 300);
	dataMatrixXAxis = new CategoryDataMatrix("#data-matrix-xaxis-container", sampleJsonDataForCDM_XAxis, 300, 37.5, CategoryDataMatrix.Axis.AxisType_X);
	//dataMatrix.updateDataset(randomDataForXAxis);
	dataMatrixXAxis.initDataMatrix();
	
	initTimeSlider(sampleOverviewTimesliderData);
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

var sampleOverviewTimesliderData = {
			"data_group_id": 1,
			"overview_data": [{
				"month_id": 0,
				"num_of_fatalities": 45
			}, {
				"month_id": 1,
				"num_of_fatalities": 45
			}, {
				"month_id": 2,
				"num_of_fatalities": 45
			}, {
				"month_id": 3,
				"num_of_fatalities": 45
			}, {
				"month_id": 4,
				"num_of_fatalities": 45
			}, {
				"month_id": 5,
				"num_of_fatalities": 45
			}, {
				"month_id": 6,
				"num_of_fatalities": 43
			}, {
				"month_id": 7,
				"num_of_fatalities": 42
			}, {
				"month_id": 8,
				"num_of_fatalities": 45
			}, {
				"month_id": 9,
				"num_of_fatalities": 45
			}, {
				"month_id": 10,
				"num_of_fatalities": 45
			}, {
				"month_id": 11,
				"num_of_fatalities": 40
			}]
		};
		
		
		var sampleJsonDataForCDM_YAxis = {
		"data_group_id": 2,
		"category_data": [{
			"category_weather": "rainy",
			"num_of_fatalities": 48
		}, {
			"category_weather": "sunny",
			"num_of_fatalities": 12
		}, {
			"category_weather": "windy",
			"num_of_fatalities": 69
		}, {
			"category_weather": "blowing snow",
			"num_of_fatalities": 60
		}, {
			"category_weather": "thunder",
			"num_of_fatalities": 40
		}, {
			"category_weather": "clear",
			"num_of_fatalities": 6
		}, {
			"category_weather": "foggy",
			"num_of_fatalities": 63
		}, {
			"category_weather": "hurricane",
			"num_of_fatalities": 92
		}]
	};
	
	var sampleJsonDataForCDM_XAxis = {
		"data_group_id": 2,
		"category_data": [{
			"category_location": "sidewalk",
			"num_of_fatalities": 62
		}, {
			"category_location": "crosswalk",
			"num_of_fatalities": 2
		}, {
			"category_location": "road",
			"num_of_fatalities": 14
		}, {
			"category_location": "building",
			"num_of_fatalities": 21
		}, {
			"category_location": "intersection",
			"num_of_fatalities": 35
		}, {
			"category_location": "middle lane",
			"num_of_fatalities": 4
		}, {
			"category_location": "right lane",
			"num_of_fatalities": 13
		}, {
			"category_location": "bicycle lane",
			"num_of_fatalities": 45
		}]
	};
	
	var sampleJsonDataForCDM = {
		"data_group_id": 2,
		"category_data": [{
			"category_weather": "rainy",
			"category_data": [{
				"category_location": "sidewalk",
				"num_of_fatalities": 60
			}, {
				"category_location": "crosswalk",
				"num_of_fatalities": 50
			}, {
				"category_location": "road",
				"num_of_fatalities": 75
			}, {
				"category_location": "building",
				"num_of_fatalities": 83
			}, {
				"category_location": "intersection",
				"num_of_fatalities": 43
			}, {
				"category_location": "middle lane",
				"num_of_fatalities": 23
			}, {
				"category_location": "right lane",
				"num_of_fatalities": 41
			}, {
				"category_location": "bicycle lane",
				"num_of_fatalities": 68
			}]
		}, {
			"category_weather": "sunny",
			"category_data": [{
				"category_location": "sidewalk",
				"num_of_fatalities": 60
			}, {
				"category_location": "crosswalk",
				"num_of_fatalities": 15
			}, {
				"category_location": "road",
				"num_of_fatalities": 93
			}, {
				"category_location": "building",
				"num_of_fatalities": 3
			}, {
				"category_location": "intersection",
				"num_of_fatalities": 43
			}, {
				"category_location": "middle lane",
				"num_of_fatalities": 23
			}, {
				"category_location": "right lane",
				"num_of_fatalities": 41
			}, {
				"category_location": "bicycle lane",
				"num_of_fatalities": 18
			}]
		}, {
			"category_weather": "windy",
			"category_data": [{
				"category_location": "sidewalk",
				"num_of_fatalities": 40
			}, {
				"category_location": "crosswalk",
				"num_of_fatalities": 51
			}, {
				"category_location": "road",
				"num_of_fatalities": 35
			}, {
				"category_location": "building",
				"num_of_fatalities": 43
			}, {
				"category_location": "intersection",
				"num_of_fatalities": 13
			}, {
				"category_location": "middle lane",
				"num_of_fatalities": 73
			}, {
				"category_location": "right lane",
				"num_of_fatalities": 11
			}, {
				"category_location": "bicycle lane",
				"num_of_fatalities": 8
			}]
		}, {
			"category_weather": "blowing snow",
			"category_data": [{
				"category_location": "sidewalk",
				"num_of_fatalities": 67
			}, {
				"category_location": "crosswalk",
				"num_of_fatalities": 10
			}, {
				"category_location": "road",
				"num_of_fatalities": 75
			}, {
				"category_location": "building",
				"num_of_fatalities": 53
			}, {
				"category_location": "intersection",
				"num_of_fatalities": 43
			}, {
				"category_location": "middle lane",
				"num_of_fatalities": 3
			}, {
				"category_location": "right lane",
				"num_of_fatalities": 40
			}, {
				"category_location": "bicycle lane",
				"num_of_fatalities": 8
			}]
		}, {
			"category_weather": "thunder",
			"category_data": [{
				"category_location": "sidewalk",
				"num_of_fatalities": 60
			}, {
				"category_location": "crosswalk",
				"num_of_fatalities": 50
			}, {
				"category_location": "road",
				"num_of_fatalities": 75
			}, {
				"category_location": "building",
				"num_of_fatalities": 83
			}, {
				"category_location": "intersection",
				"num_of_fatalities": 43
			}, {
				"category_location": "middle lane",
				"num_of_fatalities": 23
			}, {
				"category_location": "right lane",
				"num_of_fatalities": 41
			}, {
				"category_location": "bicycle lane",
				"num_of_fatalities": 68
			}]
		}, {
			"category_weather": "clear",
			"category_data": [{
				"category_location": "sidewalk",
				"num_of_fatalities": 60
			}, {
				"category_location": "crosswalk",
				"num_of_fatalities": 50
			}, {
				"category_location": "road",
				"num_of_fatalities": 75
			}, {
				"category_location": "building",
				"num_of_fatalities": 83
			}, {
				"category_location": "intersection",
				"num_of_fatalities": 43
			}, {
				"category_location": "middle lane",
				"num_of_fatalities": 23
			}, {
				"category_location": "right lane",
				"num_of_fatalities": 41
			}, {
				"category_location": "bicycle lane",
				"num_of_fatalities": 68
			}]
		}, {
			"category_weather": "foggy",
			"category_data": [{
				"category_location": "sidewalk",
				"num_of_fatalities": 60
			}, {
				"category_location": "crosswalk",
				"num_of_fatalities": 50
			}, {
				"category_location": "road",
				"num_of_fatalities": 75
			}, {
				"category_location": "building",
				"num_of_fatalities": 83
			}, {
				"category_location": "intersection",
				"num_of_fatalities": 43
			}, {
				"category_location": "middle lane",
				"num_of_fatalities": 23
			}, {
				"category_location": "right lane",
				"num_of_fatalities": 41
			}, {
				"category_location": "bicycle lane",
				"num_of_fatalities": 68
			}]
		}, {
			"category_weather": "hurricane",
			"category_data": [{
				"category_location": "sidewalk",
				"num_of_fatalities": 60
			}, {
				"category_location": "crosswalk",
				"num_of_fatalities": 50
			}, {
				"category_location": "road",
				"num_of_fatalities": 75
			}, {
				"category_location": "building",
				"num_of_fatalities": 83
			}, {
				"category_location": "intersection",
				"num_of_fatalities": 43
			}, {
				"category_location": "middle lane",
				"num_of_fatalities": 23
			}, {
				"category_location": "right lane",
				"num_of_fatalities": 41
			}, {
				"category_location": "bicycle lane",
				"num_of_fatalities": 68
			}]
		}]
		};