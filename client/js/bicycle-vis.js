var categoryDataMatrix;
var loadingIconCount = 0;
var selectedLineGraphIDArray = [];

var multiLineG;

// var lawmode = 0;
// var dowmode = [1, 1];
var statemode = [0,0,0,0,0,
				 0,0,0,0,0,
				 0,0,0,0,0,
				 0,0,0,0,0,
				 0,0,0,0,0,
				 0,0,0,0,0,
				 0,0,0,0,0,
				 0,0,0,0,0,
				 0,0,0,0,0,
				 0,0,0,0,0,
				 0,0,0,0,0,0,0];


function init() {
	initializeTimeSlider();
	categoryDataMatrix = new CategoryDataMatrix("#data-matrix-container", null, "#data-matrix-xaxis-container", null, "#data-matrix-yaxis-container", null, categoriesSelectedCallback);
	initControl();
	timeBucketGroupings(testDataMultiLine);
	retrieveDataBasedOnFilters();
}

function displayLoadingIcon()
{
	if(loadingIconCount == 0)
	{
		$("#loading-icon-div").visible();
	}
	loadingIconCount++;	
}

function hideLoadingIcon()
{
	loadingIconCount--;	
	if(loadingIconCount == 0)
	{
		$("#loading-icon-div").invisible();
	}
}

function replaceAllTimeSliders() {	
	for(i = 0; i<selectedLineGraphIDArray.length; i++)
	{
		var divName = generateMultiLineGraphDivName(selectedLineGraphIDArray[i]["weatherCategoryName"], selectedLineGraphIDArray[i]["locationCategoryName"]);
		jQuery('<div/>', {
			id: divName,
		}).appendTo('#multiLineTimeOfDay');
		
		retrieveDataOnCDMSelection(selectedLineGraphIDArray[i]["weatherCategoryName"], selectedLineGraphIDArray[i]["locationCategoryName"], divName);
	}	
}

function retrieveDataOnCDMSelection(weather, location, divName){
	
	displayLoadingIcon();
	
	var cat_clicked = {"weather":weather, "location":location, "buttonstatus":buttonstatus};
	$.ajax({
		type: 'post',
		url: 'php/cdmCellClickUpdate.php',
		cache: false,
		data: {
			result: JSON.stringify(cat_clicked)
		},
		success: function(data, status) {
			d3.json('php/lineGraphData.php', function(error, data) {
				retrieveUSAverageDataOnCDMSelection(data, weather, location, divName);
				hideLoadingIcon();
			});
		},
		error: function(xhr, desc, err) {
			console.log("error: " + xhr);
			console.log("Details: " + desc + "\nError:" + err);
			hideLoadingIcon();
		}
	}); // end ajax call
}

function retrieveUSAverageDataOnCDMSelection(stateData, weather, location, divName)
{
	displayLoadingIcon();
	var cat_clicked = {"weather":weather, "location":location, "buttonstatus":buttonstatus};
	$.ajax({
		type: 'post',
		url: 'php/getAverage.php',
		cache: false,
		data: {
			result: JSON.stringify(cat_clicked)
		},
		success: function(usAverageData, status) {
			//console.log(stateData);
			processedMultiLineData = processMultiLineJSONData(stateData, usAverageData, weather, location);
				console.log(usAverageData);
				multiLineG = new MultiLineGraph(processedMultiLineData, "#"+divName);
				multiLineG.initTimeOfDay();
			hideLoadingIcon();
		},
		error: function(xhr, desc, err) {
			console.log("error: " + xhr);
			console.log("Details: " + desc + "\nError:" + err);
			hideLoadingIcon();
		}
	}); // end ajax call
}

var removeAllLineGraphs = function()
{
	
		$("#multiLineTimeOfDay").empty();
		selectedLineGraphIDArray = [];
		
	categoryDataMatrix.deselectAllElements();
}

function retrieveDataBasedOnFilters() {

	$("#multiLineTimeOfDay").empty();
	removeAllLineGraphs();
	
	displayLoadingIcon();	
	// console.log(buttonstatus);
	
	$.ajax({
		type: 'post',
		url: 'php/update.php',
		cache: false,
		data: {
			result: JSON.stringify(buttonstatus)
		},
		success: function(data, status) {
			updateCategoryDataMatrixData();
			if (eval(statemode.join('+')) != 0) {
		replaceAllTimeSliders();
		} 
			
			hideLoadingIcon();
		},
		error: function(xhr, desc, err) {
			console.log("error: " + xhr);
			console.log("Details: " + desc + "\nError:" + err);
			hideLoadingIcon();
		}
	}); // end ajax call
	

}
//**************************FOR TIME SLIDER************************************

