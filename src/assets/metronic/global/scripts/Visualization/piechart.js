  function piechart(conf_parameters,isfullscreen) {
	  
	  	var a = conf_parameters;
		console.log(isfullscreen);
		console.log(a);
		var div_add;
		if(isfullscreen == 0)
		{ div_add = "#"+a.chart_widget_identifier;}
		else if(isfullscreen == 1)
		{div_add = "#db_div_chart_area" ;}
		else
		{ div_add = "#db_div_fullscreen_view"}
		
		 $(div_add).empty();
		 var widthparent = $(div_add).width();
		 console.log("This Is Width Parent "+widthparent)
		 var heightparent =380;
		 var data = a.data;
		 
	 
	 
	
	  if(heightparent<=0)
	 	{heightparent = 350;}
	  
	 
		  var margin = {top:20, right: 20, bottom: 20, left: 20},
		  width= widthparent - margin.left - margin.right,
	      height = heightparent - margin.top - margin.bottom ,
	      radius = Math.min(width, height) /2;
		  var legendRectSize = 18;                                  // NEW
	      var legendSpacing = 4;                                    // NEW
	      var outerRadius = radius *1.2
	      var innerRadius = radius *0.5;

	  var color = d3.scale.category20();
	  
	var color_sentiment = d3.scale.ordinal()
      .domain(["Positive", "Negative", "Neutral"])
      .range(["#009933", "#FF0000" , "#0000FF"]);


	  var arc = d3.svg.arc()
	      .outerRadius(outerRadius)
	      .innerRadius(0);
	  
	  
	  var pie = d3.layout.pie()
	      .sort(null)
	      .value(function (d) {
	    	  console.log("&&&&"+d.measure)
	    	 return +d.measure;
	  });

	  


	  var svg = d3.select(div_add).append("svg").classed("svgclass", true).attr("preserveAspectRatio", "xMinYMin meet");
	 // if(isfullscreen == 2){svg.attr("viewBox", "-400 -300"+" "+ 750 +" "+700 );}
	 // svg.attr("viewBox", "-152.8 -155 "+ 550.6  +" "+ 400 );
	  
	  if(window.location.href.indexOf("viewdashboard") > -1) {
		  svg.attr("viewBox", (width/-2)*2+" "+((width/-2)+25)+" "+ (width*2) +" "+heightparent*1.5);
	    } 
	  else
		  svg.attr("viewBox", (width/-2)*2+" "+((width/-1.8))+" "+ (width*2) +" "+heightparent*1.5);
	
	  
	// svg.attr("viewBox", "-660 -380 1500 1200");
    
	      var g = svg.selectAll(".arc")
	          .data(pie(data))
	          .enter().append("g")
	          .attr("class", "arc");

	      g.append("path")
	          .attr("d", arc)
	          .style("fill", function (d) {
			if(d.data.label=="Positive")
 			{return "#6BEA61"}
			else if(d.data.label=="Negative")
			{return "#FF5733"}
			else if (d.data.label=="Neutral")
	          	{return "#6469EC"}
			else
			return color(d.data.label);
	      });
	      
	      g.append("path")
          .attr("d", arc)
         // .attr("legend", function(d){return d.data.label})
           .style("fill", function (d) {
			if(d.data.label=="Positive")
 			{return "#6BEA61"}
			else if(d.data.label=="Negative")
			{return "#FF5733"}
			else if (d.data.label=="Neutral")
	          	{return "#6469EC"}
			else
			return color(d.data.label);
	      });

	    g.append("text")
          .attr("transform", function(d) { //set the label's origin to the center of the arc
        //we have to make sure to set these before calling arc.centroid
        outerRadius = outerRadius + 50; // Set Outer Coordinate
        innerRadius = outerRadius + 45; // Set Inner Coordinate
        return "translate(" + arc.centroid(d) + ")";
      })
      .attr("text-anchor", "middle") //center the text on it's origin
      .style("fill", "Black")
      .style("font", " 18px Arial")
      .text(function(d, i) {
    	  
    	  return d.data.measure });
	      
	    var legendG = svg.selectAll(".legend")
	      .data(pie(data))
	      .enter().append("g")
	      .attr("transform", function(d,i){
	    	  //console.log("(i * 14)-height/2)"+(i * 14)-height/2));
	        return "translate(" + (width-160) + "," + ((i * 20)-height/2.2)  + ")";
	      })
	      .attr("class", "legend");   
	    
	    legendG.append("rect")
	    	
	      .attr("width", 30)
	      .attr("height", 30)
	      .attr("fill", function(d, i) {
	       if(d.data.label=="Positive")
 			{return "#6BEA61"}
			else if(d.data.label=="Negative")
			{return "#FF5733"}
			else if (d.data.label=="Neutral")
	          	{return "#6469EC"}
			else
			return color(d.data.label);
	      });
	    
	    legendG.append("text")
	      .text(function(d){
	    	 
	    	  console.log(d.data.measure)
	        return "   " + d.data.label;
	      })
	      .style("font-size", "18px")
	      .attr("y", 10)
	      .attr("x", 35);
	   
	    

	    
	  
  }
    