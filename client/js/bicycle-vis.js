var categoryDataMatrix;
// var lawmode = 0;
// var dowmode = [1, 1];
// var statemode = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];

function init() {
	initTimeSlider(sampleOverviewTimesliderData);
	categoryDataMatrix = new CategoryDataMatrix("#data-matrix-container", null, "#data-matrix-xaxis-container", null, "#data-matrix-yaxis-container", null);
	initControl();
	multiLineG = new MultiLineGraph(sampleDataMultiLine, "#timeOfDay");
	multiLineG.initTimeOfDay();
	retrieveDataBasedOnFilters();
}

function retrieveDataBasedOnFilters() {
	$.ajax({
		type: 'post',
		url: 'php/update.php',
		cache: false,
		data: {
			result: JSON.stringify(buttonstatus)
		},
		success: function(data, status) {
			updateCategoryDataMatrixData();
		},
		error: function(xhr, desc, err) {
			console.log("error: " + xhr);
			console.log("Details: " + desc + "\nError:" + err);
		}
	}); // end ajax call
}

function updateCategoryDataMatrixData() {
	d3.json('php/cdmMain.php', function(error, data) {
		processedJsonObject = processCDMMainJSON(data);
		categoryDataMatrix.updateMain(processedJsonObject);
	});
	
	d3.json('php/cdmLocationAxis.php', function(error, data) {
		processedJsonObject = processCDMLocationAxisJSON(data);
		//categoryDataMatrix.updateXAxis_Location(processedJsonObject);
	});
}

function processCDMLocationAxisJSON(data) {
	//setup parent json object
	var parentJSONObject = {};
	parentJSONObject["data_group_id"] = 2;
	//create an array for storing weather category data
	parentJSONObject["category_data"] = [];
	locationCategoriesArray = parentJSONObject["category_data"];
	
	data.forEach(function(d) {
		var locationJsonObject = {};
		locationJsonObject["category_location"] = d.Location;
		locationJsonObject["num_of_fatalaties"] = d.Num_of_Fatalities;
		locationCategoriesArray.push(locationJsonObject);		
	});
	
	console.log(parentJSONObject);
}

function processCDMMainJSON(data) {
	//setup parent json object
	var parentJSONObject = {};
	parentJSONObject["data_group_id"] = 2;
	//create an array for storing weather category data
	parentJSONObject["category_data"] = [];
	weatherCategoriesArray = parentJSONObject["category_data"];
	//console.log(data);
	data.forEach(function(d) {
		filteredWeatherCategories = weatherCategoriesArray.filter(function(weatherCategoryObj) {
			return weatherCategoryObj["category_weather"] == d.Weather;
		});
		var selectedWeatherCategory;
		var locationsForAWeatherCategory;
		if (filteredWeatherCategories.length > 0) {
			//right now we can just select the first category that was filtered
			selectedWeatherCategory = filteredWeatherCategories[0];
			locationsForAWeatherCategory = selectedWeatherCategory["category_data"];
		} else {
			selectedWeatherCategory = {};
			selectedWeatherCategory["category_weather"] = d.Weather;
			//create an array to store the locations for each weather category
			selectedWeatherCategory["category_data"] = [];
			locationsForAWeatherCategory = selectedWeatherCategory["category_data"];
			//we might need to push this after we have set all the attributes
			weatherCategoriesArray.push(selectedWeatherCategory);
		}
		var jsonObjForLocationInCategory = {};
		jsonObjForLocationInCategory["category_location"] = d.Location;
		jsonObjForLocationInCategory["num_of_fatalities"] = d.Number_Of_Cases;
		locationsForAWeatherCategory.push(jsonObjForLocationInCategory);
	});
	return parentJSONObject;
	//console.log(parentJSONObject);
}

function updateClicked() {
	updateTimeSlider();
}
// Control //

