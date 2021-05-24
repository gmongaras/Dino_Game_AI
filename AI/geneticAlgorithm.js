// Retuns a copy a dino's neural network
function copy(b) {
	const modelCopy = createBrain();
	const weights = b.getWeights();
	const biases = b.getBiases();
	modelCopy.setWeights(weights);
	modelCopy.setBiases(biases);
	return modelCopy;
}



function randomGaussian() {
    var rand = 0;

    for (var i = 0; i < 6; i += 1) {
		rand += Math.random();
    }
	
	
    return rand / 6;
}


// Mutates a neural network's weights given a dino
function mutateWeights(b) {
	const weights = b.getWeights();
	//const mutatedWeights = [];
	
	const rate = 0.13;
	const changeAmount = 1; // The range which the weights can be changed
	
	let newWeights = [];
	// For every layer
	for (let i = 0; i < weights.length; i++) {
		let newi = [];
		// For every node in the layer
		for (let j = 0; j < weights[i].length; j++) {
			let newj = [];
			// For every weight coming into the node
			for (let z = 0; z < weights[i][j].length; z++) {
				let newz = parseFloat(weights[i][j][z]);
				
				// With a probability of rate, change the weight slightly
				if (Math.random(1) < rate) {
					newz += parseFloat((Math.random() * changeAmount) * (Math.round(Math.random()) ? 1 : -1)); //newz + randomGaussian();
				}
				newj.push(newz);
			}
			newi.push(newj);
		}
		newWeights.push(newi);
	}
	
	return newWeights;
}

// Mutates a neural network's biases given a dino
function mutateBiases(b) {
	const biases = b.getBiases();
	newBiases = []; // Holds the new biases
	
	const rate = 0.01; // The rate at which the biases are changed
	const changeAmount = 0.5 // The range which the biases can be changed
	
	// For every layer
	for (let i = 0; i < biases.length; i++) {
		let newi = []; // New biases for this layer
		
		// For every bias that corresponds to each node in the layer.
		for (let j = 0; j < biases[i].length; j++) {
			newi.push(biases[i][j]); // Push teh bias to the new biases for this layer
			
			// With a probability of rate, change the bias slightly and add it to the weight
			if (Math.random(1) < rate) {
				// The 0.5 means between -0.5 and 0.5
				newi[j] += (Math.random() * changeAmount ) * (Math.round(Math.random()) ? 1 : -1)
				
				
				//newi[i] = biases[i][j] + parseFloat((Math.random() * (1 + 1) - 1).toFixed(20)); //newz + randomGaussian();
			}
		}
		
		newBiases.push(newi); // Add the layer biases to the new biases array
	}
	
	return newBiases;
}


function nextGeneration() {
	// Calculate the fitness for each dino and normalize the fitness values
	// between 0 and 1 and add up to 1.
	console.log('next generation');
	calculateFitness();
	
	// Create a new population of dinos -------------------
	
	
	// Get the dino with the highest fitness
	let bestFitness = 0;
	let bestBrain;
	
	for (let i = 0; i < POPULATION; i++) {
		if (dinos[i].fitness > bestFitness) {
			bestFitness = dinos[i].fitness;
			bestBrain = dinos[i].brain;
		}
	}
	
	// Copy the dino with the highest fitness to the array without mutating it
	dinos[0].brain = copy(bestBrain);
	
	// Copy and mutate the rest of the dinos
	for (let i = 1; i < POPULATION; i++) {
		// Pick a dino based on the probabiloty mapped to it's fitness
		dinos[i].brain = pickOne();
	}
}


// Pick a dino based on it's fitness. Those with a higher fitness are more liekly
// to pass on their genes to the next population
function pickOne() {
	// Put each dino's fitness in the array and sum up all the weights
	dinoFitness = [];
	sum = 0;
	for (let w = 0; w < POPULATION; w++) {
		if (w == 0) {
			dinoFitness.push(dinos[w].fitness * 100);
			sum += dinos[w].fitness * 100;
		}
		else {
			dinoFitness.push(dinos[w].fitness);
			sum += dinos[w].fitness;
		}
	}
	// Get the threshold
	const threshold = Math.random() * sum;
	
	// Now we just need to loop through the main data one more time
	// until we discover which value would live within this
	// particular threshold. We need to keep a running count of
	// weights as we go, so let's just reuse the "total" variable
	// since it was already declared.
	let total = 0;
	for (let w = 0; w < POPULATION; ++w) {
		// Add the weight to our running total.
		total += dinoFitness[w];

		// If this value falls within the threshold, we're done!
		if (total >= threshold) {
			let bestDino = dinoFitness[w];
			break;
		}
	}
	
	
	
	/*
	let bestDino;
	let bestScore = 0;
	for (let w = 0; w < POPULATION; w++) {
		if (dinos[w].fitness > bestScore) {
			bestDino = dinos[w];
			bestScore = dinos[w].fitness;
		}
	}
	*/
	
	/*
	var index = 0;
	var r = Math.random(1);
	
	// Pcik a dino based on it's fitness value
	while(r > 0) {
		r = r - dinos[index].fitness;
		index++;
	}
	index--;
	*/
	
	
	// Copy, mutate, and return the brain of the chosen dino
	let newBrain = copy(bestDino.brain);
	newBrain.setWeights(mutateWeights(newBrain));
	newBrain.setBiases(mutateBiases(newBrain));
	return newBrain;
}


// Calculate the fitness for each dino and normalize the fitness values
function calculateFitness() {
	// Get the highest distance ran
	let bestDistanceRan = 0;
	let bestDino;
	
	for (let i = 0; i < POPULATION; i++) {
		if (dinos[i].distanceRan > bestDistanceRan) {
			bestDistanceRan = dinos[i].distanceRan;
			bestDino = dinos[i];
		}
	}
	
	// Multiply the furthest distance by rate so that it has a higher chance of being chosen
	const rate = 1;
	bestDino.distanceRan *= rate;
	
	
	// Get the sum of all dino scores
	let s = 0;
	for (let d of dinos) {
		s += d.distanceRan;
	}
	
	
	
	// Create the fitness for each dino between 0 and 1
	for (let d of dinos) {
		d.fitness = d.distanceRan / s;
	}
}