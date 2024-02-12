import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { EvoMotorsApiStack } from "./evo_motors_api-stack";
import { EvoMotorsMongoAtlasStack } from "./evo_motors_mongodb_stack";
import { ConfigProps } from "../../config/envConfig";

interface IPipelineStageProps extends StageProps {
  config: Readonly<ConfigProps>;
}

export class PipelineStage extends Stage {
  constructor(scope: Construct, id: string, props: IPipelineStageProps) {
    super(scope, id, props);

    new EvoMotorsMongoAtlasStack(this, "EvoMotorsMongoStack", {
      config: props.config,
    });

    new EvoMotorsApiStack(this, "EvoMotorsApiStack", {
      stageName: props.stageName,
    });
  }
}
