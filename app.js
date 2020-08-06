const express = require('express');
const parser = require('./parser');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.text({ extended: true }));
const port = 3000;

app.post('/', (req, res) => {
    console.log(req.body);
    let script = parser.parse(req.body);

    res.json( { 
        result:{ code: "OK", message:""},
        data: script
    } );
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));