  function donut(conf_parameters,isfullscreen) {
	  
		var a = conf_parameters;
		var coordinates = [0,0];
		var div_add;
		if(isfullscreen == 0)
		{ div_add = "#"+a.chart_widget_identifier;}
		else if(isfullscreen == 1)
		{div_add = "#db_div_chart_area" ;}
		else
		{ div_add = "#db_div_fullscreen_view"}
		
		 $(div_add).empty();
		 var widthparent = $(div_add).width();
		 var heightparent =widthparent;
		 var data = a.data;
		
		 if(heightparent<=0)
	 	{heightparent = $(div_add).width();}
	  
	 
		//$(div_add).empty();
	  
		  var margin = {top:20, right: 20, bottom: 20, left: 20},
		  width= widthparent - margin.left - margin.right,
	      height = heightparent - margin.top - margin.bottom ,
	      radius = Math.min(width, height) /2;
		  var legendRectSize = 18;                                  // NEW
	      var legendSpacing = 4;                                    // NEW
	      var outerRadius = radius *0.9
	      var innerRadius = radius *0.5;
	      
	      var div = d3.select(div_add).append("div")	
		    .attr("class", "tooltip")				
		    .style("opacity", 0);
	      
	  var color = d3.scale.category20();
	  var arc = d3.svg.arc()
	      .outerRadius(outerRadius)
	      .innerRadius(innerRadius);
	  
	  
	  var pie = d3.layout.pie()
	      .sort(null)
	      .value(function (d) {
	    	  console.log("&&&&"+d.measure)
	    	 return +d.measure;
	  });

	  


	  var svg = d3.select(div_add).append("svg").classed("svgclass", true).attr("preserveAspectRatio", "xMinYMin meet");
	 // if(isfullscreen == 2){svg.attr("viewBox", "-400 -300"+" "+ 750 +" "+700 );}
	 // svg.attr("viewBox", "-152.8 -155 "+ 550.6  +" "+ 400 );
	  svg.attr("viewBox", width/-2+" "+height/-2+" "+ (width+300) +" "+height);
	      
	  
    
	      var g = svg.selectAll(".arc")
	          .data(pie(data))
	          .enter().append("g")
	          .attr("class", "arc")
	           .on("click",function(d){
        	if(d3.select(this).attr("transform") == null){
        	d3.select(this).attr("transform","translate(42,0)")	;
        	}else{
        		d3.select(this).attr("transform",null);
        	}})
        	.on("mouseover", function(d, i) {
	        	  
				  coordinates = d3.mouse(this);
				  console.log("****"+coordinates[0]);
	        	  console.log("&&&&&"+coordinates[1]);
				 div.transition()		
		          .duration(200)		
		          .style("opacity", 1);
				  div.html(d.data.label)
				  .style("left", coordinates[0]+30 +"px")		
		          .style("top", coordinates[1]+15 +"px");
		 }) 
		 .on("mouseout", function () {
	 	    //Remove the tooltip
		    	 div.transition()		
	             .duration(500)		
	             .style("opacity", 0);	
	 	});
	           
	          
	  

	      g.append("path")
	          .attr("d", arc)
	          .style("fill", function (d) {
	          return color(d.data.label);
	      });
	      
	      g.append("path")
          .attr("d", arc)
         // .attr("legend", function(d){return d.data.label})
          .style("fill", function (d) { return color(d.data.label); })
          ;
	    
	      
	     
	      
	    g.append("text")
          .attr("transform", function(d) { //set the label's origin to the center of the arc
        //we have to make sure to set these before calling arc.centroid
        outerRadius = outerRadius + 50; // Set Outer Coordinate
        innerRadius = outerRadius + 45; // Set Inner Coordinate
        return "translate(" + arc.centroid(d) + ")";
      })
      .attr("text-anchor", "middle") //center the text on it's origin
      .style("fill", "Black")
      .style("font", " 12px Arial")
      .text(function(d, i) {
    	  return d.data.measure });
	      
	    var legendG = svg.selectAll(".legend")
	      .data(pie(data))
	      .enter().append("g")
	      .attr("transform", function(d,i){
	        return "translate(" + (width-200) + "," + ((i * 15)-height/2)  + ")";
	      })
	      .attr("class", "legend");   
	    
	    legendG.append("rect")
	      .attr("width", 10)
	      .attr("height", 10)
	      .attr("fill", function(d, i) {
	        return color(d.data.label);
	      });
	    
	    legendG.append("text")
	      .text(function(d){
	    	 
	    	  console.log(d.data.measure)
	        return "   " + d.data.label;
	      })
	      .style("font-size", 12)
	      .attr("y", 10)
	      .attr("x", 11);
	   
	      
  }
    