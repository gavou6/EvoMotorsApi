import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { EvoMotorsApiStack } from "./evo_motors_api-stack";

export class PipelineStage extends Stage {
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);

    new EvoMotorsApiStack(this, "EvoMotorsApiStack", {
      stageName: props.stageName,
    });
  }
}
