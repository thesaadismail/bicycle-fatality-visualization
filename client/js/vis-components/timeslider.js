var OVchart;

var OVmargin = {top: 12, right: 30, bottom: 20, left: 55},
    OVwidth = 770 - OVmargin.left - OVmargin.right,
    OVheight = 70 - OVmargin.top - OVmargin.bottom;

var OVparseDate = d3.time.format("%b-%Y").parse;


//Gets called when the page is loaded.
function initTimeSlider(){

  ///////////////////////////////
  // Year Overview Line Graph
  ///////////////////////////////
  var OVx = d3.time.scale()
    .range([0, OVwidth]);

  var OVy = d3.scale.linear()
    .range([OVheight, 0]);

  var OVxAxis = d3.svg.axis()
    .scale(OVx)
    .orient("bottom")
    .tickSize(10, 0)
    .tickFormat(d3.time.format("%b"));

  var OVyAxis = d3.svg.axis()
    .scale(OVy)
    .ticks(3)
    .orient("left");

  var OVbrush = d3.svg.brush()
    .x(OVx)
    .on("brush", OVbrushed);

  var OVarea = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return OVx(d["month_id"]); })
    .y0(height)
    .y1(function(d) { return OVy(d["num_of_fatalities"]); });

  var OVchart = d3.select('#timeslider').append('svg')
    .attr("style", "outline: thin solid gray;") 
    .attr("width", OVwidth + OVmargin.left + OVmargin.right)
    .attr("height", OVheight + OVmargin.top + OVmargin.bottom);

  OVchart.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", OVwidth)
      .attr("height", OVheight);

  var OVvis = OVchart.append('svg:g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  // d3.csv('client/data/CoffeeData.csv', function(data) {
    // rawdata = d3.csv('client/data/CoffeeData.csv');
    // var OVformat = d3.time.format("%m/%d/%Y");
    // var OVmonthNameFormat = d3.time.format("%m");
    // OVdata_agg = d3.nest()
    //       .key(function(d) {return OVmonthNameFormat(OVformat.parse(d.date));})
    //       .rollup(function(d) {return d3.sum(d, function(g) {return g.sales;});})
    //       .entries(rawdata);
    // });

    var sampledata = {
      "data_group_id":1,
      "overview_data":[
        {
        "month_id":0,
        "num_of_fatalities":45
        },
        {
        "month_id":1,
        "num_of_fatalities":45
        },
        {
        "month_id":2,
        "num_of_fatalities":45
        },
        {
        "month_id":3,
        "num_of_fatalities":45
        },
        {
        "month_id":4,
        "num_of_fatalities":45
        },
        {
        "month_id":5,
        "num_of_fatalities":45
        },
        {
        "month_id":6,
        "num_of_fatalities":43
        },
        {
        "month_id":7,
        "num_of_fatalities":42
        },
        {
        "month_id":8,
        "num_of_fatalities":45
        },
        {
        "month_id":9,
        "num_of_fatalities":45
        },
        {
        "month_id":10,
        "num_of_fatalities":45
        },
        {
        "month_id":11,
        "num_of_fatalities":40
        }
      ]       
      };

    var OVdata_agg = sampledata["overview_data"];
    OVdata_agg.forEach(function(d) {
      d["month_id"] = new Date(2014, d["month_id"], 1);
    });

    OVx.domain(d3.extent(OVdata_agg, function(d) { return d["month_id"]; }));
    OVy.domain(d3.extent(OVdata_agg, function(d) { return d["num_of_fatalities"]; }));
    
    OVvis.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + OVheight + ")")
        .call(OVxAxis)
        .selectAll(".tick text")
        .style("text-anchor", "start")
        .attr("x", 4)
        .attr("y", 5);

    OVvis.append("g")
        .attr("class", "y axis")
        .call(OVyAxis)
      .append("text")
        .attr("transform", "rotate(0)")
        .attr("x", -6)
        .attr("y", -6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Fatalities");

    OVvis.append("path")
        .datum(OVdata_agg)
        .attr("class", "area")
        .attr("d", OVarea);

    OVvis.append("g")
        .attr("class", "x brush")
        .call(OVbrush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", OVheight + 7);

    OVvis.append("g")
        .append("rect")


  function OVbrushed() {
    OVbrush.empty() ? tmp = OVx.domain() : tmp = OVbrush.extent();
    var OVmonthNameFormat = d3.time.format("%m");
    console.log(OVmonthNameFormat(tmp[0])+"---"+OVmonthNameFormat(tmp[1]));
    // vis.select(".area").attr("d", area);
    // vis.select(".x.axis").call(xAxis);
  }
  
}

//Called when the update button is clicked
function updateTimeSlider(){
  d3.csv('client/data/CoffeeData.csv', update)
}
//date,sales,profit,region,state,category,type,caffeination

//Callback for when data is loaded
function update(rawdata){
}
