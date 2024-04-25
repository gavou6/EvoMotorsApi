import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { connectToDatabase } from "../../../../shared/utils/db-connection";
import { FileService } from "../../../../core/domain/services/FileService";
import { FileUseCases } from "../../../../core/application/use_cases/FileUseCases";
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
  PATCH,
  POST,
} from "../../../../shared/constants";
import { FileRepository } from "../../../persistence/repositories/FileRepository";
import { decodeToken } from "../../../../shared/utils/userDecoder";
import { CUSTOMER_ROLE } from "../../../../shared/constants/roles";
import { IIdToken } from "../../../security/Auth";
import { CombustionType, EngineType } from "../../../../shared/enums";

const createFileBodySchema = z.object({
  name: z.string(),
  brandId: z.string(),
  year: z.string().refine((val) => /^\d{4}$/.test(val), {
    message: "Year must be a four-digit number",
  }),
  engineSize: z.string(),
  cylinder: z.number().positive(),
  combustion: z.nativeEnum(CombustionType),
  engineType: z.nativeEnum(EngineType),
  files: z.array(z.string()).optional(),
});

const updateFileBodySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  brandId: z.string().optional(),
  year: z
    .string()
    .regex(/^\d{4}$/, "Year must be a four-digit number")
    .optional(),
  engineSize: z.string().optional(),
  cylinder: z.number().positive().optional(),
  combustion: z.nativeEnum(CombustionType).optional(),
  engineType: z.nativeEnum(EngineType).optional(),
  files: z.array(z.string()).optional(),
});

const removeFileBody = z.object({
  id: z.string(),
});

const getFileBody = z.object({
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
  const carModelRepository = new FileRepository();
  const carModelService = new FileService(carModelRepository);
  const carModelUseCases = new FileUseCases(carModelService);

  try {
    switch (event.requestContext.http.method) {
      case GET:
        if (event.pathParameters) {
          const pathValidationResult = getFileBody.safeParse({
            id: event.pathParameters.carModelId,
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

          const carModels = await carModelUseCases.getFile(
            pathValidationResult.data.id,
          );
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(carModels),
          };
        } else {
          const carModels = await carModelUseCases.findAllFiles();
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(carModels),
          };
        }

      case POST: {
        const payload = JSON.parse(event.body ?? "{}");
        const validationResult = createFileBodySchema.safeParse(payload);
        let newFile;
        if (validationResult.success) {
          newFile = await carModelUseCases.createFile(payload);
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
          body: JSON.stringify(newFile),
        };
      }

      case PATCH: {
        const payload = JSON.parse(event.body ?? "{}");
        let updatedFile;

        if (!event.pathParameters || !event.pathParameters.carModelId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Car Model ID is required in the path",
            }),
          };
        }

        const validationResult = updateFileBodySchema.safeParse({
          ...payload,
          id: event.pathParameters.carModelId,
        });

        if (validationResult.success) {
          updatedFile = await carModelUseCases.updateFile(
            event.pathParameters.carModelId,
            payload,
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
          body: JSON.stringify(updatedFile),
        };
      }

      case DELETE: {
        if (!event.pathParameters || !event.pathParameters.carModelId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Car Model ID is required in the path",
            }),
          };
        }

        const pathValidationResult = removeFileBody.safeParse({
          id: event.pathParameters.carModelId,
        });

        if (!pathValidationResult.success) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Invalid or missing Car Model ID",
              errors: pathValidationResult.error.issues,
            }),
          };
        }

        const carModelId = pathValidationResult.data.id;

        try {
          await carModelUseCases.removeFile(carModelId);
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify({
              id: carModelId,
              message: "Car Model removed successfully",
            }),
          };
        } catch (error) {
          return {
            statusCode: HTTP_INTERNAL_SERVER_ERROR,
            body: JSON.stringify({
              message: "An error occurred while removing the car model",
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
