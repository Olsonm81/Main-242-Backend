const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
const multer = require("multer");

app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage});

const gallery = [
    {
        "state": "Oregon",
        "city": "Durkee",
        "fe": "Fire",
        "date": "2023-07-09",
        "people": "Jason",
        "description": "Our team was task with going to Washington state to put out several fires in the local area. We were able to accomplish this mission and were successful in putting out the fire that was widespread. While there we were able to provide critical support and medical care to the local community. This was our first successful deployment that we went on. This deployment overall provided the baseline of knowledge for how to successful deploy and ensure that the fires are put out the fastest way possible. Also, during this fire we were able to connect and meet many great people who are in our feild.",
        
        "images": [
            "images/washington-fire-gallery.jpg"
        ],
    },
    
    {
        "state": "Arizona",
        "city": "Limepoint",
        "fe": "Fire",
        "date":"2024-08-17",
        "people": "Junior",
        "description": "Assisted with the removal of trees that feel during the fire. Also, helped reduced the spread of the fire to other parts of the National Forest. This operation overall was consided a success especially after our hardworking members were able to stop the fire. This experience was an excellent opprotunity to our team to who gained a vast amount of knowledge from this deployment.",
        
        "images": [
            "/images/arizona-fire.jpg"
        ],
    },
];


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});



app.get("/api/gallery", (req, res) => {
  res.json(gallery);
});

app.post("/api/gallery", upload.single("img"), (req, res) => {
  const result = validateGallery(req.body);

  if(result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  const gal = {
    //_id: gallery.length + 1,
    state: req.body.state,
    city: req.body.city,
    fe: req.body.fe,
    date: req.body.date,
    people: req.body.people,
    description: req.body.description,
  };
  
  if(req.file) {
    gal.images = "/images/" + req.file.filename; 
  }

  gallery.push(gal);
  res.status(200).send(gal);
});

const validateGallery = (gal) => {
  const schema = Joi.object({
    //_id: Joi.allow(""),
    state: Joi.string().min(3).required(),
    city: Joi.string().min(3).required(),
    fe: Joi.string().min(3).required(),
    date: Joi.string().required(),
    people: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
  });
  return schema.validate(gal);
};

app.listen(3001, () => {
  console.log("Listening....");
});