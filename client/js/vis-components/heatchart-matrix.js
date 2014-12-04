HeatchartMatrix.Axis = {
	AxisType_None: 0,
	AxisType_X: 1,
	AxisType_Y: 2
}

function HeatchartMatrix(elementName, cells, widthAttr, heightAttr, axisType, cellSelectionCallback) {
/*
	===========================================
					VARIABLES
	===========================================
	*/
	//generic graph attributes
	var width = widthAttr,
		height = heightAttr;
	//dataset attributes
	var sampleJsonDataForCDM = cells;
	var matrixAxisType = axisType;
	var enableLawMode = false;
	var yAxisWidth = 100;
	var xAxisHeight = 100;
	//cell attributes
	var cellMargin = 2.5;
	if (axisType == HeatchartMatrix.Axis.AxisType_None) {
		var numRows = cells["category_data"].length,
			numCols = cells["category_data"][0]["category_data"].length;
	} else if (axisType == HeatchartMatrix.Axis.AxisType_X) {
		//console.log(cells);
		var numRows = 1,
			numCols = cells["category_data"].length;
	} else if (axisType == HeatchartMatrix.Axis.AxisType_Y) {
		var numRows = cells["category_data"].length,
			numCols = 1;
	}
	//color attributes
	var color = d3.interpolateRgb("#fff", "#F4A460"),
		cellStrokeColor = "#7e7e7e",
		selectedCellStrokeColor = "#663300";
		
	this.updateColor = function(newColor)
	{
		color = newColor;
	}
		
		
	/*
	lawmodeAllowedColor = d3.interpolateRgb("#fff", "#00f"),
		lawmodeProhibitedColor = d3.interpolateRgb("#fff", "#f00"),
*/
	//selected cell matrix
	var selectedCellsBoolMatrix;
/*
	===========================================
					ADD ELEMENTS
	===========================================
	*/
	var createHeatchart = function() {
			var sampleJsonData = sampleJsonDataForCDM["category_data"];
			
			var maxMinDict = determineMaxMinForMain(sampleJsonData, max, min);
			var max = maxMinDict.max;
			var min = maxMinDict.min;
			
			var heatchartCanvas = d3.select(elementName).append("svg").attr("width", width).attr("height", height);
			var selectedHeatChart = heatchartCanvas.selectAll("g").data(sampleJsonData).enter().append("g");
			addRegularGrid(false, selectedHeatChart, min, max);
		};
	var createYAxisComponent = function() {
			var sampleJsonData = [sampleJsonDataForCDM["category_data"]];
			
			var maxMinDict = determineMaxMinForYAxis(sampleJsonData, max, min);
			var max = maxMinDict.max;
			var min = maxMinDict.min;

			var heatchartCanvas = d3.select(elementName).append("svg").attr("width", width+yAxisWidth).attr("height", height);
			//console.log(samplejson);
			buildYAxisLabels(false, sampleJsonData, heatchartCanvas);
			var selectedHeatChart = heatchartCanvas.append("svg").selectAll("g").data(sampleJsonData).enter().append("g");
			var selectedComponents = addRegularGrid(false, selectedHeatChart, min, max);
			//this is to shift the x axis over so there is room for the axes labels
			selectedComponents.attr("transform", "translate("+yAxisWidth+"," + 0 + ")");
		};
	var createXAxisComponent = function() {
			var sampleJsonData = sampleJsonDataForCDM["category_data"];
			
			var maxMinDict = determineMaxMinForXAxis(sampleJsonData, max, min);
			var max = maxMinDict.max;
			var min = maxMinDict.min;
			
			var heatchartCanvas = d3.select(elementName).append("svg").attr("width", width).attr("height", height+xAxisHeight);
			//console.log(samplejson);
			//buildXAxis(sampleJsonData, heatchartCanvas);
			buildXAxisLabels(false,sampleJsonData, heatchartCanvas);
			var selectedHeatChart = heatchartCanvas.append("svg").selectAll("g").data(sampleJsonData).enter().append("g");
			var selectedComponents = addRegularGrid(false, selectedHeatChart, min, max);
			//selectedComponents.attr("transform", "translate("+0+"," + xAxisHeight + ")");
		};
/*
	===========================================
					UPDATE ELEMENTS
	===========================================
	*/
	this.updateHeatchart = function() {
			console.log("************ Update Main Component ************");
		//console.log(sampleJsonDataForCDM);
		var sampleJsonData = sampleJsonDataForCDM["category_data"];
		
			var maxMinDict = determineMaxMinForMain(sampleJsonData, max, min);
			var max = maxMinDict.max;
			var min = maxMinDict.min;
			
			var heatchartCanvas = d3.select(elementName).select("svg");
			var selectedHeatChart = heatchartCanvas.selectAll("g").data(sampleJsonData);
			addRegularGrid(true, selectedHeatChart, min, max);
	};
	
		this.updateYAxisComponent = function() {
			console.log("************ Update Y Axis Component ************");
			var sampleJsonData = [sampleJsonDataForCDM["category_data"]];
			
			var maxMinDict = determineMaxMinForYAxis(sampleJsonData);
			var max = maxMinDict.max;
			var min = maxMinDict.min;


						var heatchartCanvas = d3.select(elementName).select("svg");
			//console.log(heatchartCanvas);
			buildYAxisLabels(true, sampleJsonData, heatchartCanvas);
			var selectedHeatChart = heatchartCanvas.select("svg").selectAll("g").data(sampleJsonData);
			var selectedComponents = addRegularGrid(true, selectedHeatChart, min, max);
			//this is to shift the x axis over so there is room for the axes labels
			selectedComponents.attr("transform", "translate("+yAxisWidth+"," + 0 + ")");

		};
		
		this.updateXAxisComponent = function() {
			console.log("************ Update X Axis Component ************");
			var sampleJsonData = sampleJsonDataForCDM["category_data"];
			
			var maxMinDict = determineMaxMinForXAxis(sampleJsonData, max, min);
			var max = maxMinDict.max;
			var min = maxMinDict.min;
			
			var heatchartCanvas = d3.select(elementName).select("svg");
			//console.log(samplejson);
			//buildXAxis(sampleJsonData, heatchartCanvas);
			buildXAxisLabels(true, sampleJsonData, heatchartCanvas);
			var selectedHeatChart = heatchartCanvas.select("svg").selectAll("g").data(sampleJsonData);
			var selectedComponents = addRegularGrid(true, selectedHeatChart, min, max);
			//selectedComponents.attr("transform", "translate("+0+"," + xAxisHeight + ")");
		};
/*
	===========================================
	  Determine Max and Min
	===========================================
	*/
var determineMaxMinForMain = function(sampleJsonData, max, min)
{
			var min = undefined;
			var max = undefined;
			var l;
			//console.log(sampleJsonData);
			
			for (var rowNum = 0; rowNum < numRows; rowNum++) {
				for (var colNum = 0; colNum < numCols; colNum++) {
					sampleJsonData[rowNum]["category_data"][colNum]['row'] = rowNum;
					sampleJsonData[rowNum]["category_data"][colNum]['col'] = colNum;
					//generate sample data - remove this when we have real data
					//sampleJsonData[rowNum]["category_data"][colNum]['num_of_fatalities_law_allowed'] = Math.floor(Math.random() * 111);
					//sampleJsonData[rowNum]["category_data"][colNum]['num_of_fatalities_law_prohibited'] = Math.floor(Math.random() * 111);
					l = parseInt(sampleJsonData[rowNum]["category_data"][colNum]["num_of_fatalities"]);
					
					if(max === undefined || min === undefined)
				{
					max = l;
					min = l;
				}
				
					if (l > max) {
						max = l;
					}
					if (l < min) {
						min = l;
					}
				}
			}
						
			return {'max':max, 'min':min}
}

var determineMaxMinForXAxis = function(sampleJsonData, max, min)
{
			var min = undefined;
			var max = undefined;
			var l;
			//console.log(sampleJsonData);
			for (var colNum = 0; colNum < numCols; colNum++) {
				//generate sample data - remove this when we have real data
				l = parseInt(sampleJsonData[colNum]["num_of_fatalities"]);
				//console.log(sampleJsonData[colNum]);
				sampleJsonData[colNum]["category_data"] = [{
					"num_of_fatalities": l,
					'row': 0,
					'col': colNum,
					"category_location": sampleJsonData[colNum]["category_location"]
					//'num_of_fatalities_law_allowed': Math.floor(Math.random() * 111),
					//'num_of_fatalities_law_prohibited': Math.floor(Math.random() * 111)
				}];
				
				if(max === undefined || min === undefined)
				{
					max = l;
					min = l;
				}
				
				if (l > max) {
					max = l;
				}
				if (l < min) {
					min = l;
				}
			}
			
			return {'max':max, 'min':min}
}

var determineMaxMinForYAxis = function(sampleJsonData, max, min)
{
		var min = undefined;
			var max = undefined;
			var l;
			//console.log(sampleJsonDataForCDM);
			for (var rowNum = 0; rowNum < numRows; rowNum++) {
				//console.log(sampleJsonData[0][rowNum]);
				sampleJsonData[0][rowNum]['row'] = rowNum;
				sampleJsonData[0][rowNum]['col'] = 0;
				//generate sample data - remove this when we have real data
				//sampleJsonData[0][rowNum]['num_of_fatalities_law_allowed'] = Math.floor(Math.random() * 111);
				//sampleJsonData[0][rowNum]['num_of_fatalities_law_prohibited'] = Math.floor(Math.random() * 111);
				l = parseInt(sampleJsonData[0][rowNum]["num_of_fatalities"]);
				
				if(max === undefined || min === undefined)
				{
					max = l;
					min = l;
				}


				if (l > max) {
					max = l;
				}
				if (l < min) {
					min = l;
				}
			}

			
			return {'max':max, 'min':min}
}
/*
	===========================================
	  Build Axes
	===========================================
	*/
	var buildYAxisLabels = function(isUpdate, sampleJsonData, canvas) {
	
			console.log("************ Build Y Axis Labels ************");
			var yAxisCategories = [];
			//console.log(sampleJsonData);
			sampleJsonData = sampleJsonData[0];
			for (var rowNum = 0; rowNum < sampleJsonData.length; rowNum++) {
				//console.log(sampleJsonData[rowNum]);
				yAxisCategories[yAxisCategories.length] = sampleJsonData[rowNum]["category_weather"];
			}
			//console.log(yAxisCategories);
			//
			var yscale = d3.scale.ordinal().domain(yAxisCategories).rangeRoundBands([0, height], 0)	;
			var yAxis = d3.svg.axis().orient('left').scale(yscale).tickSize(2);
			
	/*
		.tickSize(2).tickFormat(function(d, i) {
				return yAxisCategories[i];
			}).tickValues(d3.range(yAxisCategories.length));
*/			if(isUpdate)
			{
				var y_xis = canvas.select('g').attr('id', 'yaxis').attr("transform", "translate("+yAxisWidth+"," + 0 + ")").call(yAxis);
			}
			else
			{
				var y_xis = canvas.append('g').attr('id', 'yaxis').attr("transform", "translate("+yAxisWidth+"," + 0 + ")").call(yAxis);
			}
		};
	var buildXAxisLabels = function(isUpdate, sampleJsonData, canvas) {
			console.log("************ Build X Axis Labels ************");
			var xAxisCategories = [];
			//console.log(sampleJsonData);
			//console.log(sampleJsonData);
			for (var colNum = 0; colNum < sampleJsonData.length; colNum++) {
				xAxisCategories[xAxisCategories.length] = sampleJsonData[colNum]["category_location"];
			}
			//console.log(xAxisCategories);
			
			var xscale = d3.scale.ordinal().domain(xAxisCategories).rangeRoundBands([0, width], 0)	;
			var xAxis = d3.svg.axis().orient('bottom').scale(xscale).tickSize(2);
			
	/*
		.tickSize(2).tickFormat(function(d, i) {
				return yAxisCategories[i];
			}).tickValues(d3.range(yAxisCategories.length));
*/

		if(isUpdate)
		{
			var x_xis = canvas.select('g')
							  .attr('id', 'xaxis')
							  .attr("transform", "translate("+0+"," + 38 + ")")
							  .call(xAxis)
							  .selectAll("text")
							  	.attr("transform", "rotate(90)")
							  	.style("text-anchor", "start")
							  	.attr("dy", ".20em")
							  	.attr("dx", ".35em");
		}
		else
		{
			var x_xis = canvas.append('g')
							  .attr('id', 'xaxis')
							  .attr("transform", "translate("+0+"," + 38 + ")")
							  .call(xAxis)
							  .selectAll("text")
							  	.attr("transform", "rotate(90)")
							  	.style("text-anchor", "start")
							  	.attr("dy", ".20em")
							  	.attr("dx", ".35em");
		}
			

		};
/*
	===========================================
	  Category Data Matrix Component Helpers
	===========================================
	*/
	var addRegularGrid = function(update, selectedHeatChart, min, max) {
			console.log("************ Adding or Updating Grid ************");
			var selectedRectangles;
			if (update) {
			
				selectedRectangles = selectedHeatChart.selectAll("rect").data(function(d) {
					if (axisType == HeatchartMatrix.Axis.AxisType_None) {
						return d["category_data"];
					} else if (axisType == HeatchartMatrix.Axis.AxisType_X) {
						//console.log(d);
						return d["category_data"];
					} else if (axisType == HeatchartMatrix.Axis.AxisType_Y) {
						//console.log(d);
						return d;
					}
				});
			} else {
				selectedRectangles = selectedHeatChart.selectAll("rect").data(function(d) {
					if (axisType == HeatchartMatrix.Axis.AxisType_None) {
						return d["category_data"];
					} else if (axisType == HeatchartMatrix.Axis.AxisType_X) {
						//console.log(d);
						return d["category_data"];
					} else if (axisType == HeatchartMatrix.Axis.AxisType_Y) {
						//console.log(d);
						return d;
					}
				}).enter().append("rect");
			}
			
		//console.log(selectedRectangles);
			selectedElements = selectedRectangles.attr("x", function(d, i) {
				return (d.col * (width / numCols)) + cellMargin;
			}).attr("y", function(d, i) {
				return (d.row * (height / numRows)) + cellMargin;
			}).attr("width", (width / numCols) - (cellMargin * 2))
			.attr("height", (height / numRows) - (cellMargin * 2))
			.attr("fill", function(d, i) {
				//console.log("Updating Fill Color: "+color((d["num_of_fatalities"] - min) / (max - min))+" min: "+min+" max: "+max+" num_of_fatalities: "+d["num_of_fatalities"]);
				if(d["num_of_fatalities"] == 0)
				{
					return "#dbdbdb"
				}
				else
				{
				return color((d["num_of_fatalities"] - min) / (max - min));
				}
			}).attr("stroke", cellStrokeColor).attr("cell", function(d) {
				return "r" + d.row + "c" + d.col;
			}).attr("row", function(d, i) { //for debugging purposes
				return d.row + "";
			}).attr("col", function(d, i) { //for debugging purposes
				return d.col + "";
			}).attr("num_of_fatalities", function(d, i) { //for debugging purposes
				return d["num_of_fatalities"] + "";
			});
			addHoverClickAttributes(selectedElements);
			return selectedElements;
		}
/*
	var addLawModeGrid = function(update, selectedHeatChart, min, max) {
			//var tooltip = d3.select("body").append("div").style("position", "absolute").style("z-index", "10").style("visibility", "hidden").text("a simple tooltip");
			//work on top triangles
			var topSelectedPolygons;
			var bottomSelectedPolygons;
			if (update) {
				bottomSelectedPolygons = selectedHeatChart.selectAll("polygon#bottomTriangle").data(function(d) {
					if (axisType == HeatchartMatrix.Axis.AxisType_None) {
						return d["category_data"];
					} else if (axisType == HeatchartMatrix.Axis.AxisType_X) {
						//console.log(d);
						return d["category_data"];
					} else if (axisType == HeatchartMatrix.Axis.AxisType_Y) {
						//console.log(d);
						return d;
					}
				});
				topSelectedPolygons = selectedHeatChart.selectAll("polygon#topTriangle").data(function(d) {
					if (axisType == HeatchartMatrix.Axis.AxisType_None) {
						return d["category_data"];
					} else if (axisType == HeatchartMatrix.Axis.AxisType_X) {
						//console.log(d);
						return d["category_data"];
					} else if (axisType == HeatchartMatrix.Axis.AxisType_Y) {
						//console.log(d);
						return d;
					}
				});
			} else {
				selectedPolygons = selectedHeatChart.selectAll("polygon").data(function(d) {
					if (axisType == HeatchartMatrix.Axis.AxisType_None) {
						return d["category_data"];
					} else if (axisType == HeatchartMatrix.Axis.AxisType_X) {
						//console.log(d);
						return d["category_data"];
					} else if (axisType == HeatchartMatrix.Axis.AxisType_Y) {
						//console.log(d);
						return d;
					}
				}).enter();
				topSelectedPolygons = selectedPolygons.append("polygon").attr('id', 'topTriangle');
				bottomSelectedPolygons = selectedPolygons.append("polygon").attr('id', 'bottomTriangle');
			}
			selectedTopTriangles = topSelectedPolygons.attr("points", function(d, i) {
				//top triangle
				var topX = d.col * (width / numCols);
				var topY = d.row * (height / numRows);
				var heightOfSquare = height / numRows;
				var widthOfSquare = width / numCols;
				//top left corner
				var firstPoint = (topX + cellMargin) + "," + (topY + cellMargin);
				//top right corner
				var secondPoint = (topX + widthOfSquare - cellMargin) + "," + (topY + cellMargin);
				//bottom left corner
				var thirdPoint = (topX + cellMargin) + "," + (topY + heightOfSquare - cellMargin);
				//console.log(firstPoint + " " + secondPoint + " " + thirdPoint);
				return firstPoint + " " + secondPoint + " " + thirdPoint;
			}).attr("fill", function(d, i) {
				//console.log(d);
				return lawmodeAllowedColor((d["num_of_fatalities_law_allowed"] - min) / (max - min));
			}).attr("stroke", cellStrokeColor).attr("cell", function(d) {
				return "r" + d.row + "c" + d.col;
			});
			addHoverClickAttributes(selectedTopTriangles);
			//work with bottom triangles
			selectedBottomTriangles = bottomSelectedPolygons.attr("points", function(d, i) {
				//bottom triangle
				var topX = d.col * (width / numCols);
				var topY = d.row * (height / numRows);
				var heightOfSquare = height / numRows;
				var widthOfSquare = width / numCols;
				//top right corner
				var firstPoint = (topX + widthOfSquare - cellMargin) + "," + (topY + cellMargin);
				//bottom right corner
				var secondPoint = (topX + widthOfSquare - cellMargin) + "," + (topY + heightOfSquare - cellMargin);
				//bottom left corner
				var thirdPoint = (topX + cellMargin) + "," + (topY + heightOfSquare - cellMargin);
				//console.log(firstPoint + " " + secondPoint + " " + thirdPoint);
				return firstPoint + " " + secondPoint + " " + thirdPoint;
			}).attr("fill", function(d, i) {
				//console.log(d);
				return lawmodeProhibitedColor(d["num_of_fatalities_law_prohibited"] / (max - min));
			}).attr("stroke", cellStrokeColor).attr("cell", function(d) {
				return "r" + d.row + "c" + d.col;
			});
			addHoverClickAttributes(selectedBottomTriangles);
		}
*/
/*
	===========================================
			D3 CELL INTERACTIONS
	===========================================
	*/
	var addHoverClickAttributes = function(selectedElements) {
			var tooltip = d3.select("#category-filter-overview").append("div").style("position", "absolute").style("z-index", "10").style("visibility", "hidden").style("background-color", "rgba(255, 255, 255, 0.7)").style('border', '2px solid').style("border-radius", "5px").style("padding", "5px");
			selectedElements.on("mouseover", function(d) {
				onCellOver(this, d);
				allPs = tooltip.selectAll('p');
				allPs.remove();
				tooltip.append('p').text("Weather: " + d["category_weather"]);
				tooltip.append('p').text("Location: " + d["category_location"]);
				tooltip.append('p').text("Num of Fatalities: " + d["num_of_fatalities"]);
				//tooltip.append('p').text("Num of Fatalities (Allowed): " + d["num_of_fatalities_law_allowed"]);
				//tooltip.append('p').text("Num of Fatalities (Prohibited): " + d["num_of_fatalities_law_prohibited"]);
				tooltip.append('p').text("Cell Information: [" + d.col + "," + d.row + "]");
				tooltip.style("visibility", "visible");
			}).on("mousemove", function(d) {
				tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
			}).on("mouseout", function(d) {
				onCellOut(this, d);
				tooltip.style("visibility", "hidden");
			}).on("click", function(d) {
				//console.log("clicking: [" + d.col + "," + d.row + "]");
				if (cellSelectionCallback != null) {
					cellSelectionCallback(axisType, this, d);
				} else {
					this.toggleCellSelection(this, d);
				}
			});
		}
/*
	===========================================
			CELL SELECTION AND MOUSEOVER
	===========================================
	*/
		this.toggleCellSelection = function(cell, data) {
			if (selectedCellsBoolMatrix[data.row][data.col] == false) {
				this.selectCellWithCellData(cell, data);
				selectedCellsBoolMatrix[data.row][data.col] = true;
			} else {
				this.unselectCellWithCellData(cell, data);
				selectedCellsBoolMatrix[data.row][data.col] = false;
			}
		}
	this.selectCellWithCellData = function(cell, data) {
		d3.select(cell).attr("stroke", selectedCellStrokeColor).attr("stroke-width", 3);
		cell.parentNode.parentNode.appendChild(cell.parentNode);
		cell.parentNode.appendChild(cell);
	};
	this.unselectCellWithCellData = function(cell, data) {
		d3.select(cell).attr("stroke", cellStrokeColor).attr("stroke-width", 1);
	};
	this.selectCellInMatrix = function(row, col) {
		var filteredMatrix = d3.select(elementName).select("svg").selectAll('g').selectAll("rect").filter(function(d) {
			return d.row == row && d.col == col;
		});
		var cell = getSingleElementFromFilteredMatrix(filteredMatrix);
		var data = sampleJsonDataForCDM["category_data"][row]["category_data"][col];
		this.selectCellWithCellData(cell, data);
	}
	this.unselectCellInMatrix = function(row, col) {
		var filteredMatrix = d3.select(elementName).select("svg").selectAll('g').selectAll("rect").filter(function(d) {
			return d.row == row && d.col == col;
		});
		var cell = getSingleElementFromFilteredMatrix(filteredMatrix);
		var data = sampleJsonDataForCDM["category_data"][row]["category_data"][col];
		this.unselectCellWithCellData(cell, data);
	}
	var getSingleElementFromFilteredMatrix = function(filteredMatrix) {
			for (i = 0; i < filteredMatrix.length; i++) {
				if (filteredMatrix[i].length > 0) {
					return filteredMatrix[i][0];
				}
			}
			return null;
		}
/*
	var highlightCell = function(cell, data) {
			d3.select(cell).attr("stroke", "#f00").attr("stroke-width", 3);
			cell.parentNode.parentNode.appendChild(cell.parentNode);
			cell.parentNode.appendChild(cell);
		};
	var unhighlightCell = function(cell, data) {
			if (selectedCellsBoolMatrix[data.row][data.col] == true) {
				d3.select(cell).attr("stroke", selectedCellStrokeColor).attr("stroke-width", 1);
			} else {
				d3.select(cell).attr("stroke", cellStrokeColor).attr("stroke-width", 1);
			}
		};
*/
	var onCellOver = function(cell, data) {
			//highlightCell(cell, data);
		};
	var onCellOut = function(cell, data) {
			//unhighlightCell(cell, data);
		};
	this.initDataMatrix = function() {
		if (axisType == HeatchartMatrix.Axis.AxisType_None) {
			console.log("Create Main Heatchart");
			createHeatchart();
		} else if (axisType == HeatchartMatrix.Axis.AxisType_X) {
			console.log("Create X Axis");
			createXAxisComponent();
		} else if (axisType == HeatchartMatrix.Axis.AxisType_Y) {
			console.log("Create Y Axis");
			createYAxisComponent();
		}
	};
/*
	===========================================
			DATA SET MANPULATION
	===========================================
	*/
	this.updateDataset = function(newCells) {
		sampleJsonDataForCDM = newCells;
	}
	this.updateLawModeDatasets = function(newCellsAllowed, newCellsProhibited) {
		sampleJsonDataForCDM = newCells;
	}
	this.getDataset = function() {
		return sampleJsonDataForCDM;
	}
/*
	===========================================
			SELECTED CELLS CREATION
	===========================================
	*/
	var createDefaultselectedCellsBoolMatrix = function() {
			selectedCellsBoolMatrix = new Array(numRows);
			for (i = 0; i < numRows; i++) {
				selectedCellsBoolMatrix[i] = new Array(numCols);
				for (j = 0; j < numCols; j++) {
					selectedCellsBoolMatrix[i][j] = false;
				}
			}
		}
/*
	===========================================
			Functions to Execute on Load
	===========================================
	*/
		createDefaultselectedCellsBoolMatrix();
}
