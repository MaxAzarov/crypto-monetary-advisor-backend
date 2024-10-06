import { Body, Controller, Post } from '@nestjs/common';

import { OpenAIService } from './openai.service';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openAIService: OpenAIService) {}

  @Post('ask')
  async askCryptoQuestion(
    @Body('question') question: string,
  ): Promise<{ answer: string }> {
    const answer = await this.openAIService.askQuestion(question);
    return { answer };
  }
}
