import { aws_stepfunctions_tasks, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs'; 
import * as ddb from 'aws-cdk-lib/aws-dynamodb'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as stepFunctions from 'aws-cdk-lib/aws-stepfunctions' 
import * as stepFunctionstask from 'aws-cdk-lib/aws-stepfunctions-tasks'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step18StepFunctionsStack extends Stack {
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

    const index = new lambda.Function(this, "addData", {
      runtime: lambda.Runtime.NODEJS_12_X, // execution environment
      code: lambda.Code.fromAsset("lambda"), // code loaded from "lambda" directory
      handler: "index.handler",
    });
    DynamoTable.grantFullAccess(index),
    index.addEnvironment("Dynamotable",DynamoTable.tableName)
    
    const echoStatus = new lambda.Function(this, "echoStatus", {
      runtime: lambda.Runtime.NODEJS_12_X, // execution environment
      code: lambda.Code.fromAsset("lambda"), // code loaded from "lambda" directory
      handler: "echoStatus.handler",
    });
    //========================================================
    //steps are created 
    //========================================================
    //creating a steps for step functions 
    const firstStep = new stepFunctionstask.LambdaInvoke(
      this,
      "Invoke addData lambda",
      {
        lambdaFunction:index
      }
    )

    const secondStep = new stepFunctionstask.LambdaInvoke(
      this,
      "Invoke echoStatus lambda",
      {
        lambdaFunction:echoStatus,
        // inputPath:"$.Payload",
      }
    )
    //========================================================
    //Create a chain to define the sequence of your steps 
    //========================================================

    const chain = stepFunctions.Chain.start(firstStep).next(secondStep)//basically telling which lambda runs first and second
    
    //========================================================
    //Refer your chain to the state machine
    //========================================================
    new stepFunctions.StateMachine(this,"simpleStateMachine",{
      definition:chain 
    })
  }
}
