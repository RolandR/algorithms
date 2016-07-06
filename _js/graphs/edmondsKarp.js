
/*
	Edmonds-Karp's Algorithm

	Finds max-flow in a network
	
*/
function edmondsKarp(graphTool, sink){
	
	var source = graphTool.getSelectedVertex();
	var graph = graphTool.getGraph();
	
	if(!source){
		return false;
	}

	source.attributes.source = true;
	sink.attributes.sink = true;

	graphTool.render();

	graphTool.addAnimationFrame(function(a){
		var edge = graph.getEdgeList().getFirst();
		while(edge && edge.isElement){
			var e = edge.getE();
			e.attributes.label = "0/"+e.getWeight();
			edge = edge.getNext();
		}
	}, []);

	resetEdges();
	var path = findAugmentingPath(source);
	
	while(path){

		traceBackPath(sink);

		resetEdges();
		
		path = findAugmentingPath(source, [], 0);
	}

	function traceBackPath(vertex){

		var path = [];

		var smallestEdge;
		var lastEdge;
		var minimumSoFar = 0;

		while(vertex != source){
			lastEdge = smallestEdge;
			var edge = vertex.getIncidence().getFirst();
			while(edge && edge.isElement){
				
				var e = edge.getE();

				if(e.attributes.order && lastEdge != e){
					if(smallestEdge){
						if(smallestEdge.attributes.order > e.attributes.order){
							smallestEdge = e;
						}
					} else {
						smallestEdge = e;
					}
				}
				
				edge = edge.getNext();
			}

			var residual = 0;
			var sign = 1;

			if(smallestEdge.pointsTo(vertex)){
				residual = smallestEdge.attributes.fResidual;
				sign = 1;
			} else {
				residual = smallestEdge.attributes.bResidual;
				sign = -1;
			}

			if(minimumSoFar == 0){ minimumSoFar = residual; }

			if(minimumSoFar > residual){
				minimumSoFar = residual;
			}
			
			path.unshift([smallestEdge, sign]);
			vertex = smallestEdge.getOther(vertex);
		}

		for(var i in path){
			path[i][0].attributes.flow += path[i][1] * minimumSoFar;
		}

		graphTool.addAnimationFrame(function(a){
			var edge = graph.getEdgeList().getFirst();
			while(edge && edge.isElement){
				var e = edge.getE();
				e.attributes.aExplored = false;
				e.attributes.aDiscovery = false;
				edge = edge.getNext();
			}
			var path = a[0];
			for(var i in path){
				path[i][0].attributes.aExplored = true;
				path[i][0].attributes.aDiscovery = true;
				path[i][0].attributes.aFlow += path[i][1] * a[1];
				path[i][0].attributes.label = path[i][0].attributes.aFlow + "/" + path[i][0].getWeight();
			}
		}, [path, minimumSoFar]);

		return path;
		
	}

	function findAugmentingPath(vertex){

		var i = 0;			
		var l = [[]];
		l[0].push(vertex);

		while(l[i].length > 0){

			l[i+1] = [];

			for(var a in l[i]){
				vertex = l[i][a];
				
				var edge = vertex.getIncidence().getFirst();			
				while(edge && edge.isElement){
				
					var e = edge.getE();

					var residual = 0;

					if(e.comesFrom(vertex)){
						residual = e.attributes.fResidual;
					} else {
						residual = e.attributes.bResidual;
					}

					if(residual > 0 && e.attributes.explored === false){

						e.attributes.explored = true;
						e.attributes.order = i+1;
						
						var other = e.getOther(vertex);
						l[i+1].push(other);
						
						if(other == sink){
							return true;
						}
					}
					
					edge = edge.getNext();
				}
			}

			i++;
		}
	}

	function resetEdges(){
		var edge = graph.getEdgeList().getFirst();
		while(edge && edge.isElement){
			var e = edge.getE();
			if(e.attributes.flow == undefined){
				e.attributes.flow = 0;
				e.attributes.aFlow = 0;
			}
			e.attributes.explored = false;
			e.attributes.aExplored = false;
			e.attributes.aDiscovery = false;
			e.attributes.fResidual = e.getWeight() - e.attributes.flow;
			e.attributes.bResidual = e.attributes.flow;
			e.attributes.order = undefined;
			edge = edge.getNext();
		}
	}
}

function edmondsKarpClick(args, vertex){
	if(!vertex){
		if(graphTool.getSelectedVertex()){
			graphTool.requestVertex(edmondsKarpClick);
		}
	} else {
		edmondsKarp(graphTool, vertex);
	}
}






























