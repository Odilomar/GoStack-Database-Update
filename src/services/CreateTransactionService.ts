/* eslint-disable prettier/prettier */
import { getRepository, getCustomRepository, Like } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface TransectionResponse {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: TransectionResponse): Promise<Transaction> {
    const categoryRepository = getRepository(Category);

    let checkCategoryExists = await categoryRepository.findOne({
      where: {
        title: Like(`%${category}%`),
      },
    });

    if (!checkCategoryExists) {
      const newCategory = categoryRepository.create({
        title: category,
      });

      checkCategoryExists = await categoryRepository.save(newCategory);
    }

    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      const balance = await transactionsRepository.getBalance();

      if (value > balance.total) {
        throw new AppError('string', 400);
      }
    }

    const newTransaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: checkCategoryExists.id,
    });

    await transactionsRepository.save(newTransaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
