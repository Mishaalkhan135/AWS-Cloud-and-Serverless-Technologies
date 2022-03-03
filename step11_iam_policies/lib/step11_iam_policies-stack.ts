import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as appsync from "@aws-cdk/aws-appsync-alpha"
import * as ddb from "aws-cdk-lib/aws-dynamodb"
import * as iam from "aws-cdk-lib/aws-iam"
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step11IamPoliciesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, 'graphql_new', {
      name: 'api_new',
      schema: appsync.Schema.fromAsset('schema/schema.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
      xrayEnabled: true,
    });

   ///Defining a DynamoDB Table
   const dynamoDBTable = new ddb.Table(this, 'Table', {
     tableName:"PoliciesTable",
    partitionKey: {
      name: 'id',
      type: ddb.AttributeType.STRING,
    },
  });

   ///create a specific role for Lambda function
   const role = new iam.Role(this, 'MyLambdaRole', {
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  });

  ///Attaching DynamoDb access to policy
  const policy = new iam.PolicyStatement({
    effect:iam.Effect.ALLOW,
    actions: ['dynamodb:PutItem', 'dynamodb:GetItem'],
    //cant access any other data
    resources: [dynamoDBTable.tableArn]
  });
  const policy1 = new iam.PolicyStatement({
    effect:iam.Effect.DENY,
    actions: ['logs:*',],
    resources: ['*']
  });

  //granting IAM permissions to role
  role.addToPolicy(policy);
  role.addToPolicy(policy1);

       // The code that defines your stack goes here
       const hello = new lambda.Function(this, "MyNewLambdaHandler", {
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromAsset("lambda"),
        handler: "index.handler",
        //the Acessability to role 
        role:role
      });
      dynamoDBTable.grantFullAccess(hello) 
      const lambda_data_source = api.addLambdaDataSource("lambda_data_source",hello)
      lambda_data_source.createResolver({
        typeName:"Query",
        fieldName:"welcome"
      })
      lambda_data_source.createResolver({
        typeName:"Mutation",
        fieldName:"createData"
      })
  }
}