function initializeTimeSlider(){
	d3.json('php/overviewData.php', function(error, data) {
		processedJsonObject = processOverviewJSON(data);
		initTimeSlider(processedJsonObject);
	});
}

/* function updateTimeSlider(){
	d3.json('php/overviewData.php', function(error, data) {
		processedJsonObject = processOverviewJSON(data);
		console.log(processedJsonObject);
		//initTimeSlider(processedJsonObject);
	});
} */

function processOverviewJSON(data){
	var timeJSONObject = {};
	timeJSONObject["data_group_id"] = 1;
	//"month_id": 7,"num_of_fatalities": 42
	timeJSONObject["overview_data"] = [];
	sampleOverviewTimesliderData = timeJSONObject["overview_data"];
	
	data.forEach(function(d) {
		var tempJsonObject = {};
		// console.log(d.month_id);
		tempJsonObject["month_id"] = d.month_id-1;
		tempJsonObject["num_of_fatalities"] = d.num_of_fatalities;
		sampleOverviewTimesliderData.push(tempJsonObject);		
	});
	//console.log(timeJSONObject);
	return timeJSONObject;
	
}
//**************************FOR TIME SLIDER************************************

function updateCategoryDataMatrixData() {
	displayLoadingIcon();
	d3.json('php/cdmMain.php', function(mainError, mainData) {
		d3.json('php/cdmLocationAxis.php', function(LocationAxisError, locationAxisData) {
			
			
			processedJsonObjectForLocationAxis = processCDMLocationAxisJSON(locationAxisData);
			//console.log(processedJsonObjectForLocationAxis);
			categoryDataMatrix.updateXAxis_Location(processedJsonObjectForLocationAxis);
			
			
			processedJsonObjectForMain = processCDMMainJSON(mainData);
			categoryDataMatrix.updateMain(processedJsonObjectForMain);
			
			processedJsonObjectForXAxis = processCDMWeatherAxisBasedOnMainJSON(processedJsonObjectForMain);
			categoryDataMatrix.updateYAxis_Weather(processedJsonObjectForXAxis);
			hideLoadingIcon();
		});
	});
	
	
	
/*
	d3.json('php/cdmWeatherAxis.php', function(error, data) {
		processedJsonObject = processCDMWeatherAxisJSON(data);
		categoryDataMatrix.updateYAxis_Weather(processedJsonObject);
	});
*/
}

//this processes weather axis data based on the PROCESSED main json data
function processCDMWeatherAxisBasedOnMainJSON(data) {
	//setup parent json object
	var parentJSONObject = {};
	parentJSONObject["data_group_id"] = 2;
	//create an array for storing weather category data
	parentJSONObject["category_data"] = [];
	weatherCategoriesArray = parentJSONObject["category_data"];
	
	mainJsonWeatherArray = data["category_data"];
	for(i = 0; i<mainJsonWeatherArray.length; i++)
	{
		mainJsonLocationsArray = mainJsonWeatherArray[i]["category_data"];
		//sum of fatalities across all locations
		var sumOfFatalities = 0;
		for(j = 0; j<mainJsonLocationsArray.length; j++)
		{
			sumOfFatalities+=parseInt(mainJsonLocationsArray[j]["num_of_fatalities"]);
		}
		
		var weatherJsonObject = {};
		weatherJsonObject["category_weather"] = mainJsonWeatherArray[i]["category_weather"];
		weatherJsonObject["num_of_fatalities"] = sumOfFatalities;
		weatherCategoriesArray.push(weatherJsonObject);		
	}
	return parentJSONObject;
}

//currently this is not being used, see this function: processCDMWeatherAxisBasedOnMainJSON
function processCDMWeatherAxisJSON(data) {
	//setup parent json object
	var parentJSONObject = {};
	parentJSONObject["data_group_id"] = 2;
	//create an array for storing weather category data
	parentJSONObject["category_data"] = [];
	weatherCategoriesArray = parentJSONObject["category_data"];
	
	data.forEach(function(d) {
		var weatherJsonObject = {};
		weatherJsonObject["category_weather"] = d.Weather;
		weatherJsonObject["num_of_fatalities"] = d.Num_of_Fatalities;
		weatherCategoriesArray.push(weatherJsonObject);		
	});
	//console.log(parentJSONObject);
	return parentJSONObject;
}

