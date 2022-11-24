import { App } from "@slack/bolt";
import { buildExpenseModalView, expenseAcknowledgeModalView } from "./expense";
import { incomeModalView } from "./incomeModal";
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
import { balanceModalView } from "./balance";
import { moveMessage } from "./moveMessage";
import { MoveFormResult } from "./moveFormResultInterface";
import menu from "./menu";
import { moveModalView } from "./move";
import {confirmationModal} from "./confirmationModal";

export function registerListeners(app: App) {
  customMiddleware.enableAll(app);

  app.command("/drebedengi", async ({ body, client, logger, ack }) => {
    await ack();

    try {
      const mes = menu.message();

      await client.views.open({
        trigger_id: body.trigger_id,
        view: {
          type: "modal",
          callback_id: "menu",
          title: {
            type: "plain_text",
            text: "Дребеденьги",
          },
          blocks: mes.blocks ? mes.blocks : [],
        },
      });

      //   await client.chat.postEphemeral({
      //     channel: process.env.NOTIFICATION_CHANNEL_ID as string,
      //     user: body.user_id,
      //     ...mes,
      //   });
    } catch (e) {
      logger.error(
        `Failed to publish a view for user: (response: ${JSON.stringify(e)})`,
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
          const expenseModal = await buildExpenseModalView();
          await client.views.push({
            trigger_id: body.trigger_id,
            // view_id: body.view!.id,
            view: expenseModal,
          });
          break;
        case "menu_action_income":
          const incomeModal = await incomeModalView();
          await client.views.push({
            trigger_id: body.trigger_id,
            // view_id: body.view!.id,
            view: incomeModal,
          });
          break;
        case "menu_action_move":
          const moveModal = await moveModalView();
          await client.views.push({
            trigger_id: body.trigger_id,
            // view_id: body.view!.id,
            view: moveModal,
          });
          break;
        case "menu_action_balance":
          const modal = await balanceModalView();
          await client.views.push({
            trigger_id: body.trigger_id,
            // view_id: body.view!.id,
            view: modal,
          });

          break;
        default:
          throw new Error(`No such action: ${action.action_id}`);
      }
    }
  );

  app.action(
    { type: "block_actions", action_id: "link-button" },
    async ({ ack }) => {
      await ack();
    }
  );

  app.shortcut("drebedengi", async ({ body, client, logger, ack }) => {
    await ack();
    try {
      const mes = menu.message();
      await client.views.open({
        trigger_id: body.trigger_id,
        view: {
          type: "modal",
          callback_id: "menu",
          title: {
            type: "plain_text",
            text: "Дребеденьги",
          },
          blocks: mes.blocks ? mes.blocks : [],
        },
      });
    } catch (e) {
      logger.error(
        `Failed to publish a view for user: (response: ${JSON.stringify(e)})`,
        e
      );
    }
  });

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
        response_action: "update",
        view: confirmationModal("Дребеденьги", ":white_check_mark: Расход внесен")
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

      await ack({
        response_action: "update",
        view: confirmationModal("Дребеденьги", ":white_check_mark: Доход внесен")
      });

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

      await ack({
        response_action: "update",
        view: confirmationModal("Дребеденьги", ":white_check_mark: Перемещение внесено")
      });

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
    { type: "block_actions", action_id: "places_info_confirmed" },
    async ({ client, ack, body }) => {
      await ack();

      await client.chat.postMessage({
        channel: "C03EW7TQKFB", // debug-private channel in Vipassana Minsk workspace
        //   channel: "C8CPP6DND", // #general channel in Bonanza 88 workspace
        text: `<@${body.user.id}> только что подтвердил актуальность данных в своих кошельках.`,
      });

      //   await axios.post(body.response_url, {
      //     replace_original: true,
      //     text: 'all good'
      //   })

      await client.chat.postMessage({
        channel: body.user.id,
        text: ":white_check_mark: Вы отметили, что данные верны",
      });
    }
  );
}
