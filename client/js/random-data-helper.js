var generateRandomDataForCategoryDataMatrix = function(cells, numRows, numCols, numPoints, size) {
		//cells = null;
		data = [];
		if (cells === null) {
			cells = getEmptyCells(numRows, numCols);
		} else {
			//console.log("clear cells");
			//console.log(cells);
			clearCells(cells, numRows, numCols);

		}
		var x, y, col, row;
		for (var i = 0; i < numPoints; i++) {
			x = Math.random() * size;
			y = Math.random() * size;
			col = Math.min(Math.floor(x / size * numCols), numCols - 1);
			row = Math.min(Math.floor(y / size * numRows), numRows - 1);
			data.push({
				x: x,
				y: y,
				col: col,
				row: row,
				cell: cells[row][col],
				ind: i
			});
			cells[row][col].points.push(data[data.length - 1]);
		}
		return cells;
	};
var getEmptyCells = function(numRows, numCols) {
		var emptyCells = [];
		for (var rowNum = 0; rowNum < numRows; rowNum++) {
			emptyCells.push([]);
			var row = emptyCells[emptyCells.length - 1];
			for (var colNum = 0; colNum < numCols; colNum++) {
				row.push({
					row: rowNum,
					col: colNum,
					density: 0,
					points: []
				});
			}
		}
		return emptyCells;
	};
var createRandomCells = function(numRows, numCols) {
		var emptyCells = [];
		for (var rowNum = 0; rowNum < numRows; rowNum++) {
			emptyCells.push([]);
			var row = emptyCells[emptyCells.length - 1];
			for (var colNum = 0; colNum < numCols; colNum++) {
				row.push({
					row: rowNum,
					col: colNum,
					density: 0,
					points: []
				});
			}
		}
		return emptyCells;
	};
var clearCells = function(cells, numRows, numCols) {
		for (var rowNum = 0; rowNum < numRows; rowNum++) {
			for (var colNum = 0; colNum < numCols; colNum++) {
				cells[rowNum][colNum].density = 0;
				cells[rowNum][colNum].points = [];
			}
		}
	};