/* eslint-disable prettier/prettier */
/* eslint-disable no-param-reassign */
import {
  EntityRepository,
  Repository,
  getCustomRepository,
  getRepository,
} from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionsWithCategory {
  id: string;
  title: string;
  value: number;
  type: string;
  category: Category;
  created_at: Date;
  updated_at: Date;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const allTransactions = await transactionsRepository.find();

    const initReducedBalance: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    const reducedBalance = allTransactions.reduce((prev, cur) => {
      const key = cur.type;

      if (!prev[key]) {
        prev[key] = 0;
      }

      prev[key] += cur.value;

      return prev;
    }, initReducedBalance);

    const { income, outcome } = reducedBalance;
    const total = income - outcome;
    const resultBalance: Balance = { income, outcome, total };

    return resultBalance;
  }
}

export default TransactionsRepository;
