const express =require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileupload = require('express-fileupload');
const path = require('path');
const Handlebars = require("handlebars");
const MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(Handlebars);


const app = express();

//Mongoose
mongoose.connect('mongodb://localhost:27017/blog', {useNewUrlParser: true});

//static 
app.use(express.static('public'));


//bodyParser

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(fileupload());

//engine handlebars

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');


//Routes

app.get('/', (req,res)=>{
    res.render('home')
});

app.get('/blog',async (req,res)=>{
const posts = await Post.find({})
    res.render('blog', {posts})
});

app.get('/articles/add',(req,res)=>{
    res.render('articles/add')
});

//Articles

const Post = require('./database/models/Article');
//post des articles

app.post('/poste',(req,res)=>{
    const {image} = req.files
    const uploadFile = path.resolve(__dirname, 'public/imagesArticles', image.name);

    image.mv(uploadFile, (err, post)=>{

        Post.create({

            ...req.body,
            image: `/imagesArticles/${image.name}`
        },
        
        (err, post)=>{
            res.redirect('/blog')

    })

      console.log(req.files);
  });
    
})

app.listen(2500, (req,res)=> console.log('le port tourne sur leport 2500'));
