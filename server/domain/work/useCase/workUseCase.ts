import { LoadingWorkEntity } from 'api/@types/work';
import { transaction } from 'service/prismaClient';
import { workMEthod } from '../model/workMethod';
import { novelQuery } from '../repository/novelQuery';
import { workCommand } from '../repository/workCommand';

export const workUseCase = {
  create: (novelUrl: string): Promise<LoadingWorkEntity> =>
    transaction('RepeatableRead', async (tx) => {
      const { title, author } = await novelQuery.scrape(novelUrl);
      const loadingWork = workMEthod.create({ novelUrl, title, author });

      await workCommand.save(tx, loadingWork);

      return loadingWork;
    }),
};
