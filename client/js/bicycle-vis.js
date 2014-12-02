var categoryDataMatrix;
var lawmode = 0;
var dowmode = [1, 1];
var statemode = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];

function init() {	
	categoryDataMatrix = new CategoryDataMatrix("#data-matrix-container", sampleJsonDataForCDM, "#data-matrix-xaxis-container", sampleJsonDataForCDM_XAxis, "#data-matrix-yaxis-container", sampleJsonDataForCDM_YAxis);
	
	initTimeSlider(sampleOverviewTimesliderData);
	initTimeOfDay();
	initControl();
	d3.json("php/data2.php", function(error, data) {
		processJSON(data);
		
    });
}

function processJSON(data) {

	//setup parent json object
	var parentJSONObject = {};
	parentJSONObject["data_group_id"] = 2;
	
	//create an array for storing weather category data
	parentJSONObject["category_data"] = [];
	weatherCategoriesArray = parentJSONObject["category_data"];
	console.log(data);
	data.forEach(function(d) {
	
		filteredWeatherCategories = weatherCategoriesArray.filter(function (weatherCategoryObj) {
			return weatherCategoryObj["category_weather"] == d.Weather;
			});
		
		var selectedWeatherCategory;
		var locationsForAWeatherCategory;
		
		if(filteredWeatherCategories.length > 0)
		{
			//right now we can just select the first category that was filtered
			selectedWeatherCategory = filteredWeatherCategories[0];
			locationsForAWeatherCategory = selectedWeatherCategory["category_data"];
		}
		else
		{
			selectedWeatherCategory = { };
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
	
	//console.log(parentJSONObject);
}


function updateClicked() {
	//generateRandomDataForCategoryDataMatrix(dataMatrix.getDataset(), 8, 8, 1500, 300);
	dataMatrix.updateHeatchart();
	
	//xAxisNewDataset = generateRandomDataForCategoryDataMatrix(dataMatrixXAxis.getDataset(), 1, 8, 37.5, 300);
	dataMatrixXAxis.updateHeatchart();
	
	//yAxisNewDataset = generateRandomDataForCategoryDataMatrix(dataMatrixYAxis.getDataset(), 8, 1, 37.5, 300);
	dataMatrixYAxis.updateHeatchart();
	
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
		if (this.id=='law_button') {
			this.checked ? lawmode = 1 : lawmode = 0;
		} else if (this.id=='DOW_all_button') {
			d3.select('#DOW_wd_button').property('checked', d3.select('#DOW_all_button').property('checked'));
			d3.select('#DOW_we_button').property('checked', d3.select('#DOW_all_button').property('checked'));
			this.checked ? dowmode = [1, 1] : dowmode = [1, 1];
		} else if (this.id=='state_all_button') {
			for (i = 1; i < 51; i++) { 
				d3.selectAll('#state_'+i+'_button').property('checked', d3.select('#state_all_button').property('checked'));
				this.checked ? statemode[i-1] = 1 : statemode[i-1] = 0;
			}
		} else if (this.id=='DOW_wd_button') {
			// if (d3.select('#DOW_all_button').property('checked') == true && this.checked == false) {
			// 	d3.select('#DOW_all_button').property('checked', false);
			// }
			this.checked ? dowmode[0] = 1 : dowmode[0] = 0;
		} else if (this.id=='DOW_we_button') {
			this.checked ? dowmode[1] = 1 : dowmode[1] = 0;
		} else if (this.id=='state_avg_button') {
			this.checked ? statemode[50] = 1 : statemode[50] = 0;
		} else {
			if (d3.select('#state_all_button').property('checked') == true && this.checked == false) {
				d3.select('#state_all_button').property('checked', false);
			}
			var idx = parseInt(this.id.split('_')[1])-1;
			this.checked ? statemode[idx] = 1 : statemode[idx] = 0;
		}

		if (dowmode[0]+dowmode[1] == 0) {
			console.log("Select day of week!!!!!!!!!!");
		} 
		if (eval(statemode.join('+')) == 0) {
			console.log("Select states!!!!!!!!!!");
		} 
		console.log(dowmode);
		console.log(lawmode);
		console.log(statemode);

		call_update();
	});
}
function call_update() {
	console.log('update update update\n');
}


var stateList = [
    {
        "name": "Alabama",
        "abbreviation": "AL"
    },
    {
        "name": "Alaska",
        "abbreviation": "AK"
    },
    {
        "name": "American Samoa",
        "abbreviation": "AS"
    },
    {
        "name": "Arizona",
        "abbreviation": "AZ"
    },
    {
        "name": "Arkansas",
        "abbreviation": "AR"
    },
    {
        "name": "California",
        "abbreviation": "CA"
    },
    {
        "name": "Colorado",
        "abbreviation": "CO"
    },
    {
        "name": "Connecticut",
        "abbreviation": "CT"
    },
    {
        "name": "Delaware",
        "abbreviation": "DE"
    },
    {
        "name": "District Of Columbia",
        "abbreviation": "DC"
    },
    {
        "name": "Federated States Of Micronesia",
        "abbreviation": "FM"
    },
    {
        "name": "Florida",
        "abbreviation": "FL"
    },
    {
        "name": "Georgia",
        "abbreviation": "GA"
    },
    {
        "name": "Guam",
        "abbreviation": "GU"
    },
    {
        "name": "Hawaii",
        "abbreviation": "HI"
    },
    {
        "name": "Idaho",
        "abbreviation": "ID"
    },
    {
        "name": "Illinois",
        "abbreviation": "IL"
    },
    {
        "name": "Indiana",
        "abbreviation": "IN"
    },
    {
        "name": "Iowa",
        "abbreviation": "IA"
    },
    {
        "name": "Kansas",
        "abbreviation": "KS"
    },
    {
        "name": "Kentucky",
        "abbreviation": "KY"
    },
    {
        "name": "Louisiana",
        "abbreviation": "LA"
    },
    {
        "name": "Maine",
        "abbreviation": "ME"
    },
    {
        "name": "Marshall Islands",
        "abbreviation": "MH"
    },
    {
        "name": "Maryland",
        "abbreviation": "MD"
    },
    {
        "name": "Massachusetts",
        "abbreviation": "MA"
    },
    {
        "name": "Michigan",
        "abbreviation": "MI"
    },
    {
        "name": "Minnesota",
        "abbreviation": "MN"
    },
    {
        "name": "Mississippi",
        "abbreviation": "MS"
    },
    {
        "name": "Missouri",
        "abbreviation": "MO"
    },
    {
        "name": "Montana",
        "abbreviation": "MT"
    },
    {
        "name": "Nebraska",
        "abbreviation": "NE"
    },
    {
        "name": "Nevada",
        "abbreviation": "NV"
    },
    {
        "name": "New Hampshire",
        "abbreviation": "NH"
    },
    {
        "name": "New Jersey",
        "abbreviation": "NJ"
    },
    {
        "name": "New Mexico",
        "abbreviation": "NM"
    },
    {
        "name": "New York",
        "abbreviation": "NY"
    },
    {
        "name": "North Carolina",
        "abbreviation": "NC"
    },
    {
        "name": "North Dakota",
        "abbreviation": "ND"
    },
    {
        "name": "Northern Mariana Islands",
        "abbreviation": "MP"
    },
    {
        "name": "Ohio",
        "abbreviation": "OH"
    },
    {
        "name": "Oklahoma",
        "abbreviation": "OK"
    },
    {
        "name": "Oregon",
        "abbreviation": "OR"
    },
    {
        "name": "Palau",
        "abbreviation": "PW"
    },
    {
        "name": "Pennsylvania",
        "abbreviation": "PA"
    },
    {
        "name": "Puerto Rico",
        "abbreviation": "PR"
    },
    {
        "name": "Rhode Island",
        "abbreviation": "RI"
    },
    {
        "name": "South Carolina",
        "abbreviation": "SC"
    },
    {
        "name": "South Dakota",
        "abbreviation": "SD"
    },
    {
        "name": "Tennessee",
        "abbreviation": "TN"
    },
    {
        "name": "Texas",
        "abbreviation": "TX"
    },
    {
        "name": "Utah",
        "abbreviation": "UT"
    },
    {
        "name": "Vermont",
        "abbreviation": "VT"
    },
    {
        "name": "Virgin Islands",
        "abbreviation": "VI"
    },
    {
        "name": "Virginia",
        "abbreviation": "VA"
    },
    {
        "name": "Washington",
        "abbreviation": "WA"
    },
    {
        "name": "West Virginia",
        "abbreviation": "WV"
    },
    {
        "name": "Wisconsin",
        "abbreviation": "WI"
    },
    {
        "name": "Wyoming",
        "abbreviation": "WY"
    }
];

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
			,"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_weather": "sunny",
			"num_of_fatalities": 12
			,"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_weather": "windy",
			"num_of_fatalities": 69
			,"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_weather": "blowing snow",
			"num_of_fatalities": 60
			,"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_weather": "thunder",
			"num_of_fatalities": 40
			,"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_weather": "clear",
			"num_of_fatalities": 6
			,"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_weather": "foggy",
			"num_of_fatalities": 63
			,"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_weather": "hurricane",
			"num_of_fatalities": 92
			,"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}]
	};
	
	var sampleJsonDataForCDM_XAxis = {
		"data_group_id": 2,
		"category_data": [{
			"category_location": "sidewalk",
			"num_of_fatalities": 62
			,"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "crosswalk",
			"num_of_fatalities": 2
			,"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "road",
			"num_of_fatalities": 14
			,"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "building",
			"num_of_fatalities": 21
			,"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "intersection",
			"num_of_fatalities": 35
			,"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "middle lane",
			"num_of_fatalities": 4
			,"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "right lane",
			"num_of_fatalities": 13
			,"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}, {
			"category_location": "bicycle lane",
			"num_of_fatalities": 45
			,"num_of_fatalities_law_allowed": 45,
			"num_of_fatalities_law_prohibited": 45
		}]
	};
	
	var sampleJsonDataForCDM = {
		"data_group_id": 2,
		"category_data": [{
			"category_weather": "rainy",
			"category_data": [{
				"category_location": "sidewalk",
				"num_of_fatalities": 60
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "crosswalk",
				"num_of_fatalities": 50
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "road",
				"num_of_fatalities": 75
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "building",
				"num_of_fatalities": 83
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "intersection",
				"num_of_fatalities": 43
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "middle lane",
				"num_of_fatalities": 23
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "right lane",
				"num_of_fatalities": 41
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "bicycle lane",
				"num_of_fatalities": 68
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}]
		}, {
			"category_weather": "sunny",
			"category_data": [{
				"category_location": "sidewalk",
				"num_of_fatalities": 60
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "crosswalk",
				"num_of_fatalities": 15
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "road",
				"num_of_fatalities": 93
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "building",
				"num_of_fatalities": 3
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "intersection",
				"num_of_fatalities": 43
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "middle lane",
				"num_of_fatalities": 23
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "right lane",
				"num_of_fatalities": 41
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "bicycle lane",
				"num_of_fatalities": 18
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}]
		}, {
			"category_weather": "windy",
			"category_data": [{
				"category_location": "sidewalk",
				"num_of_fatalities": 40
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "crosswalk",
				"num_of_fatalities": 51
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "road",
				"num_of_fatalities": 35
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "building",
				"num_of_fatalities": 43
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "intersection",
				"num_of_fatalities": 13
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "middle lane",
				"num_of_fatalities": 73
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "right lane",
				"num_of_fatalities": 11
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "bicycle lane",
				"num_of_fatalities": 8
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}]
		}, {
			"category_weather": "blowing snow",
			"category_data": [{
				"category_location": "sidewalk",
				"num_of_fatalities": 67
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "crosswalk",
				"num_of_fatalities": 10
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "road",
				"num_of_fatalities": 75
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "building",
				"num_of_fatalities": 53
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "intersection",
				"num_of_fatalities": 43
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "middle lane",
				"num_of_fatalities": 3
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "right lane",
				"num_of_fatalities": 40
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "bicycle lane",
				"num_of_fatalities": 8
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}]
		}, {
			"category_weather": "thunder",
			"category_data": [{
				"category_location": "sidewalk",
				"num_of_fatalities": 60
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "crosswalk",
				"num_of_fatalities": 50
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "road",
				"num_of_fatalities": 75
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "building",
				"num_of_fatalities": 83
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "intersection",
				"num_of_fatalities": 43
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "middle lane",
				"num_of_fatalities": 23
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "right lane",
				"num_of_fatalities": 41
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "bicycle lane",
				"num_of_fatalities": 68
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}]
		}, {
			"category_weather": "clear",
			"category_data": [{
				"category_location": "sidewalk",
				"num_of_fatalities": 60
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "crosswalk",
				"num_of_fatalities": 50
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "road",
				"num_of_fatalities": 75
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "building",
				"num_of_fatalities": 83
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "intersection",
				"num_of_fatalities": 43
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "middle lane",
				"num_of_fatalities": 23
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "right lane",
				"num_of_fatalities": 41
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "bicycle lane",
				"num_of_fatalities": 68
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}]
		}, {
			"category_weather": "foggy",
			"category_data": [{
				"category_location": "sidewalk",
				"num_of_fatalities": 60
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "crosswalk",
				"num_of_fatalities": 50
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "road",
				"num_of_fatalities": 75
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "building",
				"num_of_fatalities": 83
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "intersection",
				"num_of_fatalities": 43
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "middle lane",
				"num_of_fatalities": 23
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "right lane",
				"num_of_fatalities": 41
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "bicycle lane",
				"num_of_fatalities": 68
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}]
		}, {
			"category_weather": "hurricane",
			"category_data": [{
				"category_location": "sidewalk",
				"num_of_fatalities": 60
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "crosswalk",
				"num_of_fatalities": 50
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "road",
				"num_of_fatalities": 75
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "building",
				"num_of_fatalities": 83
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "intersection",
				"num_of_fatalities": 43
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "middle lane",
				"num_of_fatalities": 23
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "right lane",
				"num_of_fatalities": 41
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}, {
				"category_location": "bicycle lane",
				"num_of_fatalities": 68
				,"num_of_fatalities_law_allowed": 45,
				"num_of_fatalities_law_prohibited": 45
			}]
		}]
		};