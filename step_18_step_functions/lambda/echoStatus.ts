type event = {
    //to check if the previous function was true or false ,
  Payload:{
    operationSuccessful: Boolean;
  }
  };
  
  module.exports.handler = function (event: event) {
    console.log("EVENT >", event);
  
    if (event.Payload.operationSuccessful) {
      console.log("The data was added successfully");
    } else {
      console.log("The data was not added to the database");
    }
  };