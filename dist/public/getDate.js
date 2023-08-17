"use strict";
function getDate() {
    const today = new Date(Number(new Date()) % (Number(new Date('2023-03-09')) - Number(new Date('2020-01-22'))) + Number(new Date('2020-01-22')));
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    if (dd < 10)
        dd = ('0' + String(dd));
    if (mm < 10)
        mm = ('0' + String(mm));
    return yyyy + '-' + mm + '-' + dd;
}
