import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class SampleCdk1Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    new s3.Bucket(this,"my-bootcamp-bucket-hello-world",{
      versioned:true,
      bucketName: "my-bootcamp-bucket-hello-world"


    });

  };
};
