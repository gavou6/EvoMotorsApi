import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { EvoMotorsApiStack } from "./evo_motors_api-stack";
import { EvoMotorsMongoAtlasStack } from "./evo_motors_mongodb_stack";

export class PipelineStage extends Stage {
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);

    new EvoMotorsMongoAtlasStack(this, "EvoMotorsMongoStack", {});

    new EvoMotorsApiStack(this, "EvoMotorsApiStack", {
      stageName: props.stageName,
    });
  }
}
