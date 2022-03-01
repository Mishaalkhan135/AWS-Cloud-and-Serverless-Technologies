import {DynamoDB} from 'aws-sdk'
// For Callling DynamoDb
const documentClient = new DynamoDB.DocumentClient()

type AppSyncEvent = {
    info:{
        fieldName:String
    },arguments:{
        product:Product
    }
}

type Product = {
    id:String,
    name:String,
    price:Number
}

exports.handler = async (event : AppSyncEvent)=>{
    if(event.info.fieldName === "welcome"){
        return "Hello world"
    }
    else if(event.info.fieldName === "addProduct"){
        event.arguments.product.id = "Key-"+Math.random()
        const params ={
            TableName:process.env.TABLE_NAME || "",
            Item:event.arguments.product
        }

        //Put the values in table 
        
        const data = await documentClient.put(params).promise()
        return event.arguments.product
    }
    else{
        return "Not Found"
    }
}