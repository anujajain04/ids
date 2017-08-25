	function barchart(conf_parameters,isfullscreen)
	 { 
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
		 var heightparent =$(div_add).height();
		 if(heightparent<=0)
		 {heightparent = 350;}
		 var container = d3.select(),
	     width = parseInt(widthparent),
	     height = parseInt(heightparent),
	     aspect = width*3/4;
		 
		var margin = {top: 20, right: 20, bottom: 20, left: 20},
	    width = widthparent - margin.left - margin.right,
	    height = heightparent - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10, "d");
	
	function make_x_axis() {        
	    return d3.svg.axis()
	        .scale(x)
	         .orient("bottom")
	         .ticks(10)
	}

	function make_y_axis() {        
	    return d3.svg.axis()
	        .scale(y)
	        .orient("left")
	        .ticks(10)
	}
	
	
	
	var svg = d3.select(div_add).classed("svg-container", true).append("svg").classed("svgclass",true).attr("id",'columnchart').attr("preserveAspectRatio", "xMinYMin meet");
	if(isfullscreen == 2){svg.attr("viewBox", "-400 -300"+" "+ 750 +" "+700 );}
	///svg.attr("viewBox", width*.8/-2+" "+((height/-2))+" "+ width*.8 +" "+height );
	svg.attr("viewBox", 0+" "+0+" "+ width +" "+height*1.2 );
	 
	 svg.append("text")
     .attr("class", "title")
     .attr("x", width/2)
     .attr("y", 0 -(25))
     .attr("text-anchor", "middle")
     .text(a.chart_title);
	 
	 svg.append("text")
		.attr("x", width / 2 )
		.attr("y",height + margin.bottom  )
		.style("text-anchor", "middle")
		.attr("dy", "2em")
		.text(a.chart_x_axis_label);
	
	 svg.append("text")
		 .attr("x",0 - 35)
		  .attr("y", height /2 )
	     .attr("dy", ".2em")
	     .style("text-anchor", "middle")
	     .text(a.chart_y_axis_label);
	
	 var div = d3.select(div_add).append("div")	
	    .attr("class", "tooltip")				
	    .style("opacity", 1);

	 
	 var data = a.data;
	 x.domain(data.map(function(d) { return d.Xaxisvalue; }));
	 y.domain([0, d3.max(data, function(d) {;return +d.Yaxisvalue; })]);

	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	       .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.20em")
            .attr("dy", ".45em")
            .attr("transform", function(d) {
                return "rotate(-25)" 
                });


	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(135)")
	      .attr("y", 6)
	      .attr("dx", ".71em")
	      .attr("dy", ".40em")
	      .style("text-anchor", "end");
	      

	  svg.selectAll(".bar")
	     .data(data)
	   .enter().append("rect")
	     .attr("class", "bar")
	     .attr("alert-value", function(d) { return x(d.Xaxisvalue); })
	     .attr("x", function(d) { return x(d.Xaxisvalue); })
	     .attr("width", x.rangeBand())
	     
	     .attr("y", function(d) { return y(d.Yaxisvalue); })
	     .attr("height", function(d) { 
	                                      return height - y(d.Yaxisvalue); })
	  .on("mouseover", function(d, i) {
		  coordinates = d3.mouse(this);
		 div.transition()		
          .duration(200)		
          .style("opacity", 1);
		  div.html(d.Xaxisvalue)
		   .style("left", coordinates[0] + "px")		
           .style("top", coordinates[1]+ "px");;
		 }) 
		 .on("mouseout", function () {
	 	    //Remove the tooltip
	    	 div.transition()		
             .duration(500)		
             .style("opacity", 0);	
	 	});
	  
	   
	  
	  
	  
	  
	/*  svg.append("g")         
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_axis()
          .tickSize(-height, 0, 0)
          .tickFormat("")
      )

  svg.append("g")         
      .attr("class", "grid")
      .call(make_y_axis()
          .tickSize(-width, 0, 0)
          .tickFormat("")
      )*/
	 
	     
	 function type(d) {
	   d.Yaxisvalue = + d.Yaxisvalue;
	   return d;
	 }
		
	 }
