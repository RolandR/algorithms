
/*

	Bucket Sort

	N = biggest Element

	Runs in O(n + N) time
	uses O(N) space
	
*/

function bucketSort(string){

	string = string.split("");

	return doBucketSort(string).join("");
	
}

function doBucketSort(arr){
	var len = arr.length;

	var bucket = [];
	
	for(var i = 0; i < len; i++){
		var index = arr[i].charCodeAt(0);
		var el = arr[i];

		if(bucket[index] == undefined){
			bucket[index] = [el];
		} else {
			bucket[index].push(el);
		}
	}

	var sorted = [];

	for(var i = 0; i < bucket.length; i++){
		el = bucket[i];

		if(el){
			for(var e = 0; e < el.length; e++){
				sorted.push(el[e]);
			}
		}
	}

	return sorted;
}
