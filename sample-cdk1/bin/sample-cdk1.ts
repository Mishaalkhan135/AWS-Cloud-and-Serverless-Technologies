#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SampleCdk1Stack } from '../lib/sample-cdk1-stack';

//CDK through structure 
const app = new cdk.App();
new SampleCdk1Stack(app, 'SampleCdk1Stack');