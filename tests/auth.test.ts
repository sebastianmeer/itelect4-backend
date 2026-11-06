import type { Server } from "node:http";
import { app } from "../src/app.js";

describe("response authorization", () => {
  it("rejects response collection access without a bearer token", async () => {
    const server = await new Promise<Server>((resolve) => {
      const instance = app.listen(0, () => resolve(instance));
    });
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Test server did not bind.");
    const response = await fetch(`http://127.0.0.1:${address.port}/api/responses`);
    server.close();
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({ error: "unauthorized" });
  });
});
