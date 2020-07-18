/* eslint-disable prettier/prettier */
import fs from 'fs';
import csv from 'csv-parse';
import path from 'path';

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
    const importedCSVFile: TransactionCSV[] = [];
    const filePath = path.join(uploadConfig.directory, filename);

    fs.createReadStream(filePath)
      .pipe(csv({ columns: true }))
      .on('data', (data: TransactionCSV) => importedCSVFile.push(data))
      .on('end', () => {
        importedCSVFile.map(async csvData => {
          const { title, category, type, value } = csvData;
          const transaction = await createTransactionService.execute({
            title,
            category,
            type,
            value,
          });
          transactions.push(transaction);
        });
        console.log(transactions);
      });

    console.log(transactions);

    return transactions;
  }
}

export default ImportTransactionsService;
