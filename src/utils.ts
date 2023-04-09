import 'dotenv/config';
import fetch, { RequestInit, BodyInit } from 'node-fetch';
import { verifyKey } from 'discord-interactions';
import { Request, Response } from 'express';

export function VerifyDiscordRequest(clientKey: string) {
  return (req: Request, res: Response, buf: Buffer) => {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');
    if (typeof signature === 'undefined') {
      throw new Error('Signature is not defined');
    }
    if (typeof timestamp === 'undefined') {
      throw new Error('Time stamp is undefined');
    }
    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };
}

export async function DiscordRequest(
  endpoint: string,
  o: RequestInit | undefined,
) {
  const url = `https://discord.com/api/v10/${endpoint}`;
  const options = o;
  if (options?.body) {
    options.body = JSON.stringify(options.body);
  }
  if (typeof process.env.DISCORD_TOKEN === 'undefined') {
    throw new Error('DISCORD TOKEN is undefined');
  }
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent':
        'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options,
  });
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  return res;
}

export async function InstallGlobalCommands(appId: string, commands: BodyInit) {
  const endpoint = `applications/${appId}/commands`;

  try {
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (error) {
    console.error(error);
  }
}
