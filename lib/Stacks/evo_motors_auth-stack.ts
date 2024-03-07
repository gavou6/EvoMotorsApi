import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import {
  AccountRecovery,
  CfnUserPoolGroup,
  UserPool,
  UserPoolClient,
  UserPoolClientIdentityProvider,
} from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

export class AdminAuthStack extends Stack {
  public userPool: UserPool;
  public userPoolClient: UserPoolClient;
  private adminGroup: CfnUserPoolGroup;
  private customerGroup: CfnUserPoolGroup;
  private sellerGroup: CfnUserPoolGroup;
  private technicianGroup: CfnUserPoolGroup;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.createUserPool();
    this.createUserPoolClient();
    this.createUserGroups();
  }

  private createUserPool() {
    this.userPool = new UserPool(this, "EvoMotorsUserPool", {
      userPoolName: "EvoMotorsPool",
      removalPolicy: RemovalPolicy.DESTROY,
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      standardAttributes: {
        familyName: {
          required: true,
          mutable: true,
        },
        givenName: {
          required: true,
          mutable: true,
        },
        phoneNumber: {
          required: true,
          mutable: true,
        },
        email: {
          required: true,
          mutable: true,
        },
        lastUpdateTime: {
          required: false,
          mutable: false,
        },
        birthdate: {
          required: false,
          mutable: true,
        },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireDigits: true,
        requireUppercase: false,
        requireSymbols: false,
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
    });

    new CfnOutput(this, "EvoMotorsUserPoolId", {
      value: this.userPool.userPoolId,
    });
  }

  private createUserPoolClient() {
    this.userPoolClient = this.userPool.addClient("EvoMotorsPoolClient", {
      authFlows: {
        adminUserPassword: true,
        userPassword: true,
        custom: true,
        userSrp: true,
      },
      supportedIdentityProviders: [
        UserPoolClientIdentityProvider.COGNITO,
        UserPoolClientIdentityProvider.GOOGLE,
      ],
    });
    new CfnOutput(this, "EvoMotorsPoolClientId", {
      value: this.userPoolClient.userPoolClientId,
    });
  }

  private createUserGroups() {
    this.adminGroup = new CfnUserPoolGroup(this, "AdminGroup", {
      groupName: "admin-user-group",
      userPoolId: this.userPool.userPoolId,
    });

    new CfnOutput(this, "AdminGroupId", {
      value: this.adminGroup.logicalId,
    });

    this.customerGroup = new CfnUserPoolGroup(this, "CustomerGroup", {
      groupName: "customer-user-group",
      userPoolId: this.userPool.userPoolId,
    });

    new CfnOutput(this, "CustomerGroupId", {
      value: this.customerGroup.logicalId,
    });

    this.sellerGroup = new CfnUserPoolGroup(this, "SellerGroup", {
      groupName: "seller-user-group",
      userPoolId: this.userPool.userPoolId,
    });

    new CfnOutput(this, "SellerGroupId", {
      value: this.sellerGroup.logicalId,
    });

    this.technicianGroup = new CfnUserPoolGroup(this, "TechnicianGroup", {
      groupName: "technician-user-group",
      userPoolId: this.userPool.userPoolId,
    });

    new CfnOutput(this, "TechnicianGroupId", {
      value: this.technicianGroup.logicalId,
    });
  }

  getUserPool(): UserPool {
    return this.userPool;
  }

  getUserPoolClient(): UserPoolClient {
    return this.userPoolClient;
  }
}
