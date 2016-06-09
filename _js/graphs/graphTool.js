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
	
	var editMode = "connect";
	var connectStartNode = null;
	var moveStart = null;
	var screenMoveStart = null;
	var moving = false;

	canvas.onclick = function(e){
		var name = String.fromCharCode(nameCharCode++);
		var v = graph.insertVertex(name);
		
		v.attributes.pos = [
			 e.offsetX
			,e.offsetY
		];

		/*v.clicked = function(e){
			switch(editMode){
				case "connect":
					if(!connectStartNode){
						connectStartNode = v;
						connectStartNode.attributes.marked = true;
						render();
					} else {
						if(connectStartNode != v){
							makeConnection(v);
						}
					}
				break;
				case "delete":
					v.remove();
					container.removeChild(v.div);
					render();
				break;
			}
		}*/

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
					if(!connectStartNode){
						connectStartNode = v;
						connectStartNode.attributes.marked = true;
						render();
					} else {
						if(connectStartNode != v){
							makeConnection(v);
						} else {
							connectStartNode.attributes.marked = false;
							connectStartNode = null;
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
		v.div.onclick = v.clicked;
		v.div.onmousedown = v.mousedown;
		container.appendChild(v.div);

		render();
		
	}

	function makeConnection(v){
		
		var weight = 1;
		var e = graph.connect(v, connectStartNode, weight);

		connectStartNode.attributes.marked = false;
		connectStartNode = null;
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
			
			edge = edge.getNext();
		}
		
		var vertex = graph.getVertexList().getFirst();
		 
		while(vertex && vertex.isElement){
			var v = vertex.getE();

			var radius = 15;

			context.beginPath();
			context.arc(v.attributes.pos[0], v.attributes.pos[1], radius, 0, 2 * Math.PI);
			if(v.attributes.marked){
				v.div.className = "vertexLabel activeVertex";
			} else {
				v.div.className = "vertexLabel";
			}
			context.fill();
			context.lineWidth = 1;
			context.strokeStyle = "#777777";
			context.stroke();
			
			vertex = vertex.getNext();
		}
	}

	function changeEditMode(newMode){
		editMode = newMode;
		if(connectStartNode){
			connectStartNode.attributes.marked = false;
			connectStartNode = null;
		}
		render();
	}


	return {
		changeEditMode: changeEditMode
	};
	
}



























