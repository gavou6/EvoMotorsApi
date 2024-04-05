import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { connectToDatabase } from "../../../../shared/utils/db-connection";
import { BrandService } from "../../../../core/domain/services/BrandService";
import { BrandUseCases } from "../../../../core/application/use_cases/BrandUseCases";
import { z } from "zod";
import {
  DELETE,
  GET,
  HTTP_BAD_REQUEST,
  HTTP_CREATED,
  HTTP_FORBIDDEN,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_OK,
  HTTP_UNAUTHORIZED,
  POST,
  PUT,
} from "../../../../shared/constants";
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
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;

  const idToken = event.headers["idtoken"];

  if (!idToken) {
    return {
      statusCode: HTTP_UNAUTHORIZED,
      body: JSON.stringify({ message: "Authorization token is required" }),
    };
  }

  let decoded;
  try {
    decoded = decodeToken(idToken) as IIdToken;
    const groups = decoded["cognito:groups"] || [];

    if (groups.includes(CUSTOMER_ROLE)) {
      return {
        statusCode: HTTP_FORBIDDEN,
        body: JSON.stringify({
          message: "Access denied: user is a member of customer group",
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: HTTP_BAD_REQUEST,
      body: JSON.stringify({ message: "Invalid token" }),
    };
  }

  await connectToDatabase();
  const brandRepository = new BrandRepository();
  const brandService = new BrandService(brandRepository);
  const brandUseCases = new BrandUseCases(brandService);

  try {
    switch (event.requestContext.http.method) {
      case GET:
        if (event.pathParameters) {
          const pathValidationResult = getBrandBody.safeParse({
            id: event.pathParameters.brandId,
          });
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
            statusCode: HTTP_OK,
            body: JSON.stringify(brand),
          };
        } else {
          const brands = await brandUseCases.findAllBrands();
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(brands),
          };
        }

      case POST: {
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
          statusCode: HTTP_CREATED,
          body: JSON.stringify(newBrand),
        };
      }

      case PUT: {
        const payload = JSON.parse(event.body ?? "{}");
        let updatedBrand;

        if (!event.pathParameters || !event.pathParameters.brandId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Brand ID is required in the path",
            }),
          };
        }

        const validationResult = updateBrandBodySchema.safeParse({
          id: event.pathParameters.brandId,
          name: payload.name,
        });

        if (validationResult.success) {
          updatedBrand = await brandUseCases.updateBrand(
            event.pathParameters.brandId,
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
          statusCode: HTTP_OK,
          body: JSON.stringify(updatedBrand),
        };
      }

      case DELETE: {
        if (!event.pathParameters || !event.pathParameters.brandId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Brand ID is required in the path",
            }),
          };
        }

        const pathValidationResult = removeBrandBody.safeParse({
          id: event.pathParameters.brandId,
        });

        if (!pathValidationResult.success) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Invalid or missing brand ID",
              errors: pathValidationResult.error.issues,
            }),
          };
        }

        const brandId = pathValidationResult.data.id;

        try {
          await brandUseCases.removeBrand(brandId);
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify({
              id: brandId,
              message: "Brand removed successfully",
            }),
          };
        } catch (error) {
          return {
            statusCode: HTTP_INTERNAL_SERVER_ERROR,
            body: JSON.stringify({
              message: "An error occurred while removing the brand",
            }),
          };
        }
      }

      default:
        return {
          statusCode: HTTP_BAD_REQUEST,
          body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }
  } catch (error) {
    return {
      statusCode: HTTP_INTERNAL_SERVER_ERROR,
      body: JSON.stringify({
        message: error instanceof Error ? error.message : "Server error",
      }),
    };
  }
}
