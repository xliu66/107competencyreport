function saveItem(){
    // get the values
    var code = $("#txtCode").val();

    var desc = $("#txtDescription").val();
    var prc = $("#txtPrice").val();
    var imge = $("#txtImage").val();
    var categ = $("#txtCategory").val();
    var stk = $("#txtStock").val();
    var ded = $("#txtDeliveryDays").val();
    

    // HOMEWORK :
    // read the values from the rest of the input fields

    console.log(code);
    console.log(desc);
    console.log(prc);
    console.log(imge);
    console.log(categ);
    console.log(stk);
    console.log(ded);

}
var items = [];
//var serverURL = "http://restclass.azurewebsites.net/API/";
var serverURL = "http://localhost:8080/API/";
var categories = [];

function fetchCatalog(){
    // get items from server
    $.ajax({
        url: serverURL + "items",
        type: "GET",
        success: function(response){
            console.log("response", response);

            // solve, show only MY ITEMS
            // travel response array
            // if the item.user == "Xiaochen Liu"
            // then, push item into items array
            for (var i=0;i<response.length;i++){
                var item = response[i];
                if (item.user == "Xiaochen"){
                    items.push(item);
                }
            }

            displayCatalog();
        },
        error: function(errorDetails){
            console.log("Error: ", errorDetails)
        }
        
    });

}
function displayCatalog(){
    // travel the array
    for(var i=0; i< items.length;i++){
        // get the item
        var item = items[i];
        // draw the item on the DOM (html)
        drawItem(item);

        var cat = item.category;
        // if not catogories contains the cat
        if(!categories.includes(cat)){
            // then push cat into categories
            categories.push(cat);
        }
    }
   
    drawCategories();
}

function drawCategories(){
    // get the container for categories
    var container = $("#categories");

    // travel the categories array
    for (var i=0;i<categories.length;i++){
        // get each category
        var c = categories[i];
        // create an LI for category
        var li = `<li class="list-group-item"> <a href="#" onclick ="searchByCategory('${c}');" >${c}</a> </li>`;
        // add li to container
        container.append(li);
    }
    
}

function drawItem(item){

    // create the sintax
    var sntx = 
    `<div class='item'> 
        <img src='${item.image}'>

        <label class='code'>${item.code}</label>

        <label class='cat'>${item.category}</label>

        <label class='desc'>${item.description}</label>  

        <label class='price'>${(item.price*1).toFixed(2)}</label>

        <button class='btn btn-sm btn-info'> + </button>
    </div>`;

    // get the element from the screen
    var container = $("#catalog");

    // append th sintax to the element
    container.append(sntx);

}

function search(){
    var text = $("#txtSearch").val().toLowerCase(); // get the text
    
    // clear prev results
    $("#catalog").html("");

    // travel array and show only items that contains the text 
    for (var i=0; i<items.length;i++){
        var item = items[i];

        //if the secription contains the text,
        //or the catagory contains the text
        //or the code is equal to the text
        //or the price is euqal to the text
        //then show the item on the screen
        if (item.description.toLowerCase().includes(text)
            || item.category.toLowerCase().includes(text)
            || item.code.toLowerCase() == text
            || item.price == text
        ){
            drawItem(item);
        }
    }
}
function searchByCategory(catName){
    console.log("Search by cat",catName);

    // clear prev results
    $("#catalog").html("");

    // travel array and show only items that contains the text 
    for (var i=0; i<items.length;i++){
        var item = items[i];

        //if the secription contains the text,
        //or the catagory contains the text
        //or the code is equal to the text
        //or the price is euqal to the text
        //then show the item on the screen
        if (item.category.toLowerCase().includes(catName.toLowerCase())){
            drawItem(item);
        }
    }
    // clear 

    // travel the array

}

function init(){
    console.log("THis is catalog page!");


    // get data

    fetchCatalog();


    // hook events

    $("#btnSearch").click(search);
    $("#txtSearch").keypress(function(e){
        /* if(e.key=="Enter"){
            search();
        } */
        if(e.keyCode==13){
            search();
        }
    });

    $("#catalog").on("click",".item",function(){
        //$(this).toggleClass("selected");
        //get the image of the clicked element
        var img = $(this).find('img').clone();

        $(".modal-body").html(img);
        $("#modal").modal();
    })
    
    
}

// HTTP methods
// HTTP status codes


window.onload = init;
