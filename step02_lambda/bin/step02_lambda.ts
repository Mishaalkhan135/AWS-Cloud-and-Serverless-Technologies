#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Step02LambdaStack } from '../lib/step02_lambda-stack';

const app = new cdk.App();
new Step02LambdaStack(app, 'Step02LambdaStack');