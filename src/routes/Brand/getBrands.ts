import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import {
  HTTP_BAD_REQUEST,
  HTTP_CREATED,
  HTTP_NOT_FOUND,
  HTTP_OK,
} from "../../constants";
import { connectToDatabase } from "../../utils/db-connection";

export async function getBrands(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;

  await connectToDatabase();
  try {
    return {
      statusCode: HTTP_CREATED,
      body: JSON.stringify(""),
    };
  } catch (error) {
    console.error("Error processing request:", error);
    return {
      statusCode: HTTP_BAD_REQUEST,
      body: JSON.stringify("An error occurred processing your request"),
    };
  }
}
