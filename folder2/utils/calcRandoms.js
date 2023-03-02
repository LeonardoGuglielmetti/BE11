process.on('message', (param) => {
    let result = {};
    for (let i = 0; i < param; i++) {
        const randomNum = Math.round(Math.random() * 1000);
        if (!result[randomNum]) {
            result[randomNum] = 1
        } else {
            result[randomNum]++
        }
    }
    process.send(result);
});