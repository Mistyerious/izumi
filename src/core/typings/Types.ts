import type { MessageOptions } from 'discord.js';
import { MessageMentionOptions } from 'discord.js';

export type EmbedMessageTypes = (MessageOptions & { split?: false }) | MessageMentionOptions;
