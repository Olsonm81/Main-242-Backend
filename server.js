const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
const multer = require("multer");
const mongoose = require("mongoose");

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

mongoose
  .connect(
    "mongodb+srv://gxyOBnVDEERPgAAp:gxyOBnVDEERPgAAp@maincluster.1c5hm.mongodb.net/"
  )
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("couldn't connect to mongodb", error);
  });

const gallerySchema = new mongoose.Schema({
  state: String,
  city: String,
  fe: String,
  date: String,
  people: String,
  description: String,
  images: String,
});

const Gallery = mongoose.model("Gallery", gallerySchema);



/*const gallery = [
    {
        "_id": 1,
        "state": "Oregon",
        "city": "Durkee",
        "fe": "Fire",
        "date": "2023-07-09",
        "people": "Jason",
        "description": "Our team was task with going to Washington state to put out several fires in the local area. We were able to accomplish this mission and were successful in putting out the fire that was widespread. While there we were able to provide critical support and medical care to the local community. This was our first successful deployment that we went on. This deployment overall provided the baseline of knowledge for how to successful deploy and ensure that the fires are put out the fastest way possible. Also, during this fire we were able to connect and meet many great people who are in our feild.",
        
        "images": "https://main-242-backend.onrender.com/images/washington-fire-gallery.jpg",
    },
    
    {
        "_id": 2,
        "state": "Arizona",
        "city": "Limepoint",
        "fe": "Fire",
        "date":"2024-08-17",
        "people": "Junior",
        "description": "Assisted with the removal of trees that feel during the fire. Also, helped reduced the spread of the fire to other parts of the National Forest. This operation overall was consided a success especially after our hardworking members were able to stop the fire. This experience was an excellent opprotunity to our team to who gained a vast amount of knowledge from this deployment.",
        
        "images":"https://main-242-backend.onrender.com/images/arizona-fire.jpg",
    },
];*/


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


app.get("/api/gallery", async (req, res) => {
  const gallery = await Gallery.find();
  res.send(gallery);
  //res.json(gallery);
});

app.get("/api/gallery/:id", async (req, res) => {
  const gall = await Gallery.findOne({ _id: id });
  res.send(gall);
})

app.post("/api/gallery", upload.single("img"), async (req, res) => {
  const result = validateGallery(req.body);

  if(result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  const gal =  new Gallery ({
    state: req.body.state,
    city: req.body.city,
    fe: req.body.fe,
    date: req.body.date,
    people: req.body.people,
    description: req.body.description,
  });
  
  if(req.file) {
    gal.images = "https://main-242-backend.onrender.com/images/" + req.file.filename; 
  }

  const newGallery = await gal.save();
  res.send(newGallery);
});


app.put("/api/gallery/:id", upload.single("img"), async (req, res) => {

  const result = validateGallery(req.body);

  /*const gal = gallery.find((g) => g._id === parseInt(req.params.id));

  if(!gal) return res.status(404).send("Gallery with given id was not found");*/

  if(result.error) {
    res.status(400).send(result.error.details[0].message);
    return
  }
  let fieldsToUpdate = {
    state: req.body.state,
    city: req.body.city,
    fe: req.body.fe,
    date: req.body.date,
    people: req.body.people,
    description: req.body.description,
  }


  if(req.file) {
    fieldsToUpdate.images = "https://main-242-backend.onrender.com/images/" + req.file.filename;
  }

  const wentThrough = await Gallery.updateOne(
    { _id: req.params.id},
    fieldsToUpdate
  );

  const updatedGallery = await Gallery.findOne({ _id:req.params.id });
  res.send(updatedGallery);

});


app.delete("/api/gallery/:id", async (req, res) => {
  /*const gal = gallery.find((g) => g._id === parseInt(req.params.id));
  
  if (!gal) {
    res.status(404).send("The gallery with the given id was not found");
  }

  const index = gallery.indexOf(gal);
  gallery.splice(index, 1);
  res.send(gal);*/
  const gal = await Gallery.findByIdAndDelete(req.params.id);
  res.send(gal);
});


const validateGallery = (gal) => {
  const schema = Joi.object({
    _id: Joi.allow(""),
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