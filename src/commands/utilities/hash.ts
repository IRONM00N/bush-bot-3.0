import crypto from 'crypto';
import got from 'got';
import { BushCommand, BushMessage } from '../../lib';

export default class HashCommand extends BushCommand {
	public constructor() {
		super('hash', {
			aliases: ['hash'],
			category: 'utilities',
			description: {
				content: 'Gets the file hash of the given discord link',
				usage: 'hash <file url>',
				examples: ['hash https://cdn.discordapp.com/emojis/782630946435366942.png?v=1'] //nice
			},
			args: [
				{
					id: 'url',
					type: 'url',
					prompt: {
						start: 'What url would you like to find the hash of?',
						retry: '{error} Enter a valid url.'
					}
				}
			],
			clientPermissions: ['SEND_MESSAGES']
		});
	}

	public override async exec(message: BushMessage, { url }: { url: string }): Promise<void> {
		try {
			const req = await got.get(url);
			const rawHash = crypto.createHash('md5');
			rawHash.update(req.rawBody.toString('binary'));
			const hash = rawHash.digest('hex');
			await message.util.reply(`\`${hash}\``);
		} catch {
			await message.util.reply('Unable to calculate hash.');
		}
	}
}
