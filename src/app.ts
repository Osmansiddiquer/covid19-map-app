import express = require("express")
import path = require("path");
import schedule from 'node-schedule';
import fs from 'fs';

const job = schedule.scheduleJob('0 0 * * *', async ()=>{
    console.log("Fetched covid data just now");
    const response = await fetch(`https://api.api-ninjas.com/v1/covid19?date=${getDate()}`, {
        method: "GET",
        headers: {
            "Content-Type": 'application/json',
            "X-Api-Key": "X8HRzct6umDKWGH8Zx8qMQ==fHR77mfCOuJzCB5W"
        }
    })
    const data = await response.json();
    fs.writeFileSync(path.join(__dirname, '/resources/Covid-Data.json'), JSON.stringify(data));
});

const app = express();

app.use(express.static('dist/public'))

app.use((req, res, next)=>{
    console.log(req.url);
    next(); // tells to proceed on the route
})

app.get("/coordinates", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "/resources/Place-coordinates list.json"));
})

app.get("/covid-statistics", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "/resources/Covid-Data.json"));
})

app.use((req, res, next) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, "/public/404.html"))
        return;
    }
    // respond with json
    if (req.accepts('json')) {
        res.json({ error: 'Not found' });
        return;
    }
    // default to plain-text. send()
    res.type('txt').send('Not found');
})
app.listen(80, () => console.log(`Server is listening on port 80`))




function getDate() {
    const today = new Date(Number(new Date()) % (Number(new Date('2023-03-09')) - Number(new Date('2020-01-22'))) + Number(new Date('2020-01-22')));
    const yyyy = today.getFullYear();
    let mm: number | string = today.getMonth() + 1; // Months start at 0!
    let dd: number | string = today.getDate();

    if (dd < 10) dd = ('0' + String(dd));
    if (mm < 10) mm = ('0' + String(mm));

    return yyyy + '-' + mm + '-' + dd;
}