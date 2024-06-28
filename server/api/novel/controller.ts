import { novelUseCase } from 'domain/novel/usecase/novelUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({ status: 200, body: 'Hello' }),
  post: async ({ body }) => ({ status: 200, body: await novelUseCase.scrape(body.aozoraUrl) }),
}));
