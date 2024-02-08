#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { EvoMotorsApiStack } from "../lib/Stacks/evo_motors_api-stack";
import { EvoMotorsCiCdStack } from "../lib/Stacks/evo_motors_cicd-stack";

const app = new cdk.App();
new EvoMotorsApiStack(app, "EvoMotorsApiStack", {});
new EvoMotorsCiCdStack(app, "EvoMotorsCiCdStack", {});

app.synth();
