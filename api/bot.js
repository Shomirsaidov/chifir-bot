// api/bot.js  (for Vercel /api/bot endpoint)

const TELEGRAM_API = "https://api.telegram.org";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    try {
        const update = req.body;

        // Handle only messages; ignore other update types for simplicity
        const message = update.message || update.edited_message;
        if (!message) {
            return res.status(200).json({ ok: true });
        }

        const chatId = message.chat.id;

        // TODO: fill these with real values later
        const BOT_TOKEN = process.env.BOT_TOKEN;          // put your token in Vercel env
        const MINI_APP_URL = process.env.MINI_APP_URL;    // URL of your Mini App

        const text = "Open the mini app using the button below:";

        // Inline keyboard button that opens a Web App (Mini App)
        const replyMarkup = {
            inline_keyboard: [
                [
                    {
                        text: "Open Mini App",
                        web_app: { url: MINI_APP_URL }
                    }
                ]
            ]
        };

        const sendMessageUrl = `${TELEGRAM_API}/bot${BOT_TOKEN}/sendMessage`;

        await fetch(sendMessageUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                reply_markup: replyMarkup
            })
        });

        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error(err);
        return res.status(200).json({ ok: true }); // reply OK so Telegram doesn't retry forever
    }
}
