import { handler } from "../../src/infrastructure/web/routes/Product/handler";

handler(
  {
    pathParameters: {
      productPriceId: "",
    },
    headers: {
      idtoken: "",
      Authorization: "",
    },
    requestContext: {
      http: {
        method: "GET",
      },
    },
  } as any,
  {} as any,
);
