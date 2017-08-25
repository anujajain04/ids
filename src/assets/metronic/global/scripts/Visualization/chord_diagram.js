function chorddiagram(conf_parameters,isfullscreen)
{
	var a = conf_parameters;
	var div_add;
	if(isfullscreen == 0)
	{ div_add = "#"+a.chart_widget_identifier;}
	else if(isfullscreen == 1)
	{div_add = "#db_div_chart_area" ;}
	else
	{ div_add = "#db_div_fullscreen_view"}
	
	var matrix ;
	var label;
	
	$.each(a.data,function(i,v){
		
		matrix =v.matrix;
		label = v.label;	
		
	});
	

	   $(div_add).empty();
	   
	 var color = d3.scale.category20();           
	 var widthparent = $(div_add).width();
	 var heightparent = $(div_add).height();
	 if(heightparent<=0)
	 {heightparent = 350;}
	 console.log(heightparent);
	 var margin = {top:20, right: 20, bottom: 20, left: 20},
  
    width =  widthparent - margin.left - margin.right,
    height = heightparent - margin.top - margin.bottom;
    //console.log("widthparent"+widthparent);
    //console.log("heightparent"+heightparent);
	outerRadius = Math.min(width, height) / 2 - 10,
	innerRadius = outerRadius - 24;
	
	console.log(width);
	console.log(height);
	console.log(width/-2+" "+height/-2+" "+ width*.8 +" "+height*.8 );
	
	var formatPercent = d3.format("d");
	
	var arc = d3.svg.arc()
		.innerRadius(innerRadius)
		.outerRadius(outerRadius);
	
	var layout = d3.layout.chord()
		.padding(.04)
		.sortSubgroups(d3.descending)
		.sortChords(d3.ascending);
	
	var path = d3.svg.chord()
		.radius(innerRadius);
	
	var svg = d3.select(div_add).append("svg").classed("svgclass", true).attr("id",'chordchart').attr("preserveAspectRatio", "xMinYMin meet");
	if(isfullscreen == 2){svg.attr("viewBox", "-400 -300"+" "+ 750 +" "+700 );}
	//svg.attr("viewBox", width*.8/-2+" "+((height/-2))+" "+ width*.8 +" "+height );
	else{
	if(window.location.href.indexOf("viewdashboard") > -1) {
		  svg.attr("viewBox", "-300"+" -135 "+ (width-100) +" "+heightparent*1.5);
	    } 
	  else
		  svg.attr("viewBox", "-200 -105 400 360");
	}
	 //svg.attr("viewBox", (width/-2)*2+" "+((width/-2)+25)+" "+ (width*2) +" "+heightparent*1.2);
	// svg.attr("viewBox", (width/-2)*2+" "+((width/-2)+25)+" "+ (width*2) +" "+((width*2)-60));
	svg.attr("id", "circle")
	svg.append("circle")
		.attr("r", outerRadius);
	layout.matrix(matrix);

	// Add a group per neighborhood.
	var group = svg.selectAll(".group")
	.data(layout.groups)
	  .enter().append("g")
		.attr("class", "group")
		.on("mouseover", mouseover);

	// Add a mouseover title.
	group.append("title").text(function(d, i) {
	  return label[i] + ": " + formatPercent(d.value);
	});
	
	
	group.append("text")
	  .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
	  .attr("dy", ".35em")
	  .attr("transform", function(d) {
	    return "rotate(" + (d.angle * 180/ Math.PI - 90 ) + ")"
	        + "translate(" + (innerRadius + 30) + ")"
	        + (d.angle > Math.PI ? "rotate(180)" : "");
	  })
	  .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
	   .style("font-size","8px")
	  .text(function(d, i) { return label[i] });
	
	
	var groupPath = group.append("path")
	.attr("id", function(d, i) { return "group_"+i; })
	.attr("d", arc)
	.style("fill", function(d, i) { return color([i]); });
	
	
	// Add a text label.
	var groupText = groupPath.append("text")
		.attr("x", 6)
		.attr("dy", 15)
		
		.append("textPath")
		
		.attr("xlink:href", function(d, i) { return "#group_"+i; })
		.text(function(d, i) {
			console.log("Label +"+label[i]);
			return label[i] });

	// Remove the labels that don't fit. :(
	groupText.filter(function(d, i) { return groupPath[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength(); })
		.remove();
	
	
	

	// Add the chords.
	var chord = svg.selectAll(".chord")
		.data(layout.chords)
	  .enter().append("path")
		.attr("class", "chord")
		.style("fill", function(d) { return color([d.source.index]); })
		.attr("d", path);

	// Add an elaborate mouseover title for each chod.
	chord.append("title").text(function(d) {
	  return label[d.source.index]
		  + " → " + label[d.target.index]
		  + ": " + formatPercent(d.source.value)
		  + "\n" + label[d.target.index]
		  + " → " + label[d.source.index]
		  + ": " + formatPercent(d.target.value);
	});

	function mouseover(d, i) {
	  chord.classed("fade", function(p) {
		return p.source.index != i
			&& p.target.index != i;
	  });
	}
	
	 svg.append("text")
     .attr("class", "title")
     .attr("x",width-300)
     .attr("y",height-height/2)
     .attr("text-anchor", "middle");
    

//});
}