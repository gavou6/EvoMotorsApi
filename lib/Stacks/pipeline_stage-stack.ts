import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { EvoMotorsApiStack } from "./evo_motors_api-stack";
import { EvoMotorsMongoAtlasStack } from "./evo_motors_mongodb_stack";
import { ConfigProps } from "../../config/envConfig";
import { AdminAuthStack } from "./evo_motors_auth-stack";
import { LambdaStack } from "./evo_motors_lambda-stack";
import * as _ from "lodash";
interface IPipelineStageProps extends StageProps {
  config: Readonly<ConfigProps>;
  stageName: string;
}

export class PipelineStage extends Stage {
  constructor(scope: Construct, id: string, props: IPipelineStageProps) {
    super(scope, id, props);

    const envVariables: { [key: string]: string | undefined } = {
      DATABASE_URL: process.env.DATABASE_URL,
    };

    const lambdaVariables = _.omitBy(envVariables, _.isUndefined) as {
      [key: string]: string;
    };

    // TODO: Already created, causing issues after stack delition
    /* new EvoMotorsMongoAtlasStack(this, "EvoMotorsMongoStack", {
      config: props.config,
    }); */

    const evoMotorsAuthStack = new AdminAuthStack(
      this,
      "EvoMotorsAdminAuthStack",
    );

    //Brand lAMBDA
    const brandLambdaIntegration = new LambdaStack(this, "brandLambda", {
      lambdaDirectory: "Brand",
      envVariables: lambdaVariables,
    });

    //CarModel Lambda
    const carModelLambdaIntegration = new LambdaStack(this, "carModelLambda", {
      lambdaDirectory: "CarModel",
      envVariables: lambdaVariables,
    });

    //Product Lambda
    const productLambdaIntegration = new LambdaStack(this, "ProductLambda", {
      lambdaDirectory: "Product",
      envVariables: lambdaVariables,
    });

    //Witness Lambda
    const witnessLambdaIntegration = new LambdaStack(this, "WitnessLambda", {
      lambdaDirectory: "Witness",
      envVariables: lambdaVariables,
    });

    //Remission Lambda
    const remissionLambdaIntegration = new LambdaStack(this, "RemissionLambda", {
      lambdaDirectory: "Remission",
      envVariables: lambdaVariables,
    });

    //Certificate Lambda
    const certificateLambdaIntegration = new LambdaStack(this, "CertificateLambda", {
      lambdaDirectory: "Certificate",
      envVariables: lambdaVariables,
    });

    //Receipt Lambda
    const receiptLambdaIntegration = new LambdaStack(this, "ReceiptLambda", {
      lambdaDirectory: "Receipt",
      envVariables: lambdaVariables,
    });

    new EvoMotorsApiStack(this, "EvoMotorsApiStack", {
      stageName: props.stageName,
      userPool: evoMotorsAuthStack.getUserPool(),
      userPoolClient: evoMotorsAuthStack.getUserPoolClient(),
      brandLambdaIntegration: brandLambdaIntegration.lambdaIntegration,
      carModelLambdaIntegration: carModelLambdaIntegration.lambdaIntegration,
      productLambdaIntegration: productLambdaIntegration.lambdaIntegration,
      witnessLambdaIntegration: witnessLambdaIntegration.lambdaIntegration,
      remissionLambdaIntegration: remissionLambdaIntegration.lambdaIntegration,
      certificateLambdaIntegration: certificateLambdaIntegration.lambdaIntegration,
      receiptLambdaIntegration: receiptLambdaIntegration.lambdaIntegration,
    });
  }
}
