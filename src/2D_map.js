 // Load the GeoJSON file
 d3.json("Borough Boundaries.geojson")
 .then(function(data) {
   // Create an SVG element
var svg = d3.select("#map");
var center = [-74, 40.7];
var translation = [800 / 2, 600 / 2];

const projection = d3.geoNaturalEarth1()
     .rotate([0, 0])
     .center(center) // WorldSpace: Latitude and longitude of the center of Switzerland
     .scale(53000)
     .translate(translation) // SVG space
     .precision(.1);

var colors = ["steelblue", "green", "red", "orange", "purple"];
var darkerColors = colors.map(function(color) {
 var rgb = d3.rgb(color);
 var darkerRgb = rgb.darker(0.5); 
 return darkerRgb.toString();
});

   var opacity = 0.5;

   // Create a GeoPath generator
   var path = d3.geoPath().projection(projection);

   var relativeScales = [
     [1, 1, 1, 1, 1], // Scale 1
     [0.9, 1.1, 0.8, 1.2, 1], // Scale 2
     [1.2, 1, 0.9, 1.1, 0.8], // Scale 3
     [0.8, 1.2, 1, 0.8, 1.1], // Scale 4
     [1, 1.5, 2, 0.02, 0.5]  // Scale 5
   ];

var initialLocations = [
 { x: 0, y: 0 },
 { x: 0, y: 0 },
 { x: 0, y: 0 },
 { x: 0, y: 0 },
 { x: 0, y: 0 },
];
var tooltip = d3.select("body")
       .append("div")
       .attr("class", "tooltip")
       .style("opacity", 0);

   var currentScaleIndex = 0; // Index of the currently selected scale
// Set the transition duration in milliseconds
var transitionDuration = 200;

var districts = null;

var district_names = [];

var district_areas = [];

var district_area_scales = [];

var district_post_counts = [];
var district_mean_price = [];

var district_data = [];

var data_precision = [0,0,2];

var bars = null;
   function initializeMap() {
 svg.selectAll("path").remove(); // Clear existing paths
 svg.selectAll("circle").remove(); // Clear existing paths

       data.features.forEach(function(feature, index) {
   if (feature.geometry.type === "MultiPolygon") {
     var currentPath = null;
     district_names.push(feature.properties.boro_name);
     district_areas.push(parseFloat(feature.properties.shape_area));
     district_area_scales.push(Math.sqrt(parseFloat(feature.properties.shape_area)));
     console.log(feature.geometry);
     svg.append("path")
       .datum({
         type: feature.geometry.type,
         coordinates: feature.geometry.coordinates,
         name: feature.properties.boro_name,
         index: index
       })
       .attr("d", path)
       .attr("fill", colors[index % colors.length])
       .attr("fill-opacity", opacity)
       .attr("stroke", "white")
       .on("mouseover", MouseOver)
       .on("mouseout", MouseOut);
       
     districts = svg.selectAll("path");
     
     var cent = path.centroid(feature.geometry);
     initialLocations[index].x = cent[0];
     initialLocations[index].y = cent[1];
     
     
         }
     });


 function calculateMedian(array) {
   var sortedArray = array.slice().sort(function(a, b) {
     return a - b;
   });
   var middle = Math.floor(sortedArray.length / 2);
   if (sortedArray.length % 2 === 0) {
     return (sortedArray[middle - 1] + sortedArray[middle]) / 2;
   } else {
     return sortedArray[middle];
   }
 }

 // Calculate the median value of the divisionArray
 var median = calculateMedian(district_area_scales);

 // Divide each element in the divisionArray by the median value
 district_area_scales = district_area_scales.map(function(value) {
   return value / median;
 });

 d3.csv('district_scales_data.csv').then(function(data) {
   var sqrtCountDivMedian = data.map(function(d) { return +d.Sqrt_Count_Div_Median; });
   var sqrtMeanDivMedian = data.map(function(d) { return +d.Sqrt_Mean_Div_Median; });
   district_post_counts = data.map(function(d) { return +d.Count; });
   district_mean_price = data.map(function(d) { return +d.Mean; });

   relativeScales[1] = sqrtCountDivMedian.map(function(value, index) {
     return value / district_area_scales[index];
   });

   relativeScales[2] = sqrtMeanDivMedian.map(function(value, index) {
     return value / district_area_scales[index];
   });
   // Use the data as needed
   district_data.push(district_areas);
   district_data.push(district_post_counts);
   district_data.push(district_mean_price);
   console.log(district_data);
 });
};
var currentShape = 0;

function MouseOver(d,i) {
 console.log(i.index);

 // Store the currently hovered path
 currentPath = this;
 currentShape = i.index;
 
 svg.selectAll("path")
   .filter(function(d,_i) {
     return _i === currentShape;
   })
   .transition()
   .duration(transitionDuration)
   .attr("stroke", "black")
   .attr("fill-opacity", 0.9);

 svg.selectAll("path")
   .filter(function(d,_i) {
     return _i !== currentShape;
   })
   .transition()
   .duration(transitionDuration)
   .attr("fill-opacity", 0.3);
 
 svg.selectAll("rect")
   .filter(function(d,i){
     return i !== currentShape;
   })
   .transition()
   .duration(transitionDuration)
   .attr("fill-opacity", 0.3); // Adjust the opacity as desired
 
 svg.selectAll("rect")
   .filter(function(d,i){
     return i === currentShape;
   })
   .transition()
   .duration(transitionDuration)
   .attr("fill-opacity", 0.9); // Adjust the opacity as desired
 
 svg.selectAll("text")
   .filter(function(d,i){
     return d.index === currentShape;
   }).transition()
   .duration(transitionDuration)
   .attr('y', (d,i) => targetLocations[d.index].y + normed[d.index] + 20)
   .attr("font-size", 20);

 // Show the tooltip with the name of the shape
 tooltip.transition()
   .duration(200)
   .style("opacity", 0.9);
 tooltip.html(i.name)
   .style("left", (d3.event.pageX + 10) + "px")
   .style("top", (d3.event.pageY - 20) + "px");
}

function MouseOut() {
 // Change the contour color to black on mouseover
 d3.select(this)
   .attr("stroke", "white");

 // Store the currently hovered path
 currentPath = this;

 svg.selectAll("text")
   .filter(function(d,i){
     return d.index === currentShape;
   }).transition()
   .duration(transitionDuration)
   .attr('y', (d,i) => targetLocations[d.index].y + 20)
   .attr("font-size", 16);

 // Reduce the opacity of other paths
 svg.selectAll("path")
   .transition()
   .duration(transitionDuration)
   .attr("fill-opacity", opacity); // Adjust the opacity as desired

 svg.selectAll("rect")
   .transition()
   .duration(transitionDuration)
   .attr("fill-opacity", 0.3); // Adjust the opacity as desired

 // Hide the tooltip
 tooltip.transition()
   .duration(200)
   .style("opacity", 0);
}

function updateMap() {
 districts.each(function(d, i) {
  if(moved===false){
    transitMap();
  }
   const shape = d3.select(this);
   const scaleFactor = relativeScales[currentScaleIndex][i]; // Retrieve the scale factor for the current circle
   const centroid = getCentroid(shape,i);

   var centroid1 = path.centroid(d);

   var targetX = -centroid1[0] + targetLocations[i].x;
   var targetY = -centroid1[1] + targetLocations[i].y;

   var transform = `translate(${centroid.x}, ${centroid.y}) scale(${scaleFactor}) translate(-${centroid.x}, -${centroid.y})`;
   
   if(moved){
     transform = "translate(" + targetX + ", " + targetY + ") " + transform;
     d3.selectAll("text").remove();
     d3.selectAll("rect").remove();
     var max = Math.max(...district_data[currentScaleIndex]);

     normed = calcScale(district_data[currentScaleIndex]);

     var scale_value = scale_pos.map(function(value) {return value * max / max_percentage / max_height;});

     svg.selectAll("line")
       .data(scale_value)
       .enter()
       .append("line")
       .attr("x1", chart_start)
       .attr("y1", (d,i) => 1000 / 2 + scale_pos[i])
       .attr("y2", (d,i) => 1000 / 2 + scale_pos[i])
       .attr("stroke", "grey")
       .attr("stroke-width", 1)
       .attr("fill-opacity", 0)
       .attr("x2", chart_start)
       .transition()
       .duration(1000)
       .attr("x2", 1050 + chart_start)
       .attr("fill-opacity", 0.05);

     svg.selectAll("line_2")
       .data(scale_value)
       .enter()
       .append("line")
       .attr("x1", chart_start)
       .attr("x2", chart_start)
       .attr("y1", 1000/2 - 1)
       .attr("stroke", "grey")
       .attr("stroke-width", 2)
       .attr("fill-opacity", 0)
       .attr("y2", 1000/2)
       .transition()
       .duration(1000)
       .attr("y2", 1000/2 + max_height*max_percentage)
       .attr("fill-opacity", 0.05);



     svg.selectAll("text_scale")
       .data(scale_pos)
       .enter()
       .append("text")
       .attr("x", chart_start - 10)
       .attr("y", function(d,i) { return 1000/2 + scale_pos[i]; }) // Adjust the y-coordinate to position the text above the checkpoints
       .attr("text-anchor", "end")
       .text(function(d, i) { 
         if (i === 0){
           return 0;
         }
         if(data_precision[currentScaleIndex] == 0){
           return parseInt(d3.format("." + 0 + "f")(scale_value[i])).toLocaleString(); 
         }
         return parseFloat(d3.format("." + 2 + "f")(scale_value[i])).toLocaleString();
       })
       .attr("font-size", 14)
       .attr("fill", "black");

     svg.selectAll("rect_barplot")
       .data(normed)
       .enter()
       .append("rect")
       .attr("x", function(d, i) {
         return targetLocations[i].x - 25;
       })
       .attr("y", function(d, i) {
         return targetLocations[i].y ; // Adjust the scaling factor as needed
       })
       .attr("width", 50)
       .transition()
       .duration(1000)
       .attr("height", function(d) { return d;} )
       .attr("fill", function(d,i) {return darkerColors[i];})
       .attr("fill-opacity", 0.3);

     districts.raise();
     svg.selectAll("circle").raise();

     svg.selectAll("text_names")
       .data(district_names)
       .enter()
       .append("text")
       .attr("x", function(d, i) { return targetLocations[i].x; })
       .attr("y", function(d, i) { return targetLocations[i].y - 10; }) // Adjust the y-coordinate to position the text above the checkpoints
       .attr("text-anchor", "middle")
       .text(function(d, i) { return d; })
       .attr("font-size", 16)
       .attr("font-style", "italic")
       .attr("fill", "black")
       .transition()
       .duration(1000)
       .attr("fill-opacity", 0.5);
   
     svg.selectAll("text_data")
       .data(targetLocations)
       .enter()
       .append("text")
       .attr("x", function(d) { return d.x; })
       .attr("y", function(d) { return d.y + 20; }) // Adjust the y-coordinate to position the text above the checkpoints
       .attr("text-anchor", "middle")
       .text(function(d, i) { 
         if(data_precision[currentScaleIndex] === 0){
           return parseInt(d3.format("." + data_precision[currentScaleIndex] + "f")(district_data[currentScaleIndex][i])).toLocaleString();
         }
         return d3.format("." + data_precision[currentScaleIndex] + "f")(district_data[currentScaleIndex][i]);
       })
       .attr("font-size", 16)
       .attr("font-style", "italic")
       .attr("fill", "black")
       .transition()
       .duration(1000)
       .attr("fill-opacity", 0.5);
   }
   shape.transition().duration(500).attr("transform", transform);
 });

 
};

// Define the target locations for each shape
var targetLocations = [
 { x: 200, y: 500, index: 0 },
 { x: 400, y: 500, index: 1  },
 { x: 600, y: 500, index: 2  },
 { x: 800, y: 500, index: 3  },
 { x: 1000, y: 500, index: 4  },
];

var chart_start = 100;

var moved = false;
var normed = [];
function getCentroid(shape, index) {
 const bbox = shape.node().getBBox();
 let w = bbox.width;
 let h = bbox.height;
 if(index === 4){
   w = w*1.1;
   h = h*0.8;
 }
 return {
   x: bbox.x + w / 2,
   y: bbox.y + h / 2,
 };
}

var max_height = 500;
var max_percentage = 0.7;

var scale_pos = [0, max_height * 0.15, max_height * 0.3, max_height * 0.45, max_height * 0.6];

function calcScale(d){
 var max = Math.max(...d); // Find the largest element
 
 var normalizedValues = d.map(function(value) {
   return value / max * max_height * max_percentage; // Divide each value by the largest element
 });

 return normalizedValues;
}

function transitMap() {
 if(moved === true){
   moved = false;
   opacity = 0.5;

   d3.selectAll("line").remove();
   d3.selectAll("circle").remove();
   d3.selectAll("text").remove();
   d3.selectAll("rect").remove();
   
   districts.on("mouseover", null)
     .on("mouseout", null)
     .transition()
     .duration(1000)
     .attr("fill-opacity", opacity)
     .attr("transform", function(d,i) {
       return "translate(" + 0 + ", " + 0 + ")";
     } );

     setTimeout(function() {
       districts.on("mouseover", MouseOver);
       districts.on("mouseout", MouseOut);
     }, 1000);

 }else{
   moved = true;
   opacity = 0.4;
   currentScaleIndex = 0;

   var max = Math.max(...district_data[currentScaleIndex]);

   normed = calcScale(district_data[currentScaleIndex]);

   var scale_value = scale_pos.map(function(value) {return value * max / max_percentage / max_height;});

   svg.selectAll("line")
     .data(scale_value)
     .enter()
     .append("line")
     .attr("x1", chart_start)
     .attr("y1", (d,i) => 1000 / 2 + scale_pos[i])
     .attr("y2", (d,i) => 1000 / 2 + scale_pos[i])
     .attr("stroke", "grey")
     .attr("stroke-width", 1)
     .attr("fill-opacity", 0)
     .attr("x2", chart_start)
     .transition()
     .duration(1000)
     .attr("x2", 1050 + chart_start)
     .attr("fill-opacity", 0.05);

   svg.selectAll("line_2")
     .data(scale_value)
     .enter()
     .append("line")
     .attr("x1", chart_start)
     .attr("x2", chart_start)
     .attr("y1", 1000/2 - 1)
     .attr("stroke", "grey")
     .attr("stroke-width", 2)
     .attr("fill-opacity", 0)
     .attr("y2", 1000/2)
     .transition()
     .duration(1000)
     .attr("y2", 1000/2 + max_height*max_percentage)
     .attr("fill-opacity", 0.05);



   svg.selectAll("text_scale")
     .data(scale_pos)
     .enter()
     .append("text")
     .attr("x", chart_start - 10)
     .attr("y", function(d,i) { return 1000/2 + scale_pos[i]; }) // Adjust the y-coordinate to position the text above the checkpoints
     .attr("text-anchor", "end")
     .text(function(d, i) { 
       if (i === 0){
         return 0;
       }
       if(data_precision[currentScaleIndex] == 0){
         return parseInt(d3.format("." + 0 + "f")(scale_value[i])).toLocaleString(); 
       }
       return parseFloat(d3.format("." + 2 + "f")(scale_value[i])).toLocaleString();
     })
     .attr("font-size", 14)
     .attr("fill", "black");

   console.log(normed);

   svg.selectAll("rect_barplot")
     .data(normed)
     .enter()
     .append("rect")
     .attr("x", function(d, i) {
       return targetLocations[i].x - 25;
     })
     .attr("y", function(d, i) {
       return targetLocations[i].y ; // Adjust the scaling factor as needed
     })
     .attr("width", 50)
     .transition()
     .duration(1000)
     .attr("height", function(d) { return d;} )
     .attr("fill", function(d,i) {return darkerColors[i];})
     .attr("fill-opacity", 0.3);

   districts
     .on("mouseover", null)
     .on("mouseout", null)
     .transition()
     .duration(1000)
     .attr("fill-opacity", opacity)
     .attr("transform", function(d,i) {
       var centroid = path.centroid(d);

       var targetX = -centroid[0] + targetLocations[i].x;
       var targetY = -centroid[1] + targetLocations[i].y;
       return "translate(" + targetX + ", " + targetY + ")";
     } );

   
   setTimeout(function() {
     districts
     .on("mouseover", MouseOver)
     .on("mouseout", MouseOut);
   }, 1000);
   

   svg.append("line")
     .attr("x1", chart_start )
     .attr("y1", 1000 / 2)
     .attr("x2", 1050 + chart_start)
     .attr("y2", 1000 / 2)
     .attr("stroke", "black")
     .attr("stroke-width", 2)
     .attr("fill-opacity", 0)
     .transition()
     .duration(1000)
     .attr("fill-opacity", 0.2);

   districts.raise();
   // Append the checkpoints
   svg.selectAll("circle")
     .data(targetLocations)
     .enter()
     .append("circle")
     .attr("cx", function(d) { return d.x; })
     .attr("cy", function(d) { return d.y; })
     .attr("r", 5)
     .attr("fill", "black")
     .attr("fill-opacity", 0);

   // Append the checkpoints
   svg.selectAll("circle_inner")
     .data(targetLocations)
     .enter()
     .append("circle")
     .attr("cx", function(d) { return d.x; })
     .attr("cy", function(d) { return d.y; })
     .attr("r", 3)
     .attr("fill", "white")
     .attr("fill-opacity", 0);

   svg.selectAll("circle").transition()
     .duration(1000)
     .attr("fill-opacity", 0.2);
   svg.selectAll("circle_inner").transition()
     .duration(1000)
     .attr("fill-opacity", 0.5);

   svg.selectAll("text_names")
     .data(district_names)
     .enter()
     .append("text")
     .attr("x", function(d, i) { return targetLocations[i].x; })
     .attr("y", function(d, i) { return targetLocations[i].y - 10; }) // Adjust the y-coordinate to position the text above the checkpoints
     .attr("text-anchor", "middle")
     .text(function(d, i) { return d; })
     .attr("font-size", 16)
     .attr("font-family", "Times New Roman")
     .attr("font-style", "italic")
     .attr("fill", "black")
     .transition()
     .duration(1000)
     .attr("fill-opacity", 0.5);
   
   svg.selectAll("text_data")
     .data(targetLocations)
     .enter()
     .append("text")
     .attr("x", function(d) { return d.x; })
     .attr("y", function(d) { return d.y + 20; }) // Adjust the y-coordinate to position the text above the checkpoints
     .attr("text-anchor", "middle")
     .text(function(d, i) { 
       if(data_precision[currentScaleIndex] === 0){
         return parseInt(d3.format("." + data_precision[currentScaleIndex] + "f")(district_data[currentScaleIndex][i])).toLocaleString();
       }
       return d3.format("." + data_precision[currentScaleIndex] + "f")(district_data[currentScaleIndex][i]);
     })
     .attr("font-size", 16)
     .attr("font-family", "Times New Roman")
     .attr("font-style", "italic")
     .attr("fill", "black")
     .transition()
     .duration(1000)
     .attr("fill-opacity", 0.5);

 }
   };


var button = d3.select("#moveButton");
// Button click event handler
button.on("click", function() {
 transitMap();
});

   // Button event listeners
   d3.select("#scale1").on("click", function() {
     currentScaleIndex = 0;
     updateMap();
   });

   d3.select("#scale2").on("click", function() {
     currentScaleIndex = 1;
     updateMap();
   });

   d3.select("#scale3").on("click", function() {
     currentScaleIndex = 2;
     updateMap();
   });

   d3.select("#scale4").on("click", function() {
     currentScaleIndex = 3;
     updateMap();
   });

   d3.select("#scale5").on("click", function() {
     currentScaleIndex = 4;
     updateMap();
   });

   // Initial map rendering
   initializeMap();

 })
 .catch(function(error) {
   console.log("Error loading GeoJSON file:", error);
 });