import * as cdk from "aws-cdk-lib";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";

export class EvoMotorsCiCdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new CodePipeline(this, "EvoMotorsPipelineId", {
      pipelineName: "EvoMotorsPipeline",
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub("EvoMotorsMx/EvoMotorsApi", "master"),
        commands: ["npm ci", "npx cdk synth --all"],
        primaryOutputDirectory: "cdk.out",
      }),
    });
  }
}
