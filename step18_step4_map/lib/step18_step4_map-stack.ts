import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as stepFunctions from 'aws-cdk-lib/aws-stepfunctions'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step18Step4MapStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const initialState = new stepFunctions.Pass(this, "initialState", {
      result: stepFunctions.Result.fromArray(["entry1", "entry2", "entry3"]),//map 3 times as array contains 3 values
      resultPath: "$.arrayOutput",
    });

    // this pass function doesnt change anything. We just made this to explain the mapping process

    const mapPass = new stepFunctions.Pass(this, "mapping");

    // this is a mapping function that runs 'mapPass' for each element in the state path {arrayOutput:[....]} coming
    // from the previous step. In this case we have 3 elements in the array therefore the "mapPass" would run 3 times.

    const map = new stepFunctions.Map(this, "MapState", {
      maxConcurrency: 1,
      itemsPath: stepFunctions.JsonPath.stringAt("$.arrayOutput"),
    });
    map.iterator(mapPass);

    // created a chain

    const chain = stepFunctions.Chain.start(initialState).next(map);

    // create a state machine

    new stepFunctions.StateMachine(this, "mapStateMachine", {
      definition: chain,
    });
  }
}
