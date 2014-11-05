function CategoryDataMatrix(elementName, cells, size) { // constructor function
	//var elementName;
	var matrixDataset = cells;
	var numRows = matrixDataset.length,
		numCols = matrixDataset[0].length,
		data = null,
		color = d3.interpolateRgb("#fff", "#f00");
	var selectCell = function(cell) {
			d3.select(cell).attr("stroke", "#f00").attr("stroke-width", 3);
			cell.parentNode.parentNode.appendChild(cell.parentNode);
			cell.parentNode.appendChild(cell);
		};
	var deselectCell = function(cell) {
			d3.select(cell).attr("stroke", "#fff").attr("stroke-width", 1);
		};
	var onCellOver = function(cell, data) {
			selectCell(cell);
		};
	var onCellOut = function(cell, data) {
			deselectCell(cell);
		};
	var createHeatchart = function() {
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
			//setup x & y axes
			var heatchart = d3.select(elementName).append("svg:svg").attr("width", size).attr("height", size);
			heatchart.selectAll("g").data(matrixDataset).enter().append("svg:g").selectAll("rect").data(function(d) {
				return d;
			}).enter().append("svg:rect").attr("x", function(d, i) {
				return d.col * (size / numCols);
			}).attr("y", function(d, i) {
				return d.row * (size / numRows);
			}).attr("width", size / numCols).attr("height", size / numRows).attr("fill", function(d, i) {
				return color((d.points.length - min) / (max - min));
			}).attr("stroke", "#fff").attr("cell", function(d) {
				return "r" + d.row + "c" + d.col;
			}).on("mouseover", function(d) {
				onCellOver(this, d);
				tooltip.text("Cell: [" + d.col + "," + d.row + "]");
				tooltip.style("visibility", "visible");
			}).on("mousemove", function(d) {
				tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
			}).on("mouseout", function(d) {
				onCellOut(this, d);
				tooltip.style("visibility", "hidden");
			}).on("click", function(d) {
				console.log("clicking: [" + d.col + "," + d.row + "]");
			});
		};
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
		d3.select(elementName).select("svg").selectAll("g").data(matrixDataset).selectAll("rect").data(function(d) {
			return d;
		}).attr("x", function(d, i) {
			return d.col * (size / numCols);
		}).attr("y", function(d, i) {
			return d.row * (size / numRows);
		}).attr("fill", function(d, i) {
			return color((d.points.length - min) / (max - min));
		}).attr("cell", function(d) {
			return "r" + d.row + "c" + d.col;
		}).on("mouseover", function(d) {
			onCellOver(this, d);
		}).on("mouseout", function(d) {
			onCellOut(this, d);
		}).on("click", function(d) {
			console.log("clicking: [" + d.col + "," + d.row + "]");
		});
	};
	this.initDataMatrix = function() {
		createHeatchart();
	};
}