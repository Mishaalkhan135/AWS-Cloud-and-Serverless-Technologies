import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from 'aws-cdk-lib/aws-apigateway'
 // import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step02LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

   const hello = new lambda.Function(this, "hello-mishaal-handler", {
      runtime: lambda.Runtime.NODEJS_12_X, // Specifying which type of function we have deployed
      code: lambda.Code.fromAsset("lambda"), // 'lambda' is the folder containing all lambda function
      handler: "myNewLambda.handler", // 'hello' is the file name and 'handler' is the function name
      functionName:"lambda-example"
    });
    const api = new apigw.LambdaRestApi(this, 'my-api-1', {
      restApiName: "my-first-api",
      handler: hello,
      proxy: false
    });
     const items = api.root.addResource('cars');
     const items_2 = api.root.addResource('bikes');
    items.addMethod('GET');// GET cars
    items_2.addMethod('GET');  

    new CfnOutput(this, 'api-url-output', {
      value: api.url
    })

  }
}
