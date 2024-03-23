import { handler } from "../../src/infrastructure/web/routes/Brand/handler";

handler(
  {
    httpMethod: "PUT",
    pathParameters: {
      id: "",
    },
    headers: {
      IdToken: "",
      Authorization: "",
    },
    body: JSON.stringify({
      name: "AUDI",
    }),
  } as any,
  {} as any,
);
