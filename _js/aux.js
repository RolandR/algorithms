function max(numbers){
	var foundMax = numbers[0];
	for(var i in numbers){
		if(numbers[i] > foundMax){
			foundMax = numbers[i];
		}
	}
	return foundMax;
}
