import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface TransectionResponse {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: TransectionResponse): Promise<Transaction> {
    // const categoryRepository = Categories
  }
}

export default CreateTransactionService;
