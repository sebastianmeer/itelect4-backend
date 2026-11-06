import type { Server } from "node:http";
import { app } from "../src/app.js";

describe("health endpoint", () => {
  it("returns a safe service status without database secrets", async () => {
    const server = await new Promise<Server>((resolve) => {
      const instance = app.listen(0, () => resolve(instance));
    });
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Test server did not bind.");
    const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
    const body = await response.json();
    server.close();

    expect(response.status).toBe(200);
    expect(body).toEqual({ status: "ok", service: "orbit-api" });
    expect(JSON.stringify(body)).not.toContain("MONGODB");
  });
});
