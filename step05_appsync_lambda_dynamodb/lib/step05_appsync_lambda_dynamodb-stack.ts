import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from '@aws-cdk/aws-appsync-alpha'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as dynamo from 'aws-cdk-lib/aws-dynamodb'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step05AppsyncLambdaDynamodbStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const api = new appsync.GraphqlApi(this, "DynamoDBLambda", {
      name: 'cdk-appsync-dyanamodb-api',
      schema: appsync.Schema.fromAsset('schema/schema.gql'),       ///Path specified for lambda
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,     ///Defining Authorization Type
        },
      },
      // xrayEnabled: true                                             ///Enables xray debugging
    })
 
    //Lambda function 
    const lambda_function = new lambda.Function(this,"Lambda_Function",{
      runtime:lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler:'index.handler',
      environment: {
        // TABLE_NAME: productTable.tableName
      }
  })
  //To connect lambda and graphQl 
  const lambda_datasource = api.addLambdaDataSource("LambdaDataSource",lambda_function)
//To Call querys 
  lambda_datasource.createResolver({
    typeName:"Query",
    fieldName:'welcome'
  })
  lambda_datasource.createResolver({
    typeName:"Mutation",
    fieldName:"addProduct"
  })
  lambda_datasource.createResolver({
    typeName:"Mutation",
    fieldName:"deleteProduct"
  })
  const productTable = new dynamo.Table(this,"ProductTable",{
    tableName:"mishaalkhan",
    partitionKey:{
      name:'id',
      type:dynamo.AttributeType.STRING
    }
  })
  productTable.grantFullAccess(lambda_function)
  lambda_function.addEnvironment("TABLE_NAME",productTable.tableName)
  }
}
