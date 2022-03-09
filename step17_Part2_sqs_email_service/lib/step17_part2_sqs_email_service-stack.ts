import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns'
import * as sqs from 'aws-cdk-lib/aws-sqs'
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions'
import * as cdk from 'aws-cdk-lib'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step17Part2SqsEmailServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

       // create an SNS topic
       const myTopic = new sns.Topic(this, "MyTopic");

       // create a dead letter queue
       const dlQueue = new sqs.Queue(this, "DeadLetterQueue", {
         queueName: "MySubscription_DLQ",
         retentionPeriod: cdk.Duration.days(14),
       });
   
       // subscribe email to the topic
       myTopic.addSubscription(
         new subscriptions.EmailSubscription("mishaalkhan135@gmail.com", {
           json: false,
           deadLetterQueue: dlQueue,
         })
       );
  }
}
