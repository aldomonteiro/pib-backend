export const configSortQuery = sortString => {
    var sortObj = {};
    if (typeof (sortString) != "undefined") {
        var arr = JSON.parse(sortString);
        sortObj[arr[0]] = arr[1];
    }
    return sortObj;
}

// react-admin sends a range [0,9] and I am transforming
// it in offset: 0, limit: 10
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
