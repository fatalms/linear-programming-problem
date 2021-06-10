const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

const filepath = path.join(__dirname, "/data/data.json");
const PORT = process.env.PORT || 8888;

app.route("/get-data")
    .get((req, res) => {
        fs.readFile(filepath, "utf8", (err, data) => {
            if (err) {
                return;
            }
            res.json(JSON.parse(data));
        });
    })
    .post((req, res) => {
        console.log(req.body);
        fs.readFile(filepath, "utf8", (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const obj = JSON.parse(data);

            obj.push(req.body);
            fs.writeFile(filepath, JSON.stringify(obj), (err, result) => {
                if (err) console.log("error", err);
            });
        });
    });

app.route("/delete-data").post((req, res) => {
    console.log('asdsadasdasdasdadsasdasdasdsadasd');
    console.log(req.body);
    fs.writeFile(filepath, JSON.stringify(req.body), (err, result) => {
        if (err) console.log("error", err);
    });
});

app.listen(PORT, () => {
    console.log(`server started at port ${PORT}...`);
});
