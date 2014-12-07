function MultiLineGraph(sampleData, elementName){
	var chart;
	
	//----DO NOT CHANGE THE ODER OF linesSVG, pointsSVG, and tooltipsSVG.....order creation acts as 'layers'---
	var linesSVG;					//linesSVG will hold a grouping of all the lines to be graphed.  it will be positited in same place as vis (the temp var that has all all the other drawn object) in the initTimeOfDay() fucntion
	var pointsSVG; 					//pointsSVG will hold a grouping of all the circles of 1 line to be graphed.  it will be positited in same place as vis (the temp var that has all all the other drawn object) in the initTimeOfDay() fucntion
	var tooltipsSVG;
	
	var tooltipsDiv;
	
	var mousedLine;
	var xScale;
	var yScale;
	
	var weekdaysEnum;
	
	var test0;
	var test1;
	var test2;
	
	
	//----------------------------JSON TEST OBJECTS-------------------
	var sampleData;
	var graphSets;
	
	
	
	var margin = {top: 100, right: 50, bottom: 20, left: 60},
		width = 770 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;
		
	mousedLine = -1;
	
	//Gets called when the page is loaded.
	this.initTimeOfDay = function(){
	console.log('-------- INIT() -----------\n');
	
	  xScale = d3.scale.linear()
		.range([0, width]);
	
	  yScale = d3.scale.linear()
		.range([height, 0]);
	
	　　weekdaysEnum =  ['3am', '6am', '9am', 'Noon', '3pm', '6pm', '9pm', 'Midnight'];
	
	  var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.ticks(weekdaysEnum.length)
		.tickSize(10, 0)
		.tickFormat(function(d, i){return weekdaysEnum[d];})
	
	  var yAxis = d3.svg.axis()
		.scale(yScale)
		.ticks(10)
		.orient("left");
	
	  var line = d3.svg.line()
		.x(function(d) { return xScale(d.key); })
		.y(function(d) { return yScale(d.values); });
	
	  var brush = d3.svg.brush()
		.x(xScale)
		.on("brush", brushed);
	
	  chart = d3.select(elementName).append('svg')
		.attr("style", "outline: thin solid gray;") 
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);
	
	  var vis = chart.append('svg:g')
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	
		//----DO NOT CHANGE THE ODER OF linesSVG, pointsSVG, and tooltipsSVG.....order creation acts as 'layers'---	
			pointsSVG = chart.append('svg:g')
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");	
			
			linesSVG = chart.append('svg:g')
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");	
			
			tooltipsSVG = chart.append('svg:g')
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");							
	
		
	
	
		console.log('==== json objets made ====\n');
			xScale.domain([0,7]);
			
			allValues = [];
			sampleData.us_average_data.time_category_data.forEach( function(d){
				allValues = allValues.concat(d.values);
			});
			sampleData.state_category_data.forEach( function(d){
				d.time_category_data.forEach( function(d){
					allValues = allValues.concat(d.values);
				});
			});
			yMin = Math.min.apply(Math, allValues);
			yMax = Math.max.apply(Math,allValues);
			yScale.domain([Math.round(0.8*yMin),yMax]);
	
	
		vis.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.selectAll(".tick text")
			.style("text-anchor", "start")
			.attr("x", 4)
			.attr("y", 5);
	
		vis.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		  .append("text")
			.attr("transform", "rotate(0)")
			.attr("x", -6)
			.attr("y", -18)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Fatalities");
		
		
		//---- add the title ----	
		vis.append("g")
			.append("text")
				.attr("transform", "rotate(0)")
				.attr("x", width/2)
				.attr("y", -85)
				.attr("dy", ".71em")
				.attr("font-size", 24)
				.attr("font-family", "arial")
				.attr("text-anchor", "middle")
				.attr("fill", "rgb(0, 0, 0)")
				.text(sampleData.weatherLocation);
				
		//---- add the missing states value string ----	
/* 		if(sampleData.missing_state_values != ''){			
			vis.append("g")
				.append("text")
					.attr("transform", "rotate(0)")
					.attr("x", width/2)
					.attr("y", -60)
					.attr("dy", ".71em")
					.attr("font-size", 18)
					.attr("font-family", "arial")
					.attr("text-anchor", "middle")
					.attr("fill", "rgb(0, 0, 0)")
					.text("No records found for: " + sampleData.missing_state_values);
		} */
	
		console.log('-------- ADDING HIDDEN POINTS -----------\n'); 
		sampleData.state_category_data[0].time_category_data.forEach(function(d) {
			pointsSVG.append("circle")
				.attr("cx", xScale(d.key))
				.attr("cy", yScale(d.values))
				.attr("r", 4)
				.attr("idKey", d.key)
				.attr("stroke-width", 1)
				.attr("stroke-opacity", 0)
				.attr("stroke", "rgb(64, 64, 64)")
				.attr("fill", "#d62728")
				.attr("fill-opacity", 0)
		});
		
		console.log('-------- ADDING HIDDEN TOOLTIPS -----------\n'); 
		sampleData.state_category_data[0].time_category_data.forEach(function(d,i) {
			g = tooltipsSVG.append('svg:g')
				.attr("transform", "translate(" + xScale(-100) + "," + yScale(-100) + ")");					//moving the tool tips off the edge of the svg object window to hide them.			
			g.append("rect")
				.attr("width", 75)
				.attr("height", 35)
				.attr("x", -38)
				.attr("y", -18)
				.attr("stroke-width", 1)
				.attr("stroke-opacity", 1)
				.attr("stroke", "rgb(64, 64, 64)")
				.attr("fill", "rgb(220, 220, 220)")
				.attr("fill-opacity", 0.75);
			t = g.append("text")
				.attr("y", "0")
				.attr("font-size", 11)
				.attr("font-family", "arial")
				.attr("text-anchor", "middle")
				.attr("fill", "rgb(0, 0, 0)");
			t.append("tspan")
				.attr("x", 0)
				.text("Rhode Island");
			t.append("tspan")
				.attr("x", 0)
				.attr("y", "1em")
				//.attr("dY", "0")
				.text(Math.round(d.values * 100)/100);
		});
		tooltipsSVG.attr("opacity", 0);
	
		console.log('-------- GRAPHING US AVERAGE -----------\n'); 
			linesSVG.append("path")
				.attr("class", "line")
				.attr("idKey", sampleData.us_average_data.category_state)
				.attr("d", line(sampleData.us_average_data.time_category_data))
				.attr("stroke-width", 2)
				.attr("stroke-opacity", 0.5)
				.attr("stroke", "#2ca02c")
				.attr("fill", "none")
				.on('mouseover', function(d){
					mousedLine = this.getAttribute('idKey');
					//d3.select(this).attr("stroke-opacity", 1.0);
					update();
				})
				.on('mousemove', function(d){
					//console.log('path-line ' + this.getAttribute('idKey') + ' mousemove\n'); 
					mousedLine = this.getAttribute('idKey');
					//d3.select(this).attr("stroke-opacity", 1.0);
					update();
				})
				.on('mouseout', function(d){
					mousedLine = -1;
					//d3.select(this).attr("stroke-opacity", 0.5);
					update();
			});
			
		console.log('-------- BATCH GRAPHING ALL LINES OF All STATES -----------\n'); 
		if(sampleData.law_mode == 1){
				sampleData.state_category_data.forEach(function(d){
						if(d.law_data == "yes"){	
							linesSVG.append("path")
								.attr("class", "line")
								.attr("idKey", d.category_state)
								.attr("d", line(d.time_category_data))
								.attr("stroke-width", 2)
								.attr("stroke-opacity", 0.5)
								.attr("stroke", "#1f77b4")
								.attr("fill", "none")
								.on('mouseover', function(d){
									mousedLine = this.getAttribute('idKey');
									//d3.select(this).attr("stroke-opacity", 1.0);
									update();
								})
								.on('mousemove', function(d){
									//console.log('path-line ' + this.getAttribute('idKey') + ' mousemove\n'); 
									mousedLine = this.getAttribute('idKey');
									//d3.select(this).attr("stroke-opacity", 1.0);
									update();
								})
								.on('mouseout', function(d){
									mousedLine = -1;
									//d3.select(this).attr("stroke-opacity", 0.5);
									update();
								});
						} else{
								linesSVG.append("path")
									.attr("class", "line")
									.attr("idKey", d.category_state)
									.attr("d", line(d.time_category_data))
									.attr("stroke-width", 2)
									.attr("stroke-opacity", 0.5)
									.attr("stroke", "rgb(255, 0, 0)")
									.attr("fill", "none")
									.on('mouseover', function(d){
										mousedLine = this.getAttribute('idKey');
										//d3.select(this).attr("stroke-opacity", 1.0);
										update();
									})
									.on('mousemove', function(d){
										//console.log('path-line ' + this.getAttribute('idKey') + ' mousemove\n'); 
										mousedLine = this.getAttribute('idKey');
										//d3.select(this).attr("stroke-opacity", 1.0);
										update();
									})
									.on('mouseout', function(d){
										mousedLine = -1;
										//d3.select(this).attr("stroke-opacity", 0.5);
										update();
									});
							}	
					});
		}
		else{
				sampleData.state_category_data.forEach(function(d){
					linesSVG.append("path")
						.attr("class", "line")
						.attr("idKey", d.category_state)
						.attr("d", line(d.time_category_data))
						.attr("stroke-width", 2)
						.attr("stroke-opacity", 0.5)
						.attr("stroke", "rgb(128, 128, 128)")
						.attr("fill", "none")
						.on('mouseover', function(d){
							mousedLine = this.getAttribute('idKey');
							//d3.select(this).attr("stroke-opacity", 1.0);
							update();
						})
						.on('mousemove', function(d){
							//console.log('path-line ' + this.getAttribute('idKey') + ' mousemove\n'); 
							mousedLine = this.getAttribute('idKey');
							//d3.select(this).attr("stroke-opacity", 1.0);
							update();
						})
						.on('mouseout', function(d){
							mousedLine = -1;
							//d3.select(this).attr("stroke-opacity", 0.5);
							update();
						});
				});
		}
		
	
	
	
		this.test1 = linesSVG.selectAll("path.line");
		this.test2 = pointsSVG.selectAll("circle");
		this.test3 = tooltipsSVG.selectAll('g');
				
		vis.append("g")
			.append("rect")
	
	  function brushed() {
		x.domain(brush.empty() ? x2.domain() : brush.extent());
		focus.select(".area").attr("d", area);
		focus.select(".x.axis").call(xAxis);
	  }
	
	
	  
	}
	
	
	
	
	//Callback for when data is loaded
	//update will be used to redraw the lines and apply the mouseover color intensity effects
	function update(rawdata){
		console.log('----WARNING: ITEMS ARE DRAWN IN LAYERS IN THE ODER IN WHICH THEIR SVG ELEMENT WAS CREATED------\n'); 
		//console.log('mousedLine ' + mousedLine +'\n');
		linesSVG.selectAll("path.line").each(function(d,i){						//<----------use .each for d3 selections (can use 'this'), and .forEach for traditional arrays 
			lineIDX = i;
			if(mousedLine !== -1){
				//----DO NOT CHANGE THE ORDER OF THESE CHECKS...
				//....THE COLORING OF THE DATA POINTS IMPLICITLY DEPENDS ON IT!!!!!!-----
					if( "US Average" === this.getAttribute('idKey')) {
						//console.log('modifying line ' + mousedLine + '\n'); 
						d3.select(this).attr("stroke-opacity", 0.75);
						d3.select(this).attr("stroke-width", 4);
						pointsSVG.selectAll("circle").each(function(d,i){	
							d3.select(this).attr("cx", xScale(parseInt(sampleData.us_average_data.time_category_data[i].key)))
							d3.select(this).attr("cy", yScale(sampleData.us_average_data.time_category_data[i].values))							
							d3.select(this).attr("r", 6)
							d3.select(this).attr("idKey", parseInt(sampleData.us_average_data.time_category_data[i].key))
							d3.select(this).attr("stroke-width", 1)
							d3.select(this).attr("stroke-opacity", 0.85)
							d3.select(this).attr("stroke", "rgb(64, 64, 64)")
							//d3.select(this).attr("fill", "rgb(255, 0, 0)")
							//d3.select(this).attr("fill-opacity", 0.5)	
						}); 
						tooltipsSVG.selectAll('g').each(function(d,i) {			
							d3.select(this).attr("transform", "translate(" + xScale(parseInt(sampleData.us_average_data.time_category_data[i].key)) + "," + yScale(sampleData.us_average_data.time_category_data[i].values - 35) + ")");
							t = d3.select(this).select("text");
							ts = t.selectAll("tspan");
							ts[0][0].textContent = sampleData.us_average_data.category_state;
							ts[0][1].textContent = Math.round(sampleData.us_average_data.time_category_data[i].values * 100)/100;							 
	
						});
					}
					else if(mousedLine === this.getAttribute('idKey')) {
						//apply no oppacity to the line that has been mousedOver.
						//make the line thicker
							//console.log('points on lineIDX = ' + lineIDX + '\n');
						d3.select(this).attr("stroke-opacity", 0.75);
						d3.select(this).attr("stroke-width", 4);
						//-------move the points to the one for the selected line-----
							pointsSVG.selectAll("circle").each(function(d,i){	
								d3.select(this).attr("cx", xScale(parseInt(sampleData.state_category_data[lineIDX-1].time_category_data[i].key)))			//lineIDX-1 because svg idexing it 1 indexed and d3 javascript is 0 indexed
								d3.select(this).attr("cy", yScale(sampleData.state_category_data[lineIDX-1].time_category_data[i].values))							
								d3.select(this).attr("r", 6)
								d3.select(this).attr("idKey", parseInt(sampleData.state_category_data[lineIDX-1].time_category_data[i].key))
								d3.select(this).attr("stroke-width", 1)
								d3.select(this).attr("stroke-opacity", 0.85)
								d3.select(this).attr("stroke", "rgb(64, 64, 64)")
								//d3.select(this).attr("fill", "rgb(0, 0, 255)")
								//d3.select(this).attr("fill-opacity", 0.5)	
							}); 
						tooltipsSVG.selectAll('g').each(function(d,i1) {		
							d3.select(this).attr("transform", "translate(" + xScale(parseInt(sampleData.state_category_data[lineIDX-1].time_category_data[i1].key)) + "," + yScale(sampleData.state_category_data[lineIDX-1].time_category_data[i1].values) + 35 + ")");
							t = d3.select(this).select("text");
							ts = t.selectAll("tspan");
							ts[0][0].textContent = sampleData.state_category_data[lineIDX-1].category_state;
							ts[0][1].textContent = Math.round(sampleData.state_category_data[lineIDX-1].time_category_data[i1].values * 100)/100;							 
	
						});
					}
					else {
						// dim the non-moused over lines
						d3.select(this).attr("stroke-opacity", 0.2);
						d3.select(this).attr("stroke-width", 2);
					}
					tooltipsSVG.attr("opacity", 0.85);	
			}
			else {
	
				//-------- Reset all lines to default ----------
					if( "US Average" === this.getAttribute('idKey')) {
						// reset the US Average line
						d3.select(this).attr("stroke-opacity", 0.5);
						d3.select(this).attr("stroke-width", 4);
					} else {
						// reset all the other lines
						d3.select(this).attr("stroke-opacity", 0.5);
						d3.select(this).attr("stroke-width", 2);
					}
	
					//-------hide all the points-----
						pointsSVG.selectAll("circle").each(function(d,i){
							d3.select(this).attr("cx", xScale(-100))
							d3.select(this).attr("cy", yScale(-100))						
							d3.select(this).attr("stroke-opacity", 0)
							d3.select(this).attr("fill-opacity", 0)	
						}); 				
					//--------- Move and hide all tool tips and points to keep them out of the way ---------				
						tooltipsSVG.selectAll('g').each(function(d,i) {		
								d3.select(this).attr("transform", "translate(" + xScale(-100) + "," + yScale(-100) + ")");					//moving the tool tips off the edge of the svg object window to hide them.
								/*
									t = d3.select(this).select("text");
									t.selectAll("tspan").each( function(d,i) {
										d3.select(this).text(Math.round(0 * 100)/100);
										
									})
								*/
						});
						tooltipsSVG.attr("opacity", 0);						
	
			}
	
		});
		
		this.test1 = linesSVG.selectAll("path.line");
		this.test2 = pointsSVG.selectAll("circle");
		this.test3 = tooltipsSVG.selectAll('g');
	}
}
