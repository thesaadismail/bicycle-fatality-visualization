function CategoryDataMatrix(elementName, cells, widthAttr, heightAttr) {
/*
	===========================================
					VARIABLES
	===========================================
	*/
	var width = widthAttr,
		height = heightAttr;
	var cellStrokeColor = "#7e7e7e",
		selectedCellStrokeColor = "#ffff00";
	var matrixDataset = cells;
	var numRows = matrixDataset.length,
		numCols = matrixDataset[0].length,
		data = null,
		color = d3.interpolateRgb("#fff", "#f00"),
		lawmodeAllowedColor = d3.interpolateRgb("#fff", "#00f"),
		lawmodeProhibitedColor = d3.interpolateRgb("#fff", "#f00");
	var selectedCells;
/*
	===========================================
					ADD ELEMENTS
	===========================================
	*/
	var createHeatchart = function() {
			var sampleJsonData = sampleJsonDataForCDM["weather_category_data"];
			
			var min = 999;
			var max = -999;
			var l;
			//console.log(sampleJsonData);
			for (var rowNum = 0; rowNum < sampleJsonData.length; rowNum++) {
				for (var colNum = 0; colNum < sampleJsonData[0]["location_category_data"].length; colNum++) {
					sampleJsonData[rowNum]["location_category_data"][colNum]['row'] = rowNum;
					sampleJsonData[rowNum]["location_category_data"][colNum]['col'] = colNum;
					
					l = sampleJsonData[rowNum]["location_category_data"][colNum]["num_of_fatalities"];
					if (l > max) {
						max = l;
					}
					if (l < min) {
						min = l;
					}
				}
			}
			var tooltip = d3.select("body").append("div").style("position", "absolute").style("z-index", "10").style("visibility", "hidden").text("a simple tooltip");
			var heatchart = d3.select(elementName).append("svg").attr("width", width).attr("height", height);
			//console.log(samplejson);
			var selectedHeatChart = heatchart.selectAll("g").data(sampleJsonData).enter().append("g");
			addLawModeGrid(false, selectedHeatChart, min, max);
		};
/*
	===========================================
					UPDATE ELEMENTS
	===========================================
	*/
	this.updateHeatchart = function() {
		var min = 999;
		var max = -999;
		var l;
		for (var rowNum = 0; rowNum < matrixDataset.length; rowNum++) {
			for (var colNum = 0; colNum < numCols; colNum++) {
				l = matrixDataset[rowNum][colNum].points.length;
				if (l > max) {
					max = l;
				}
				if (l < min) {
					min = l;
				}
			}
		}
		var tooltip = d3.select("body").append("div").style("position", "absolute").style("z-index", "10").style("visibility", "hidden").text("a simple tooltip");
		var heatchart = d3.select(elementName).select("svg");
		var selectedHeatChart = heatchart.selectAll("g").data(matrixDataset);
		addLawModeGrid(true, selectedHeatChart, min, max);
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
					//console.log(d);
					return d;
				});
			} else {
				selectedRectangles = selectedHeatChart.selectAll("rect").data(function(d) {
					return d["location_category_data"];
				}).enter().append("rect");
			}
			selectedElements = selectedRectangles.attr("x", function(d, i) {
				return d.col * (width / numCols);
			}).attr("y", function(d, i) {
				return d.row * (height / numRows);
			}).attr("width", width / numCols)
			.attr("height", height / numRows)
			.attr("fill", function(d, i) {
				return color((d["num_of_fatalities"] - min) / (max - min));
			}).attr("stroke", cellStrokeColor).attr("cell", function(d) {
				return "r" + d.row + "c" + d.col;
			});
			addHoverClickAttributes(selectedElements);
		}
	var addLawModeGrid = function(update, selectedHeatChart, min, max) {
			var tooltip = d3.select("body").append("div").style("position", "absolute").style("z-index", "10").style("visibility", "hidden").text("a simple tooltip");
			//work on top triangles
			var topSelectedPolygons;
			var bottomSelectedPolygons;
			if (update) {
				bottomSelectedPolygons = selectedHeatChart.selectAll("polygon#bottomTriangle").data(function(d) {
					return d["location_category_data"];
				});
				topSelectedPolygons = selectedHeatChart.selectAll("polygon#topTriangle").data(function(d) {
					return d["location_category_data"];
				});
			} else {
				selectedPolygons = selectedHeatChart.selectAll("polygon").data(function(d) {
					return d["location_category_data"];
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
				var firstPoint = topX + "," + topY;
				var secondPoint = (topX + widthOfSquare) + "," + topY;
				var thirdPoint = topX + "," + (topY + heightOfSquare);
				//console.log(firstPoint + " " + secondPoint + " " + thirdPoint);
				return firstPoint + " " + secondPoint + " " + thirdPoint;
			}).attr("fill", function(d, i) {
				//console.log(d);
				return lawmodeAllowedColor((d["num_of_fatalities"] - min) / (max - min));
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
				var firstPoint = (topX + widthOfSquare) + "," + topY;
				var secondPoint = (topX + widthOfSquare) + "," + (topY + heightOfSquare);
				var thirdPoint = topX + "," + (topY + heightOfSquare);
				//console.log(firstPoint + " " + secondPoint + " " + thirdPoint);
				return firstPoint + " " + secondPoint + " " + thirdPoint;
			}).attr("fill", function(d, i) {
				//console.log(d);
				return lawmodeProhibitedColor(d["num_of_fatalities"] / (max - min));
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
			var tooltip = d3.select("body").append("div").style("position", "absolute").style("z-index", "10").style("visibility", "hidden").text("a simple tooltip");
			selectedElements.on("mouseover", function(d) {
				onCellOver(this, d);
				tooltip.text("Cell: [" + d.col + "," + d.row + "]");
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
			d3.select(cell).attr("stroke", selectedCellStrokeColor).attr("stroke-width", 1);
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
		createHeatchart();
	};
/*
	===========================================
			DATA SET MANPULATION
	===========================================
	*/
	this.updateDataset = function(newCells) {
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
		
		var sampleJsonDataForCDM = {
	"data_group_id": 2,
	"weather_category_data":[
		{
			"category_weather": "rainy",
			"location_category_data":
			[
				{
					"category_location": "sidewalk",
					"num_of_fatalities": 60 
				},
				{
					"category_location": "crosswalk",
					"num_of_fatalities": 50
				},
				{
					"category_location": "road",
					"num_of_fatalities": 75
				},
				{
					"category_location": "building",
					"num_of_fatalities": 83 
				},
				{
					"category_location": "intersection",
					"num_of_fatalities": 43 
				},
				{
					"category_location": "middle lane",
					"num_of_fatalities": 23 
				},
				{
					"category_location": "right lane",
					"num_of_fatalities": 41 
				},
				{
					"category_location": "bicycle lane",
					"num_of_fatalities": 68 
				}
			]
		},
		{
			"category_weather": "sunny",
			"location_category_data":
			[
				{
					"category_location": "sidewalk",
					"num_of_fatalities": 60 
				},
				{
					"category_location": "crosswalk",
					"num_of_fatalities": 15
				},
				{
					"category_location": "road",
					"num_of_fatalities": 93
				},
				{
					"category_location": "building",
					"num_of_fatalities": 3 
				},
				{
					"category_location": "intersection",
					"num_of_fatalities": 43 
				},
				{
					"category_location": "middle lane",
					"num_of_fatalities": 23 
				},
				{
					"category_location": "right lane",
					"num_of_fatalities": 41 
				},
				{
					"category_location": "bicycle lane",
					"num_of_fatalities": 18 
				}
			]
		},
		{
			"category_weather": "windy",
			"location_category_data":
			[
				{
					"category_location": "sidewalk",
					"num_of_fatalities": 40 
				},
				{
					"category_location": "crosswalk",
					"num_of_fatalities": 51
				},
				{
					"category_location": "road",
					"num_of_fatalities": 35
				},
				{
					"category_location": "building",
					"num_of_fatalities": 43 
				},
				{
					"category_location": "intersection",
					"num_of_fatalities": 13 
				},
				{
					"category_location": "middle lane",
					"num_of_fatalities": 73 
				},
				{
					"category_location": "right lane",
					"num_of_fatalities": 11 
				},
				{
					"category_location": "bicycle lane",
					"num_of_fatalities": 8 
				}
			]
		},
		{
			"category_weather": "blowing snow",
			"location_category_data":
			[
				{
					"category_location": "sidewalk",
					"num_of_fatalities": 67 
				},
				{
					"category_location": "crosswalk",
					"num_of_fatalities": 10
				},
				{
					"category_location": "road",
					"num_of_fatalities": 75
				},
				{
					"category_location": "building",
					"num_of_fatalities": 53 
				},
				{
					"category_location": "intersection",
					"num_of_fatalities": 43 
				},
				{
					"category_location": "middle lane",
					"num_of_fatalities": 3 
				},
				{
					"category_location": "right lane",
					"num_of_fatalities": 40 
				},
				{
					"category_location": "bicycle lane",
					"num_of_fatalities": 8 
				}
			]
		},
		{
			"category_weather": "thunder",
			"location_category_data":
			[
				{
					"category_location": "sidewalk",
					"num_of_fatalities": 60 
				},
				{
					"category_location": "crosswalk",
					"num_of_fatalities": 50
				},
				{
					"category_location": "road",
					"num_of_fatalities": 75
				},
				{
					"category_location": "building",
					"num_of_fatalities": 83 
				},
				{
					"category_location": "intersection",
					"num_of_fatalities": 43 
				},
				{
					"category_location": "middle lane",
					"num_of_fatalities": 23 
				},
				{
					"category_location": "right lane",
					"num_of_fatalities": 41 
				},
				{
					"category_location": "bicycle lane",
					"num_of_fatalities": 68 
				}
			]
		},
		{
			"category_weather": "clear",
			"location_category_data":
			[
				{
					"category_location": "sidewalk",
					"num_of_fatalities": 60 
				},
				{
					"category_location": "crosswalk",
					"num_of_fatalities": 50
				},
				{
					"category_location": "road",
					"num_of_fatalities": 75
				},
				{
					"category_location": "building",
					"num_of_fatalities": 83 
				},
				{
					"category_location": "intersection",
					"num_of_fatalities": 43 
				},
				{
					"category_location": "middle lane",
					"num_of_fatalities": 23 
				},
				{
					"category_location": "right lane",
					"num_of_fatalities": 41 
				},
				{
					"category_location": "bicycle lane",
					"num_of_fatalities": 68 
				}
			]
		},
		{
			"category_weather": "foggy",
			"location_category_data":
			[
				{
					"category_location": "sidewalk",
					"num_of_fatalities": 60 
				},
				{
					"category_location": "crosswalk",
					"num_of_fatalities": 50
				},
				{
					"category_location": "road",
					"num_of_fatalities": 75
				},
				{
					"category_location": "building",
					"num_of_fatalities": 83 
				},
				{
					"category_location": "intersection",
					"num_of_fatalities": 43 
				},
				{
					"category_location": "middle lane",
					"num_of_fatalities": 23 
				},
				{
					"category_location": "right lane",
					"num_of_fatalities": 41 
				},
				{
					"category_location": "bicycle lane",
					"num_of_fatalities": 68 
				}
			]
		},
		{
			"category_weather": "hurricane",
			"location_category_data":
			[
				{
					"category_location": "sidewalk",
					"num_of_fatalities": 60 
				},
				{
					"category_location": "crosswalk",
					"num_of_fatalities": 50
				},
				{
					"category_location": "road",
					"num_of_fatalities": 75
				},
				{
					"category_location": "building",
					"num_of_fatalities": 83 
				},
				{
					"category_location": "intersection",
					"num_of_fatalities": 43 
				},
				{
					"category_location": "middle lane",
					"num_of_fatalities": 23 
				},
				{
					"category_location": "right lane",
					"num_of_fatalities": 41 
				},
				{
					"category_location": "bicycle lane",
					"num_of_fatalities": 68 
				}
			]
		}
	]

};
/*
	===========================================
			Functions to Execute on Load
	===========================================
	*/
		createDefaultSelectedCells();
}