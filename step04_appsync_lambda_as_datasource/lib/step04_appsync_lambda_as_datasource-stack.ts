import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import *as appsync from "@aws-cdk/aws-appsync-alpha"
import * as lambda from "aws-cdk-lib/aws-lambda"
import { apexDomain } from 'aws-cdk-lib/aws-certificatemanager';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step04AppsyncLambdaAsDatasourceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const api = new appsync.GraphqlApi(this, "GRAPHQL_API", {
      name: 'cdk-appsync-api-new',
      schema: appsync.Schema.fromAsset('graphql/schema.gql'),       ///Path specified for lambda
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,     ///Defining Authorization Type
        },
      },
      // xrayEnabled: true                                             ///Enables xray debugging
    })
    //Lambda function 
    const myLambda = new lambda.Function(this,"MyLambdaFunction",{
      runtime:lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler:'welcome.handler'
    })
    //The code which connects graphQl and lambda
    const LambdaDataSource = api.addLambdaDataSource("FirstLambdaDataSource",myLambda)

    LambdaDataSource.createResolver(
      {
      typeName:"Query",
      fieldName:'welcome'
    }
    )
    LambdaDataSource.createResolver(
      {
      typeName:"Query",
      fieldName:'hello'
    }
    )
    LambdaDataSource.createResolver({
      typeName:"Mutation",
      fieldName:"addProduct"
    })
    const url = new CfnOutput(this,"GraphQlUrl",{
      value:api.graphqlUrl
    })
    const key = new CfnOutput(this,"GraphQlUrl_Key",{
      value:api.apiKey || ""
    })
  }
}
