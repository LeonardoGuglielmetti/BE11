import express from 'express';
import { fork } from 'child_process';

const app = express();

let contador = 0;

app.get('/', (req, res) => {
    res.send(`You visited this page ${++contador} times`);
});

app.get('/randoms', (req, res) => {
    // console.log(req.query);
    let numbersToGenerate = req.query.cant ? req.query.cant : 100000000;
    const childProcess = fork('./utils/calcRandoms.js');
    childProcess.send(numbersToGenerate);
    childProcess.on('message', value => {
        res.json(value);
    });
});

app.listen(8080, () => console.log('http://localhost:8080'));