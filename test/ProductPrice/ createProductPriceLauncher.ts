import { handler } from "../../src/infrastructure/web/routes/Product/handler";

handler(
  {
    requestContext: {
      http: {
        method: "POST",
      },
    },
    headers: {
      idtoken: "",
      Authorization: "",
    },
    body: JSON.stringify({}),
  } as any,
  {} as any,
);
