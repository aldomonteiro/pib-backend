export const configSortQuery = sortString => {
    var sortObj = {};
    if (typeof (sortString) != "undefined") {
        var arr = JSON.parse(sortString);
        sortObj[arr[0]] = arr[1];
    }
    return sortObj;
}

/**
 * This function is deprecated and is used with the mongoose paginate plugin.
 * Insted of this function, use configRangeQueryNew
 * react-admin sends a range [0,9] and I am transforming it in offset: 0, limit: 10
 * @param {*} rangeString 
 */
export const configRangeQuery = rangeString => {
    var rangeObj = {};
    if (typeof (rangeString) != "undefined") {
        var arr = JSON.parse(rangeString);
        rangeObj = {
            offset: arr[0],
            limit: arr[1] + 1
        }
    }
    return rangeObj;
}

/**
 * Using without the paginate plugin.
 * @param {*} rangeString 
 */
export const configRangeQueryNew = rangeString => {
    if (typeof (rangeString) !== "undefined") {
        let json = JSON.parse(rangeString);
        return {
            offset: json[0],
            limit: (json[1] + 1) - json[0]
        };
    } else
        return null;
}

export const configFilterQuery = filterString => {
    if (typeof filterString !== "undefined") {
        const json = JSON.parse(filterString);
        const _field = Object.keys(json)[0];
        const _values = Object.values(json)[0];

        return { filterField: _field, filterValues: _values };
    } else return null;
}

export const configFilterQueryMultiple = filterString => {
    if (typeof filterString !== "undefined") {
        const json = JSON.parse(filterString);
        return { filterField: Object.keys(json), filterValues: Object.values(json) };
    } else return null;
}


export const choices_sizes = async () => {
    return new Object([
        { id: 'mini', name: 'Mini', order: 1 },
        { id: 'pequena', name: 'Pequena', order: 2 },
        { id: 'media', name: 'Média', order: 3 },
        { id: 'grande', name: 'Grande', order: 4 },
        { id: 'gigante', name: 'Gigante', order: 5 }
    ]);
}

export const choices_kinds = () => {
    return [
        { id: 'tradicional', name: 'Tradicional' },
        { id: 'especial', name: 'Especial' },
        { id: 'doce', name: 'Doce' },
    ];
}


/**
 * Shuffle (randomize) the elements of array
 * @param {*} array 
 */
export const shuffle = array => {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

