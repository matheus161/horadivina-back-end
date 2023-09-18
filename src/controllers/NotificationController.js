import { User } from "../models/User";
import mailer from "../lib/mailer";
import notification from "../constants/email_body/notification";

async function notify(req, res) {
  try {
    const { usersId, subject, text } = req.body;

    const usersInfo = [];
    for (const userId of usersId) {
      const user = await User.findById(userId);
      if (user.email) {
        usersInfo.push({
          id: user._id,
          email: user.email,
        });
      }
    }

    for (const user of usersInfo) {
      mailer.sendMail({
        from: "Hora Divina <teteucoroinha@hotmail.com>",
        to: user.email,
        subject: subject,
        text: text,
        html: notification(subject, text),
      });
    }

    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({
      mensage: "Erro interno do servidor, tente novamente mais tarde",
    });
  }
}

export default { notify };
