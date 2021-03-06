/*

=== Set ===

Insert takes O(n) time
Remove takes O(1) time

Like priority queue, takes values instead of pairs and deduplicates

*/


function Set(){

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
			var previous = null;
			
			while (node){
				if(node.getE() > value){
					// Insert before
					if(previous){
						previous.setNext(new Element(value));
						previous.getNext().setNext(node);
					} else {
						first = new Element(value);
						first.setNext(node);
					}
					length++;
					break;
				} else if(node.getE() < value){
					if(!node.getNext()){
						node.setNext(new Element(value));
						last = node.getNext();
						length++;
						break;
					} else {
						var next = node.getNext();
						node.setNext(new Element(value));
						node.getNext().setNext(next);
						length++;
						break;
					}
				} else {
					// element exists already, skip
					return node;
				}
				previous = node;
				node = node.getNext();
			}
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




