function processCDMLocationAxisJSON(dataFromServer) {
	var data = [];
	if(data.length != 15)
	{
		for(i = 0; i<xAxisCategoryNameArray.length; i++)
		{
			filteredData = dataFromServer.filter(function(dataObj) {
				return dataObj["Location"] == xAxisCategoryNameArray[i];
			});
			
			if(filteredData.length > 0)
			{
				data.push(filteredData[0]);
			}
			else
			{
				var dataJsonObj = {"Location":xAxisCategoryNameArray[i], "Num_of_Fatalities":0};
				data.push(dataJsonObj);
			}
		}
	}
	//setup parent json object
	var parentJSONObject = {};
	parentJSONObject["data_group_id"] = 2;
	//create an array for storing weather category data
	parentJSONObject["category_data"] = [];
	locationCategoriesArray = parentJSONObject["category_data"];
	
	data.forEach(function(d) {
		var locationJsonObject = {};
		locationJsonObject["category_location"] = d.Location;
		locationJsonObject["num_of_fatalities"] = d.Num_of_Fatalities;
		locationCategoriesArray.push(locationJsonObject);		
	});
	
	return parentJSONObject;
}

function processCDMMainJSON(data) {
	//setup parent json object
	var parentJSONObject = {};
	parentJSONObject["data_group_id"] = 2;
	//create an array for storing weather category data
	parentJSONObject["category_data"] = [];
	weatherCategoriesArray = parentJSONObject["category_data"];
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
		jsonObjForLocationInCategory["category_weather"] = d.Weather;
		jsonObjForLocationInCategory["num_of_fatalities"] = d.Number_Of_Cases;
		locationsForAWeatherCategory.push(jsonObjForLocationInCategory);
	});
	//console.log(parentJSONObject);
	return parentJSONObject;
}


