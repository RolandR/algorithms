
/*
	Depth First Search

	runs in O(n+m) using adjacency list
	
*/
function depthFirstSearch(graphTool, onlySelected){

	var selectedVertex = graphTool.getSelectedVertex();
	
	if(onlySelected && !selectedVertex){
		return false;
	}

	graphTool.resetAttributes();

	var graph = graphTool.getGraph();

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

	var current;

	if(selectedVertex){
		var v = selectedVertex;
		
		doDFS(v);
		
	}

	if(!onlySelected){

		var vertex = graph.getVertexList().getFirst();
		while(vertex && vertex.isElement){
			var v = vertex.getE();
			if(v.attributes.explored === false){
				
				if(current != v){
					current = v;
					graphTool.addAnimationFrame(function(a){
						var v = a[0];
						graphTool.highlightNode(v);
						v.attributes.aExplored = v.attributes.explored;
					}, [v]);
				}
					
				doDFS(v);
			}
			vertex = vertex.getNext();
		}
	}
	
	function doDFS(vertex){

		if(vertex.attributes.explored === false){
			
			vertex.attributes.explored = true;

			var edge = vertex.getIncidence().getFirst();
			
			while(edge && edge.isElement){
				
				var e = edge.getE();

				if(e.attributes.explored === false && e.comesFrom(vertex)){

					if(current != vertex){
						current = vertex;
						graphTool.addAnimationFrame(function(a){
							var v = a[0];
							graphTool.highlightNode(v);
							v.attributes.aExplored = v.attributes.explored;
						}, [vertex]);
					}
					
					var other = e.getOther(vertex);
					
					if(other.attributes.explored == false){
						e.attributes.explored = true;
						e.attributes.discovery = true;

						graphTool.addAnimationFrame(function(a){
							var e = a[0];
							e.attributes.aExplored = e.attributes.explored;
							e.attributes.aDiscovery = e.attributes.discovery;
							var v = a[1];
							v.attributes.aExplored = v.attributes.explored;
						}, [e, other]);
						
						doDFS(other);
					} else {
						e.attributes.explored = true;
						e.attributes.discovery = false;

						graphTool.addAnimationFrame(function(a){
							var e = a[0];
							e.attributes.aExplored = e.attributes.explored;
							e.attributes.aDiscovery = e.attributes.discovery;
							var v = a[1];
							v.attributes.aExplored = v.attributes.explored;
						}, [e, other]);
					}
				}
				
				edge = edge.getNext();
			}
		}
	}
	
	
}

