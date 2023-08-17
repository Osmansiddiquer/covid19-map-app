"use strict";
// - Set up a server to fetch covid statistics and store them once per day to reduce the api calls. Then the server can handle all the reqests for covid statistics, essentially working as a REST API
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
;
let mapElement = document.getElementById('map');
let zoom = 3;
let map = L.map('map', {
    maxBounds: L.latLngBounds(L.latLng(90, -180), L.latLng(-90, 180)),
    maxBoundsViscosity: 0.9,
});
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);
L.control.scale().addTo(map);
map.options.minZoom = 3;
fetch('http://ip-api.com/json/?fields=lat,lon')
    .then(response => response.json())
    .then(data => {
    map = map.setView([data.lat, data.lon], zoom);
});
let covid_promise = updateData();
let coordinates_promise = fetch("/coordinates")
    .then(response => response.json());
Promise.all([covid_promise, coordinates_promise])
    .then(data => {
    let covidData = data[0];
    let coordinatesData = data[1];
    covidData.forEach(element => {
        let regionName = `${element.country} ${element.region}`;
        if (coordinatesData[regionName] !== undefined) {
            addMarker(regionName, element.cases, coordinatesData[regionName]);
        }
    });
});
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
function updateData() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("/covid-statistics");
        const data = yield response.json();
        return data; // works
        // return Promise.resolve(data) // same. works (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
    });
}
function addMarker(region, data, coordinates) {
    let marker = L.marker(coordinates).addTo(map);
    let popupHTML = `<strong>${region}</strong><br>Total Cases: ${data.total}<br>New Cases: ${data.new}<br>Date: ${getDate()}`;
    marker.bindPopup(popupHTML);
}
