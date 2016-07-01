/*

=== Unordered Set ===

Insert takes O(n) time

Only deduplicates, unlike Set, which also orders

*/


function UnorderedSet(){

	var first = null;
	var last = null;

	var length = 0;

	function Element(content){
		var e = content;
		var next = null;

		return {
			 getE: function(){return e;}
			,getNext: function(){return next;}
			,setNext: function(n){next = n;}
		};
	}

	function insert(value){
		if(length == 0){
			
			first = new Element(value);
			last = first;
			length++;
			
		} else {
			var node = first;
			while (node){
				if(node.getE() == value){
					// element exists already, skip
					return node;
				}
				node = node.getNext();
			}

			var newNode = new Element(value);
			newNode.setNext(first);
			first = newNode;
			length++;
		}
	}

	function addAll(other){
		while(other.size() > 0){
			var el = other.remove();
			insert(el);
		}
	}

	function remove(){
		if(length > 0){
			var e = first.getE();
			first = first.getNext();
			length--;
			return e;
		} else {
			return null;
		}
	}

	function peek(){
		return first;
	}

	function toArray(){
		var arr = [];
		var node = first;
		while(node){
			arr.push(node.getE());
			node = node.getNext();
		}
		return arr;
	}

	function print(){
		var outString = "Length: "+length+"\n";

		if(length > 0){
			var node = first;
			do{
				outString += "("+node.getE()+")";
				if(node != last){
					outString += " -> ";
				}
				node = node.getNext();
			} while (node)
		}
		
		return outString;
	}

	return {
		 insert: insert
		,remove: remove
		,peek: peek
		,addAll: addAll
		,toArray: toArray
		,print: print
		,size: function(){return length;}
	};
}




























