
var margin = {top: 35, right: 200, bottom: 20, left: 80},
    width = 960 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
  
var svg = d3.select("#d3space").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg_legend = d3.select("#d3space").append("svg")
    .attr("width", width+margin.left)
    .attr("height", 250)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var leg_grp=svg_legend.append("g");
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data; // a global
var coldomain=[];
var coldomain2=[];
var firstword;
i=0;
var ydomain=[];
var xdomain=[];
var grplists=[];

d3.json("testgrp.json", function(error, json) {
        if (error) return console.warn(error)
                data=json

        console.log('data',data);

//		X AXIS        
        for (grp in data.groups) {
        		console.log('grp',grp);
        		xdomain.push(grp);
        	};
        
//        X AXIS SECTION

        var x = d3.scale.ordinal()
                .domain(xdomain)
                .rangeRoundBands([2, width],0.08);

		console.log('max',data.max);

		
        var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

//        Y AXIS SECTION
		
		var y = d3.scale.linear()
			.range([0,height]);

		y.domain([parseInt(data.max),0]);

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");
                                
		for (grp in data.groups)
			{
				grplists.push(data.groups[grp].grplist);
			};

		coldomain=data.maxcats.split('-');
			
		console.log('coldomain',coldomain);

		tempy=0;
		grpmaps=[];
		grpmap=[];
		
		for (grp in grplists) {
			for (var i=0; i<grplists[grp].length; i=i+2) {
				var splitname='';
				splitname=grplists[grp][i].split('-');
				tempy=parseInt(tempy)+parseInt(grplists[grp][i+1]);				
				for (var j=0; j<splitname.length; j++) {
					tempname=splitname[j];
					tempx=coldomain.indexOf(splitname[j]);

// 					console.log('tempname',tempname,'tempx',tempx,'tempy',tempy);
					var tempmap=function() {
// 						console.log('tempname',tempname,'tempx',tempx,'tempy',tempy);
						return{name:tempname,x0:tempx,y0:tempy};}
// 					console.log('tempmap',tempmap());
					grpmap.push(tempmap());
			};		
					
		};
			grpmaps.push(grpmap);
			tempy=0;			
		
		};


		console.log('grpmaps',grpmaps);

        
                 
        svg.append("g") //"g" is DOM shorthand for a "group" object, which is a heuristic that lets you add things to everything in that group later
                .attr("class", "xAxis")
                .attr("transform", "translate(0," + height + ")") //this is responsible for moving axis from top (svg default) to bottom                
                .call(xAxis)
                .append("text")
                .attr("x", width+margin.left)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .style("font-size", "16px")
                .attr("transform", "translate(40,0), rotate(0)")
                .text("Month")
        ;

//        Y AXIS TITLE
        svg.append("g")
                .attr("class", "yAxis")
                .call(yAxis)
                .append("text")
                .attr("y", -17)
                .attr("dy", ".71em")
                .style("text-anchor", "middle")
                .style("font-size", "16px")
                .attr("transform", "translate(5,0), rotate(0)")
                .text("Users")
        ;
        

});
