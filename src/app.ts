import 'dotenv/config';
import Express, { Response } from 'express';
import { InteractionResponseType, InteractionType } from 'discord-interactions';
import { VerifyDiscordRequest } from './utils';
import { TypedRequestBody } from './types/express';

const app: Express.Application = Express();
const PORT = process.env.PORT || 3000;
if (typeof process.env.PUBLIC_KEY === 'undefined') {
  throw new Error('PUBLIC KEY is undefined');
}
app.use(Express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// const activeGames = {};

app.post(
  '/interactions',
  (
    req: TypedRequestBody<{
      type: number;
      id: string;
      data: { name: string };
    }>,
    res: Response,
  ) => {
    const { type, /* id, */ data } = req.body;

    switch (type) {
      case InteractionType.PING: {
        return res.send({ type: InteractionResponseType.PONG });
        break;
      }
      case InteractionType.APPLICATION_COMMAND: {
        const { name } = data;
        if (name === 'test') {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: 'Hello World!',
            },
          });
        }
        return undefined;
        break;
      }
      default: {
        return undefined;
        break;
      }
    }
  },
);

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
