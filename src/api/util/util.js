
export const configSortQuery = sortString => {
    var sortObj = {};
    if (typeof (sortString) != 'undefined') {
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
    if (typeof rangeString !== 'undefined') {
        var arr = JSON.parse(rangeString);
        return {
            offset: arr[0],
            limit: arr[1] + 1
        }
    } else return null;
}

/**
 * Using without the paginate plugin.
 * @param {*} rangeString 
 */
export const configRangeQueryNew = rangeString => {
    if (typeof (rangeString) !== 'undefined') {
        let json = JSON.parse(rangeString);
        return {
            offset: json[0],
            limit: (json[1] + 1) - json[0]
        };
    } else
        return null;
}

export const configFilterQuery = filterString => {
    if (typeof filterString !== 'undefined') {
        const json = JSON.parse(filterString);
        const _field = Object.keys(json)[0];
        const _values = Object.values(json)[0];

        return { filterField: _field, filterValues: _values };
    } else return null;
}

export const configFilterQueryMultiple = filterString => {
    if (typeof filterString !== 'undefined') {
        const json = JSON.parse(filterString);
        return { filterField: Object.keys(json), filterValues: Object.values(json) };
    } else return null;
}


export const choices_sizes = async () => {
    return [
        { id: 'mini', name: 'Mini', order: 1 },
        { id: 'pequena', name: 'Pequena', order: 2 },
        { id: 'media', name: 'Média', order: 3 },
        { id: 'grande', name: 'Grande', order: 4 },
        { id: 'gigante', name: 'Gigante', order: 5 }
    ];
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

const degreesToRadians = degrees => degrees * Math.PI / 180;

export const distanceBetweenCoordinates = (lat1, lon1, lat2, lon2) => {
    if (lat1 && lon1 && lat2 && lon2) {
        var earthRadiusKm = 6371;

        var dLat = degreesToRadians(lat2 - lat1);
        var dLon = degreesToRadians(lon2 - lon1);

        lat1 = degreesToRadians(lat1);
        lat2 = degreesToRadians(lat2);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadiusKm * c;
    }
    else return null;
}

/**
 * Whatsapp send the id this way: "554184163676@c.us",
 * I am removing the last part, after @.
 * @param {*} id
 */
export const formatWhatsappNumber = id => {
    const index = id.indexOf('@');
    if (index > 0)
        return id.substr(0, index);
    else
        return id;
}

/**
 * Format as a currency
 * @param {*} amount
 */
export const formatAsCurrency = amount =>
    amount.toLocaleString('pt-BR',
        {
            style: 'currency',
            currency: 'BRL',
            minimumSignificantDigits: 2,
            maximumSignificantDigits: 2,
        });
