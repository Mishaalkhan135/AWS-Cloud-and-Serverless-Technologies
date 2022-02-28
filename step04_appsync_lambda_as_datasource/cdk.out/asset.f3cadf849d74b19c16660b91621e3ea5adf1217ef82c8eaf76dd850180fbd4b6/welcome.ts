
type AppSyncEvent= {
    info:{
        fieldName:String
    }
    arguments:{
        product:Product
    }
}
type Product ={
    name:String
    price:Number
}

exports.handler = async (event:AppSyncEvent) => {
    if(event.info.fieldName === "welcome"){
        return "Welcome from appsync lambda"
    }
    else if(event.info.fieldName === "hello")
    {
        return "Hello from appsync lambda"
    }
    else if(event.info.fieldName === "addProduct"){
        console.log("Event data here",event.arguments.product);
        return "Product Data " + event.arguments.product.name
    }
    else{
        return "Not Found"
    }
}