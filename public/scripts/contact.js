var serverURL = "http://localhost:8080/api/";

function Message(firstName, lastName, email, message){
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.message = message;
    this.user = "Xiaochen";
    
}

function clearForm(){
    $("#txtFirstName").val("");
    $("#txtLastName").val("");
    $("#txtEmail").val("");
    $("#txtMessage").val("");
    
}

function saveMessage(){
    // get the values
    var firstName = $("#txtFirstName").val();
    var lastName = $("#txtLastName").val();
    var email = $("#txtEmail").val();
    var message = $("#txtMessage").val();

    // create an object
    var theMessage = new Message(firstName, lastName, email, message);


    console.log(theMessage);
    
    var jsontring = JSON.stringify(theMessage);
    console.log(jsontring);

    // send the object to the server
    $.ajax({
        url: serverURL + "messages",
        type: "POST",
        data: jsontring,
        contentType: "application/json",
        success: function(response){
            console.log("Yeii, it works",response);

            // data saved!
            clearForm();
            // show notification
            $("#alertSuccess").removeClass("hidden");
            // setTimeout(fn,miliseconds);
            setTimeout(function(){
                $("#alertSuccess").addClass("hidden");

            },3000);
        },
        error: function(errorDetails){
            console.log("Error: ",errorDetails);

        }
    });
}


function init(){

    console.log("This is Contact page!");
    // retrieve initial data

    // hook events
    $("#btnSend").click(saveMessage);

}


window.onload = init;