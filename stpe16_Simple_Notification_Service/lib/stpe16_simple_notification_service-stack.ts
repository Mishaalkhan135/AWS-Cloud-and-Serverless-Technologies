import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as snsSubscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class Example00HttpsSubscriptionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Creating lambda to invoke when hit on rest API
    const lambdaToInvokeOnRestAPI = new lambda.Function(this, 'lambdaToInvokeOnRestAPI', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
    });

    
    // Creating an endpoint
    const restAPIEndpointForLambda = new apigateway.LambdaRestApi(this, 'restAPIEndpointForLambda', {
      handler: lambdaToInvokeOnRestAPI,
    });


    // Creating a SNS topic
    const topicForHttpsSubscription = new sns.Topic(this, 'topicForHttpsSubscription');
    

    // The following command subscribes our endpoint(connected to lambda) to the SNS topic
    topicForHttpsSubscription.addSubscription(
      new snsSubscriptions.UrlSubscription(restAPIEndpointForLambda.url, {
        protocol: sns.SubscriptionProtocol.HTTPS,
      })
    );

  }
}