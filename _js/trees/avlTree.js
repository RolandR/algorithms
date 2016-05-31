/*

=== AVL Tree ===

*/


function AVLTree(){

	var root = new Element(null, false);

	var length = 0;

	function Element(p, l){
		var e = null;
		var isLeftChild = l;
		var parent = p;
		var left = null;
		var right = null;
		var isExternal = true;
		var height = 0;

		return {
			 getE: function(){return e;}
			,setE: function(p){e = p;}
			,getParent: function(){return parent;}
			,setParent: function(p){parent = p;}
			,getLeft: function(){return left;}
			,setLeft: function(p){left = p;}
			,getRight: function(){return right;}
			,setRight: function(p){right = p;}
			,getExternal: function(){return isExternal;}
			,setExternal: function(p){isExternal = p;}
			,isLeft: function(){return isLeftChild;}
			,setIsLeft: function(p){isLeftChild = p;}
			,getHeight: function(){return height;}
			,setHeight: function(p){height = p;}
		};
	}

	function Pair(k, v){
		var key = k;
		var value = v;

		return {
			 getKey: function(){return key;}
			,getValue: function(){return value;}
		};
	}

	function swap(a, b){
		var aContent = a.getE();
		a.setE(b.getE());
		b.setE(aContent);
	}

	function rotate(rRoot, pivot){
		/*
		    root (b)
		    /  \
		   /    \
		  a    pivot (d)
		       /   \
		      c     e

		      to

				pivot (d)
				/  \
			   /    \
			root(b)  e
			/   \
		   a     c

			(down is left rotation, up is right)

		*/

		if(pivot.getParent() != rRoot){
			console.error("Tried to rotate where pivot isn't child of root: ");
			console.log(rRoot.getE().getKey());
			console.log(pivot.getE().getKey());
			console.log(pivot.getParent().getE().getKey());
			return false;
		}

		var rotateRight = true;
		if(rRoot.getRight() == pivot){ // as per wikipedia, I guess
			rotateRight = false;
		}	

		// subree that will move from pivot to root
		var movedSubtree = null;
		
		if(rotateRight){
			
			movedSubtree = pivot.getRight();
			pivot.setRight(rRoot);
			rRoot.setLeft(movedSubtree);
			
		} else {
			
			movedSubtree = pivot.getLeft();
			pivot.setLeft(rRoot);
			rRoot.setRight(movedSubtree);
			
		}

		// Attach pivot to root's parent
		var parent = rRoot.getParent();
		if(parent){
			if(rRoot.isLeft()){
				parent.setLeft(pivot);
				pivot.setIsLeft(true);
			} else {
				parent.setRight(pivot);
				pivot.setIsLeft(false);
			}
		} else {
			root = pivot;
			pivot.setIsLeft(false);
		}

		rRoot.setIsLeft(!rotateRight);
		if(movedSubtree){
			movedSubtree.setIsLeft(rotateRight);
			movedSubtree.setParent(rRoot);
		}
		
		rRoot.setParent(pivot);
		pivot.setParent(parent);

		rRoot.setHeight(max([rRoot.getLeft().getHeight(), rRoot.getRight().getHeight()])+1);
		pivot.setHeight(max([pivot.getLeft().getHeight(), pivot.getRight().getHeight()])+1);
		updateHeightRecursively(pivot.getParent());

		return true;

		
	}

	function insert(key, value){
		var pair = new Pair(key, value);
		
		var newNode = insertRecursively(root, pair);

		updateHeightRecursively(newNode.getParent());
		
		return newNode;
		
	}

	function insertRecursively(node, pair){
		
		if(node.getExternal()){
			node.setExternal(false);
			node.setHeight(1);
			node.setE(pair);
			node.setLeft(new Element(node, true));
			node.setRight(new Element(node, false));

			length++;

			return node;
			
		} else {
			if(pair.getKey() < node.getE().getKey()){
				return insertRecursively(node.getLeft(), pair);
			} else {
				return insertRecursively(node.getRight(), pair);
			}
		}
	}

	function updateHeightRecursively(node){
		if(node){
			var newHeight = max([node.getLeft().getHeight(), node.getRight().getHeight()]) + 1;
			if(newHeight == node.getHeight()){
				return;
			} else {
				node.setHeight(newHeight);
				var lean = node.getRight().getHeight() - node.getLeft().getHeight(); // negative means left-leaning
				if(lean > 1){
					rotate(node, node.getRight());
					return;
				} else if(lean < -1){
					rotate(node, node.getLeft());
					return;
				} else {
					updateHeightRecursively(node.getParent());
					return;
				}
			}
		} else {
			return;
		}
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
			if(node.getParent()){
				var replacement;
				if(node.getLeft().getExternal()){
					replacement = node.getRight();
				} else if(node.getRight().getExternal()){
					replacement = node.getLeft();
				}
				replacement.setIsLeft(node.isLeft());
				if(replacement.isLeft()){
					node.getParent().setLeft(replacement);
				} else {
					node.getParent().setRight(replacement);
				}
			}
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

		if(!node){
			return ['<span style="background-color: #FFAAAA">-</span>'];
		} else if(node.getExternal()){
			return ['<span style="background-color: #FFFFAA">'+node.getHeight()+' []</span>'];
		} else {				
			var out = [];
			out.push('<span style="background-color: #FFCCAA">'+node.getHeight()+' ('+node.getE().getKey()+', '+node.getE().getValue()+')</span>');
			
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
		,rotate: rotate
		,print: print
		,getRoot: function(){return root;}
	};
}

/*

	Binary tree sort:
	Traverse binary tree inorder

*/


function avlTreeSort(sortString){
	
	var tree = new AVLTree();
	
	sortString = sortString.split("");

	for(var i in sortString){
		var el = sortString[i];
		tree.insert(el, el);
	}

	tree.print("out");

	var sortedString = inorderPrintKeys(tree.getRoot());
	
	function inorderPrintKeys(node){
		if(node.getExternal()){
			return "";
		} else {
			return inorderPrintKeys(node.getLeft()) + node.getE().getKey() + inorderPrintKeys(node.getRight());
		}
	}

	return sortedString;
	
}




























