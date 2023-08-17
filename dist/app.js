"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const node_schedule_1 = __importDefault(require("node-schedule"));
const fs_1 = __importDefault(require("fs"));
const job = node_schedule_1.default.scheduleJob('0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Fetched covid data just now");
    const response = yield fetch(`https://api.api-ninjas.com/v1/covid19?date=${getDate()}`, {
        method: "GET",
        headers: {
            "Content-Type": 'application/json',
            "X-Api-Key": "X8HRzct6umDKWGH8Zx8qMQ==fHR77mfCOuJzCB5W"
        }
    });
    const data = yield response.json();
    fs_1.default.writeFileSync(path.join(__dirname, '/resources/Covid-Data.json'), JSON.stringify(data));
}));
const app = express();
app.use(express.static('dist/public'));
app.use((req, res, next) => {
    console.log(req.url);
    next(); // tells to proceed on the route
});
app.get("/", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "/public/index.html"));
});
app.get("/coordinates", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "/resources/Place-coordinates list.json"));
});
app.get("/covid-statistics", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "/resources/Covid-Data.json"));
});
app.use((req, res, next) => {
    console.log(req.url);
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, "/public/404.html"));
        return;
    }
    // respond with json
    if (req.accepts('json')) {
        res.json({ error: 'Not found' });
        return;
    }
    // default to plain-text. send()
    res.type('txt').send('Not found');
});
app.listen(80, () => console.log(`Server is listening on port 80`));
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
