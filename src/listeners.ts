import { App } from "@slack/bolt";
import * as simpleModal from "./simpleModal";
import * as simpleHomeTab from "./simpleHomeTab";
import * as customMiddleware from "./customMiddleware";
import sayBalanceMessage from "./sayBalanceMessage";

export function registerListeners(app: App) {
  customMiddleware.enableAll(app);

  app.command(
    "/drebedengi-record",
    async ({ body, client, logger, context, ack }) => {
      await ack();
      try {
        await simpleModal.openModal(client, body.trigger_id);
      } catch (e) {
        logger.error(
          `Failed to publish a view for user: (response: ${JSON.stringify(e)})`,
          e
        );
      }
  });

  // app.message('foo', async ({body, message}) => {
  //   console.log('22222')
  // })

  app.event("app_mention", async ({ body, client, logger, context, say }) => {
    try {
      await sayBalanceMessage(say);
    } catch (e) {
      logger.error(e);
    }
  });

  app.action(
    { type: "block_actions", action_id: "link-button" },
    async ({ ack }) => {
      await ack();
    }
  );

  app.shortcut("drebedengi-add-record-shortcut", async ({ body, client, logger, ack }) => {
    await ack();
    try {
      await simpleModal.openModal(client, body.trigger_id);
    } catch (e) {
      logger.error(
        `Failed to publish a view for user: (response: ${JSON.stringify(e)})`,
        e
      );
    }
  });

  app.view("request-modal", async ({ body, ack, logger }) => {
    await ack();
    console.log('request-modal 5555 values', JSON.stringify(body.view.state.values))
    try {
      await simpleModal.notify(body);
    } catch (e) {
      logger.error(
        `Failed to handle modal submit (response: ${JSON.stringify(e)})`,
        e
      );
    }
  });
}
