import { StackContext, Api } from "@serverless-stack/resources";

export function DrebedengiSlackStack({ stack }: StackContext) {
  const api = new Api(stack, "api", {
    routes: {
      "GET /hello": "src/handler.hello",
      "POST /slack/events": "src/main.handler",
      "GET /remind_to_fill_in": "src/remind.handler"
    },
  });
  stack.addOutputs({
    ApiEndpoint: api.url
  });
}
