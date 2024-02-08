import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

interface EvoMotorsApiStackProps extends cdk.StackProps {
  stageName?: string;
}

export class EvoMotorsApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: EvoMotorsApiStackProps) {
    super(scope, id, props);
  }
}
