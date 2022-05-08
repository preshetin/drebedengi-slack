import { App } from "@slack/bolt";
import * as simpleModal from "./expenseModal";
import * as simpleHomeTab from "./simpleHomeTab";
import ddClient from "../ddClient";
import * as customMiddleware from "./customMiddleware";
import sayBalanceMessage from "./sayBalanceMessage";
import { ExpenseFormResult } from "./expenseFormResultInterface";
import { CreateExpenseParams } from "../ts-ddng-client/src/messages/setRecordList";

export function registerListeners(app: App) {
  customMiddleware.enableAll(app);

  app.command(
    "/drebedengi-expense",
    async ({ body, client, logger, context, ack }) => {
      await ack();
      try {
        await simpleModal.openExpenseModal(client, body.trigger_id);
      } catch (e) {
        logger.error(
          `Failed to publish a view for user: (response: ${JSON.stringify(e)})`,
          e
        );
      }
    }
  );

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

  app.action(
    { type: "block_actions", action_id: "recordType" },
    async ({ ack }) => {
      await ack();
      console.log("UUUUPDATTTTTTING>.......");
    }
  );

  app.shortcut(
    "drebedengi-add-expense",
    async ({ body, client, logger, ack }) => {
      await ack();
      try {
        await simpleModal.openExpenseModal(client, body.trigger_id);
      } catch (e) {
        logger.error(
          `Failed to publish a view for user: (response: ${JSON.stringify(e)})`,
          e
        );
      }
    }
  );

  app.view("expense-modal-submit", async ({ client, body, ack, logger }) => {
    try {
      console.log(
        "expense-modal-submit",
        JSON.stringify(body.view.state.values)
      );
      const values = (body.view.state.values as unknown) as ExpenseFormResult;

      if (values && values.sum && isNaN(Number(values.sum.sum.value))) {
        await ack({
          response_action: "errors",
          errors: { sum: "Введите число. Для разделения копеек ипользуйте точку", },
        });
        return;
      }

      if (+values.sum.sum.value <= 0) {
        await ack({
          response_action: "errors",
          errors: { sum: "Число должно быть положительное" },
        });
        return;
      }

      await ack({
        response_action: "clear",
      });

      const channel = process.env.NOTIFICATION_CHANNEL_ID
        ? process.env.NOTIFICATION_CHANNEL_ID
        : body.user.id;

      const createExpenseParams: CreateExpenseParams = {
        placeId: +values.placeId.placeId.selected_option.value,
        comment: values.comment.comment.value + (new Date()).toISOString(),
        sum: Math.floor(+values.sum.sum.value * 100),
        currencyId: +values.currencyId.currencyId.selected_option.value,
        categoryId: +values.categoryId.categoryId.selected_option.value
      }

      if (typeof values.recordDate.recordDate.selected_date === 'string') {
        createExpenseParams.dateTime = values.recordDate.recordDate.selected_date
      }

      const createExpenseResult = await ddClient.createExpense(createExpenseParams)
      console.log('createExpenseResult', createExpenseResult)

      client.chat.postMessage({
        channel,
        text: `I'll be adding it to Drebedengi....`,
      });
    } catch (e) {
      logger.error(
        `Failed to handle modal submit (response: ${JSON.stringify(e)})`,
        e
      );
    }
  });
}
