import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch'
import * as cdk from 'aws-cdk-lib'
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions'
import  {SnsAction} from 'aws-cdk-lib/aws-cloudwatch-actions'
import * as sns from 'aws-cdk-lib/aws-sns'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step00CloudWatchAlarmStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    //lambda function
    const lambdaFn = new lambda.Function(this, 'LambdaHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      functionName:"mishaalLambda"
    });
    //defined 3 metrix to get more meaningful information
    const errors = lambdaFn.metricErrors();
    const invocations = lambdaFn.metricInvocations();
    const throttle = lambdaFn.metricThrottles();//throttle means limit extension



    //checking if there is a problem in lambda function
    const allProblems = new cloudwatch.MathExpression({//to combine matrix u need MathExpression
      expression: "errors + throttles",
      usingMetrics: {
        errors: errors,
        throttles: throttle
      }
    })


    const problemPercentage = new cloudwatch.MathExpression({
      expression: "(problems / invocations) * 100",//percentage of the problem
      usingMetrics: {
        problems: allProblems,
        invocations: invocations
      },
      period: cdk.Duration.minutes(1),
    })


    const Topic = new sns.Topic(this, 'Topic');

    Topic.addSubscription(
      new subscriptions.EmailSubscription("mishaalkhan135@gmail.com")//get email throuh topic alarm
    );

    const alarm = new cloudwatch.Alarm(this, 'Alarm', {
      metric: problemPercentage,
      threshold: 10,//if 10% is failing then alarm will be tregered
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
      evaluationPeriods: 1,//1min wait
    });

    alarm.addAlarmAction(new SnsAction(Topic))//alarm will push some data to topic and it will generate a email


   
  
  }
}
