let express = require('express');
let app = express();
let port = 9090;
let mongo =require('mongodb');
let MongoClient = mongo.MongoClient;
let mongoUrl = "mongodb+srv://test:XKuhQ4x3x1CvkUag@cluster0.mwoz2jr.mongodb.net/?retryWrites=true&w=majority";
let db;
let cors = require('cors');
app.use(cors());

const fs = require("fs");

// app.get('/video', function(req, res){
//     res.sendFile(__dirname+ "/index.html");
// })

const videoFileMap = {
    'Fast X':'./videos/FAST X.mp4',
    'pathan':'./videos/pathan.mp4',
    'dasvi':'./videos/dasvi.mp4',
    'Bholaa':'./videos/Bholaa.mp4',
    'cocktail':'./videos/cocktail.mp4',
    'luka chuppi':'./videos/luka chuppi.mp4',
    'tanu weds manu returns':'./videos/tanu weds manu returns.mp4',
    'drishyam':'./videos/drishyam.mp4',
    'stree':'./videos/stree.mp4',
    'curse of the nun':'./videos/curse of the nun.mp4',
    'bajirao mastani':'./videos/bajirao mastani.mp4',
    'housefull 3':'./videos/housefull 3.mp4',
    'love aaj kal':'./videos/love aaj kal.mp4',
    '2.0':'./videos/2.0.mp4',
    'RRR':'./videos/RRR.mp4',
    'Agent':'./videos/Agent.mp4',
    'Tu Jhoothi Main Makkaar':'./videos/Tu Jhoothi Main Makkaar.mp4',
    'Kisi Ka Bhai Kisi Ki Jaan':'./videos/Kisi Ka Bhai Kisi Ki Jaan.mp4',
    'Jawan':'./videos/Jawan.mp4',
}

app.get('/video1/:filename', function(req, res){
    const range = req.headers.range;
    if(!range){
        res.status(400).send("Requires Range header");
    }
    const filename = req.params.filename;
    const videoPath = videoFileMap[filename];
    const videoSize = fs.statSync(videoPath).size;
    // console.log("size of video is:", videoSize);
    const CHUNK_SIZE = 10**6; //1 MB
    const start = Number(range.replace(/\D/g, "")); 
    const end = Math.min(start + CHUNK_SIZE , videoSize-1);
    const contentLength = end-start+1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": 'bytes',
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }
    res.writeHead(206,headers);
    const videoStream = fs.createReadStream(videoPath,{start,end});
    videoStream.pipe(res);

})

app.get('/api/pricing',(req,res) => {
    db.collection('coinPrizingData').find().toArray((err,data) => {
        if(err) throw err;
        res.send(data)
    })
})

//list of movies
app.get('/movies',(req,res) => {
    db.collection('Movies').find().toArray((err,data) => {
        if(err) throw err;
        res.send(data)
    })
})

// details of a movie wrt movie id
app.get('/movies/:id',(req,res) => {
    let id = Number(req.params.id);
    db.collection('Movies').find({"id":id}).toArray((err,data) => {
        if(err) throw err;
        res.send(data)
    })
})

// details of a movie wrt movie_typeid
app.get('/moviesCategory/:movie_typeid',(req,res) => {
    let movie_typeid = Number(req.params.movie_typeid);
    db.collection('Movies').find({"movie_typeid":movie_typeid}).toArray((err,data) => {
        if(err) throw err;
        res.send(data)
    })
})

// connection with db
MongoClient.connect(mongoUrl,(err,client) => {
    if(err) console.log('Error while connecting');
    db = client.db("Netflix-clone");
    app.listen(port,(err) => {
        if(err) throw err;
        console.log(`Server is Running on port ${port}`);
    })
})