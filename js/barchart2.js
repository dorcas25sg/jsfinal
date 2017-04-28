var margin = {top: 50, right: 55, bottom: 10, left: 115},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], 0.3);

var x = d3.scale.linear()
    .rangeRound([0, width]);

var color = d3.scale.ordinal()
    .range(["#ADD8E6", "#F08080"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#figurebar").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "d3-plot")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  color.domain(["Male", "Female"]);

  d3.csv("data/2016data.csv", function(error, data) {

  data.forEach(function(d) {
    // calc percentages
    d["Male"] = +d.M/1000;
    d["Female"] = +d.F/1000;
    var x0 = -1*(d["Male"]);
    var idx = 0;
    d.boxes = color.domain().map(function(name) { return {name: name, x0: x0, x1: x0 += +d[name], N: +d.N, n: +d[idx += 1]}; });
  });

  var min_val = d3.min(data, function(d) {
          return d.boxes["0"].x0;
          });

  var max_val = d3.max(data, function(d) {
          return d.boxes["1"].x1;
          });

  x.domain([min_val, max_val]).nice();
  y.domain(data.map(function(d) { return d.T; }));

  svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var vakken = svg.selectAll(".question")
      .data(data);

      vakken.enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(0," + y(d.T) + ")"; });

  var bars = vakken.selectAll("rect")
      .data(function(d) { return d.boxes; });

    bars.enter()
    .append("rect")
      .attr("height", y.rangeBand())
      .attr("x", function(d) { return x(d.x0); })
      .attr("width", function(d) { return x(d.x1) - x(d.x0); })
      .style("fill", function(d) { return color(d.name); });

  svg.append("g")
      .attr("class", "y axis")
  .append("line")
      .attr("x1", x(0))
      .attr("x2", x(0))
      .attr("y2", height);

  var startp = svg.append("g").attr("class", "legendbox").attr("id", "mylegendbox");
  var legend_tabs = [0, 120, 200, 375, 450];
  var legend = startp.selectAll(".legend")
      .data(color.domain().slice())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + legend_tabs[i] + ",-45)"; });

  // for pretty legend
  legend.append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", 22)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "begin")
      .style("font" ,"10px sans-serif")
      .text(function(d) { return d; });

  // for pretty x and y axis
  d3.selectAll(".axis path")
      .style("fill", "none")
      .style("stroke", "#000")
      .style("shape-rendering", "crispEdges");

  d3.selectAll(".axis line")
      .style("fill", "none")
      .style("stroke", "#000")
      .style("shape-rendering", "crispEdges");

  var movesize = width/2 - startp.node().getBBox().width/2;
  d3.selectAll(".legendbox").attr("transform", "translate(" + movesize  + ",0)");


//On click, update with new data
d3.select('#toolbar2')
  .selectAll('.button')
  .on("click", function() {

      // Remove active class from all buttons
      d3.selectAll('.button').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var buttonId = button.attr('id');

  //remove bars from previous plot
  svg.selectAll("rect")
  .transition()
  .duration(1000)
  .style("fill-opacity", 0.3 ).style("fill", function(d) { return color(d.name); })
  .remove();


    d3.csv(buttonId, function(data) {

    data.forEach(function(d) {
      d["Male"] = +d.M/1000;
      d["Female"] = +d.F/1000;
      var x0 = -1*(d["Male"]);
      var idx = 0;
      d.boxes = color.domain().map(function(name) { return {name: name, x0: x0, x1: x0 += +d[name], N: +d.N, n: +d[idx += 1]}; });
    });

    var vakken = svg.selectAll(".question")
        .data(data)
      .enter().append("g")
        .attr("transform", function(d) { return "translate(0," + y(d.T) + ")"; });

   var bars = vakken.selectAll("rect")
        .data(function(d) { return d.boxes; });

    bars.enter()
        .append("rect")
        .transition()
        .duration(100)
          .each('start', function () {
            d3.select(this).style("fill-opacity", 0.3);})
        .transition()
        .duration(1100)
        .style("fill-opacity", 1 ).style("fill", function(d) { return color(d.name); })
        .attr("height", y.rangeBand())
        .attr("x", function(d) { return x(d.x0); })
        .attr("width", function(d) { return x(d.x1) - x(d.x0); });

    });
  });
});
