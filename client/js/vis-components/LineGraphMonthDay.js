var chart;
var data_month_day_obj;
var data_month_day;
var data_day_avg;
var linesSVG;					//linesSVG will hold a grouping of all the lines to be graphed.  it will be positited in same place as vis (the temp var that has all all the other drawn object) in the initTimeOfDay() fucntion
var mousedLine;

var test;


var margin = {top: 12, right: 30, bottom: 20, left: 55},
    width = 770 - margin.left - margin.right,
    //height = 70 - margin.top - margin.bottom;
	height = 200 - margin.top - margin.bottom;
	
mousedLine = -1;

//Gets called when the page is loaded.
function initTimeOfDay(){
console.log('-------- INIT() -----------\n');

  var x = d3.scale.linear()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var weekdaysEnum =  ['Sun.', 'Mon.', 'Tues.', 'Wed.', 'Thur.', 'Fri.', 'Sat.'];

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
	.ticks(weekdaysEnum.length)
    .tickSize(10, 0)
	//.tickFormat(d3.time.format("%w"));
	.tickFormat(function(d, i){return weekdaysEnum[d];})

  var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(4)
    .orient("left");

  var line = d3.svg.line()
    .x(function(d) { return x(d.key); })
    .y(function(d) { return y(d.values); });

  var brush = d3.svg.brush()
    .x(x)
    .on("brush", brushed);

  var chart = d3.select('#timeOfDay').append('svg')
    .attr("style", "outline: thin solid gray;") 
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var vis = chart.append('svg:g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	linesSVG = chart.append('svg:g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");							

//WILL GRAPH 12 LINES (1 FOR EACH MONTH) AND SHOW THE SUMMED VALUES FOR THAT MOTHN EACH DAY TICK ON THE X AXIS
	
//----------------Month & Daily data-----------
  data_month_day_obj = d3.csv('data/CoffeeRandDatesCopiedTime.csv', function(rawdata) {
 
    var format = d3.time.format("%m/%d/%Y");
    var monthNameFormat = d3.time.format("%m");
    var dayNameFormat = d3.time.format("%w");
	
console.log('-------- Starting Month & Day Gouprings -----------\n');
	data_month_day = d3.nest()
         .key(function(d) {return monthNameFormat(format.parse(d.date));}).sortKeys(d3.ascending)
		 .key(function(d) {return dayNameFormat(format.parse(d.date));}).sortKeys(d3.ascending)
		 .rollup(function(d) {return d3.mean(d, function(g) {return +g.sales;});})							//....need to put +g.sales, or else it will not calculate the average correctly
         .entries(rawdata);
		 
console.log('-------- Starting Day Averages ----------\n');
monthCount = data_month_day.length;
dayCount = data_month_day[0].values.length;
data_day_avg = {key: 'US Average', values: [dayCount]};
for(d = 0; d < dayCount; d ++){
	daySum = 0;
	for(m = 0; m < monthCount; m++){
		daySum += +data_month_day[m].values[d].values;
	}
	data_day_avg.values[d] = { key: d.toString(), values: (daySum/monthCount) };
}

	
    //x.domain(d3.extent(data_agg, function(d) { return d.key; }));
	x.domain([0,6]);
    //y.domain(d3.extent(data_agg, function(d) { return d.values; }));
	y.domain([150,300]);


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
        .attr("y", -6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Fatalities");


/*
console.log('-------- BATCH GRAPHING ALL LINES OF All MONTHS -----------\n'); 
data_month_day.forEach(function(d) {   
	vis.append("path")
        .attr("class", "line")
        .attr("d", line(d.values))
        .attr("stroke-width", 2)
		.attr("stroke-opacity", 0.5)
        .attr("stroke", "rgb(0, 0, 255)")
        .attr("fill", "none");
});

console.log('-------- GRAPHING AVERAGE OF ALL LINES -----------\n'); 
	vis.append("path")
        .attr("class", "line")
        .attr("d", line(data_day_avg))
        .attr("stroke-width", 5)
		.attr("stroke-opacity", 0.5)
        .attr("stroke", "rgb(255, 0, 0)")
        .attr("fill", "none");
*/
console.log('-------- GRAPHING AVERAGE OF ALL LINES -----------\n'); 
	linesSVG.append("path")
        .attr("class", "line")
		.attr("idKey", data_day_avg.key)
        .attr("d", line(data_day_avg.values))
        .attr("stroke-width", 4)
		.attr("stroke-opacity", 0.5)
        .attr("stroke", "rgb(255, 0, 0)")
        .attr("fill", "none");
		
		
console.log('-------- BATCH GRAPHING ALL LINES OF All MONTHS -----------\n'); 
data_month_day.forEach(function(d) {   
	linesSVG.append("path")
        .attr("class", "line")
		.attr("idKey", d.key)
        .attr("d", line(d.values))
        .attr("stroke-width", 2)
		.attr("stroke-opacity", 0.5)
        .attr("stroke", "rgb(0, 0, 255)")
        .attr("fill", "none")
		.on('mouseover', function(d){
			console.log('path-line ' + this.getAttribute('idKey') + ' mouseover\n'); 
			mousedLine = this.getAttribute('idKey');
			//d3.select(this).attr("stroke-opacity", 1.0);
			update();
		})
		.on('mousemove', function(d){
			console.log('path-line ' + this.getAttribute('idKey') + ' mousemove\n'); 
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




			
    vis.append("g")
        .append("rect")

  });

  function brushed() {
    x.domain(brush.empty() ? x2.domain() : brush.extent());
    focus.select(".area").attr("d", area);
    focus.select(".x.axis").call(xAxis);
  }


  
}

//Called when the update button is clicked
function updateClicked(){
  d3.csv('data/CoffeeData.csv', update)
}
//date,sales,profit,region,state,category,type,caffeination

//Callback for when data is loaded
//update will be used to redraw the lines and apply the mouseover color intensity effects
function update(rawdata){
	//test = linesSVG.selectAll("path.line");
	console.log('---> UPDATING\n'); 	
	linesSVG.selectAll("path.line").each(function(d){						//<----------use .each for d3 selections (can use 'this'), and .forEach for traditional arrays 
		if(mousedLine !== -1){
			if(mousedLine === this.getAttribute('idKey')){
				//apply no oppacity to the line that has been mousedOver.
				//make theline thicker
				console.log('modifying line ' + mousedLine + '\n'); 
				d3.select(this).attr("stroke-opacity", 0.75);
				d3.select(this).attr("stroke-width", 4)
			} else if( "US Average" === this.getAttribute('idKey')) {
				console.log('modifying line ' + mousedLine + '\n'); 
				d3.select(this).attr("stroke-opacity", 0.75);
				d3.select(this).attr("stroke-width", 4)

			} else {
				// dim the non-moused over lines
				d3.select(this).attr("stroke-opacity", 0.2);
				d3.select(this).attr("stroke-width", 2)
			}
		} else {
			if( "US Average" === this.getAttribute('idKey')) {
				// reset the US Average line
				d3.select(this).attr("stroke-opacity", 0.5);
				d3.select(this).attr("stroke-width", 4)
			} else {
				// reset all the other lines
				d3.select(this).attr("stroke-opacity", 0.5);
				d3.select(this).attr("stroke-width", 2)
			}
		}
		
	});
		
	
}

// Returns the selected option in the X-axis dropdown. Use d[getXSelectedOption()] to retrieve value instead of d.getXSelectedOption()
function getXSelectedOption(){
  var node = d3.select('#xdropdown').node()
  var i = node.selectedIndex
  return node[i].value
}

// Returns the selected option in the Y-axis dropdown. 
function getYSelectedOption(){
  var node = d3.select('#ydropdown').node()
  var i = node.selectedIndex
  return node[i].value
}// JavaScript Document