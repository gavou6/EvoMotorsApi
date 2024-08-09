import { handler } from "../../src/infrastructure/web/routes/Receipt/handler";

handler(
  {
    httpMethod: "GET",
    pathParameters: {
      id: "",
    },
    headers: {
      IdToken: "",
      Authorization: "",
    },
  } as any,
  {} as any,
);
