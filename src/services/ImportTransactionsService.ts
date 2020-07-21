/* eslint-disable prettier/prettier */
import { promises as fs } from 'fs';
import path from 'path';
import neatCsv from 'neat-csv';

import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface TransactionCSV {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  public async execute(filename: string): Promise<Transaction[]> {
    const createTransactionService = new CreateTransactionService();
    const transactions: Transaction[] = [];

    const filePath = path.join(uploadConfig.directory, filename);
    const fileBuffer = await fs.readFile(filePath);
    const parsedData = await neatCsv<TransactionCSV>(
      fileBuffer.toString().replace(/[ ]/g, ''),
    );

    const importedCSVFile = parsedData;
    await importedCSVFile.map(async transactionParsedData => {
      const { title, value, type, category } = transactionParsedData;

      const transaction = await createTransactionService.execute({
        title,
        value,
        type,
        category,
      });

      transactions.push(transaction);
    });

    console.log(transactions);

    return transactions;
  }
}

export default ImportTransactionsService;
