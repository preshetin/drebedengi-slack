import { App } from "@slack/bolt";
import { openExpenseModal } from "./expenseModal";
import { openIncomeModal } from "./incomeModal";
import ddClient from "./ddClient";
import * as customMiddleware from "./customMiddleware";
import { ExpenseFormResult } from "./expenseFormResultInterface";
import IncomeFormResult from "./incomeFormResultInterface";
import {
  CreateExpenseParams,
  CreateIncomeParams,
  CreateMoveParams,
} from "./ts-ddng-client/src/messages/setRecordList";
import { expenseMessage } from "./expenseMessage";
import { incomeMessage } from "./incomeMessage";
import { openMoveModal } from "./moveModal";
import { openBalanceModal } from "./balanceModal";
import { moveMessage } from "./moveMessage";
import { MoveFormResult } from "./moveFormResultInterface";
import { menuMessage } from "./menuMessage";

export function registerListeners(app: App) {
  customMiddleware.enableAll(app);

  app.command("/drebedengi", async ({ body, client, logger, ack }) => {
    await ack();

    try {
      const mes = menuMessage();

      await client.chat.postEphemeral({
        channel: process.env.NOTIFICATION_CHANNEL_ID as string,
        user: body.user_id,
        ...mes,
      });
    } catch (e) {
      logger.error(
        `Failed to publish a view for user: (response: ${JSON.stringify(e)})`,
        e
      );
    }
  });

  app.action(
    { type: "block_actions", action_id: "link-button" },
    async ({ ack }) => {
      await ack();
    }
  );

  app.shortcut(
    "drebedengi-add-expense",
    async ({ body, client, logger, ack }) => {
      await ack();
      try {
        await openExpenseModal(client, body.trigger_id);
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
      const values = body.view.state.values as unknown as ExpenseFormResult;

      if (values && values.sum && isNaN(Number(values.sum.sum.value))) {
        await ack({
          response_action: "errors",
          errors: {
            sum: "Введите число. Для разделения копеек ипользуйте точку",
          },
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

      const commentArr: string[] = [
        values.comment.comment.value,
        `[введено ${body.user.name}]`,
        ...values.tags.tags.selected_options.map(
          (item) => `[${item.text.text}]`
        ),
      ];
      const comment = commentArr.join(" ");

      const createExpenseParams: CreateExpenseParams = {
        placeId: +values.placeId.placeId.selected_option.value,
        comment,
        sum: Math.floor(+values.sum.sum.value * 100),
        currencyId: +values.currencyId.currencyId.selected_option.value,
        categoryId: +values.categoryId.categoryId.selected_option.value,
      };

      if (typeof values.recordDate.recordDate.selected_date === "string") {
        createExpenseParams.dateTime =
          values.recordDate.recordDate.selected_date;
      }

      const createExpenseResult = await ddClient.createExpense(
        createExpenseParams
      );

      const mes = await expenseMessage(values, body.user.id);

      if (
        values.ignoreNotification.ignoreNotification.selected_options.length
      ) {
        await client.chat.postEphemeral({
          channel,
          user: body.user.id,
          text: "Трата добавлена",
        });
      } else {
        await client.chat.postMessage({ channel, ...mes });
      }
    } catch (e) {
      logger.error(
        `Failed to handle modal submit (response: ${JSON.stringify(e)})`,
        e
      );
    }
  });

  app.view("income-modal-submit", async ({ client, body, ack, logger }) => {
    try {
      const values = body.view.state.values as unknown as IncomeFormResult;

      logger.info("values of IncomeFormResult", JSON.stringify(values));

      if (values && values.sum && isNaN(Number(values.sum.sum.value))) {
        await ack({
          response_action: "errors",
          errors: {
            sum: "Введите число. Для разделения копеек ипользуйте точку",
          },
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

      await ack({ response_action: "clear" });

      const channel = process.env.NOTIFICATION_CHANNEL_ID
        ? process.env.NOTIFICATION_CHANNEL_ID
        : body.user.id;

      const createIncomeParams: CreateIncomeParams = {
        comment: values.comment.comment.value
          ? values.comment.comment.value
          : "",
        sum: Math.floor(+values.sum.sum.value * 100),
        placeId: +values.placeId.placeId.selected_option.value,
        sourceId: +values.sourceId.sourceId.selected_option.value,
        currencyId: +values.currencyId.currencyId.selected_option.value,
      };

      if (typeof values.recordDate.recordDate.selected_date === "string") {
        createIncomeParams.dateTime =
          values.recordDate.recordDate.selected_date;
      }

      const createIncomeResult = await ddClient.createIncome(
        createIncomeParams
      );
      logger.info("create Income Result", createIncomeResult);

      const mes = incomeMessage(values, body.user.id);

      await client.chat.postMessage({
        channel,
        ...mes,
      });
    } catch (e) {
      logger.error(
        `Failed to handle modal submit (response: ${JSON.stringify(e)})`,
        e
      );
    }
  });

  app.view("move-modal-submit", async ({ client, body, ack, logger }) => {
    try {
      const values = body.view.state.values as unknown as MoveFormResult;

      logger.info("values of MoveFormResult", JSON.stringify(values));

      if (values && values.sum && isNaN(Number(values.sum.sum.value))) {
        await ack({
          response_action: "errors",
          errors: {
            sum: "Введите число. Для разделения копеек ипользуйте точку",
          },
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

      await ack({ response_action: "clear" });

      const channel = process.env.NOTIFICATION_CHANNEL_ID
        ? process.env.NOTIFICATION_CHANNEL_ID
        : body.user.id;

      const createMoveParams: CreateMoveParams = {
        comment: values.comment.comment.value
          ? values.comment.comment.value
          : "",
        sum: Math.floor(+values.sum.sum.value * 100),
        placeId: +values.placeId.placeId.selected_option.value,
        fromPlaceId: +values.fromPlaceId.fromPlaceId.selected_option.value,
        currencyId: +values.currencyId.currencyId.selected_option.value,
      };

      if (typeof values.recordDate.recordDate.selected_date === "string") {
        createMoveParams.dateTime = values.recordDate.recordDate.selected_date;
      }

      const createMoveResult = await ddClient.createMove(createMoveParams);
      logger.info("create Move Result", createMoveResult);

      const mes = await moveMessage(values, body.user.id);

      await client.chat.postMessage({
        channel,
        ...mes,
      });
    } catch (e) {
      logger.error(
        `Failed to handle modal submit (response: ${JSON.stringify(e)})`,
        e
      );
    }
  });

  app.action(
    { type: "block_actions", action_id: /^menu_action_*/ },
    async ({ client, action, body, ack }) => {
      await ack();

      switch (action.action_id) {
        case "menu_action_expense":
          await openExpenseModal(client, body.trigger_id);
          break;
        case "menu_action_income":
          await openIncomeModal(client, body.trigger_id);
          break;
        case "menu_action_move":
          await openMoveModal(client, body.trigger_id);
          break;
        case "menu_action_balance":
          await openBalanceModal(client, body.trigger_id);
          break;
        default:
          throw new Error(`No such action: ${action.action_id}`);
      }
    }
  );
}
