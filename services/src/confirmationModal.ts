import { ModalView } from "@slack/bolt";

export function confirmationModal(
  title: string,
  description: string
): ModalView {
  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: title,
      emoji: true,
    },
    close: {
      type: "plain_text",
      text: "Ok",
      emoji: true,
    },
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: description,
        },
      },
    ],
  };
}
