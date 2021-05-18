// Deep copies an array
function deepCopy(arr) {
	let arrCopy = []
	for (let i = 0; i < arr.length; i++) {
		arrCopy[i] = arr[i];
	}

	return arrCopy;
}


// Add all items in a array
function add(arr) {
	let sum = 0;
	for (let i = 0; i < arr.length; i++) {
		sum += arr[i];
	}
	
	return sum;
}


// Puts a t value through the sigmoid function and returns the value
function sigmoid(t) {
    return 1/(1+Math.pow(Math.E, -t));
}




class NeuralNetwork {
	constructor(layers, layer_sizes, inputs) {
		// layers = number of layers. If there are 5 layers, layers = 5
		// layer_sizes = number of nodes in each layer in an array. If layers = 2,
		//				 layer_sizes = [8, 10] If the hidden layer has 8 nodes and
		//				 the output layer has 10 nodes.
		// inputs = number of inputs. If there are 6 inputs, inputs = 6
		this.l = layers;
		this.ls = layer_sizes;
		this.i = inputs;
		
		
		// Set the weights and biases ----------------------------------------------------------------
		this.weights = [];
		this.biases = [];
		// For every layer in the network
		for (let i = 0; i < this.l; i++) {
			let newWeights = []; // new weights for that layer
			let newBiases = []; // new biases for that layer
			
			
			// For every node in the layer
			for (let j = 0; j < this.ls[i]; j++) {
				let nodeWeights = []; // Holds the weights for each input from the previous nodes
				let inputCount = 0; // Number of inputs to randomize
				
				// If i is 0, the inputs are form the input layer
				if (i == 0) {
					inputCount = this.i;
				} 
				// If i is not 0, the inputs are form the previous layer
				else {
					inputCount = this.ls[i-1];
				}
				
				// Randomize weigts from -1 to 1 for each node from the previous layer
				for (let z = 0; z < inputCount; z++) {
					nodeWeights.push(((Math.random() * (1 + 1) - 1).toFixed(20)));
				}
				
				// Push the new weights to the newWeights array
				newWeights.push(nodeWeights);
				
				
				
				// Push a new bias to the newBiases array.
				newBiases.push(0);
			}
			
			
			this.weights.push(newWeights); // Add the weights for that layer
			
			// Add a new bias to the biases array
			this.biases.push(newBiases);
			//this.biases.push(((Math.random() * (1 + 1) - 1).toFixed(20)));
		}
	}
	
	// Given an array of this.i (inputs) large, predict the output
	predict(inputs) {
		// Test if the array is large enough
		if (inputs.length == this.i) {
			let newOutputs = []; // Array of new outputs from the network
			let newInputs = []; // Array of new inputs to next layer
			
			// For every layer in the network
			for (let i = 0; i < this.l; i++) {
				newInputs = deepCopy(newOutputs);
				newOutputs = [];
				
				// For every node in the layer
				for (let j = 0; j < this.ls[i]; j++) {
					let nodeOutputs = []; // Output of this node
					
					// If the first layer is being worked with (i = 0)
					if (i == 0) {
						nodeOutputs = deepCopy(inputs);
						
						// Deep copy the inputs array to the nodeOutputs array
						//for (let z = 0; z < inputs.length; z++) {
						//	nodeOutputs[z] = inputs[z];
						//}
					}
					// If i is not 0, then the inputs is the newInputs
					else {
						// Deep copy the inputs to nodeOutputs
						nodeOutputs = deepCopy(newInputs);
						
						//for (let z = 0; z < newInputs[j].length; z++) {
						//	nodeOutputs[z] = newInputs[j][z];
						//}
					}
					
					// Multiply each input in the inputs array by it's corresponding weight
					for (let z = 0; z < nodeOutputs.length; z++) {
						nodeOutputs[z] *= this.weights[i][j][z];
					}
					
					// Find the sum of the new inputs
					nodeOutputs = add(nodeOutputs);
					
					// Pass nodeOutputs to the sigmoid function
					nodeOutputs = sigmoid(nodeOutputs);
					
					// Add the bias to the total (the b in y = mx + b)
					nodeOutputs += this.biases[i][j];
					
					// Add nodeOutputs to the newInputs
					newOutputs[j] = nodeOutputs;
				}
			}
			
			// When all the weights are calculated in newInputs, return them
			return newOutputs;
		}
		
		// If array isn't large enough, return -100
		console.log("Inputs not correct size");
		return -100;
	}
	
	// Returns the weights
	getWeights() {
		return this.weights;
	}
	
	// Returns the biases
	getBiases() {
		return this.biases;
	}
	
	// Sets the weights given a set of weights
	setWeights(w) {
		let newWeights = [];
		// For every layer
		for (let i = 0; i < w.length; i++) {
			let newi = [];
			// For evrery node
			for (let j = 0; j < w[i].length; j++) {
				let newj = [];
				// Fore very weight connected to the node
				for (let z = 0; z < w[i][j].length; z++) {
					newj.push(w[i][j][z]);
				}
				newi.push(newj);
			}
			newWeights.push(newi);
		}
		
		this.weights = newWeights;
	}
	
	// Sets the biases given a set of biases
	setBiases(b) {
		let newBiases = [];
		// For every layer
		for (let i = 0; i < b.length; i++) {
			let newi = [];
			// For every bias that corresponds to each node
			for (let j = 0; j < b[i].length; j++) {
				newi.push(b[i][j]);
			}
			newBiases.push(newi);
		}
		

		this.biases = newBiases;
	}
}