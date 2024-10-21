import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { IJWTAuthorizedRequest } from 'src/common/types';

import { OpenAIService } from './openai.service';

@Controller('openai')
@UseGuards(JwtAuthGuard)
export class OpenaiController {
  constructor(private readonly openAIService: OpenAIService) {}

  @Post('ask')
  async askCryptoQuestion(
    @Request() { user }: IJWTAuthorizedRequest,
    @Body('question') question: string,
  ): Promise<{ answer: string }> {
    const answer = await this.openAIService.askQuestion(user.id, question);
    return { answer };
  }
}
