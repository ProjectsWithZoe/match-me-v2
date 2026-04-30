import { app } from "../app.js";

let ready: Promise<unknown> | undefined;

export default async function handler(request: any, reply: any) {
  ready ??= Promise.resolve(app.ready());
  await ready;
  app.server.emit("request", request, reply);
}
