
/*
	Depth First Search

	runs in O(n+m) using adjacency list
	
*/
function topologicalSorting(graphTool, onlySelected){

	var selectedVertex = graphTool.getSelectedVertex();
	
	if(onlySelected && !selectedVertex){
		return false;
	}

	graphTool.resetAttributes();

	var graph = graphTool.getGraph();

	var n = graph.getVertexCount();

	var vertex = graph.getVertexList().getFirst();
	while(vertex && vertex.isElement){
		var v = vertex.getE();
		v.attributes.explored = false;
		v.attributes.aExplored = false;
		vertex = vertex.getNext();
	}

	var edge = graph.getEdgeList().getFirst();
	while(edge && edge.isElement){
		var e = edge.getE();
		e.attributes.explored = false;
		e.attributes.aExplored = false;
		edge = edge.getNext();
	}

	graphTool.render();

	var path = [];

	if(selectedVertex){
		var v = selectedVertex;
		path.push(v);
		topoSort(v);
		
	}

	if(!onlySelected){

		var vertex = graph.getVertexList().getFirst();
		while(vertex && vertex.isElement){
			var v = vertex.getE();
			if(v.attributes.explored === false){
				path.push(v);
				topoSort(v);
			}
			vertex = vertex.getNext();
		}
	}
	
	function topoSort(vertex){

		if(vertex.attributes.explored === false){

			path.push(vertex);
			
			vertex.attributes.explored = true;

			var edge = vertex.getIncidence().getFirst();
			
			while(edge && edge.isElement){
				
				var e = edge.getE();

				if(e.attributes.explored === false && e.comesFrom(vertex)){
					
					var other = e.getOther(vertex);
					
					if(other.attributes.explored == false){
						e.attributes.explored = true;
						e.attributes.discovery = true;

						path.push(vertex);
						path.push(e);
						
						topoSort(other);
					} else {
						e.attributes.explored = true;
						e.attributes.discovery = false;
					}
				}
				
				edge = edge.getNext();
			}

			vertex.attributes.number = n;
			n--;
			graphTool.addAnimationFrame(function(a){
				var v = a[0];
				v.attributes.label = v.attributes.number;
				var path = a[1];
				if(path[0]){
					graphTool.highlightNode(path[0]);
				}
				for(var i in path){
					path[i].attributes.aExplored = path[i].attributes.explored;
					path[i].attributes.aDiscovery = path[i].attributes.discovery;
				}
			}, [vertex, Array.from(path)]);
			path = [];
		}
	}
	
	
}


