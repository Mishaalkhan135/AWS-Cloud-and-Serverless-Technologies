import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch'
import * as cdk from 'aws-cdk-lib'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step01DashboardStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const lambdaFn = new lambda.Function(this, 'LambdaHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
    });
    //matrix for lambda function
    const errors = lambdaFn.metricErrors({
      statistic: 'avg',
      period: cdk.Duration.minutes(1),
    });
    
    const duration = lambdaFn.metricDuration();

    //created a dashboard but not added any graphs
    const dash = new cloudwatch.Dashboard(this, "dash");
    //graph widget creation 
    const widget = new cloudwatch.GraphWidget({

      title: "Executions vs error rate",
    
      left: [errors],
      right: [duration],

      view: cloudwatch.GraphWidgetView.BAR,
      liveData: true
    })
    //text widget only shows heading
    const textWidget = new cloudwatch.TextWidget({
      markdown: '# Key Performance Indicators'
    });
    //adding widgets in dashboard
    dash.addWidgets(textWidget);
    dash.addWidgets(widget);
  }
}
