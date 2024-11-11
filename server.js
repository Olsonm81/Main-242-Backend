const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.static("public"));

const gallery = [
    {
        "state": "Oregon",
        "city": "Durkee",
        "f-or-e": "Fire",
        "date": "July 9th 2023",
        "people": ["Jason"],
        "description": "Our team was task with going to Washington state to put out several fires in the local area. We were able to accomplish this mission and were successful in putting out the fire that was widespread. While there we were able to provide critical support and medical care to the local community. This was our first successful deployment that we went on. This deployment overall provided the baseline of knowledge for how to successful deploy and ensure that the fires are put out the fastest way possible. Also, durign this fire we were able to connect and meet many great people who are in our feild.",
        
        "images": [
            "washington-fire-gallery.jpg"
        ],
    },
    
    {
        "state": "Arizona",
        "city": "Limepoint",
        "f-or-e": "Fire",
        "date":"August 15th 2024",
        "people": ["Junior", "Adam"],
        "description": "Assisted with the removal of trees that feel during the fire. Also, helped reduced the spread of the fire to other parts of the National Forest. This operation overall was consided a success especially after our hardworking members were able to stop the fire. This experience was an excellent opprotunity to our team to who gained a vast amount of knowledge from this deployment.",
        
        "images": [
            "arizona-fire.jpg"
        ],
    },
];


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/gallery", (req, res) => {
  res.json(gallery);
});

app.listen(3001, () => {
  console.log("Listening....");
});