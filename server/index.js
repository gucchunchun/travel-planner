import express from "express";
import cors from "cors";
import generate from "./generate.js";
import bodyParser from "body-parser";


const app = express();

app.use(cors());
// middleware to read request objects
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('/Users/yuna/Documents/GitHub/travel-planner/client'));
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    // http://localhost:3000/にアクセスが来るとメインのindex.htmlを表示するように設定
    res.sendFile("/Users/yuna/Documents/GitHub/travel-planner/client/index.html");
})

app.post("/planner", async(req, res) => {
    const conditions = JSON.stringify(req.body);
    // console.log("server:"+conditions);
    try {
        // 送られてきたユーザーのインプットを旅行プランを作成する独自のAPIに送る
        const response = await generate(conditions);
        // APIからのレスポンスを送信する
        res.json({response: response});
    }catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

// ローカルサーバーを構築している