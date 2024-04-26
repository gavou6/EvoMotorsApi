import { handler } from "../../src/infrastructure/web/routes/Product/handler";

handler(
  {
    requestContext: {
      http: {
        method: "GET",
      },
    },
    headers: {
      IdToken: "",
      Authorization: "",
    },
    body: JSON.stringify({}),
  } as any,
  {} as any,
);
