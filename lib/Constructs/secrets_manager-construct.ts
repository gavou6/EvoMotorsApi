import { Construct } from "constructs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

interface IEvoMotorsSecretManagerProps {
  secretArn: string;
}

export class EvoMotorsSecretManager extends Construct {
  public readonly secret: secretsmanager.ISecret;

  constructor(
    scope: Construct,
    id: string,
    props: IEvoMotorsSecretManagerProps,
  ) {
    super(scope, id);

    this.secret = secretsmanager.Secret.fromSecretAttributes(
      this,
      "EvoMotorsImportedSecrets",
      {
        secretPartialArn: props.secretArn,
      },
    );
  }
}
