import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  AtlasServerlessBasic,
  ServerlessInstanceProviderSettingsProviderName,
} from "awscdk-resources-mongodbatlas";
import { ConfigProps } from "../../config/envConfig";

interface IEvoMotorsMongoAtlasStackProps extends cdk.StackProps {
  config: Readonly<ConfigProps>;
}

export class EvoMotorsMongoAtlasStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: IEvoMotorsMongoAtlasStackProps,
  ) {
    super(scope, id, props);

    const { config } = props;

    new AtlasServerlessBasic(this, "AtlasServerlessBasic", {
      serverlessProps: {
        name: config.MONGO_NAME,
        profile: config.MONGO_PROFILE,
        continuousBackupEnabled: true,
        providerSettings: {
          providerName:
            ServerlessInstanceProviderSettingsProviderName.SERVERLESS,
          regionName: config.MONGO_REGION,
        },
        terminationProtectionEnabled: true,
      },
      projectProps: {
        name: config.MONGO_PROJECT,
        orgId: config.MONGO_ORG,
      },
      profile: config.MONGO_PROFILE,
    });
  }
}
