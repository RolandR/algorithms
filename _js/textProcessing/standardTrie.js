/*

=== Standard Trie ===

Space: O(n) for
n = total size of strings
search, insert, delete: O(dm)
d = |alphabet|
m = |string parameter|

when compressed, size is O(s) for number of strings

Compressed Suffix trie uses O(n) space
and upports arbitrary pattern matching queries in O(dm) time

*/


function StandardTrie(){

	var root = new Element();

	var length = 0;

	function Element(){
		var e = "";
		var children = new PriorityQueue();
		var isRoot = false;
		var isExternal = true;

		function insert(string){

			var value = "";
			if(string.length > 0){
				value = string[0];
			}
			
			var node = children.getAt(value);
			
			if(!node){
				node = new Element();
				node.setE(value);
				children.insert(value, node);
				isExternal = false;
			}

			if(string.length > 1){
				node.insert(string.substring(1));
			} else if(string.length == 1){
				node.insert("");
			}
		}

		return {
			 getE: function(){return e;}
			,setE: function(p){e = p;}
			,getChildren: function(){return children;}
			,insert: insert
			,getExternal: function(){return isExternal;}
			,setExternal: function(p){isExternal = p;}
		};
	}

	function match(string, node){
		if(!node){
			node = root;
		}

		var value = "";

		if(node.getExternal()){
			if(node.getE() == value){
				return true;
			} else {
				return false;
			}
		}
		
		if(string.length > 0){
			value = string[0];
		}

		var children = node.getChildren();
		
		var child = children.getAt(value);
		
		if(!child){
			return false;
		} else {
			if(string.length > 1){
				return match(string.substring(1), child);
			} else {
				return match("", child);
			}
		}
	}

	function getAllWords(node){
		if(!node){
			node = root;
		}
		
		if(node.getExternal()){
			return [""];
		} else {
			var out = [];
			
			var child = node.getChildren().peek();
			while(child){

				var words = getAllWords(child.getE().getValue());

				for(var i in words){
					out.push(node.getE() + words[i]);
				}
				
				child = child.getNext();
			}

			return out;
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
			out.push('<span style="background-color: #FFCCAA">('+node.getE()+')</span>');

			var child = node.getChildren().peek();
			while(child){
				var e = child.getE().getValue();

				var subtrie = buildFancy(e);

				if(child.getNext()){
					for(var i in subtrie){
						var l = subtrie[i];
						if(i == 0){
							l = "├" + l;
						} else {
							l = "│" + l;
						}
						out.push(l);
					}
				} else {
					for(var i in subtrie){
						var r = subtrie[i];
						if(i == 0){
							r = "└" + r;
						} else {
							r = "&nbsp;" + r;
						}
						out.push(r);
					}
				}
				
				child = child.getNext();
			}
			
			return out;
		}
	}

	return {
		 insert: root.insert
		,getAllWords: getAllWords
		,match: match
		,print: print
		,getRoot: function(){return root;}
	};
}





















