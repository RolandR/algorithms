
/*

	MergeSort

	Runs in O(n log n)
	
*/

function mergeSort(string){

	var len = string.length;

	if(len <= 1){
		return string;
	}

	var a = mergeSort(string.substring(0, Math.floor(len/2)));
	var b = mergeSort(string.substring(Math.floor(len/2)));

	var aIndex = 0;
	var bIndex = 0;

	var aChar = a.charAt(aIndex);
	var bChar = b.charAt(bIndex);

	var out = "";

	while(out.length < len){
		if((aChar < bChar && aChar != "") || bChar == ""){
			out += aChar;
			aChar = a.charAt(++aIndex);
		} else {
			out += bChar;
			bChar = b.charAt(++bIndex);
		}
	}

	return out;
	
}
