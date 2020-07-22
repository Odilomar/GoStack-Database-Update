/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
import { promises as fs } from 'fs';
import path from 'path';
import neatCsv from 'neat-csv';

import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface TransactionCSV extends TransactionResponse {
  value: number;
  category: string;
}

interface TransactionResponse {
  title: string;
  type: 'income' | 'outcome';
}

class ImportTransactionsService {
  public async execute(filename: string): Promise<TransactionResponse[]> {
    const createTransactionService = new CreateTransactionService();
    const transactions: TransactionResponse[] = [];

    const filePath = path.join(uploadConfig.directory, filename);
    const fileBuffer = await fs.readFile(filePath);
    const parsedData = await neatCsv<TransactionCSV>(
      fileBuffer.toString().replace(/(,[ ])/g, ','),
    );

    const importedCSVFile = parsedData;
    console.log(parsedData);

    // eslint-disable-next-line no-restricted-syntax
    for (const transactionParsedData of importedCSVFile) {
      const { title, value, type, category } = transactionParsedData;

      // eslint-disable-next-line no-await-in-loop
      await createTransactionService.execute({
        title,
        value: Number(value),
        type,
        category,
      });

      transactions.push({ title, type });
    }

    return transactions;
  }
}

export default ImportTransactionsService;
