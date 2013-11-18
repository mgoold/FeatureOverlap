
var margin = {top: 35, right: 200, bottom: 20, left: 80},
    width = 960 - (margin.left + margin.right);
    height = 400  - (margin.top + margin.bottom);
  
var svg = d3.select("#d3space").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data; // a global
var coldomain=[];
var ydomain=[];
var xdomain=[];
var grplists=[];

d3.json("testgrp2013.json", function(error, json) {
        if (error) return console.warn(error)
                data=json

        console.log('data',data);

//		X AXIS        
        for (grp in data.groups) {
//         		console.log('grp',grp);
        		xdomain.push(grp);
        	};
        
//        X AXIS SECTION

        var x = d3.scale.ordinal()
                .domain(xdomain)
                .rangeRoundBands([0, width],0.08);

// 		console.log('max',data.max, 'height', height);

		var max=data.max;
		
        var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

//        Y AXIS SECTION
		
		var y = d3.scale.linear()
			.domain([max,0])
			.range([0,height]);
		
		ylist=y.ticks();
		
		ylist.push(max);
		
// 		console.log('ticks',ylist);
			
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");
 
 		yAxis.tickValues(ylist);
 				
//  		console.log('ticks',y.ticks());
                                
		for (grp in data.groups)
			{
				console.log('grp',grp);
				grplists.push(data.groups[grp]);
			};

// 		console.log('grplists',grplists);

		coldomain=data.maxcats.split('--');
			
// 		console.log('coldomain',coldomain);

//        READ LEGEND ITEMS INTO D3 DEFAULT ARRAY OF 20 COLOURS
        var color = d3.scale.category20()
                .domain(coldomain);
        
        console.log('color',color,coldomain);
        console.log('maxcats',data.maxcats,coldomain.length);       
		

		tempy=0;
		tempy0=0;
		tempy1=0;
		tempy2=0;
		grpmaps=[];

		
		for (grp in grplists) {
			grpmap=[];
			tempy1=0;	
// 			console.log('grplists[grp]',grplists[grp]);
			templist=grplists[grp].grplist;
			console.log('sublegend',grplists[grp].sublegend);
			
			splitsublegend=grplists[grp].sublegend.split('--');
			
			
			for (var i=0; i<templist.length; i=i+2) {

				tempy0=parseInt(templist[i+1]);	
				splitname=templist[i].split('--');
				for (var j=0; j<splitname.length; j++) {
					tempname=splitname[j];
					tempx=splitsublegend.indexOf(tempname);
// 					splitname.indexOf(splitname[j]);
// 					console.log('tempx',tempname,tempx);
// 					console.log('tempname',tempname,'tempx',tempx,'tempy',tempy);
					catlength=splitsublegend.length;
					var tempmap=function() {
// 						console.log('name',tempname,'x0',tempx,'y0',tempy0,'y1',tempy1);
						return{indx:j,name:tempname,x0:tempx,y0:tempy0,y1:tempy1,len:catlength};
				};
// 					console.log('tempmap',tempmap());
				grpmap.push(tempmap());
			};			
			tempy1=tempy0+tempy1;	
		};
		
			var tempgrp=function(){return{grp:xdomain[grp],rectvals:grpmap};}
			
			console.log('tempgrp',tempgrp());
			
			grpmaps.push(tempgrp());
		
		
		};


// 		console.log('grpmaps',grpmaps);

        
                 
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
        
		var month = svg.selectAll('.grp')
			.data(grpmaps)
			.enter()
			.append('g')
// 			.attr("class", "g")
			.attr('transform', function (d, i) {
// 				console.log('i',d.grp);
			return 'translate(' + x(d.grp) + ', 0)';
		});

		month.selectAll("rect")
			.data(function(grpmaps) {
			return grpmaps.rectvals; })
			.enter().append("rect")
			.attr("height", function(d,i) { 
// 				console.log('height',d.y0,d.y1 );
				return y(max-d.y0);})
			.attr("x", function(d,i) {
// 				console.log('x',d.x0);
				return (d.x0)*(x.rangeBand()/d.len);})
			.attr("y", function(d,i) {		
// 				console.log('y',d.y0+d.y1);		
				return y(d.y0+d.y1);})
			.attr("width", function(d){ return x.rangeBand()/d.len;})
			.style("fill", function(d) { return color(d.name); });

});
