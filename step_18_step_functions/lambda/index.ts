const { DynamoDB } = require("aws-sdk");
const dynamo = new DynamoDB();

exports.handler = async () => {
 

  var generateId = Date.now();//generating id 
  var idString = generateId.toString();//generating string

  const params = {
    TableName: process.env.Dynamotable,
    Item: {
      id: { S: idString },
      message: { S: "New Entry Added" },
    },
  };
  try {
    await dynamo.putItem(params).promise();
    return { operationSuccessful: true };
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return { operationSuccessful: false };
  }
};