function processMultiLineJSONData(statesData, usAverageData, weatherCategoryName, locationCategoryName) {
	
	usAverageData = JSON.parse(usAverageData);
	//console.log(usAverageData);
	//setup parent json object
	var parentJSONObject = {};
	var andstring = " and ";
	if(weatherCategoryName=="" || locationCategoryName=="")
		andstring="";
	parentJSONObject["weatherLocation"] = weatherCategoryName+andstring+locationCategoryName;
	
	if(isLawModeSelected())
	{
		parentJSONObject["law_mode"] = 1;
	}
	else
	{
		parentJSONObject["law_mode"] = 0;
	}
	
	//setup us average data
	parentJSONObject["us_average_data"] = {};	
	var usAverageJsonObject = parentJSONObject["us_average_data"];
	
	usAverageJsonObject["category_state"] = "US Average";
	usAverageJsonObject["time_category_data"] = [];
	usAverageTimeCategoryDataArray = usAverageJsonObject["time_category_data"];
	
	usAverageData.forEach(function(d){
		if(d.HOUR < 24)
		{
			//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ "+d.id)
			//statemode[d.id]++;
			//console.log("hour: "+d.HOUR+" block:"+determineTimeGroupBasedOnHour(d.HOUR));
			filteredTimeCategories = usAverageTimeCategoryDataArray.filter(function(timeCategoryObject) {
					return timeCategoryObject["key"] == determineTimeGroupBasedOnHour(d.HOUR);
				});
				
				if (filteredTimeCategories.length > 0) {
					//right now we can just select the first category that was filtered
					selectedTimeCategory = filteredTimeCategories[0];
					selectedTimeCategory["values"] = parseInt(parseInt(selectedTimeCategory["values"])+parseInt(d.fatalities));
				}
				else
				{
					//if time category does not exist create a new one
					var timeCategoryDataForHour = {};
					timeCategoryDataForHour["key"] = determineTimeGroupBasedOnHour(parseInt(d.HOUR));
					timeCategoryDataForHour["values"] = parseInt(d.fatalities);
				
					usAverageTimeCategoryDataArray.push(timeCategoryDataForHour);
				}
		}		
	});	
		var ssss="";
		for(i=0; i<statelist.length; i++){
			if(buttonstatus[statelist[i]]==1)
				statemode[statelist[i]]++;
			ssss+=", "+statemode[statelist[i]];
		}
		
		console.log(ssss);
		usAvgCategoryJsonObj = usAverageTimeCategoryDataArray[i];
		timeBlocksArray = usAverageJsonObject["time_category_data"];
		
		for(timeBlocks = 0; timeBlocks<8; timeBlocks++)
		{
			//get time category
			filteredTimeCategories = timeBlocksArray.filter(function(timeCategoryObject) {
				return timeCategoryObject["key"] == timeBlocks;
			});
			
			if(filteredTimeCategories.length == 0)
			{
				var timeCategoryDataForHour = {};
				timeCategoryDataForHour["key"] = timeBlocks;
				timeCategoryDataForHour["values"] = 0;
		
				timeBlocksArray.push(timeCategoryDataForHour);
			}
			
			timeBlocksArray.sort(function(a,b) {return a.key - b.key});
		}
	
	//console.log(usAverageJsonObject);
	
	//setup state category data	
	parentJSONObject["state_category_data"] = [];	
	var stateCategoryDataArray = parentJSONObject["state_category_data"];
	
	statesData.forEach(function(d) {
		if(d.hour < 24)
		{
			filteredStateCategories = stateCategoryDataArray.filter(function(stateCategoryObject) {
				return stateCategoryObject["category_state"] == d.category_state;
			});
			
			if (filteredStateCategories.length > 0) {
				//right now we can just select the first category that was filtered
				selectedStateCategory = filteredStateCategories[0];
				
				var timeCategoryDataArrayForState = selectedStateCategory["time_category_data"];
				
				//get time category
				filteredTimeCategories = timeCategoryDataArrayForState.filter(function(timeCategoryObject) {
					return timeCategoryObject["key"] == determineTimeGroupBasedOnHour(d.hour);
				});
				
				if (filteredTimeCategories.length > 0) {
					//right now we can just select the first category that was filtered
					selectedTimeCategory = filteredTimeCategories[0];
					selectedTimeCategory["values"] = parseInt(parseInt(selectedTimeCategory["values"])+parseInt(d.fatalities));
				}
				else
				{
					//if time category does not exist create a new one
					var timeCategoryDataForHour = {};
					timeCategoryDataForHour["key"] = determineTimeGroupBasedOnHour(parseInt(d.hour));
					timeCategoryDataForHour["values"] = parseInt(d.fatalities);
				
					timeCategoryDataArrayForState.push(timeCategoryDataForHour);
				}
				
			} else {
				selectedStateCategory = {};
				selectedStateCategory["category_state"] = d.category_state;
				
				if(parseInt(d.law) == 1)
				{
					selectedStateCategory["law_data"] = "yes";
				}
				else
				{
					selectedStateCategory["law_data"] = "no";
				}
				
				selectedStateCategory["time_category_data"] = [];
				var timeCategoryDataArrayForState = selectedStateCategory["time_category_data"];
				
				var timeCategoryDataForHour = {};
				timeCategoryDataForHour["key"] = determineTimeGroupBasedOnHour(parseInt(d.hour));
				timeCategoryDataForHour["values"] = parseInt(d.fatalities);
				
				timeCategoryDataArrayForState.push(timeCategoryDataForHour);
				
				stateCategoryDataArray.push(selectedStateCategory);
			}
		}
	});
	
	//add in missing data for state time categories
	for(i = 0; i<stateCategoryDataArray.length; i++)
	{
		stateCategoryJsonObj = stateCategoryDataArray[i];
		timeBlocksArray = stateCategoryJsonObj["time_category_data"];
		
		for(timeBlocks = 0; timeBlocks<8; timeBlocks++)
		{
			//get time category
			filteredTimeCategories = timeBlocksArray.filter(function(timeCategoryObject) {
				return timeCategoryObject["key"] == timeBlocks;
			});
			
			if(filteredTimeCategories.length == 0)
			{
				var timeCategoryDataForHour = {};
				timeCategoryDataForHour["key"] = timeBlocks;
				timeCategoryDataForHour["values"] = 0;
		
				timeBlocksArray.push(timeCategoryDataForHour);
			}
		}
		
		timeBlocksArray.sort(function(a,b) {return a.key - b.key});
		//console.log(stateCategoryJsonObj);
	}
	
	
	return parentJSONObject;
}

