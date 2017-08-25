function wordcloud(conf_parameters,isfullscreen){	
	console.log("In word cloud");
	var a = conf_parameters;
	console.log(a.chart_widget_identifier)
	if(isfullscreen == 0)
	{ div_add = "#"+a.chart_widget_identifier;}
	else if(isfullscreen == 1)
	{div_add = "#db_div_chart_area" ;}
	else
	{ div_add = "#db_div_fullscreen_view"}
		
	 $(div_add).empty();
	 var widthparent = $(div_add).width();
	 var heightparent =$(div_add).height();
	 console.log(heightparent);
	 if(heightparent<=0)
		 {heightparent = 350;}
	 console.log(heightparent);
	 
	  var fill = d3.scale.category20();
	   var margin = {
	    top: 10,
	    right: 20,
	    bottom:20,
	    left: 20
	},
	width = widthparent- margin.left - margin.right,
	height = heightparent - margin.top - margin.bottom;
	var data = a.data;
		
	 var fill = d3.scale.category20();
	 d3.layout.cloud().size([width, height])
	    .words(data.map(function(d) {
	    	console.log(d.word +"size"+d.size); return {text:d.word, size:d.size};
	      }))
	      .rotate(function() { return ~~(Math.random() * 2) * 90; })
	      .font("Impact")
	      .fontSize(function(d) {if(isfullscreen == 2){ return d.size/2 ;} else return d.size/5 ; })
	      .on("end", draw)
	      .start();

	  function draw(words) {
	   var svg = d3.select(div_add).append("svg").classed("svgclass", true).attr("id",'wordcloud').attr("preserveAspectRatio", "xMinYMin meet");
	   console.log( width);
	   console.log(height) ;
	   console.log(width/-2+" "+height/-2);
	   svg.attr("viewBox", width*.8/-2+" "+((height/-2))+" "+ width*.8 +" "+height );
	   if(isfullscreen == 2){svg.attr("viewBox", "-400 -300"+" "+ 750 +" "+700 );}
	    // .attr("width", width)
	        //.attr("height", height)
	      svg.append("g")
	        //svg.attr("transform", "translate("+ width/2+","+height/2+")")
	      .selectAll("text")
	        .data(words)
	      .enter().append("text")
	        .style("font-size", function(d) { return d.size + "px"; })
	        .style("font-family", "Impact")
	        .style("fill", function(d, i) { return fill(i); })
	        .attr("text-anchor", "middle")
	        .attr("transform", function(d) {
	          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
	        })
	        .text(function(d) { return d.text; });
	  }
	
	
}