import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { connectToDatabase } from "../../../../shared/utils/db-connection";
import { ReceiptService } from "../../../../core/domain/services/ReceiptService";
import { ReceiptUseCases } from "../../../../core/application/use_cases/ReceiptUseCases";
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
import { ReceiptRepository } from "../../../persistence/repositories/ReceiptRepository";
import { decodeToken } from "../../../../shared/utils/userDecoder";
import { CUSTOMER_ROLE } from "../../../../shared/constants/roles";
import { IIdToken } from "../../../security/Auth";


const createReceiptBodySchema = z.object({
  _id: z.string(),
  userId: z.string(),
  productId: z.string(),
  installationTime: z.date().optional(),
  reviewVehicleStart: z.number().optional(),
  reviewVehicleResponse: z.number().optional(),
  reviewFunctionality: z.number().optional(),
  reviewService: z.number().optional(),
  reviewTime: z.number().optional(),
  reviewRecommendation: z.number().optional(),
  discount: z.string().optional(),
  date: z.date().optional(),
  finalPrice: z.number().optional(),
  arriveTime: z.date().optional(),
});

const updateReceiptBodySchema = z.object({
  _id: z.string(),
  userId: z.string().optional(),
  productId: z.string().optional(),
  installationTime: z.date().optional(),
  reviewVehicleStart: z.number().optional(),
  reviewVehicleResponse: z.number().optional(),
  reviewFunctionality: z.number().optional(),
  reviewService: z.number().optional(),
  reviewTime: z.number().optional(),
  reviewRecommendation: z.number().optional(),
  discount: z.string().optional(),
  date: z.date().optional(),
  finalPrice: z.number().optional(),
  arriveTime: z.date().optional(),
});

const removeReceiptBody = z.object({
  id: z.string(),
});

const getReceiptBody = z.object({
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
  const receiptRepository = new ReceiptRepository();
  const receiptService = new ReceiptService(receiptRepository);
  const receiptUseCases = new ReceiptUseCases(receiptService);

  try {
    switch (event.requestContext.http.method) {
      case GET:
        if (event.pathParameters) {
          const pathValidationResult = getReceiptBody.safeParse({
            id: event.pathParameters.receiptId,
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

          const receipts = await receiptUseCases.getReceipt(
            pathValidationResult.data.id,
          );
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(receipts),
          };
        } else {
          const receipts = await receiptUseCases.findAllReceipts();
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify(receipts),
          };
        }

      case POST: {
        const payload = JSON.parse(event.body ?? "{}");
        const validationResult = createReceiptBodySchema.safeParse(payload);
        let newReceipt;
        if (validationResult.success) {
          newReceipt = await receiptUseCases.createReceipt(payload);
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
          body: JSON.stringify(newReceipt),
        };
      }

      case PATCH: {
        const payload = JSON.parse(event.body ?? "{}");
        let updatedReceipt;

        if (!event.pathParameters || !event.pathParameters.receiptId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Receipt ID is required in the path",
            }),
          };
        }

        const validationResult = updateReceiptBodySchema.safeParse({
          ...payload,
          id: event.pathParameters.receiptId,
        });

        if (validationResult.success) {
          updatedReceipt = await receiptUseCases.updateReceipt(
            event.pathParameters.receiptId,
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
          body: JSON.stringify(updatedReceipt),
        };
      }

      case DELETE: {
        if (!event.pathParameters || !event.pathParameters.receiptId) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Receipt ID is required in the path",
            }),
          };
        }

        const pathValidationResult = removeReceiptBody.safeParse({
          id: event.pathParameters.receiptId,
        });

        if (!pathValidationResult.success) {
          return {
            statusCode: HTTP_BAD_REQUEST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: "Invalid or missing Receipt ID",
              errors: pathValidationResult.error.issues,
            }),
          };
        }

        const receiptId = pathValidationResult.data.id;

        try {
          await receiptUseCases.removeReceipt(receiptId);
          return {
            statusCode: HTTP_OK,
            body: JSON.stringify({
              id: receiptId,
              message: "Receipt removed successfully",
            }),
          };
        } catch (error) {
          return {
            statusCode: HTTP_INTERNAL_SERVER_ERROR,
            body: JSON.stringify({
              message: "An error occurred while removing the receipt",
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
