import { aws_codebuild, aws_codepipeline_actions, SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as CodePipeline from 'aws-cdk-lib/aws-codepipeline'
import * as CodePipelineAction from aws-cdk-lib/aws-codepipeline-actions'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step13PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    //Stack name in repo of github
    const stackName = "DynamoDbPipelineStack"
     
      // Artifact is a temparery storage thats is used in pipleLine to fetch or transfer data from one stage to other 
      const sourceOutput = new CodePipeline.Artifact();
      // Artifact from build stage
    const CDKOutput = new CodePipeline.Artifact();

    //Code build action, Here you will define a complete build
    const cdkBuild = new aws_codebuild.PipelineProject(this, 'CdkBuild', {
      buildSpec: aws_codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            "runtime-versions": {
              "nodejs": 12
            },
            commands: [
              'cd step12_CI_CD_pipeline',
              'cd step02_CI_CD_pipeline_update_cdk_template',
              'npm install'
            ],
          },
          build: {
            commands: [
              'npm run build',
              'npm run cdk synth -- -o dist'
            ],
          },
        },
        artifacts: {
          'base-directory': 'AWS-Cloud-and-Serverless-Technologies/tree/main/step13_pipeline',      ///outputting our generated JSON CloudFormation files to the dist directory
          files: [
            `${this.stackName}.template.json`,
          ],
        },
      }),
      environment: {
        buildImage: aws_codebuild.LinuxBuildImage.STANDARD_3_0,  ///BuildImage version 3 because we are using nodejs environment 12
      },
    });
    const pipeline = new CodePipeline.Pipeline(this, 'MyFirstPipeline', {
      pipelineName: 'MyPipeline',
      crossAccountKeys: false,  //Pipeline construct creates an AWS Key Management Service (AWS KMS) which cost $1/month. this will save your $1.
      restartExecutionOnUpdate: true,  //Indicates whether to rerun the AWS CodePipeline pipeline after you update it.
    });

     ///Adding stages to pipeline
  
     //First Stage Source
 const sourceStage = pipeline.addStage({
  stageName: 'GitFetch',
  actions: [
    new aws_codepipeline_actions.GitHubSourceAction({
     actionName: 'Github_Source',
     output: sourceOutput,
     owner: 'mishaalkhan',
     repo: 'pipeLineExample',
     oauthToken: SecretValue.plainText("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"),
     branch:'main'
    })
  ],
});
const sourceStage1 = pipeline.addStage({
  stageName: 'Build',
  actions: [
    new aws_codepipeline_actions.CodeBuildAction({
      actionName: 'cdkBuild',
      project: cdkBuild,
      input: sourceOutput,
      outputs: [CDKOutput],
    }),
  ],
});
const sourceStage2 = pipeline.addStage({
  stageName: 'DeployCDK',
  actions: [
    new aws_codepipeline_actions.CloudFormationCreateUpdateStackAction({
      actionName: "AdministerPipeline",
      templatePath: CDKOutput.atPath(`${this.stackName}.template.json`),   ///Input artifact with the CloudFormation template to deploy
      stackName: this.stackName,                                           ///Name of stack
      adminPermissions: true  //all permissions 
    }),
  ],
});

  }
}
