
/*
	Depth First Search
*/
function depthFirstSearch(graphTool){

	
	var graph = graphTool.getGraph();

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

	graphTool.render();

	var startVertex = graphTool.getSelectedVertex();

	if(startVertex){
		graphTool.requestAction(doDFS, [startVertex]);
	}

	function doDFS(args){

		console.log("foo!");
		
		vertex = args[0];
		
		vertex.attributes.explored = true;

		var edge = vertex.getIncidence().getFirst();
		while(edge && edge.isElement){
			var e = edge.getE();

			var other = e.getOther(vertex);

			if(other.attributes.explored == false){
				e.attributes.explored = true;
				e.attributes.discovery = true;
				graphTool.requestAction(doDFS, [other]);
			} else {
				e.attributes.explored = true;
				e.attributes.discovery = false;
			}
			
			edge = edge.getNext();
		}

		graphTool.render();
	}
	
	
}

