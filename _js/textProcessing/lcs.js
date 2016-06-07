

/*
	Find longest common subsequences of two texts
*/

function findLCS(text1, text2, findAll){
	var lengths = [];
	
	for(var i = -1; i < text1.length; i++){
		lengths[i] = [];
		lengths[i][-1] = 0;
	}
	for(var k = -1; k < text2.length; k++){
		lengths[-1][k] = 0;
	}
	var padWidth = max([(text1.length+"").length, (text2.length+"").length]);
	var grid = " " + text2 + "\n";
	
	for(var i = 0; i < text1.length; i++){
		var line = text1.charAt(i);
		for(var k = 0; k < text2.length; k++){

			if(text1.charAt(i) == text2.charAt(k)){
				lengths[i][k] = lengths[i-1][k-1] + 1;
			} else {
				lengths[i][k] = max([lengths[i][k-1], lengths[i-1][k]]);
			}

			line += pad(lengths[i][k], padWidth, " ");
			
		}

		grid += line + "\n";
	}

	console.log(grid);


	function getAllLCS(i, k){
		if(i < 0 || k < 0){
			return [""];
		} else if (lengths[i][k-1] == lengths[i][k] && lengths[i-1][k] == lengths[i][k]) {
			var results = getAllLCS(i, k-1).concat(getAllLCS(i-1, k));
			var resultsSet = new Set();
			for(var r in results){
				resultsSet.insert(results[r]);
			}
			return resultsSet.toArray();
		} else if (lengths[i][k-1] == lengths[i][k]) {
			return getAllLCS(i, k-1);
		} else if (lengths[i-1][k] == lengths[i][k]) {
			return getAllLCS(i-1, k);
		} else {
			var results = getAllLCS(i-1, k-1);
			for(var r in results){
				results[r] += text1.charAt(i);
			}
			return results;
		}
	}

	function getLCS(i, k){
		if(i < 0 || k < 0){
			return "";
		} else if (lengths[i][k-1] == lengths[i][k]) {
			return getLCS(i, k-1);
		} else if (lengths[i-1][k] == lengths[i][k]) {
			return getLCS(i-1, k);
		} else {
			return getLCS(i-1, k-1) + text1.charAt(i);
		}
	}

	if(findAll){
		return getAllLCS(text1.length-1, text2.length-1);
	} else {
		return getLCS(text1.length-1, text2.length-1);
	}

}