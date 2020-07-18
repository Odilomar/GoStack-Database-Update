/* eslint-disable prettier/prettier */
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const deletedTransaction = await transactionsRepository.findOne({
      where: {
        id,
      },
    });

    if (!deletedTransaction) {
      throw new AppError('Transaction not found', 404);
    }

    await transactionsRepository.remove(deletedTransaction);
  }
}

export default DeleteTransactionService;
