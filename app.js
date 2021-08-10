const express = require("express");
const mongoose = require("mongoose");
const Note = require("./models/Note");
const VisitorsSchema = require('./models/Visitors.schema')
const path = require('path');
const parser = require('ua-parser-js');
const md = require('marked');

const app = express();

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/notes', 
{ useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,});
mongoose.connection.on('error',()=>console.error('Error in db connection'));
mongoose.connection.once('open',()=>console.log('db connected'));

//set the view engine
app.set('view engine', 'pug');
app.set('views', 'views');

// set express config
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));


// get localhost
app.get("/", async (req, res) => {
  const notes = await Note.find();
  res.render("index",{ notes: notes } ) 

  const path = req.originalUrl;
  const userAgent = parser(req.headers["user-agent"]);
   try {
    const existingCollection = await VisitorsSchema.findOne({path})
    if(!existingCollection){
      const analytics = new VisitorsSchema({path: path ,userAgent: userAgent})
      await analytics.save();
    }
    else{
      existingCollection.count += 1;
      await existingCollection.save();
    }
  } catch (error) {
    console.log(error)
  }
});

app.get("/notes/new", async (req, res) => {
  const notes = await Note.find();
  res.render("new", { notes: notes });
  const path = req.originalUrl;
  const userAgent = parser(req.headers["user-agent"]);
   try {
    const existingCollection = await VisitorsSchema.findOne({path})
    if(!existingCollection){
      const analytics = new VisitorsSchema({path: path ,userAgent: userAgent})
      await analytics.save();
    }
    else{
      existingCollection.count += 1;
      await existingCollection.save();
    }
  } catch (error) {
    console.log(error)
  }
});

app.post("/notes", async (req, res, next) => {
  const data = {
    title: req.body.title,
    body: req.body.body
  };

  const note = new Note(req.body);
  try {
    await note.save();
  } catch (e) {
    return next(e);
  }

  res.redirect('/');
});

app.get("/notes/:id", async (req, res) => {
  const notes = await Note.find();
  const note = await Note.findById(req.params.id);
  res.render("show", { notes: notes, currentNote: note, md: md });
  const path = req.originalUrl;
  const userAgent = parser(req.headers["user-agent"]);
   try {
    const existingCollection = await VisitorsSchema.findOne({path})
    if(!existingCollection){
      const analytics = new VisitorsSchema({path: path ,userAgent: userAgent})
      await analytics.save();
    }
    else{
      existingCollection.count += 1;
      await existingCollection.save();
    }
  } catch (error) {
    console.log(error)
  }
});

app.get("/notes/:id/edit", async (req, res, next) => {
  const notes = await Note.find();
  const note = await Note.findById(req.params.id);
  res.render("edit", { notes: notes, currentNote: note });
  const path = req.originalUrl;
  const userAgent = parser(req.headers["user-agent"]);
   try {
    const existingCollection = await VisitorsSchema.findOne({path})
    if(!existingCollection){
      const analytics = new VisitorsSchema({path: path ,userAgent: userAgent})
      await analytics.save();
    }
    else{
      existingCollection.count += 1;
      await existingCollection.save();
    }
  } catch (error) {
    console.log(error)
  }
});

app.get('/analytics',async(req,res)=>{
  const path = req.originalUrl;
  const userAgent = parser(req.headers["user-agent"]);
   try {
    const existingCollection = await VisitorsSchema.findOne({path})
    if(!existingCollection){
      const analytics = new VisitorsSchema({path: path ,userAgent: userAgent})
      await analytics.save();
    }
    else{
      existingCollection.count += 1;
      await existingCollection.save();
    }
  } catch (error) {
    console.log(error)
  }
  const pageViews = await VisitorsSchema.find().sort({count : 'descending'})
  res.render('analytics',{pageViews})

})

app.patch("/notes/:id", async (req, res) => {
  const id = req.params.id;
  const note = await Note.findById(id);

  note.title = req.body.title;
  note.body = req.body.body;

  try {
    await note.save();
  } catch (e) {
    return next(e);
  }

  res.status(204).send({});
});

app.delete("/notes/:id", async (req, res) => {
  await Note.deleteOne({ _id: req.params.id });
  res.status(204).send({});
  
});

app.listen(3000, () => console.log("Listening on port 3000 ..."));
