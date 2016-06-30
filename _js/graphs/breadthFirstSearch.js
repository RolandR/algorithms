
/*
	Breadt First Search

	runs in O(n+m) using adjacency list
	
*/
function breadthFirstSearch(graphTool, onlySelected){

	
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

	if(selectedVertex){
		var v = selectedVertex;
		
		doBFS(v);
		
	}

	if(!onlySelected){

		var vertex = graph.getVertexList().getFirst();
		while(vertex && vertex.isElement){
			var v = vertex.getE();
			if(v.attributes.explored === false){
				
				doBFS(v);
			}
			vertex = vertex.getNext();
		}
	}
	
	function doBFS(vertex){

		if(vertex.attributes.explored === false){
			
			vertex.attributes.explored = true;

			var i = 0;			
			var l = [[]];
			l[0].push(vertex);

			while(l[i].length > 0){

				l[i+1] = [];

				for(var a in l[i]){
					vertex = l[i][a];

					graphTool.addAnimationFrame(function(a){
						var v = a[0];
						v.attributes.aExplored = v.attributes.explored;
						graphTool.highlightNode(v);
					}, [vertex]);
					
					var edge = vertex.getIncidence().getFirst();			
					while(edge && edge.isElement){
					
						var e = edge.getE();

						if(e.attributes.explored === false && e.comesFrom(vertex)){
							var other = e.getOther(vertex);
							
							if(other.attributes.explored == false){
								e.attributes.explored = true;
								e.attributes.discovery = true;
								other.attributes.explored = true;

								graphTool.addAnimationFrame(function(a){
									var e = a[0];
									e.attributes.aExplored = e.attributes.explored;
									e.attributes.aDiscovery = e.attributes.discovery;
									var v = a[1];
									v.attributes.aExplored = v.attributes.explored;
								}, [e, other]);
								
								l[i+1].push(other);
							} else {
								e.attributes.explored = true;
								e.attributes.discovery = false;

								graphTool.addAnimationFrame(function(a){
									var e = a[0];
									e.attributes.aExplored = e.attributes.explored;
									e.attributes.aDiscovery = e.attributes.discovery;
								}, [e]);
							}
						}
						
						edge = edge.getNext();
					}
				}

				i++;
			}
		}
	}
	
	
}

