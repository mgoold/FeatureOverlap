var MYLIBRARY2 = MYLIBRARY2 || (function(){
    var jsonfile = {}; // private

    return {
        init : function(Args) {
            jsonfile = Args;
            // some other initialising
        },
        helloWorld : function() {
//             alert('Hello World! -' + jsonfile[0]);

	var margin = {top: 35, right: 200, bottom: 30, left: 80},
		width = 1400 - (margin.left + margin.right);
		height = 450  - (margin.top + margin.bottom);
  
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
	var data; // a global
	var coldomain=[];
	var ydomain=[];
	var xdomain=[];
	var	grppresort=[];
	var grplists=[];
	var subtotals=[];
	var lastposxngrps=[];

	d3.json(jsonfile[0], function(error, json) {
			if (error) return console.warn(error)
					data=json

//         console.log('data',data);

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
		
// 			var y = d3.scale.linear()
// 				.domain([max,0])
// 				.range([0,height]);
					
			var y = d3.scale.linear()
				.rangeRound([height, 0]);
		
// 			ylist=y.ticks();
		
// 			ylist.push(max);
		
	// 		console.log('ticks',ylist);
	
			var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.tickFormat(d3.format(".0%"));
				
// 			var yAxis = d3.svg.axis()
// 				.scale(y)
// 				.tickFormat(function(d) {
// 	// 				console.log('d',d.val);
// 					var prefix = d3.formatPrefix(d,'.1s');
// 	// 				console.log(prefix.scale(d.val,'.1s'));
// 					return prefix.scale(d).toFixed(1).toString()+prefix.symbol;
// 				})
// 				.orient("left");
//  
// 			yAxis.tickValues(ylist);
// 				
	//  		console.log('ticks',y.ticks());

								
			for (grp in data.groups)
			{

				grplists.push(data.groups[grp]);
				subtotals.push(data.groups[grp].grand_total);
			};

// 		console.log('subtotals',subtotals);

			coldomain=data.maxcats.split('--');
			
	// 		console.log('coldomain',coldomain);

	//        READ LEGEND ITEMS INTO D3 DEFAULT ARRAY OF 20 COLOURS
			var color = d3.scale.category20()
					.domain(coldomain);
		
	//         console.log('color',color,coldomain);
	//         console.log('maxcats',data.maxcats,coldomain.length);       
		

			tempy=0;
			tempy0=0;
			tempy1=0;
			tempy2=0;
			grpmaps=[];

		
			for (grp in grplists) {
	// 			console.log('grp',grp);
				grpmap=[];
				var lastposxns=[];
				var lastposxns2=[];
				var subtotal=subtotals[grp];
				tempy1=0;	
				ypos=0;
				coltotal=0;
	// 			console.log('grplists[grp]',grplists[grp]);
				templist=grplists[grp].grplist;
// 				console.log('subtotal',subtotal);
			
				// 
				splitsublegend=grplists[grp].sublegend.split('--');
				catlength=splitsublegend.length;
							
// 				console.log('grand_total', data[grp
			
				for (var i=0; i<templist.length; i=i+2) {
					ypos=0;
					tempy0=parseInt(templist[i+1]);	
	// 				console.log('templist[i]',templist[i]);
				
					splitname=templist[i].split('--');
					for (var j=0; j<splitname.length; j++) {
						tempname=splitname[j];
	// 					console.log('tempname',tempname);
						tempx=splitsublegend.indexOf(tempname);

						
						var tempmap=function() {
// 							console.log('name',tempname,'x0',tempx,'y0',tempy0,'y1',tempy1, 'subtot', subtotal);
							return{indx:j,name:tempname,x0:tempx,y0:tempy0,y1:tempy1,len:catlength, subtot:subtotal,subleg:grplists[grp].sublegend,grpnum:grp};					
						};

						ypos=tempy0+tempy1;	
									
						if (lastposxns.indexOf(tempname)>-1) {
							tempindx=lastposxns.indexOf(tempname)+1;
							tempindx2=lastposxns.indexOf(tempname)+2;
							lastposxns[tempindx]=ypos;
							lastposxns[tempindx2]=lastposxns[tempindx2]+tempy0;
						}
						else
						{
							lastposxns.push(tempname);
							lastposxns.push(ypos);
							lastposxns.push(tempy0);
						};

						grpmap.push(tempmap());
					};	
			
					tempy1=tempy0+tempy1;	
				};
						
				
					for (i=0; i<lastposxns.length; i=i+3) {
						tempx=(splitsublegend.indexOf(lastposxns[i]));
						tempx=tempx*(x.rangeBand()/catlength);
						tempy=lastposxns[i+1];
						val=lastposxns[i+2];
						var tempposxn=function(){
							return{val:val, x0:tempx, y0:tempy};
						};
						lastposxns2.push(tempposxn());
					};
						
	// 				var coltots=function(){return {tottext:lastposxns2};};
								
	// 				lastposxngrps.push(coltots());
				
					var tempgrp=function(){return{grp:xdomain[grp],rectvals:grpmap,tottext:lastposxns2};}
					grpmaps.push(tempgrp());
				
			};

	// 		console.log('lastposxngrps',lastposxngrps);
				 
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

//        Y AXIS
		  svg.append("g")
			  .attr("class", "yAxis")
			  .call(yAxis);


//        Y AXIS TITLE
// 			svg.append("g")
// 					.attr("class", "yAxis")
// 					.call(yAxis)
// 					.append("text")
// 					.attr("y", -17)
// 					.attr("dy", "-.25em")
// 					.style("text-anchor", "middle")
// 					.style("font-size", "16px")
// 					.attr("transform", "translate(5,0), rotate(0)")
// 					.text("Total Users")
// 			;
		
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
					if (d.subleg='CV-Content_View--NS-New_Searches') {
// 											return{indx:j,name:tempname,x0:tempx,y0:tempy0,y1:tempy1,len:catlength, subtot:subtotal,subleg:grplists[grp].sublegend,grpnum:grp};					
						if (d.grpnum==0) {
							if (d.y0==18704) {
								console.log(d.name, d.y0, d.y1, d.subleg, d.subtot,d.grpnum, d.y0/d.subtot, y(1-d.y0/d.subtot))
							}
						}
					}
					return y(1-d.y0/d.subtot);})  // this is the amount from the overall chart max minus the current value, 
						// which is then cast proportionally in terms of the y scale
				.attr("x", function(d,i) {
	// 				console.log('x',d.x0);
					return (d.x0)*(x.rangeBand()/d.len);})
				.attr("y", function(d,i) {		
// 				console.log('y',y(d.y0/subtotal+d.y1/subtotal));
// 					return d.y0/d.subtotal+d.y1/d.subtotal;})
					return y(d.y0/d.subtot+d.y1/d.subtot);})
				.attr("width", function(d){ return x.rangeBand()/d.len;})
				.style("fill", function(d) { return color(d.name); });

// 			month.selectAll("text")
// 				.data(function(grpmaps) {		
// 					console.log('grpmaps',grpmaps.tottext);	
// 					return grpmaps.tottext;
// 				})
// 				.enter().append('text')
// 				.text(function(d) {
// 					return d.val/
// 	// 				console.log('d',d.val);
// 					var prefix = d3.formatPrefix(d.val,'.4s');
// 	// 				console.log(prefix.scale(d.val,'.1s'));
// 					return prefix.scale(d.val).toFixed(1).toString()+prefix.symbol ;
// 				})
// 				.attr('x',function(d) {
// 					return d.x0;
// 				})
// 				.attr('y',function(d) {
// 					return y(d.y0/d.subtot);
// 				})
// 				.attr("font-size", "9px")
// 				;
			
			

	// legend section
		
			var leg_groups=leg_grp.selectAll('g')
					.data(coldomain)
					.enter()
					.append('g')
					.attr("transform", function(d, i) { return "translate(" + (i)*((width-margin.left)/coldomain.length)+",0)";});
		
			leg_groups.append('rect')
			.attr("height", 15)
			.attr("x",45)
		// .attr("x", function(d, i) { return (i+1)*((width-margin.left)/coldomain.length); })
			.attr("width", 15)
			.style("fill", color);        

			leg_groups.append('text')
					.text(function(d){return d})
					.style("fill", 'black')
					.attr("y", 60)
					.attr("x", 0)
					.attr("text-anchor", "end")
					.style("font-size", "12px")
					.attr("transform", function(d, i) { return "translate(0,0) rotate(-65," + 0+"," + 0+") "; })

			svg.append("text")
					.attr("x", (width / 4))
					.attr("y", 0 - (margin.top / 2))
					.attr("text-anchor", "left")
					.style("font-size", "15px")
					.text(data['charttitle']);

			svg.append("text")
					.attr("x", (width / 4))
					.attr("y", 0 - (margin.top / 7))
					.attr("text-anchor", "left")
					.style("font-size", "12px")
					.text(data['chartnote']);

	});
            
        }
    };
}());

