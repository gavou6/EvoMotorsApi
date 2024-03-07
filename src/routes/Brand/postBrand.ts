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
import { z } from "zod";
import Brand, { BrandInput } from "../../models/Brand.model";

const createBrandBodySchema = z.object({
  name: z.string(),
});

type CreatePostBodyInput = z.infer<typeof createBrandBodySchema>;

export async function postBrand(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;

  await connectToDatabase();

  const payload = JSON.parse(event.body ?? "{}");
  const validationResult = createBrandBodySchema.safeParse(payload);

  if (validationResult.success) {
    const { data } = validationResult;
    const brandInput: BrandInput = {
      name: data.name,
    };

    const [createdPost] = await Brand.create([brandInput]);

    return {
      statusCode: HTTP_OK,
      headers: { "Content-Type": "text/json" },
      body: JSON.stringify(createdPost),
    };
  } else {
    return {
      statusCode: HTTP_BAD_REQUEST,
      headers: { "Content-Type": "text/json" },
      // @ts-ignore
      body: JSON.stringify({
        message: "Invalid input data",
        errors: validationResult.error,
      }),
    };
  }
}
