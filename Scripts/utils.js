/**
 * Return a random integer between `min` and `max` (inclusive)
 * @param min {number}
 * @param max {number}
 * @returns {number}
 */
function randInt(min, max) {
	const lowerBound = Math.round(Math.min(min, max));
	const range = Math.round(Math.max(min, max)) - lowerBound + 1;

	return Math.floor(Math.random() * range) + lowerBound;
}

exports.randInt = randInt;

/**
 * Shuffle the given array in-place.
 * @template T
 * @param array {T[]}
 * @returns {void}
 */
function shuffleArray(array) {
	for (let i = 0; i < array.length - 1; i++) {
		const j = randInt(i, array.length - 1);
		[array[i], array[j]] = [array[j], array[i]];
	}
}

exports.shuffleArray = shuffleArray;
