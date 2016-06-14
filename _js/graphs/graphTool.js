/*
	GraphTool - for displaying and interacting with graphs
*/

function GraphTool(graph, containerId){
	var container = document.getElementById(containerId);

	var canvas = document.createElement("canvas");
	container.appendChild(canvas);
	var context = canvas.getContext("2d");

	var size = min([container.offsetWidth, container.offsetHeight]);
	canvas.width = size;
	canvas.height = size;
	
	render();

	var nameCharCode = 65; //A
	
	var selectedNode = null;
	var selectedEdge = null;
	var moveStart = null;
	var screenMoveStart = null;
	var moving = false;

	function selectEdge(e){
		if(selectedNode){
			selectedNode.attributes.marked = false;
			selectedNode = null;
		}

		if(selectedEdge){
			selectedEdge.attributes.marked = false;
			selectedEdge.div.setAttribute("contentEditable", false);
		}
		selectedEdge = e;
		selectedEdge.attributes.marked = true;
		render();
	}

	function selectNode(v){
		if(selectedEdge){
			selectedEdge.attributes.marked = false;
			selectedEdge.div.setAttribute("contentEditable", false);
			selectedEdge = null;
		}

		if(selectedNode){
			selectedNode.attributes.marked = false;
		}
		selectedNode = v;
		selectedNode.attributes.marked = true;
		render();
	}

	window.onkeydown = function(e){
		if(e.code == "Delete"){
			if(selectedNode){
				
				var edge = selectedNode.getIncidence().getFirst();
				while(edge && edge.isElement){
					var e = edge.getE();

					container.removeChild(e.div);
					
					edge = edge.getNext();
				}
				
				selectedNode.remove();
				container.removeChild(selectedNode.div);
				selectedNode = null;
				render();
			}
			if(selectedEdge){
				
				selectedEdge.remove();
				container.removeChild(selectedEdge.div);
				selectedEdge = null;
				render();
			}
		}
		if(e.code == "Escape"){
			if(selectedNode){
				selectedNode.attributes.marked = false;
				selectedNode = null;
				render();
			}
			if(selectedEdge){
				selectedEdge.attributes.marked = false;
				selectedEdge = null;
				render();
			}
		}
	}

	canvas.onclick = function(e){
		var name = String.fromCharCode(nameCharCode++);
		var v = graph.insertVertex(name);
		
		v.attributes.pos = [
			 e.offsetX
			,e.offsetY
		];
		
		v.mousedown = function(e){
			moveStart = [
				 v.attributes.pos[0]
				,v.attributes.pos[1]
			];
			screenMoveStart = [
				 e.clientX
				,e.clientY
			];
			window.onmouseup = v.mouseup;
			window.onmousemove = v.mousemove;
		}

		v.mouseup = function(e){
			if(moveStart && screenMoveStart){
				if(Math.abs(e.clientX - screenMoveStart[0]) > 2 && Math.abs(e.clientY - screenMoveStart[1]) > 2){
					moving = true;
				}
				
				if(!moving){
					if(!selectedNode){
						selectNode(v);
					} else {
						if(selectedNode != v){
							makeConnection(v);
						} else {
							selectedNode.attributes.marked = false;
							selectedNode = null;
							render();
						}
					}
				}
			}
			moveStart = null;
			screenMoveStart = null;
			canvas.onmouseup = null;
			canvas.onmousemove = null;
			moving = false;
			render();
		}

		v.mousemove = function(e){
			if(moveStart && screenMoveStart){
				var newX = moveStart[0] + (e.clientX - screenMoveStart[0]);
				var newY = moveStart[1] + (e.clientY - screenMoveStart[1]);
				v.div.setAttribute("style", "top: "+newY+"px; left: "+newX+"px;");
				v.attributes.pos = [
					 newX
					,newY
				];

				var edge = v.getIncidence().getFirst();
				while(edge && edge.isElement){
					var e = edge.getE();

					var x = newX + (e.getOther(v).attributes.pos[0] - newX)/2;
					var y = newY + (e.getOther(v).attributes.pos[1] - newY)/2;
					e.div.setAttribute("style", "top: "+y+"px; left: "+x+"px;");
					
					edge = edge.getNext();
				}
				
				render();
				
				if(Math.abs(e.clientX - screenMoveStart[0]) > 2 && Math.abs(e.clientY - screenMoveStart[1]) > 2){
					moving = true;
				}
			}
		}

		v.div = document.createElement("div");
		v.div.className = "vertexLabel";
		v.div.setAttribute("style", "top: "+e.offsetY+"px; left: "+e.offsetX+"px;");
		v.div.innerHTML = name;
		v.div.onmousedown = v.mousedown;
		container.appendChild(v.div);

		if(selectedNode){
			makeConnection(v);
		}

		render();
		
	}

	function makeConnection(v){
		
		var weight = 1;
		var e = graph.connect(v, selectedNode, weight);

		e.clicked = function(ev){
			e.div.setAttribute("contentEditable", true);
			if(e == selectedEdge){
				
			} else {
				selectEdge(e);
			}
		}

		e.div = document.createElement("div");
		e.div.className = "edgeLabel";
		var x = v.attributes.pos[0] + (selectedNode.attributes.pos[0] - v.attributes.pos[0])/2;
		var y = v.attributes.pos[1] + (selectedNode.attributes.pos[1] - v.attributes.pos[1])/2;
		e.div.setAttribute("style", "top: "+y+"px; left: "+x+"px;");
		e.div.innerHTML = weight;
		e.div.onclick = e.clicked;
		container.appendChild(e.div);

		selectedNode.attributes.marked = false;
		selectedNode = null;
		render();
	}

	function render(){

		context.clearRect(0, 0, canvas.width, canvas.height);

		var edge = graph.getEdgeList().getFirst();
		 
		while(edge && edge.isElement){
			var e = edge.getE();

			context.beginPath();
			context.moveTo(e.getA().attributes.pos[0]+0.5, e.getA().attributes.pos[1]+0.5);
			context.lineTo(e.getB().attributes.pos[0]+0.5, e.getB().attributes.pos[1]+0.5);
			
			context.strokeStyle = "#555555";
			context.stroke();

			if(e.attributes.marked){
				e.div.className = "edgeLabel activeEdge";
			} else {
				e.div.className = "edgeLabel";
			}
			
			edge = edge.getNext();
		}
		
		var vertex = graph.getVertexList().getFirst();
		 
		while(vertex && vertex.isElement){
			var v = vertex.getE();
			
			if(v.attributes.marked){
				v.div.className = "vertexLabel activeVertex";
			} else {
				v.div.className = "vertexLabel";
			}
			
			vertex = vertex.getNext();
		}
	}
	
}



























