/*

=== Partition ===

*/


function Partition(){

	var setts = new DoublyLinkedList();

	function Element(v){
		var value = v;
		var sett = new UnorderedSet();
		var settPosition = setts.insertLast(sett);

		function union(other){
			var otherSett = other.getSett();
			if(sett.size() > otherSett.size()){
				sett.addAll(otherSett);
				other.setSett(sett, setPosition);
			} else {
				otherSett.addAll(sett);
				setSett(otherSett, other.getSettPosition());
			}

			var node = sett.peek();
			while(node){
				node.getE().setSett(sett, setPosition);
				node = node.getNext();
			}
			
		}

		return{
			 getE: function(){return value;}
			,getSett: function(){return sett;}
			,getSettPosition: function(){return settPosition;}
			,setSett: function(p, pos){
				settPosition.remove();
				sett = p;
				settPosition = pos;
			}
			,union: union
		};
	}

	function insert(v){
		var e = new Element(v);
		e.getSett().insert(e);
		return e;
	}

	function toArray(){
		var array = [];
		var settsArray = setts.toArray();
		for(var i in settsArray){
			array.push(settsArray[i]);
		}
		return array;
	}

	return {
		 insert: insert
		,toArray: toArray
	};
}