var determineTimeGroupBasedOnHour = function(hour)
{
	return Math.floor(parseInt(hour)/3);
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
			var idx = parseInt(this.id.split('_')[1]);
			// this.checked ? statemode[idx] = 1 : statemode[idx] = 0;
			this.checked ? buttonstatus[idx] = 1 : buttonstatus[idx] = 0;
			console.log("-------------------"+idx);
				
		}
		if (buttonstatus["weekdays"] == 0 && buttonstatus["weekends"] == 0) {
			console.log("Select day of week!!!!!!!!!!");
		}
		// if (eval(statemode.join('+')) == 0) {
		// 	console.log("Select states!!!!!!!!!!");
		// } 
		//console.log(buttonstatus);
		retrieveDataBasedOnFilters();
	});
}

function lawModeToggled()
{
	if($("#law_button").is(":checked"))
	{
		$("#lawmode-switch-div").visible();
		categoryDataMatrix.enableProhibitedLawMode();
		for (i = 0; i < statelist.length; i++) {
			if (lawstatus[statelist[i]] == 1) {
				d3.select('#state_' + statelist[i] + '_text').attr("style", "color:#1f77b4");
			} else {
				d3.select('#state_' + statelist[i] + '_text').attr("style", "color:#d62728");
			}
		}
	}
	else
	{
		$("#lawmode-switch-div").invisible();
		categoryDataMatrix.disableLawMode();
		for (i = 0; i < statelist.length; i++) {
			if (lawstatus[statelist[i]] == 1) {
				d3.select('#state_' + statelist[i] + '_text').attr("style", "color:black");
			} else {
				d3.select('#state_' + statelist[i] + '_text').attr("style", "color:black");
			}
		}
	}
	//	retrieveDataBasedOnFilters();
}

function cdmLawOptionToggled()
{
if($("#myonoffswitch").is(":checked"))
	{
		categoryDataMatrix.enableProhibitedLawMode();
		buttonstatus["allowed"] = 0;
	}
	else
	{
		categoryDataMatrix.enableAllowedLawMode();
		buttonstatus["allowed"] = 1;
	}
		retrieveDataBasedOnFilters();
		console.log(buttonstatus);
}

(function($) {
    $.fn.invisible = function() {
        return this.each(function() {
            $(this).css("visibility", "hidden");
        });
    };
    $.fn.visible = function() {
        return this.each(function() {
            $(this).css("visibility", "visible");
        });
    };
}(jQuery));


var categoriesSelectedCallback = function(isSelected, weatherCategoryName, locationCategoryName)
{
	//weatherCategoryName or locationCategoryName can be undefined if an axis cell is selected.
	if(weatherCategoryName === undefined)
	{
		weatherCategoryName = "";
	}
	
	if(locationCategoryName === undefined)
	{
		locationCategoryName = "";
	}
	
	var divName = generateMultiLineGraphDivName(weatherCategoryName, locationCategoryName);
	
	if(isSelected)
	{	
		jQuery('<div/>', {
			id: divName,
		}).appendTo('#multiLineTimeOfDay');
		
		selectedLineGraphIDArray.push(
			{	
				"divname":divName,
				"weatherCategoryName":weatherCategoryName,
				"locationCategoryName":locationCategoryName
			});
		
		retrieveDataOnCDMSelection(weatherCategoryName, locationCategoryName, divName);
		console.log("Categories Selected: ["+weatherCategoryName+", "+locationCategoryName+"]");
	}
	else
	{
		$("#"+divName).remove();
		
		filteredList = selectedLineGraphIDArray.filter(function (el) {
						return el.divname == divName;
						});
		

		selectedLineGraphIDArray.splice(selectedLineGraphIDArray.indexOf(filteredList[0]), 1);
		
		console.log("Categories DE-Selected: ["+weatherCategoryName+", "+locationCategoryName+"]");
	}
		console.log(selectedLineGraphIDArray);
}

var generateMultiLineGraphDivName = function(weatherCategoryName, locationCategoryName)
{
	var divName = weatherCategoryName+"-"+locationCategoryName;
	divName = divName.replace(/\(/g, "");
	divName = divName.replace(/\)/g, "");
	divName = divName.replace(/ /g, "-");
	return divName;
}

