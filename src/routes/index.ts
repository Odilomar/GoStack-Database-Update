/* eslint-disable prettier/prettier */
import { Router } from 'express';

import { getRepository } from 'typeorm';
import transactionsRouter from './transactions.routes';

import Category from '../models/Category';

const routes = Router();

routes.use('/transactions', transactionsRouter);

routes.get('/categories', async (request, response) => {
  const categoryRepository = getRepository(Category);

  const categories = await categoryRepository.find();

  return response.json(categories);
});

routes.delete('/categories', async (request, response) => {
  const categoryRepository = getRepository(Category);

  const categories = await categoryRepository.find();

  await Promise.all(
    categories.map(async category => {
      await categoryRepository.remove(category);
    }),
  );

  return response.status(204).send();
});

export default routes;
