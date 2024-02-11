import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  AtlasServerlessBasic,
  ServerlessInstanceProviderSettingsProviderName,
} from "awscdk-resources-mongodbatlas";
import { EvoMotorsSecretManager } from "../Constructs/secrets_manager-construct";

export class EvoMotorsMongoAtlasStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { secret } = new EvoMotorsSecretManager(this, "MongoDBSecrets", {
      secretArn:
        "arn:aws:secretsmanager:us-east-1:891377003070:secret:EvoMotorsDBSecrets-C8V2j0",
    });

    new AtlasServerlessBasic(this, "AtlasServerlessBasic", {
      serverlessProps: {
        name: secret.secretValueFromJson("name").toString(),
        profile: secret.secretValueFromJson("profile").toString(),
        continuousBackupEnabled: true,
        providerSettings: {
          providerName:
            ServerlessInstanceProviderSettingsProviderName.SERVERLESS,
          regionName: secret.secretValueFromJson("region").toString(),
        },
        terminationProtectionEnabled: true,
      },
      projectProps: {
        name: secret.secretValueFromJson("projectName").toString(),
        orgId: secret.secretValueFromJson("orgId").toString(),
      },
      profile: secret.secretValueFromJson("profile").toString(),
    });
  }
}
