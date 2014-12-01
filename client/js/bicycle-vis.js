var categoryDataMatrix;

function init() {	
	categoryDataMatrix = new CategoryDataMatrix("#data-matrix-container", sampleJsonDataForCDM, "#data-matrix-xaxis-container", sampleJsonDataForCDM_XAxis, "#data-matrix-yaxis-container", sampleJsonDataForCDM_YAxis);
	
	initTimeSlider(sampleOverviewTimesliderData);
	initTimeOfDay();
	initFilter();
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

function initFilter() {
	
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