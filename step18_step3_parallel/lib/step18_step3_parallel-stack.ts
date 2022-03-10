import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as stepFunctions from 'aws-cdk-lib/aws-stepfunctions'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step18Step3ParallelStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
//pass branches do nothing infact they just add static data to the input and pass it to output
    const parallelBranch1 = new stepFunctions.Pass(this, "parallelBranch1", {
      result: stepFunctions.Result.fromObject({
        message: "hello parallel branch 1",
      }),
      resultPath: "$.parallel_branch_1",
    });

    const parallelBranch2 = new stepFunctions.Pass(this, "parallelBranch2", {
      result: stepFunctions.Result.fromObject({
        message: "hello parallel branch 2",
      }),
      resultPath: "$.parallel_branch_2",
    });

    const parallelBranch3 = new stepFunctions.Pass(this, "parallelBranch3", {
      result: stepFunctions.Result.fromObject({
        message: "hello parallel branch 3",
      }),
      resultPath: "$.parallel_branch_3",
    });

    const failureBranch = new stepFunctions.Pass(this, "failureBranch", {
      result: stepFunctions.Result.fromObject({
        message: "hello failure branch",
      }),
      resultPath: "$.failure_branch",
    });

    const success = new stepFunctions.Succeed(this, "successBranch");

    const parallel = new stepFunctions.Parallel(
      this,
      "Do the work in parallel"
    );

    // Add branches to be executed in parallel
    parallel.branch(parallelBranch1);
    parallel.branch(parallelBranch2);
    parallel.branch(parallelBranch3);

    // Retry the whole workflow if something goes wrong
    parallel.addRetry({ maxAttempts: 1 });

    // How to recover from errors
    parallel.addCatch(failureBranch);

    // What to do in case everything succeeded
    parallel.next(success);

    // create a chain

    const chain = stepFunctions.Chain.start(parallel);

    // create a state machine

    new stepFunctions.StateMachine(this, "parallelStateMachine", {
      definition: chain,
    });
  }
}
