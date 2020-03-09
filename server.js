var express = require("express");
var app = express(); // create an app
var itemList = []; // store items on this array
var ItemDB;
var MessageDB;

/*********************************************
 * Configuration
 **********************************************/

// enable CORS 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Rquested-With, Content-Type, Accept");
    next();
});

// config body-parse to read info in request
var bparser = require("body-parser");
app.use(bparser.json());

// to server static files ( css, js, img, pdfs )
app.use(express.static(__dirname + '/public'))

// to serve HTML
var ejs = require('ejs');
app.set('views',__dirname + '/public'); // where are the HTML files?
app.engine('html',ejs.renderFile);
app.set('view engine',ejs);  

// MongoDB connection config
var mongoose = require('mongoose');
mongoose.connect("mongodb://ThiIsAPassword:TheRealPassword@cluster0-shard-00-00-euadh.mongodb.net:27017,cluster0-shard-00-01-euadh.mongodb.net:27017,cluster0-shard-00-02-euadh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin");

var db = mongoose.connection;

 /*********************************************
 * Web server endpoints
 **********************************************/


app.get('/',(req,res) => { 
    res.render('catalog.html');
});

app.get('/contact',(req,res) => {
    res.render('contact.html');
});

app.get('/aboutme',(req,res) => {
    res.render('about.html');
});

app.get('/exc/:message',(req,res) => {
    console.log("Message from client: ", req.params.message);
    
    var msj = req.params.message;
    var vowels = '';
    var allVowels = ['a','e','i','o','u'];
    
    

    // 1 travel the msj string and print on the console each letter
    for (var i=0;i<msj.length;i++){
        var letter = msj[i];
        console.log(letter);
    // 2 check if each letter is a vowel
        if (allVowels.indexOf(letter.toLowerCase()) != -1){
            //  if it is, add the vowel to vowels string

            // 3 return each vowel ONLY ONCE
            // hello -> eo
            // this is a test => iae

            // DECIDE
                /* if (vowels.indexOf(letter.toLowerCase())= -1) {
                    vowels += letter;
                } */
                
                var vow = letter;
                if (!vowels.includes(vow)){
                    vowels += vow;
                }
        }

    };



    res.status(202);
    res.send(vowels);
});


//HOMEWORK

app.get('/forexample',(req,res) => {
    res.send("<h1 style='color:blue;'> Here will be examples. <h1>");
});
app.get('/about',(req,res) => {
    res.send("<h1 style='color:blue;'> About what... <h1>");
});

/*********************************************
 * API END POINTS
 **********************************************/
app.post('/api/items',(req,res)=>{
    console.log("clients wants to store items");

    // var item = req.body;
    // item.id = itemList.length + 1; // create a consecutive id
    // itemList.push(item);
    // res.status(201); // 201=> created
    // res.json(item); // return the item as json

    var itemForMongo = ItemDB(req.body);
    itemForMongo.save(
        function(error, savedItem){
            if(error){
                console.log("**Error saving item",error);
                res.status(500); // internal server error
                res.send(error);
            }

            // no error:
            console.log("Item Saved!!!!");
            res.status(201); // created
            res.json(savedItem);
        
        }
    );
});

app.post('/api/messages',(req,res)=> {
    var messageForMongo = MessageDB(req.body);
    messageForMongo.save(
        function(error, savedMessage){
            if(error){
                console.log("**Error saving messages",error);
                res.status(500); // internal server error
                res.send(error);
            }
            console.log("Message Saved!!!!");
            res.status(201); // created
            res.json(savedMessage);
        }

    );
});

app.get('/api/messages',(req,res)=>{
    // res.json(itemList);
    MessageDB.find({}, function(error, data){
        if(error){
            res.status(500);
            res.send(error);
        }
        res.status(200); // OK
        res.json(data);
    });
});


app.get('/api/items',(req,res)=>{
    // res.json(itemList);
    ItemDB.find({}, function(error, data){
        if(error){
            res.status(500);
            res.send(error);
        }
        res.status(200); // OK
        res.json(data);
    });
});

app.get('/api/items/:id',(req,res) => {
    var id = req.params.id;

    // select code, description, price, as, asd, asd from itemsCh6
    ItemDB.find({_id: id},function(error, item){
        if(error){
            res.status(404); // NOT FOUND
            res.send(error);
        }
        res.status(200);
        res.json(item);
    });
});



app.get('/api/items/byName/:name',(req,res) => {
    var name = req.params.name;
    ItemDB.find({ user: name}, function(error,data){
        if(error){
            res.status(404);
            res.send(error);
        }

        res.status(200);
        res.json(data);

    });
});

app.delete('/api/items', (req,res) => {
   var item = req.body;
   ItemDB.findByIdAndRemove(item._id, function(error){
        if(error){
            res.status(500);
            res.send(error);
        }
        res.status(200);
        res.send("Item removed!");
   }); 
});


/*********************************************
 * START Server
 **********************************************/

db.on('open',function(){
    console.log("Yeei!! DB connection succeed");
    /**
     * Data types allowed for schemas:
     * String, Number, Data, Buffer, Boolean, ObjectID, Array
     */

    // Define structure (models) for the objects on each collection
    var itemsSchema = mongoose.Schema({
        code: String,
        description: String,
        price: Number,
        image: String,
        category: String,
        stock: Number,
        deliveryDays: Number,
        user: String
    });

    // schema for messages
    var messageSchema = mongoose.Schema({
        firstName: String,
        lastName: String,
        message: String
    });
    // schema3

    // create constructor (mongoose model)
    ItemDB = mongoose.model("itemsCh6",itemsSchema);
    
    // create model2
    MessageDB = mongoose.model("messageCh6",messageSchema);
    // create model3

});
db.on('error', function(error){
    console.log("Error connection to DB");
    console.log(error);
});

app.listen(8080,function(){
    console.log("Server running at http://localhost:8080");
    console.log("Press Ctrl+C to kill it");
});