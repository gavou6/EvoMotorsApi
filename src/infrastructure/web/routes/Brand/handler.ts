import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { connectToDatabase } from "../../../../shared/utils/db-connection";
import { BrandService } from "../../../../core/domain/services/BrandService";
import { BrandUseCases } from "../../../../core/application/use_cases/BrandUseCases";
import { z } from "zod";
import { HTTP_BAD_REQUEST } from "../../../../shared/constants";
import { BrandRepository } from "../../../persistence/repositories/BrandRepository";
import { decodeToken } from "../../../../shared/utils/userDecoder";
import { CUSTOMER_ROLE } from "../../../../shared/constants/roles";
import { IIdToken } from "../../../security/Auth";

const createBrandBodySchema = z.object({
  name: z.string(),
});

const updateBrandBodySchema = z.object({
  id: z.string(),
  name: z.string(),
});

const removeBrandBody = z.object({
  id: z.string(),
});

const getBrandBody = z.object({
  id: z.string(),
});

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;

  const idToken = event["headers"]["IdToken"];

  if (!idToken) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Authorization token is required" }),
    };
  }

  let decoded;
  try {
    decoded = decodeToken(idToken) as IIdToken;
    const groups = decoded["cognito:groups"] || [];

    if (groups.includes(CUSTOMER_ROLE)) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          message: "Access denied: user is a member of customer group",
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid token" }),
    };
  }

  await connectToDatabase();
  const brandRepository = new BrandRepository();
  const brandService = new BrandService(brandRepository);
  const brandUseCases = new BrandUseCases(brandService);

  try {
    switch (event.httpMethod) {
      case "GET":
        if (event.pathParameters) {
          const pathValidationResult = getBrandBody.safeParse(
            event.pathParameters,
          );
          if (!pathValidationResult.success) {
            return {
              statusCode: HTTP_BAD_REQUEST,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                message: "Invalid ID",
                errors: pathValidationResult.error,
              }),
            };
          }

          const brand = await brandUseCases.getBrand(
            pathValidationResult.data.id,
          );
          return {
            statusCode: 200,
            body: JSON.stringify(brand),
          };
        } else {
          const brands = await brandUseCases.findAllBrands();
          return {
            statusCode: 200,
            body: JSON.stringify(brands),
          };
        }

      case "POST": {
        const payload = JSON.parse(event.body ?? "{}");
        const validationResult = createBrandBodySchema.safeParse(payload);
        let newBrand;
        if (validationResult.success) {
          newBrand = await brandUseCases.createBrand(payload.name);
        } else {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "text/json" },

            body: JSON.stringify({
              message: "Invalid input data",
              errors: validationResult.error,
            }),
          };
        }

        return {
          statusCode: 201,
          body: JSON.stringify(newBrand),
        };
      }

      case "PUT": {
        const payload = JSON.parse(event.body ?? "{}");
        const validationResult = updateBrandBodySchema.safeParse(payload);
        let updatedBrand;
        if (validationResult.success) {
          updatedBrand = await brandUseCases.updateBrand(
            payload.id,
            payload.name,
          );
        } else {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "text/json" },

            body: JSON.stringify({
              message: "Invalid input data",
              errors: validationResult.error,
            }),
          };
        }
        return {
          statusCode: 201,
          body: JSON.stringify(updatedBrand),
        };
      }

      case "DELETE": {
        const payload = JSON.parse(event.body ?? "{}");
        const validationResult = removeBrandBody.safeParse(payload);
        if (validationResult.success) {
          await brandUseCases.removeBrand(payload.id);
        } else {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "text/json" },

            body: JSON.stringify({
              message: "Invalid input data",
              errors: validationResult.error,
            }),
          };
        }
        return {
          statusCode: 201,
          body: JSON.stringify(
            `{id: ${payload.id}, message: "Brand removed successfully"}`,
          ),
        };
      }

      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error instanceof Error ? error.message : "Server error",
      }),
    };
  }
}
