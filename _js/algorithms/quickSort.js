
/*

	QuickSort

	Runs max in O(n²)
	Average is O(n log n)
	
*/

function quickSort(string){

	string = string.split("");

	return doQuickSort(string).join("");
	
}

function doQuickSort(arr){
	var len = arr.length;

	if(len <= 1){
		return arr;
	}

	var pivot = arr[Math.floor(Math.random()*len)];

	var greater = [];
	var equal = [];
	var smaller = [];

	var el;
	
	for(var i = 0; i < len; i++){
		el = arr[i];
		if(el == pivot){
			equal.push(el);
		} else if(el > pivot){
			greater.push(el);
		} else {
			smaller.push(el);
		}
	}

	greater = doQuickSort(greater);
	smaller = doQuickSort(smaller);

	return smaller.concat(equal, greater);
}
