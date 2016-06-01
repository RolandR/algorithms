
/*

	QuickSelect

	Finds the n-th smallest element in input

	Runs in O(n)
	
*/

function quickSelect(string, n){

	string = string.split("");

	if(n <= string.length){
		return doQuickSelect(string, n);
	} else {
		console.error("n is larger than string length!");
	}
	
}

function doQuickSelect(arr, n){
	var len = arr.length;

	if(len == 0){
		console.log("Found nothing");
		return arr;
	}

	var p = Math.floor(Math.random()*len);
	var pivot = arr[p];

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

	if(smaller.length < n && n <= smaller.length + equal.length){
		return equal[0];
	} else if(smaller.length >= n){
		return doQuickSelect(smaller, n);
	} else {
		return doQuickSelect(greater, n - smaller.length - equal.length);
	}
}
