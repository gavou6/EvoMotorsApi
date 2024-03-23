import { handler } from "../../src/infrastructure/web/routes/Brand/handler";

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
