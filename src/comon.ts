export function filterDBCol(data) {
    let obj = {};
    let dbCol: any = ["deleted", "createdBy", "createdOn", "modifiedBy", "modifiedOn", "completenessComment"];
    for (let elem of Reflect.ownKeys(data)) {
        if (!dbCol.includes(elem)) obj[elem] = data[elem];
    }
    return obj;
}

export function sortingData(data, name, isAsc) {
    return data.sort(function (a, b) {
        return isAsc ? (a[name] - b[name]) : (b[name] - a[name]);
    });
}

