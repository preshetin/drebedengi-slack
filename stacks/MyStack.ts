import { StackContext, Api } from "sst/constructs";

export function API({ stack }: StackContext) {
  const api = new Api(stack, "api", {
    routes: {
      "GET /hello": "services/src/handler.hello",
      "POST /slack/events": "services/src/main.handler",
      "GET /remind_to_fill_in": "services/src/remind.handler",
    },
  });
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
