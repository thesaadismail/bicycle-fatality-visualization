HeatchartMatrix.Axis = {
	AxisType_None: 0,
	AxisType_X: 1,
	AxisType_Y: 2
}

function HeatchartMatrix(elementName, cells, widthAttr, heightAttr, axisType) {
/*
	===========================================
					VARIABLES
	===========================================
	*/
	var width = widthAttr,
		height = heightAttr;
	var cellStrokeColor = "#7e7e7e",
		selectedCellStrokeColor = "#663300";
	var sampleJsonDataForCDM = cells;
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
	
	var data = null,
		color = d3.interpolateRgb("#fff", "#f00"),
		lawmodeAllowedColor = d3.interpolateRgb("#fff", "#00f"),
		lawmodeProhibitedColor = d3.interpolateRgb("#fff", "#f00");
	var selectedCells;
	var matrixAxisType = axisType;
	var enableLawMode = false;
/*
	===========================================
					ADD ELEMENTS
	===========================================
	*/
	var createHeatchart = function() {
			var sampleJsonData = sampleJsonDataForCDM["category_data"];
			var min = 999;
			var max = -999;
			var l;
			//console.log(sampleJsonData);
			for (var rowNum = 0; rowNum < numRows; rowNum++) {
				for (var colNum = 0; colNum < numCols; colNum++) {
					sampleJsonData[rowNum]["category_data"][colNum]['row'] = rowNum;
					sampleJsonData[rowNum]["category_data"][colNum]['col'] = colNum;
					
					//generate sample data - remove this when we have real data
					sampleJsonData[rowNum]["category_data"][colNum]['num_of_fatalities_law_allowed'] = Math.floor(Math.random() * 111);
					sampleJsonData[rowNum]["category_data"][colNum]['num_of_fatalities_law_prohibited'] = Math.floor(Math.random() * 111);
					l = sampleJsonData[rowNum]["category_data"][colNum]["num_of_fatalities"];
					if (l > max) {
						max = l;
					}
					if (l < min) {
						min = l;
					}
				}
			}
			var heatchartCanvas = d3.select(elementName).append("svg").attr("width", width).attr("height", height);
			//console.log(samplejson);
			if (matrixAxisType == HeatchartMatrix.Axis.AxisType_Y) {
				buildYAxis(sampleJsonData, heatchartCanvas);
			} else if (matrixAxisType == HeatchartMatrix.Axis.AxisType_X) {
				buildXAxis(sampleJsonData, heatchartCanvas);
			}
			var selectedHeatChart = heatchartCanvas.selectAll("g").data(sampleJsonData).enter().append("g");
			addRegularGrid(false, selectedHeatChart, min, max);
		};
	var createYAxisComponent = function() {
			var sampleJsonData = [sampleJsonDataForCDM["category_data"], ];
			var min = 999;
			var max = -999;
			var l;
			//console.log(sampleJsonData);
			for (var rowNum = 0; rowNum < numRows; rowNum++) {
				sampleJsonData[0][rowNum]['row'] = rowNum;
				sampleJsonData[0][rowNum]['col'] = 0;
				
				//generate sample data - remove this when we have real data
				sampleJsonData[0][rowNum]['num_of_fatalities_law_allowed'] = Math.floor(Math.random() * 111);
				sampleJsonData[0][rowNum]['num_of_fatalities_law_prohibited'] = Math.floor(Math.random() * 111);
				l = sampleJsonData[0][rowNum]["num_of_fatalities"];
				if (l > max) {
					max = l;
				}
				if (l < min) {
					min = l;
				}
			}
			var heatchartCanvas = d3.select(elementName).append("svg").attr("width", width).attr("height", height);
			//console.log(samplejson);
			buildYAxis(sampleJsonData, heatchartCanvas);
			var selectedHeatChart = heatchartCanvas.selectAll("g").data(sampleJsonData).enter().append("g");
			addRegularGrid(false, selectedHeatChart, min, max);
		};
	var createXAxisComponent = function() {
			var sampleJsonData = sampleJsonDataForCDM["category_data"];
			var min = 999;
			var max = -999;
			var l;
			//console.log(sampleJsonData);
			for (var colNum = 0; colNum < numCols; colNum++) {
			
				//generate sample data - remove this when we have real data
				l = sampleJsonData[colNum]["num_of_fatalities"];
				//console.log(sampleJsonData);
				sampleJsonData[colNum]["category_data"] = [{
					"num_of_fatalities": l,
					'row': 0,
					'col': colNum,
					'num_of_fatalities_law_allowed' : Math.floor(Math.random() * 111),
					'num_of_fatalities_law_prohibited' : Math.floor(Math.random() * 111)
				}];
				if (l > max) {
					max = l;
				}
				if (l < min) {
					min = l;
				}
			}
			var heatchartCanvas = d3.select(elementName).append("svg").attr("width", width).attr("height", height);
			//console.log(samplejson);
			buildXAxis(sampleJsonData, heatchartCanvas);
			var selectedHeatChart = heatchartCanvas.selectAll("g").data(sampleJsonData).enter().append("g");
			addRegularGrid(false, selectedHeatChart, min, max);
		};
/*
	===========================================
					UPDATE ELEMENTS
	===========================================
	*/
	this.updateHeatchart = function() {
		var sampleJsonData = sampleJsonDataForCDM["category_data"];
		//console.log(sampleJsonData);
		var min = 999;
		var max = -999;
		var l;
		for (var rowNum = 0; rowNum < sampleJsonData.length; rowNum++) {
			for (var colNum = 0; colNum < sampleJsonData[0]["category_data"].length; colNum++) {
				sampleJsonData[rowNum]["category_data"][colNum]['row'] = rowNum;
				sampleJsonData[rowNum]["category_data"][colNum]['col'] = colNum;
				sampleJsonData[rowNum]["category_data"][colNum]['num_of_fatalities'] = Math.floor(Math.random() * 111);
				l = sampleJsonData[rowNum]["category_data"][colNum]["num_of_fatalities"];
				if (l > max) {
					max = l;
				}
				if (l < min) {
					min = l;
				}
			}
		}
	/*
	var yAxis = d3.svg.axis();
		yAxis.orient('left').scale(yscale).tickSize(2).tickFormat(function(d, i) {
			return categories[i];
		}).tickValues(d3.range(17));
*/
		var tooltip = d3.select("body").append("div").style("position", "absolute").style("z-index", "10").style("visibility", "hidden").text("a simple tooltip");
		var heatchartCanvas = d3.select(elementName).select("svg");
		var selectedHeatChart = heatchartCanvas.selectAll("g").data(sampleJsonData);
		addRegularGrid(true, selectedHeatChart, min, max);
	};
/*
	===========================================
	  Build Axes
	===========================================
	*/
	var buildYAxis = function(sampleJsonData, canvas) {
			var yAxisCategories = [];
			//console.log(sampleJsonData);
			for (var rowNum = 0; rowNum < sampleJsonData.length; rowNum++) {
				yAxisCategories[yAxisCategories.length] = sampleJsonData[rowNum]["category_weather"];
			}
			//console.log(yAxisCategories);
			var yscale = d3.scale.linear().domain([0, yAxisCategories.length]).range([0, 480]);
			var yAxis = d3.svg.axis();
			yAxis.orient('left').scale(yscale).tickSize(2).tickFormat(function(d, i) {
				return yAxisCategories[i];
			}).tickValues(d3.range(17));
			//var y_xis = canvas.append('g').attr('id', 'yaxis').call(yAxis);
		};
	var buildXAxis = function(sampleJsonData) {
			var xAxisCategories = [];
			//console.log(sampleJsonData);
			//console.log(sampleJsonData);
			for (var colNum = 0; colNum < sampleJsonData.length; colNum++) {
				xAxisCategories[xAxisCategories.length] = sampleJsonData[colNum]["category_location"];
			}
			//console.log(xAxisCategories);
		};
/*
	===========================================
	  Category Data Matrix Component Helpers
	===========================================
	*/
	var addRegularGrid = function(update, selectedHeatChart, min, max) {
			var selectedRectangles;
			if (update) {
				selectedRectangles = selectedHeatChart.selectAll("rect").data(function(d) {
					return d;
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
			selectedElements = selectedRectangles.attr("x", function(d, i) {
				return (d.col * (width / numCols))+cellMargin;
			}).attr("y", function(d, i) {
				return (d.row * (height / numRows))+cellMargin;
			}).attr("width", (width / numCols)-(cellMargin*2)).attr("height", (height / numRows)-(cellMargin*2)).attr("fill", function(d, i) {
				return color((d["num_of_fatalities"] - min) / (max - min));
			}).attr("stroke", cellStrokeColor)
			.attr("cell", function(d) {
				return "r" + d.row + "c" + d.col;
			})
			addHoverClickAttributes(selectedElements);
		}
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
				var firstPoint = (topX+cellMargin) + "," + (topY+cellMargin);
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
				var thirdPoint = (topX+cellMargin) + "," + (topY + heightOfSquare - cellMargin);
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
/*
	===========================================
			D3 CELL INTERACTIONS
	===========================================
	*/
	var addHoverClickAttributes = function(selectedElements) {
			var tooltip = d3.select("body")
							.append("div")
							.style("position", "absolute")
							.style("z-index", "10")
							.style("visibility", "hidden")
							.style("background-color", "rgba(255, 255, 255, 0.7)")
							.style('border', '2px solid')
							.style("border-radius", "5px")
							.style("padding", "5px");
			
			selectedElements.on("mouseover", function(d) {
				onCellOver(this, d);
				allPs = tooltip.selectAll('p');
				allPs.remove();
				
				tooltip.append('p').text("Num of Fatalities: " + d["num_of_fatalities"]);
				tooltip.append('p').text("Num of Fatalities (Allowed): " + d["num_of_fatalities_law_allowed"]);
				tooltip.append('p').text("Num of Fatalities (Prohibited): " + d["num_of_fatalities_law_prohibited"]);
				tooltip.append('p').text("Cell Information: [" + d.col + "," + d.row + "]");
				
				tooltip.style("visibility", "visible");
			}).on("mousemove", function(d) {
				tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
			}).on("mouseout", function(d) {
				onCellOut(this, d);
				tooltip.style("visibility", "hidden");
			}).on("click", function(d) {
				//console.log("clicking: [" + d.col + "," + d.row + "]");
				toggleCellSelection(this, d);
			});
		}
/*
	===========================================
			CELL SELECTION AND MOUSEOVER
	===========================================
	*/
	var toggleCellSelection = function(cell, data) {
			if (selectedCells[data.row][data.col] == false) {
				selectCell(cell, data);
			} else {
				unselectCell(cell, data);
			}
		}
	var selectCell = function(cell, data) {
			selectedCells[data.row][data.col] = true;
			d3.select(cell).attr("stroke", selectedCellStrokeColor).attr("stroke-width", 3);
			cell.parentNode.parentNode.appendChild(cell.parentNode);
			cell.parentNode.appendChild(cell);
		};
	var unselectCell = function(cell, data) {
			selectedCells[data.row][data.col] = false;
			d3.select(cell).attr("stroke", cellStrokeColor).attr("stroke-width", 1);
		};
	var highlightCell = function(cell, data) {
			d3.select(cell).attr("stroke", "#f00").attr("stroke-width", 3);
			cell.parentNode.parentNode.appendChild(cell.parentNode);
			cell.parentNode.appendChild(cell);
		};
	var unhighlightCell = function(cell, data) {
			if (selectedCells[data.row][data.col] == true) {
				d3.select(cell).attr("stroke", selectedCellStrokeColor).attr("stroke-width", 1);
			} else {
				d3.select(cell).attr("stroke", cellStrokeColor).attr("stroke-width", 1);
			}
		};
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
		matrixDataset = newCells;
	}
	
	this.updateLawModeDatasets = function(newCellsAllowed, newCellsProhibited) {
		matrixDataset = newCells;
	}
	
	
	this.getDataset = function() {
		return matrixDataset;
	}
/*
	===========================================
			CELLS CREATION
	===========================================
	*/
	var createDefaultSelectedCells = function() {
			selectedCells = new Array(numRows);
			for (i = 0; i < numRows; i++) {
				selectedCells[i] = new Array(numCols);
				for (j = 0; j < numCols; j++) {
					selectedCells[i][j] = false;
				}
			}
		}
/*
	===========================================
			Functions to Execute on Load
	===========================================
	*/
		createDefaultSelectedCells();
}