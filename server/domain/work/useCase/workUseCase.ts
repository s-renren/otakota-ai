import { LoadingWorkEntity } from 'api/@types/work';
import { transaction } from 'service/prismaClient';
import { workMEthod } from '../model/workMethod';
import { workCommand } from '../repository/workCommand';

export const workUseCase = {
  create: (novelUrl: string, title: string, author: string): Promise<LoadingWorkEntity> =>
    transaction('RepeatableRead', async (tx) => {
      const loadingWork = workMEthod.create({ novelUrl, title, author });

      await workCommand.save(tx, loadingWork);

      return loadingWork;
    }),
};
