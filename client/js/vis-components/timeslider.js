var chart;

var margin = {top: 12, right: 30, bottom: 20, left: 55},
    width = 770 - margin.left - margin.right,
    height = 70 - margin.top - margin.bottom;

var parseDate = d3.time.format("%b-%Y").parse;


//Gets called when the page is loaded.
function initTimeSlider(){

  ///////////////////////////////
  // Year Overview Line Graph
  ///////////////////////////////
  var x = d3.time.scale()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(10, 0)
    .tickFormat(d3.time.format("%b"));

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

  var chart = d3.select('#timeslider').append('svg')
    .attr("style", "outline: thin solid gray;") 
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var vis = chart.append('svg:g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  d3.csv('data/CoffeeData.csv', function(rawdata) {
    var format = d3.time.format("%m/%d/%Y");
    var monthNameFormat = d3.time.format("%m");
    data_agg = d3.nest()
          .key(function(d) {return monthNameFormat(format.parse(d.date));})
          .rollup(function(d) {return d3.sum(d, function(g) {return g.sales;});})
          .entries(rawdata);

    data_agg.forEach(function(d) {
      d.key = new Date(2014, d.key-1, 1);
      d.values = +d.values;
    });

    x.domain(d3.extent(data_agg, function(d) { return d.key; }));
    y.domain(d3.extent(data_agg, function(d) { return d.values; }));

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

    vis.append("path")
        .attr("class", "line")
        .attr("d", line(data_agg))
        .attr("stroke-width", 2)
        .attr("stroke", "steelblue")
        .attr("fill", "none");

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
function updateTimeSlider(){
  d3.csv('data/CoffeeData.csv', update)
}
//date,sales,profit,region,state,category,type,caffeination

//Callback for when data is loaded
function update(rawdata){
}
