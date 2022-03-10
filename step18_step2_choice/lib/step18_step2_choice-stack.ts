import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs'; 
import * as ddb from 'aws-cdk-lib/aws-dynamodb'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as stepFunctionstask from 'aws-cdk-lib/aws-stepfunctions-tasks'
import * as stepFunctions from 'aws-cdk-lib/aws-stepfunctions'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step18Step2ChoiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
     // created a dynamodb Table

     const DynamoTable = new ddb.Table(this, "DynamoTable", {
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });

    // this function adds data to the dynamoDB table

    const addData = new lambda.Function(this, "addData", {
      runtime: lambda.Runtime.NODEJS_12_X, // execution environment
      code: lambda.Code.fromAsset("lambda"), // code loaded from "lambda" directory
      handler: "addData.handler",
    });
    DynamoTable.grantFullAccess(addData),
    addData.addEnvironment("Dynamotable",DynamoTable.tableName)
    
   
    //========================================================
    //1)steps are created 
    //========================================================
    //creating step for lambda function addData 
    const firstStep = new stepFunctionstask.LambdaInvoke(
      this,
      "Invoke addData lambda",
      {
        lambdaFunction:addData
      }
    )
     // Reaching a Succeed state terminates the state machine execution with a succesful status.

     const success = new stepFunctions.Succeed(this, "We did it!");

     // Reaching a Fail state terminates the state machine execution with a failure status.
 
     const jobFailed = new stepFunctions.Fail(this, "Job Failed", {
       cause: "Lambda Job Failed",
       error: "could not add data to the dynamoDb",
     });
 
     // Here we are putting a condition to choose our next state. If the last state (lambdafn) returns {operationSuccessful: true}
     // then we end our state machine with a success state otherwise with a fail state
 
     const choice = new stepFunctions.Choice(this, "operation successful?");
     choice.when(
       stepFunctions.Condition.booleanEquals(
         "$.Payload.operationSuccessful",
         true
       ),
       success
     );
     choice.when(
       stepFunctions.Condition.booleanEquals(
         "$.Payload.operationSuccessful",
         false
       ),
       jobFailed
     );
 
     // creating chain to define the sequence of execution
 
     const chain = stepFunctions.Chain.start(firstStep).next(choice)//basically telling which lambda runs first and second
    
     //========================================================
     //Refer your chain to the state machine
     //========================================================
     new stepFunctions.StateMachine(this,"simpleStateMachine",{
       definition:chain 
     })
  }
}
