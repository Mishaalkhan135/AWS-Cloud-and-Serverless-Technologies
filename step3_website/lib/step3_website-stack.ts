import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step3WebsiteStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const websiteBucket = new s3.Bucket(this, 'website-bucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      bucketName: "mishaal-deploy-bucket",

    });

    // Handles buckets whether or not they are configured for website hosting.
  const distribution = new cloudfront.Distribution(this, 'Distribution', {
  defaultBehavior: { origin: new origins.S3Origin(websiteBucket) },
});
    const display  = new CfnOutput(this,"output",{
      value:distribution.domainName
    })
    new s3deploy.BucketDeployment(this, 'deploy-website', {
      sources: [s3deploy.Source.asset('./myweb')],
      destinationBucket: websiteBucket,
      distribution:distribution
    });
    
  }
}
