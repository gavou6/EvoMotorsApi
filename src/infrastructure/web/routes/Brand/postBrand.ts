import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { z } from "zod";
import Brand, {
  BrandInput,
} from "../../../../core/infrastructure/persistence/models/Brand.model";
import { HTTP_BAD_REQUEST, HTTP_CREATED } from "../../../../shared/constants";

const createBrandBodySchema = z.object({
  name: z.string(),
});

export async function postBrand(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;

  const payload = JSON.parse(event.body ?? "{}");
  const validationResult = createBrandBodySchema.safeParse(payload);

  if (validationResult.success) {
    const { data } = validationResult;
    const brandInput: BrandInput = {
      name: data.name,
    };

    const [createdPost] = await Brand.create([brandInput]);

    return {
      statusCode: HTTP_CREATED,
      headers: { "Content-Type": "text/json" },
      body: JSON.stringify(createdPost),
    };
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
}
