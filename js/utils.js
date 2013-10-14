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

function ucfirst(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1)
}

function unique(arr) {
    var newArray = [],
        i;

    for(i = 0; i < arr.length; i += 1) {
        if (newArray.indexOf(arr[i]) === -1) {
            newArray.push(arr[i]);  
        }
    }

    return newArray;
}

function timestampTostring(ts) {
    var months = 'января февраля марта апреля мая июня июля августа сентября октября ноября декабря'.split(' ');
    var d = new Date(ts);

    return d.getDay() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear()
        + ' в ' + d.getHours() + ':' + ('0' + d.getMinutes()).slice(-2); 
}