export function filterDBCol(data) {
    let obj = {};
    let dbCol: any = ["deleted", "createdBy", "createdOn", "modifiedBy", "modifiedOn", "completenessComment"];
    for (let elem of Reflect.ownKeys(data)) {
        if (!dbCol.includes(elem)) obj[elem] = data[elem];
    }
    return obj;
}

export function sortingData(data, prop, isAsc) {
    let haveData = data.filter(el => el[prop]);
    let emptyData = data.filter(el => !el[prop]);
    haveData = haveData.sort((a, b) => {
        return (a[prop] < b[prop] ? -1 : 1) * (isAsc ? 1 : -1)
    });
    return [...haveData, ...emptyData];
}

export function getfliterAry(data: any) {
    let filterAry: any = [];
    let notFilter = ["page", "size", "sortColumn", "sortOrder", "specStatus"];
    for (let elem of Object.keys(data)) {
        if (!notFilter.includes(elem)) {
            if (["internalStatus", "submitType"].includes(elem)) {
                filterAry.push(`(${data[elem]} == -1 || el['${elem}'] == ${data[elem]})`);
            } else {
                filterAry.push(`(!'${data[elem]}' || el['${elem}']?.toLowerCase().includes('${data[elem]?.toLowerCase()}'))`);
            }
        } else if (elem == "specStatus") {
            filterAry.push(`([${data[elem]}].includes(el['internalStatus']))`);
        }
    }
    return filterAry;
}

export function getPageable(data: any, result: any) {
    return {
        "last": Math.ceil(result.length / data.size) == data.size + 1,
        "size": data.size,
        "numberOfElements": result.length,
        "totalPages": Math.ceil(result.length / data.size),
        "pageable": {
            "paged": true,
            "pageNumber": data.page,
            "offset": result.length - (result.length - (data.page * data.size)),
            "pageSize": data.size,
            "unpaged": false,
            "sort": {
                "unsorted": false,
                "sorted": true,
                "empty": false
            }
        },
        "sort": {
            "unsorted": false,
            "sorted": true,
            "empty": false
        },
        "first": false,
        "totalElements": result.length,
        "empty": false
    };
}