var isLawModeSelected = function()
{
 	return $("#law_button").is(":checked");
}


var statelist = [
1, 2, 4, 5, 6, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 44, 45, 46, 47, 48, 49, 50, 51, 53, 54, 55, 56];
buttonstatus = {
	"allowed": 1,
	"start": 1,
	"end": 12,
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
var lawstatus = {
	"1":0,
	"2":1,
	"4":1,
	"5":1,
	"6":0,
	"8":1,
	"9":0,
	"10":0,
	"11":0,
	"12":0,
	"13":0,
	"15":0,
	"16":1,
	"17":1,
	"18":1,
	"19":1,
	"20":1,
	"21":1,
	"22":0,
	"23":0,
	"24":0,
	"25":0,
	"26":1,
	"27":1,
	"28":1,
	"29":1,
	"30":1,
	"31":1,
	"32":1,
	"33":0,
	"34":0,
	"35":0,
	"36":0,
	"37":0,
	"38":1,
	"39":1,
	"40":1,
	"41":0,
	"42":0,
	"44":0,
	"45":1,
	"46":1,
	"47":0,
	"48":1,
	"49":1,
	"50":1,
	"51":1,
	"53":1,
	"54":0,
	"55":1,
	"56":1
};
/* var sampleOverviewTimesliderData = {
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
};  */
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

var xAxisCategoryNameArray = ["Bicycle Lane","Driveway Access","Intersection-In Marked Crosswalk","Intersection-Not In Crosswalk","Intersection-Unknown Location","Intersection-Unmarked Crosswalk","Median or Crossing Island","Non-Intersec-On Roadway","Non-Intersec-On Roadway (Unknown)","Non-Intersection-In Marked Crosswalk","Non-Trafficway Area","Parking Lane or Zone","Shared-Use Path or Trail","Shoulder or Roadside","Sidewalk"];
var sampleJsonDataForCDM_XAxis = {
	"data_group_id": 2,
	"category_data": [{
		"category_location": "Bicycle Lane",
		"num_of_fatalities": 0,
	}, {
		"category_location": "Driveway Access",
		"num_of_fatalities": 0,
	}, {
		"category_location": "Intersection-In Marked Crosswalk",
		"num_of_fatalities": 0,
	}, {
		"category_location": "Intersection-Not In Crosswalk",
		"num_of_fatalities": 0,
	}, {
		"category_location": "Intersection-Unknown Location",
		"num_of_fatalities": 0,
	}, {
		"category_location": "Intersection-Unmarked Crosswalk",
		"num_of_fatalities": 0,
	}, {
		"category_location": "Median or Crossing Island",
		"num_of_fatalities": 0,
	}, {
		"category_location": "Non-Intersec-On Roadway",
		"num_of_fatalities": 0,
	}, {
		"category_location": "Non-Intersec-On Roadway (Unknown)",
		"num_of_fatalities": 0,
	}, {
		"category_location": "Non-Intersection-In Marked Crosswalk",
		"num_of_fatalities": 0,
	}, {
		"category_location": "Non-Trafficway Area",
		"num_of_fatalities": 0,
	}, {
		"category_location": "Parking Lane or Zone",
		"num_of_fatalities": 0,
	}, {
		"category_location": "Shared-Use Path or Trail",
		"num_of_fatalities": 0,
	}, {
		"category_location": "Shoulder or Roadside",
		"num_of_fatalities": 0,
	}, {
		"category_location": "Sidewalk",
		"num_of_fatalities": 0,
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
	
var	sampleDataMultiLine	= 
{
	"weatherLocation": "rainy-street",
	"law_mode": 0,
	"missing_state_values": "CA, FL, NY",
	"us_average_data":
	{
			"category_state": "US Average",
			"time_category_data":
			[	
				{
					"key": "0",
					"values": 30 
				},
				{
					"key": "1",
					"values": 100
				},
				{
					"key": "2",
					"values": 165
				},
				{
					"key": "3",
					"values": 120 
				},
				{
					"key": "4",
					"values": 150 
				},
				{
					"key": "5",
					"values": 100
				},
				{
					"key": "6",
					"values": 75 
				},
				{
					"key": "7",
					"values": 20 
				}
			]
	},
	"state_category_data":
	[
		{
			"category_state": "GA",
			"law_data": 'yes',
			"time_category_data":
			[	
				{
					"key": "0",
					"values": 40 
				},
				{
					"key": "1",
					"values": 80
				},
				{
					"key": "2",
					"values": 120
				},
				{
					"key": "3",
					"values": 100 
				},
				{
					"key": "4",
					"values": 150 
				},
				{
					"key": "5",
					"values": 90
				},
				{
					"key": "6",
					"values": 50 
				},
				{
					"key": "7",
					"values": 20 
				}
			]
		},
		{
			"category_state": "NY",
			"law_data": 'no',
			"time_category_data":
			[	
				{
					"key": "0",
					"values": 20 
				},
				{
					"key": "1",
					"values": 60
				},
				{
					"key": "2",
					"values": 150
				},
				{
					"key": "3",
					"values": 115 
				},
				{
					"key": "4",
					"values": 200 
				},
				{
					"key": "5",
					"values": 120
				},
				{
					"key": "6",
					"values": 75 
				},
				{
					"key": "7",
					"values": 40 
				}
			]
		}
	]
};





var	testDataMultiLine	= 
{
	"weatherLocation": "rainy-street",
	"law_mode": 0,
	"missing_state_values": "CA, FL, NY",
	"us_average_data":
	{
			"category_state": "US Average",
			"time_category_data":
			[	
				{
					"key": "0",
					"values": 6 
				},
				{
					"key": "1",
					"values": 15
				},
				{
					"key": "2",
					"values": 12
				},
				{
					"key": "3",
					"values": 25 
				},
				{
					"key": "4",
					"values": 30 
				},
				{
					"key": "5",
					"values": 25
				},
				{
					"key": "6",
					"values": 40 
				},
				{
					"key": "7",
					"values": 45 
				},
{
					"key": "8",
					"values": 60 
				},
				{
					"key": "9",
					"values": 85
				},
				{
					"key": "10",
					"values": 105
				},
				{
					"key": "11",
					"values": 95 
				},
				{
					"key": "12",
					"values": 135 
				},
				{
					"key": "13",
					"values": 140
				},
				{
					"key": "14",
					"values": 155
				},
				{
					"key": "15",
					"values": 150 
				},
				{
					"key": "16",
					"values": 190 
				},
				{
					"key": "17",
					"values": 185
				},
				{
					"key": "18",
					"values": 170 
				},
				{
					"key": "19",
					"values": 160 
				},
{
					"key": "20",
					"values": 145
				},
				{
					"key": "21",
					"values": 105
				},
				{
					"key": "22",
					"values": 115
				},
				{
					"key": "23",
					"values": 60 
				}					

			]
	},
	"state_category_data":
	[
		{
			"category_state": "GA",
			"law_data": 'yes',
			"time_category_data":
			[	
				{
					"key": "0",
					"values": 30 
				},
				{
					"key": "1",
					"values": 10
				},
				{
					"key": "2",
					"values": 15
				},
				{
					"key": "3",
					"values": 30 
				},
				{
					"key": "4",
					"values": 35 
				},
				{
					"key": "5",
					"values": 20
				},
				{
					"key": "6",
					"values": 35 
				},
				{
					"key": "7",
					"values": 50 
				},
{
					"key": "8",
					"values": 75 
				},
				{
					"key": "9",
					"values": 110
				},
				{
					"key": "10",
					"values": 95
				},
				{
					"key": "11",
					"values": 105 
				},
				{
					"key": "12",
					"values": 115 
				},
				{
					"key": "13",
					"values": 120
				},
				{
					"key": "14",
					"values": 145
				},
				{
					"key": "15",
					"values": 160 
				},
				{
					"key": "16",
					"values": 190 
				},
				{
					"key": "17",
					"values": 190
				},
				{
					"key": "18",
					"values": 185 
				},
				{
					"key": "19",
					"values": 175 
				},
{
					"key": "20",
					"values": 150
				},
				{
					"key": "21",
					"values": 112
				},
				{
					"key": "22",
					"values": 85
				},
				{
					"key": "23",
					"values": 50 
				}					
			]
		},
		{
			"category_state": "NY",
			"law_data": 'no',
			"time_category_data":
			[	
				{
					"key": "0",
					"values": 20 
				},
				{
					"key": "1",
					"values": 60
				},
				{
					"key": "2",
					"values": 150
				},
				{
					"key": "3",
					"values": 115 
				},
				{
					"key": "4",
					"values": 200 
				},
				{
					"key": "5",
					"values": 120
				},
				{
					"key": "6",
					"values": 75 
				},
				{
					"key": "7",
					"values": 40 
				}
			]
		}
	]
};



function timeBucketGroupings(multiLineGraphData){
	// will group the fatalities into 3 hour timeblock.
	timeGroupings = [0,0,0,0,0,0,0,0];
	multiLineGraphData.us_average_data.time_category_data.forEach( function(d,i){
		if( 0 <= parseInt(d.key)  &&  parseInt(d.key) < 3){
			timeGroupings[0] = parseInt(timeGroupings[0]) + parseInt(d.values)
		}
		else if(3 <= parseInt(d.key)  &&  parseInt(d.key) < 6){
			timeGroupings[1] = parseInt(timeGroupings[1]) + parseInt(d.values)
		}
		else if(6 <= parseInt(d.key)  &&  parseInt(d.key) < 9){
			timeGroupings[2] = parseInt(timeGroupings[2]) + parseInt(d.values)
		}
		else if(9 <= parseInt(d.key)  &&  parseInt(d.key) < 12){
			timeGroupings[3] = parseInt(timeGroupings[3]) + parseInt(d.values)
		}
		else if(12 <= parseInt(d.key)  &&  parseInt(d.key) < 15){
			timeGroupings[4] = parseInt(timeGroupings[4]) + parseInt(d.values)
		}
		else if(15 <= parseInt(d.key)  &&  parseInt(d.key) < 18){
			timeGroupings[5] = parseInt(timeGroupings[5]) + parseInt(d.values)
		}
		else if(18 <= parseInt(d.key)  &&  parseInt(d.key) < 21){
			timeGroupings[6] = parseInt(timeGroupings[6]) + parseInt(d.values)
		}
		else if(21 <= parseInt(d.key)  &&  parseInt(d.key) < 24){
			timeGroupings[7] = parseInt(timeGroupings[7]) + parseInt(d.values)
		}
	});
	multiLineGraphData.us_average_data.time_category_data = [];
	timeGroupings.forEach(function(d,i){
		multiLineGraphData.us_average_data.time_category_data[i] = {'key': i, 'values': parseInt(timeGroupings[i])/5};
	});
	multiLineGraphData.state_category_data.forEach( function(d1,i1){
		timeGroupings = [0,0,0,0,0,0,0,0];
		d1.time_category_data.forEach( function(d2,i2){
			if( 0 <= parseInt(d2.key)  &&  parseInt(d2.key) < 3){
				timeGroupings[0] = parseInt(timeGroupings[0]) + parseInt(d2.values)
			}
			else if(3 <= parseInt(d2.key)  &&  parseInt(d2.key) < 6){
				timeGroupings[1] = parseInt(timeGroupings[1]) + parseInt(d2.values)
			}
			else if(6 <= parseInt(d2.key)  &&  parseInt(d2.key) < 9){
				timeGroupings[2] = parseInt(timeGroupings[2]) + parseInt(d2.values)
			}
			else if(9 <= parseInt(d2.key)  &&  parseInt(d2.key) < 12){
				timeGroupings[3] = parseInt(timeGroupings[3]) + parseInt(d2.values)
			}
			else if(12 <= parseInt(d2.key)  &&  parseInt(d2.key) < 15){
				timeGroupings[4] = parseInt(timeGroupings[4]) + parseInt(d2.values)
			}
			else if(15 <= parseInt(d2.key)  &&  parseInt(d2.key) < 18){
				timeGroupings[5] = parseInt(timeGroupings[5]) + parseInt(d2.values)
			}
			else if(18 <= parseInt(d2.key)  &&  parseInt(d2.key) < 21){
				timeGroupings[6] = parseInt(timeGroupings[6]) + parseInt(d2.values)
			}
			else if(21 <= parseInt(d2.key)  &&  parseInt(d2.key) < 24){
				timeGroupings[7] = parseInt(timeGroupings[7]) + parseInt(d2.values)
			}
		});
		
		d1.time_category_data = [];
		timeGroupings.forEach(function(d2,i2){
			d1.time_category_data[i2] = {'key': i2, 'values': parseInt(timeGroupings[i2])/5};
		});
	});
	
}
