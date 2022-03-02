import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from '@aws-cdk/aws-appsync-alpha'
import * as dynamo from 'aws-cdk-lib/aws-dynamodb'

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step08AppsyncDynamodbAsDatasourceMappingtemplateMethodsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const api = new appsync.GraphqlApi(this, "DynamoDBLambda", {
      name: 'cdk-appsync-dyanamodb-apis',
      schema: appsync.Schema.fromAsset('schema/schema.gql'),       ///Path specified for lambda
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,     ///Defining Authorization Type
        },
      },
      // xrayEnabled: true                                             ///Enables xray debugging
    })
 
  const productTable = new dynamo.Table(this,"ProductTable",{
    tableName:"graphQlDb",
    partitionKey:{
      name:'id',
      type:dynamo.AttributeType.STRING
    }
  })
const dataSource = api.addDynamoDbDataSource("dataSource",productTable)

dataSource.createResolver({
  typeName:'Mutation',
  fieldName:"createNote",
  //The addition to send data directly to dynamo using graphQl without lamnbda function 
  requestMappingTemplate:appsync.MappingTemplate.dynamoDbPutItem(appsync.PrimaryKey.partition("id").auto(),appsync.Values.projecting()),
  responseMappingTemplate:appsync.MappingTemplate.dynamoDbResultItem()
})
dataSource.createResolver({
  typeName:'Query',
  fieldName:"notes",
  //The addition to send data directly to dynamo using graphQl without lamnbda function 
  requestMappingTemplate:appsync.MappingTemplate.dynamoDbScanTable(),
  responseMappingTemplate:appsync.MappingTemplate.dynamoDbResultList()
})
dataSource.createResolver({
  typeName:'Mutation',
  fieldName:"updateNote",
  //The addition to send data directly to dynamo using graphQl without lamnbda function 
  requestMappingTemplate:appsync.MappingTemplate.dynamoDbPutItem(appsync.PrimaryKey.partition("id").is("id"),appsync.Values.projecting()),
  responseMappingTemplate:appsync.MappingTemplate.dynamoDbResultItem()
})
dataSource.createResolver({
  typeName:'Mutation',
  fieldName:"deleteNote",
  //The addition to send data directly to dynamo using graphQl without lamnbda function 
  requestMappingTemplate:appsync.MappingTemplate.dynamoDbDeleteItem("id","id"),
  responseMappingTemplate:appsync.MappingTemplate.dynamoDbResultItem()
})

  }
}