function initControl() {
	// init control: check all except law mode
	d3.selectAll('.filter_button_dow').property('checked', true);
	d3.selectAll('.filter_button').property('checked', true);
	d3.selectAll('.filter_button2').property('checked', true);
	d3.select('#law_button').property('checked', false);
	// on change
	d3.selectAll(".filter_button").on("change", function() {
		if (this.id == 'law_button') {
			// this.checked ? lawmode = 1 : lawmode = 0;
			this.checked ? buttonstatus["law"] = 1 : buttonstatus["law"] = 0;
		} else if (this.id == 'state_all_button') {
			for (i = 0; i < statelist.length; i++) {
				d3.selectAll('#state_' + statelist[i] + '_button').property('checked', d3.select('#state_all_button').property('checked'));
				// this.checked ? statemode[i-1] = 1 : statemode[i-1] = 0;
				this.checked ? buttonstatus[statelist[i]] = 1 : buttonstatus[statelist[i]] = 0;
			}
		} else if (this.id == 'DOW_wd_button') {
			// this.checked ? dowmode[0] = 1 : dowmode[0] = 0;
			this.checked ? buttonstatus["weekdays"] = 1 : buttonstatus["weekdays"] = 0;
		} else if (this.id == 'DOW_we_button') {
			// this.checked ? dowmode[1] = 1 : dowmode[1] = 0;
			this.checked ? buttonstatus["weekends"] = 1 : buttonstatus["weekends"] = 0;
		} else if (this.id == 'state_avg_button') {
			// this.checked ? statemode[50] = 1 : statemode[50] = 0;
			this.checked ? buttonstatus["average"] = 1 : buttonstatus["average"] = 0;
		} else {
			if (d3.select('#state_all_button').property('checked') == true && this.checked == false) {
				d3.select('#state_all_button').property('checked', false);
			}
			var idx = parseInt(this.id.split('_')[1]) - 1;
			// this.checked ? statemode[idx] = 1 : statemode[idx] = 0;
			this.checked ? buttonstatus[idx] = 1 : buttonstatus[idx] = 0;
		}
		if (buttonstatus["weekdays"] == 0 && buttonstatus["weekends"] == 0) {
			console.log("Select day of week!!!!!!!!!!");
		}
		// if (eval(statemode.join('+')) == 0) {
		// 	console.log("Select states!!!!!!!!!!");
		// } 
		console.log(buttonstatus);
		retrieveDataBasedOnFilters();
	});
}
var statelist = [
1, 2, 4, 5, 6, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 44, 45, 46, 47, 48, 49, 50, 51, 53, 54, 55, 56];
var buttonstatus = {
	"start": 1,
	"end": 1,
	"law": 0,
	"weekdays": 1,
	"weekends": 1,
	"average": 1,
	"1": 1,
	"2": 1,
	"4": 1,
	"5": 1,
	"6": 1,
	"8": 1,
	"9": 1,
	"10": 1,
	"11": 1,
	"12": 1,
	"13": 1,
	"15": 1,
	"16": 1,
	"17": 1,
	"18": 1,
	"19": 1,
	"20": 1,
	"21": 1,
	"22": 1,
	"23": 1,
	"24": 1,
	"25": 1,
	"26": 1,
	"27": 1,
	"28": 1,
	"29": 1,
	"30": 1,
	"31": 1,
	"32": 1,
	"33": 1,
	"34": 1,
	"35": 1,
	"36": 1,
	"37": 1,
	"38": 1,
	"39": 1,
	"40": 1,
	"41": 1,
	"42": 1,
	"44": 1,
	"45": 1,
	"46": 1,
	"47": 1,
	"48": 1,
	"49": 1,
	"50": 1,
	"51": 1,
	"53": 1,
	"54": 1,
	"55": 1,
	"56": 1
};
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
		"num_of_fatalities": 48,
		"num_of_fatalities_law_allowed": 45,
		"num_of_fatalities_law_prohibited": 45
	}, {
		"category_weather": "sunny",
		"num_of_fatalities": 12,
		"num_of_fatalities_law_allowed": 45,
		"num_of_fatalities_law_prohibited": 45
	}, {
		"category_weather": "sunny",
		"num_of_fatalities": 12,
		"num_of_fatalities_law_allowed": 45,
		"num_of_fatalities_law_prohibited": 45
	}, {
		"category_weather": "sunny",
		"num_of_fatalities": 12,
		"num_of_fatalities_law_allowed": 45,
		"num_of_fatalities_law_prohibited": 45
	}, {
		"category_weather": "windy",
		"num_of_fatalities": 69,
		"num_of_fatalities_law_allowed": 45,
		"num_of_fatalities_law_prohibited": 45
	}, {
		"category_weather": "blowing snow",
		"num_of_fatalities": 60,
		"num_of_fatalities_law_allowed": 45,
		"num_of_fatalities_law_prohibited": 45
	}, {
		"category_weather": "thunder",
		"num_of_fatalities": 40,
		"num_of_fatalities_law_allowed": 45,
		"num_of_fatalities_law_prohibited": 45
	}, {
		"category_weather": "clear",
		"num_of_fatalities": 6,
		"num_of_fatalities_law_allowed": 45,
		"num_of_fatalities_law_prohibited": 45
	}, {
		"category_weather": "foggy",
		"num_of_fatalities": 63,
		"num_of_fatalities_law_allowed": 45,
		"num_of_fatalities_law_prohibited": 45
	}, {
		"category_weather": "hurricane",
		"num_of_fatalities": 92,
		"num_of_fatalities_law_allowed": 45,
		"num_of_fatalities_law_prohibited": 45
	}]
};
var sampleJsonDataForCDM_XAxis = {
	"data_group_id": 2,
	"category_data": [{
		"category_location": "sidewalk",
		"num_of_fatalities": 62,
		"num_of_fatalities_law_allowed": 45,
		"num_of_fatalities_law_prohibited": 45
	}, {
		"category_location": "crosswalk",
		"num_of_fatalities": 2,
		"num_of_fatalities_law_allowed": 45,
		"num_of_fatalities_law_prohibited": 45
	}, {
		"category_location": "road",
		"num_of_fatalities": 14,
		"num_of_fatalities_law_allowed": 45,
		"num_of_fatalities_law_prohibited": 45
	}, {
		"category_location": "building",
		"num_of_fatalities": 21,
		"num_of_fatalities_law_allowed": 45,
		"num_of_fatalities_law_prohibited": 45
	}, {
		"category_location": "intersection",
		"num_of_fatalities": 35,
		"num_of_fatalities_law_allowed": 45,
		"num_of_fatalities_law_prohibited": 45
	}, {
		"category_location": "middle lane",
		"num_of_fatalities": 4,
		"num_of_fatalities_law_allowed": 45,
		"num_of_fatalities_law_prohibited": 45
	}, {
		"category_location": "right lane",
		"num_of_fatalities": 13,
		"num_of_fatalities_law_allowed": 45,
		"num_of_fatalities_law_prohibited": 45
	}, {
		"category_location": "bicycle lane",
		"num_of_fatalities": 45,
		"num_of_fatalities_law_allowed": 45,
		"num_of_fatalities_law_prohibited": 45
	}]
};
var sampleJsonDataForCDM = {
	"data_group_id": 2,
	"category_data": [{
		"category_weather": "rainy",
		"category_data": [{
			"category_location": "sidewalk",
			"num_of_fatalities": 60,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "crosswalk",
			"num_of_fatalities": 50,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "road",
			"num_of_fatalities": 75,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "building",
			"num_of_fatalities": 83,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "intersection",
			"num_of_fatalities": 43,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "middle lane",
			"num_of_fatalities": 23,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "right lane",
			"num_of_fatalities": 41,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "bicycle lane",
			"num_of_fatalities": 68,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}]
	}, {
		"category_weather": "sunny",
		"category_data": [{
			"category_location": "sidewalk",
			"num_of_fatalities": 60,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "crosswalk",
			"num_of_fatalities": 15,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "road",
			"num_of_fatalities": 93,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "building",
			"num_of_fatalities": 3,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "intersection",
			"num_of_fatalities": 43,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "middle lane",
			"num_of_fatalities": 23,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "right lane",
			"num_of_fatalities": 41,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "bicycle lane",
			"num_of_fatalities": 18,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}]
	}, {
		"category_weather": "windy",
		"category_data": [{
			"category_location": "sidewalk",
			"num_of_fatalities": 40,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "crosswalk",
			"num_of_fatalities": 51,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "road",
			"num_of_fatalities": 35,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "building",
			"num_of_fatalities": 43,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "intersection",
			"num_of_fatalities": 13,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "middle lane",
			"num_of_fatalities": 73,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "right lane",
			"num_of_fatalities": 11,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "bicycle lane",
			"num_of_fatalities": 8,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}]
	}, {
		"category_weather": "blowing snow",
		"category_data": [{
			"category_location": "sidewalk",
			"num_of_fatalities": 67,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "crosswalk",
			"num_of_fatalities": 10,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "road",
			"num_of_fatalities": 75,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "building",
			"num_of_fatalities": 53,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "intersection",
			"num_of_fatalities": 43,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "middle lane",
			"num_of_fatalities": 3,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "right lane",
			"num_of_fatalities": 40,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "bicycle lane",
			"num_of_fatalities": 8,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}]
	}, {
		"category_weather": "thunder",
		"category_data": [{
			"category_location": "sidewalk",
			"num_of_fatalities": 60,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "crosswalk",
			"num_of_fatalities": 50,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "road",
			"num_of_fatalities": 75,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "building",
			"num_of_fatalities": 83,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "intersection",
			"num_of_fatalities": 43,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "middle lane",
			"num_of_fatalities": 23,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "right lane",
			"num_of_fatalities": 41,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "bicycle lane",
			"num_of_fatalities": 68,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}]
	}, {
		"category_weather": "clear",
		"category_data": [{
			"category_location": "sidewalk",
			"num_of_fatalities": 60,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "crosswalk",
			"num_of_fatalities": 50,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "road",
			"num_of_fatalities": 75,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "building",
			"num_of_fatalities": 83,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "intersection",
			"num_of_fatalities": 43,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "middle lane",
			"num_of_fatalities": 23,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "right lane",
			"num_of_fatalities": 41,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "bicycle lane",
			"num_of_fatalities": 68,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}]
	}, {
		"category_weather": "foggy",
		"category_data": [{
			"category_location": "sidewalk",
			"num_of_fatalities": 60,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "crosswalk",
			"num_of_fatalities": 50,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "road",
			"num_of_fatalities": 75,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "building",
			"num_of_fatalities": 83,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "intersection",
			"num_of_fatalities": 43,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "middle lane",
			"num_of_fatalities": 23,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "right lane",
			"num_of_fatalities": 41,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "bicycle lane",
			"num_of_fatalities": 68,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}]
	}, {
		"category_weather": "hurricane",
		"category_data": [{
			"category_location": "sidewalk",
			"num_of_fatalities": 60,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "crosswalk",
			"num_of_fatalities": 50,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "road",
			"num_of_fatalities": 75,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "building",
			"num_of_fatalities": 83,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "intersection",
			"num_of_fatalities": 43,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "middle lane",
			"num_of_fatalities": 23,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "right lane",
			"num_of_fatalities": 41,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "bicycle lane",
			"num_of_fatalities": 68,
			"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}]
	}]
};
var sampleDataMultiLine = {
	"weatherLocation": "rainy-street",
	"law_mode": 0,
	"us_average_data": {
		"category_state": "US Average",
		"time_category_data": [{
			"key": "0",
			"values": 30
		}, {
			"key": "1",
			"values": 100
		}, {
			"key": "2",
			"values": 165
		}, {
			"key": "3",
			"values": 120
		}, {
			"key": "4",
			"values": 150
		}, {
			"key": "5",
			"values": 100
		}, {
			"key": "6",
			"values": 75
		}, {
			"key": "7",
			"values": 20
		}]
	},
	"state_category_data": [{
		"category_state": "GA",
		"law_data": 'yes',
		"time_category_data": [{
			"key": "0",
			"values": 40
		}, {
			"key": "1",
			"values": 80
		}, {
			"key": "2",
			"values": 120
		}, {
			"key": "3",
			"values": 100
		}, {
			"key": "4",
			"values": 150
		}, {
			"key": "5",
			"values": 90
		}, {
			"key": "6",
			"values": 50
		}, {
			"key": "7",
			"values": 20
		}]
	}, {
		"category_state": "NY",
		"law_data": 'no',
		"time_category_data": [{
			"key": "0",
			"values": 20
		}, {
			"key": "1",
			"values": 60
		}, {
			"key": "2",
			"values": 150
		}, {
			"key": "3",
			"values": 115
		}, {
			"key": "4",
			"values": 200
		}, {
			"key": "5",
			"values": 120
		}, {
			"key": "6",
			"values": 75
		}, {
			"key": "7",
			"values": 40
		}]
	}]
};
