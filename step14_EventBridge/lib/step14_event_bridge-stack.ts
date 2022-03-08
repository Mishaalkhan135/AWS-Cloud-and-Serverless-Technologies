import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as events from "aws-cdk-lib/aws-events"
import * as eventtargets from "aws-cdk-lib/aws-events-targets"
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step14EventBridgeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const producerLambda = new lambda.Function(this, 'producerLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'producer.handler',
      functionName:"ProducerFunction"
    })
      // If any service wants to talk to another service it requires permission for that particular events
    events.EventBus.grantAllPutEvents(producerLambda)

    const consumerLambda = new lambda.Function(this, 'consumerLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'consumer.handler',
      functionName:"ConsumerFunction"
    })

    const rule = new events.Rule(this, 'customerOrderingRule', {
      ruleName: 'MishaalRule',
      description: '',
      targets: [new eventtargets.LambdaFunction(consumerLambda)],
      eventPattern: {
        source: ['orderService'],
        //optaional it will run when these values are present else it won't
         detail:["50","80","95"]
      },
    })
  }
}
