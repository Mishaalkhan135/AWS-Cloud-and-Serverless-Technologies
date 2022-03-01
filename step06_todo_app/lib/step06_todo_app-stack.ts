import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from '@aws-cdk/aws-appsync-alpha'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as dynamo from 'aws-cdk-lib/aws-dynamodb'

// import * as sqs from 'aws-cdk-lib/aws-sqs';


const aws_cdk_lib_1 = require("aws-cdk-lib");

export class Step06TodoAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const api = new appsync.GraphqlApi(this, "TodoLmabda", {
      name: 'cdk-appsync-dyanamodb-api',
      schema: appsync.Schema.fromAsset('schema/schema.gql'),       ///Path specified for lambda
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,     ///Defining Authorization Type
        },
      },
      // xrayEnabled: true                                             ///Enables xray debugging
    })
    
    const todosTable = new dynamo.Table(this,"CDkTodoesTable",{
      tableName:"mishaaltodo",
      partitionKey:{
        name:'id',
        type:dynamo.AttributeType.STRING
      }
    })
 
    //Lambda function 
    const lambda_function = new lambda.Function(this,"Lambda_Function_Todo",{
      runtime:lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('functions'),
      handler:'main.handler',
      environment: {
        TABLE_NAME: todosTable.tableName
      }
  })
  //To connect lambda and graphQl 
  const lambda_datasource = api.addLambdaDataSource("LambdaDataSource",lambda_function)
//To Call querys 
  lambda_datasource.createResolver({
    typeName:"Query",
    fieldName:'getTodos'
  })
  lambda_datasource.createResolver({
    typeName:"Mutation",
    fieldName:"addTodo"
  })
  lambda_datasource.createResolver({
    typeName:"Mutation",
    fieldName:"deleteTodo"
  })
  lambda_datasource.createResolver({
    typeName:"Mutation",
    fieldName:"updateTodo"
  })

  todosTable.grantFullAccess(lambda_function)
  lambda_function.addEnvironment("TABLE_NAME",todosTable.tableName)
  
  const url = new aws_cdk_lib_1.CfnOutput(this, "GraphQlUrl", {
    value: api.graphqlUrl
});
  const key = new aws_cdk_lib_1.CfnOutput(this, "GraphQlUrl_Key", {
      value: api.apiKey || ""
});

  }
}
