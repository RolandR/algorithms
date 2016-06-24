/*

=== Binary Search Tree ===

*/


function BinarySearchTree(){

	var root = new Element(null);
	root.setRoot(true);

	var length = 0;

	function Element(p){
		var e = null;
		var parent = p;
		var children = new ;
		var isExternal = true;
		var isRoot = false;

		function insert(value){
			if(!e && !isRoot){
				e = value;
				return this;
			} else {
				
			}
		}

		return {
			 getE: function(){return e;}
			,setE: function(p){e = p;}
			,getParent: function(){return parent;}
			,setParent: function(p){parent = p;}
			,getChildren: function(){return left;}
			,insert: insert
			,getExternal: function(){return isExternal;}
			,setExternal: function(p){isExternal = p;}
			,isLeft: function(){return isLeftChild;}
			,setIsLeft: function(p){isLeftChild = p;}
			,getRoot: function(){return isRoot;}
			,setRoot: function(p){isRoot = p;}
		};
	}

	function search(key){
		return searchRecursively(root, key);
	}

	function searchRecursively(node, key){
		if(node.getExternal()){
			return null;
		} else {
			if(node.getE().getKey() == key){
				return node;
			} else if(key < node.getE().getKey()){
				return searchRecursively(node.getLeft(), key);
			} else {
				return searchRecursively(node.getRight(), key);
			}
		}
	}

	function smallestKey(nodes){
		var smallest = null;
		for(var i in nodes){
			if(!nodes[i].getExternal()){
				if(smallest == null){
					smallest = nodes[i];
				} else {
					if(nodes[i].getE().getKey() < smallest.getE().getKey()){
						smallest = nodes[i];
					}
				}
			}
		}
		return smallest;
	}

	function remove(key){
		var node = search(key);
		if(node){
			return removeNode(node);
		}
		return null;
	}

	function removeNode(node){
		
		if(node.getLeft().getExternal()){
			return removeAboveExternal(node.getLeft());
		} else if(node.getRight().getExternal()){
			return removeAboveExternal(node.getRight());
		} else {

			var traverseNode = node.getRight();
			while(!traverseNode.getExternal()){
				traverseNode = traverseNode.getLeft();
			}

			swap(node, traverseNode.getParent());

			return removeAboveExternal(traverseNode);
			
		}
		
	}

	function removeAboveExternal(exNode){
		
		var node = exNode.getParent();
		var parent = node.getParent();
		var replacement;
		
		if(exNode.isLeft()){
			replacement = node.getRight();
		} else {
			replacement = node.getLeft();
		}
		
		replacement.setIsLeft(node.isLeft());
		replacement.setParent(parent);
		
		if(parent){
			if(node.isLeft()){
				parent.setLeft(replacement);
			} else {
				parent.setRight(replacement);
			}
		} else {
			root = replacement;
		}

		length--;

		return node;
		
	}

	function keysInorder(node){
		if(!node){
			node = root;
		}
		
		if(node.getExternal()){
			return "";
		} else {
			return keysInorder(node.getLeft()) + node.getE().getKey() + keysInorder(node.getRight());
		}
	}

	function print(elementId){
		var outString = "Length: "+length+"<br />\n";

		var arr = buildFancy(root);
		var out = "";
		for(var i in arr){
			out += arr[i] + "<br />\n";
		}

		outString += out;

		if(elementId){
			document.getElementById(elementId).innerHTML = outString;
		}
		
		return outString;
	}

	function buildFancy(node){
		
		if(node.getExternal()){
			return ['<span style="background-color: #FFFFAA">[]</span>'];
		} else {				
			var out = [];
			out.push('<span style="background-color: #FFCCAA">('+node.getE().getKey()+', '+node.getE().getValue()+')</span>');
			
			var left = buildFancy(node.getLeft());
			var right = buildFancy(node.getRight());
			for(var i in left){
				var l = left[i];
				if(i == 0){
					l = "├" + l;
				} else {
					l = "│" + l;
				}
				out.push(l);
			}
			for(var i in right){
				var r = right[i];
				if(i == 0){
					r = "└" + r;
				} else {
					r = "&nbsp;" + r;
				}
				out.push(r);
			}
			
			return out;
		}
	}

	return {
		 insert: insert
		,search: search
		,remove: remove
		,print: print
		,getRoot: function(){return root;}
	};
}





















