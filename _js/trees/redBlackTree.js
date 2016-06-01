/*

=== Red-Black Tree ===

	Restructure is O(1)
	Find is O(log n)
	Insert is O(log n)
	Remove is O(log n)

*/


function RedBlackTree(){

	var root = new Element(null, false, 0);

	var length = 0;

	function Element(p, l, d){
		var e = null;
		var isLeftChild = l;
		var depth = d;
		var isRed = false;
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
			,getBalance: function(){
				return left.getHeight() - right.getHeight();
			}
			,getOther: function(node){
				if(node.getParent() == this){
					if(node.isLeft()){
						return right;
					} else {
						return left;
					}
				} else {
					return null;
				}
			}
			,getSibling: function(){
				if(parent){
					if(isLeftChild){
						return parent.getRight();
					} else {
						return parent.getLeft();
					}
				} else {
					return null;
				}
			}
			,getRed: function(){return isRed;}
			,setRed: function(p){isRed = p;}
			,getDepth: function(){return depth;}
			,setDepth: function(p){depth = p;}
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

		//rRoot.setHeight(max([rRoot.getLeft().getHeight(), rRoot.getRight().getHeight()])+1);
		//pivot.setHeight(max([pivot.getLeft().getHeight(), pivot.getRight().getHeight()])+1);
		//updateHeightRecursively(pivot.getParent());

		return true;

		
	}

	function insert(key, value){
		if(!value){
			value = key;
		}
		var pair = new Pair(key, value);
		
		var newNode = insertRecursively(root, pair);

		//updateHeightRecursively(newNode.getParent());
		
		return newNode;
		
	}

	function insertRecursively(node, pair){
		
		if(node.getExternal()){
			node.setExternal(false);
			node.setHeight(1);
			node.setE(pair);
			node.setRed(true);
			node.setLeft(new Element(node, true, node.getDepth()+1));
			node.setRight(new Element(node, false, node.getDepth()+1));

			length++;

			ensureConsistency(node);

			return node;
			
		} else {
			if(pair.getKey() < node.getE().getKey()){
				return insertRecursively(node.getLeft(), pair);
			} else {
				return insertRecursively(node.getRight(), pair);
			}
		}
	}

	function ensureConsistency(node){
		if(!node.getRed()){ // Everything should be alright
			return node;
		} else if(node == root){ // Make sure root remains black and return
			node.setRed(false);
			return node;
		} else if(!node.getParent().getRed()){ // Parent of red node is black
			return node;
		} else {
			var parent = node.getParent();
			var grampa = parent.getParent();
			if(grampa){
				var uncle = parent.getSibling();
				if(uncle && uncle.getRed()){
					// Recolor
					parent.setRed(false);
					uncle.setRed(false);
					grampa.setRed(true);
					return ensureConsistency(grampa);
				} else {
					var pivot = parent;
					if(node.isLeft() != parent.isLeft()){
						/*
							turns right-left or left-right into right-right or left-left
						*/
						rotate(parent, node);
						pivot = node;
					}
					
					/*
						left-left or right-right
					*/
					rotate(grampa, pivot);
					pivot.setRed(false);
					pivot.getLeft().setRed(true);
					pivot.getRight().setRed(true);
					return node;
					
				}
			}
		}
	}

	function updateHeightRecursively(node){
		if(node){
			var oldHeight = node.getHeight();
			node.setHeight(max([node.getLeft().getHeight(), node.getRight().getHeight()]) + 1);
			
			var lean = node.getBalance(); // positive means left-leaning
			if(lean > 1){
				if(node.getLeft().getBalance() < 0){
					rotate(node.getLeft(), node.getLeft().getRight());
				} else {
					rotate(node, node.getLeft());
				}
				return;
			} else if(lean < -1){
				if(node.getRight().getBalance() > 0){
					rotate(node.getRight(), node.getRight().getLeft());
				} else {
					rotate(node, node.getRight());
				}
				return;
			} else {
				if(oldHeight != node.getHeight()){
					updateHeightRecursively(node.getParent());
				}
				return;
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

		if(node.getRed() || replacement.getRed()){ // If the removed node was red, everything's fine
			replacement.setRed(false);
		} else { // Note that replacement can be nothing but an external node in that case.
			fixDoubleBlack(replacement);
		}

		return node;
		
	}

	function fixDoubleBlack(node){
		if(node != root){
			var parent = node.getParent();
			var parentWasRed = parent.getRed();
			var sibling = parent.getOther(node);

			if(!sibling.getRed()){
				var redNephew = null;
				if(sibling.getLeft().getRed()){
					redNephew = sibling.getLeft();
				} else if(sibling.getRight().getRed()){
					redNephew = sibling.getRight();
				}

				if(redNephew){
					var pivot = sibling;
					if(redNephew.isLeft() != sibling.isLeft()){
						/*
							turns right-left or left-right into right-right or left-left
						*/
						rotate(sibling, redNephew);
						pivot = redNephew;
					}
					
					/*
						left-left or right-right
					*/
					rotate(parent, pivot);
					pivot.setRed(parentWasRed);
					pivot.getLeft().setRed(false);
					pivot.getRight().setRed(false);
					return;
					// Double black should be done
				} else {
					sibling.setRed(true);
					if(parentWasRed){
						parent.setRed(false);
						return;
					} else {
						fixDoubleBlack(parent);
						return;
					}
				}
			} else {
				rotate(parent, sibling);
				parent.setRed(true);
				sibling.setRed(false);
				fixDoubleBlack(node);
				return;
			}
		}
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
			document.getElementById(elementId).innerHTML += "<br />"+ outString;
		}
		
		return outString;
	}

	function buildFancy(node){

		if(!node){
			return ['<span style="background-color: #FFAAAA">NULL</span>'];
		} else if(node.getExternal()){
			return ['<span style="background-color: #BBBBBB">[]</span>'];
		} else {				
			var out = [];
			var color = "#999999";
			if(node.getRed()){
				color = "#FF9999";
			}
			out.push('<span style="background-color: '+color+'">('+node.getE().getKey()+', '+node.getE().getValue()+')</span>');
			
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
		,removeNode: removeNode
		,keysInorder: keysInorder
		,rotate: rotate
		,print: print
		,getRoot: function(){return root;}
	};
}

/*

	Red-Black Tree sort:
	Traverse red-black tree inorder

*/


function redBlackTreeSort(sortString){
	
	var tree = new RedBlackTree();
	
	sortString = sortString.split("");

	for(var i in sortString){
		var el = sortString[i];
		tree.insert(el, el);
	}

	tree.print("out");

	var sortedString = tree.keysInorder();

	return sortedString;
	
}




























