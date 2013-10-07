function getRandomIntegerInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
}

// DOUBLECHECK
/**
 * obj example: { a: 0.5, b: 0.3, c = 0.2 }
 * sum of object values should be equal to 1
 */
function getRandomElementByProbability(obj) {
    var number = Math.random(),
        total = 0,
        i;

    for (var i in obj) if (obj.hasOwnProperty(i)) {
        total += obj[i];

        if (total > number) return i;
    }
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}