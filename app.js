import { GRPC as Cerbos } from "@cerbos/grpc";
import express from "express";
const app = express();
const port = 3000;

const createCerbosClient = (host, port) => {
  try {
    const client = new Cerbos(`${host}:${port}`, { tls: false });
    console.log("Cerbos client created successfully");
    return client;
  } catch (error) {
    console.error(`Failed to initialize Cerbos client: ${error}`);
    throw error;
  }
};

app.get("/", async (req, res) => {
  const cerbos = createCerbosClient(
    process.env.CERBOS_HOST,
    process.env.CERBOS_PORT
  );

  try {
    console.time("cerbos");
    const isAllowed = await cerbos.isAllowed({
      principal: {
        id: "someuser",
        roles: ["user"],
      },
      resource: {
        kind: "leave_request",
        id: "1",
      },
      action: "create",
    });
    res.send(`cerbos response: ${isAllowed}`);
    console.timeEnd("cerbos");
  } catch (e) {
    res.send(`failed: ${e}`);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
