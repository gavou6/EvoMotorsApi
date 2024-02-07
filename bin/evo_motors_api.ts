#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EvoMotorsApiStack } from '../lib/evo_motors_api-stack';

const app = new cdk.App();
new EvoMotorsApiStack(app, 'EvoMotorsApiStack', {});
