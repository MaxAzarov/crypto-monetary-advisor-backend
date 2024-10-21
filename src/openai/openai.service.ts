import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { MonobankService } from 'src/monobank/monobank.service';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(private readonly monobankService: MonobankService) {
    this.openai = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] });
  }

  async askQuestion(userId: number, question: string): Promise<string> {
    const clients = await this.monobankService.findOneMonobankClients(userId);

    const clientInfos = await Promise.all(
      clients.map((client) => this.monobankService.getClientInfo(client.id)),
    );

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `User Profile: ${JSON.stringify(clientInfos)}`,
        },
        { role: 'user', content: question },
      ],
    });

    return response.choices[0].message.content;
  }
}
