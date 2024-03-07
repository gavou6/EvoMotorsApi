import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { connectToDatabase } from "../../utils/db-connection";
import { getBrands } from "./getBrands";
import { postBrand } from "./postBrand";

async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;

  await connectToDatabase();

  let message: string;

  try {
    switch (event.httpMethod) {
      case "GET":
        const brands = await getBrands(event, context);
        return brands;
      case "POST":
        const postResponse = await postBrand(event, context);
        return postResponse;
      default:
        break;
    }
  } catch (error: any) {
    return {
      statusCode: 500,
      body: error.message,
    };
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(""),
  };

  return response;
}

export { handler };
