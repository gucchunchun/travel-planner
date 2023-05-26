import express from "express";
import cors from "cors";
import generate from "./generate.js";


const app = express();

app.use(cors());
// middleware to read request objects
app.use(express.urlencoded({extended: true}));
app.use(express.static('/Users/yuna/Documents/GitHub/travel-planner/client'));
console.log(__dirname);

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.sendFile("/Users/yuna/Documents/GitHub/travel-planner/client/index.html");
  })

app.post("/planner", async(req, res) => {
    const conditions = req.body;
    console.log(conditions);
    try {
        const response = await generate(conditions);
        res.json({response: response});
    }catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

// http://localhost:3000/