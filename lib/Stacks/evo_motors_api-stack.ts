import * as cdk from "aws-cdk-lib";
import { CorsHttpMethod, HttpApi } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpUserPoolAuthorizer } from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { HttpMethod } from "aws-cdk-lib/aws-events";
import { Construct } from "constructs";

interface EvoMotorsApiStackProps extends cdk.StackProps {
  stageName: string;
  userPool: UserPool;
  userPoolClient: UserPoolClient;
  brandLambdaIntegration: HttpLambdaIntegration;
}

export class EvoMotorsApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EvoMotorsApiStackProps) {
    super(scope, id, props);

    const evoMotorsAdminHttpApi = new HttpApi(this, "EvoMotorsApi", {
      apiName: "EvoMotorsHttpApi",
      corsPreflight: {
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
          "IdToken",
        ],
        allowMethods: [
          CorsHttpMethod.OPTIONS,
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.PUT,
          CorsHttpMethod.PATCH,
          CorsHttpMethod.DELETE,
        ],
        allowCredentials: true,
        allowOrigins: ["http://localhost:3000"],
      },
    });

    const authorizer = new HttpUserPoolAuthorizer(
      "evo-motors-userpool-authorizer",
      props.userPool,
      {
        userPoolClients: [props.userPoolClient],
        identitySource: ["$request.header.Authorization"],
      },
    );

    //brand routes
    evoMotorsAdminHttpApi.addRoutes({
      path: "/brand",
      methods: [HttpMethod.GET, HttpMethod.POST],
      integration: props.brandLambdaIntegration,
      authorizer,
    });

    evoMotorsAdminHttpApi.addRoutes({
      path: "/brand/{brandId}",
      methods: [HttpMethod.GET, HttpMethod.PUT, HttpMethod.DELETE],
      integration: props.brandLambdaIntegration,
      authorizer,
    });
  }
}
