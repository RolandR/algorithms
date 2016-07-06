
/*
	Ford-Fulkerson's Algorithm

	Finds max-flow in a network
	
*/
function fordFulkerson(graphTool, sink){
	
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
	var path = findAugmentingPath(source, [], 0);
	
	while(path){
		var minimum = path[1];
		path = path[0];
		
		for(var i in path){
			path[i][0].attributes.flow += path[i][1] * minimum;
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
		}, [path, minimum]);

		resetEdges();
		path = findAugmentingPath(source, [], 0);
	}

	function findAugmentingPath(vertex, pathSoFar, minimumSoFar){

		var edge = vertex.getIncidence().getFirst();
		while(edge && edge.isElement){
			
			var e = edge.getE();

			var residual = 0;
			var sign = 1;

			if(e.comesFrom(vertex)){
				residual = e.attributes.fResidual;
			} else {
				residual = e.attributes.bResidual;
				sign = -1;
			}

			if(residual > 0 && e.attributes.explored === false){

				e.attributes.explored = true;

				if(minimumSoFar == 0){ minimumSoFar = residual; }

				if(minimumSoFar > residual){
					minimumSoFar = residual;
				}
				
				var other = e.getOther(vertex);
				
				if(other != sink){
					var path = findAugmentingPath(other, pathSoFar.concat([[e, sign]]), minimumSoFar);
					if(path){
						return path;
					}
				} else {
					return [pathSoFar.concat([[e, sign]]), minimumSoFar];
				}
			}
			
			edge = edge.getNext();
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
			edge = edge.getNext();
		}
	}
}

function fordFulkersonClick(args, vertex){
	if(!vertex){
		if(graphTool.getSelectedVertex()){
			graphTool.requestVertex(fordFulkersonClick);
		}
	} else {
		fordFulkerson(graphTool, vertex);
	}
}






























