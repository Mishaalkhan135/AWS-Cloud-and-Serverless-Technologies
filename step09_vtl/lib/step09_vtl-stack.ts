import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from '@aws-cdk/aws-appsync-alpha'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'


// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step09VtlStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const api = new appsync.GraphqlApi(this, "MyDymanoTable", {
      name: 'cdk-appsync-dyanamodb-vtl',
      schema: appsync.Schema.fromAsset('schema/schema.gql'),       ///Path specified for lambda
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,     ///Defining Authorization Type
        },
      },
      // xrayEnabled: true                                             ///Enables xray debugging
    })
 
  const productTable = new dynamodb.Table(this,"ProductTable",{
    tableName:"carsTable",
    partitionKey:{
      name:'id',
      type:dynamodb.AttributeType.STRING
    }
  })
const dynamo_dataSource = api.addDynamoDbDataSource("MyDymanoTable",productTable)

dynamo_dataSource.createResolver({
  typeName:"Mutation",
  fieldName:"addProduct",
  requestMappingTemplate:appsync.MappingTemplate.fromString(`
  {
    "version" : "2017-02-28",
    "operation" : "PutItem",
    "key" : {
        "id" : $util.dynamodb.toDynamoDBJson($util.autoId())
    },
    "attributeValues" : $util.dynamodb.toMapValuesJson($context.arguments.product)
  } 
  `),
  responseMappingTemplate:appsync.MappingTemplate.fromString(`
    $util.qr($context.result.put("name","$context.result.name $context.result.price"))
    $util.toJson($context.result)
  `)

})
dynamo_dataSource.createResolver({
  typeName:"Query",
  fieldName:"getProductList",
  requestMappingTemplate:appsync.MappingTemplate.fromString(`
            {
              "version" : "2017-02-28",
              "operation" : "Scan",
            }
  `),
  responseMappingTemplate:appsync.MappingTemplate.fromString(`
          #foreach ($item in $context.result.items)
                $util.qr($item .put("name","$item.name - $item.price"))
         #end
        $util.toJson($context.result.items) 
  `)
})
  }
}
