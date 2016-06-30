
/*
	Checks if directed graph is strongly connected
	using Depth First Search

	runs in O(n+m) using adjacency list
	
*/
function hasStrongConnectivity(graphTool){

	var selectedVertex = graphTool.getSelectedVertex();

	var graph = graphTool.getGraph();

	setUnexplored();

	if(!selectedVertex){
		selectedVertex = graph.getVertexList().getFirst().getE();
	}
	
	var v = selectedVertex;
	
	findStrongConnectivity(v, false);

	var vertex = graph.getVertexList().getFirst();
	while(vertex && vertex.isElement){
		var v = vertex.getE();
		if(v.attributes.explored === false){
			v.attributes.notStronglyConnected = true;
		}
		vertex = vertex.getNext();
	}
	
	setUnexplored();
	findStrongConnectivity(v, true);

	var vertex = graph.getVertexList().getFirst();
	while(vertex && vertex.isElement){
		var v = vertex.getE();
		if(v.attributes.explored === false || v.attributes.notStronglyConnected == true){
			v.attributes.notStronglyConnected = true;
			v.attributes.aWarn = true;
		} else {
			v.attributes.aOkay = true;
		}
		vertex = vertex.getNext();
	}

	graphTool.render();
	
	function findStrongConnectivity(vertex, reverse){

		if(vertex.attributes.explored === false){
			
			vertex.attributes.explored = true;

			var edge = vertex.getIncidence().getFirst();
			
			while(edge && edge.isElement){
				
				var e = edge.getE();

				var doExplore = e.comesFrom(vertex);
				if(reverse){
					doExplore = e.pointsTo(vertex);
				}

				if(e.attributes.explored === false && doExplore){
					var other = e.getOther(vertex);
					
					if(other.attributes.explored == false){
						e.attributes.explored = true;
						e.attributes.discovery = true;
						
						findStrongConnectivity(other, reverse);
					} else {
						e.attributes.explored = true;
						e.attributes.discovery = false;
					}
				}
				
				edge = edge.getNext();
			}
		}
	}

	function setUnexplored(){
		var vertex = graph.getVertexList().getFirst();
		while(vertex && vertex.isElement){
			var v = vertex.getE();
			v.attributes.explored = false;
			vertex = vertex.getNext();
		}

		var edge = graph.getEdgeList().getFirst();
		while(edge && edge.isElement){
			var e = edge.getE();
			e.attributes.explored = false;
			edge = edge.getNext();
		}
		
	}
}


