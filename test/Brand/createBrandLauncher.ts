import { handler } from "../../src/infrastructure/web/routes/Brand/handler";

handler(
  {
    httpMethod: "POST",
    headers: {
      IdToken: "",
      Authorization: "",
    },
    body: JSON.stringify({
      name: "Audi",
    }),
  } as any,
  {} as any,
);
