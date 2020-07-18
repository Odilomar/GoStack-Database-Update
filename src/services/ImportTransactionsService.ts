/* eslint-disable prettier/prettier */
import fs from 'fs';
import csv from 'csv-parse';
import path from 'path';
import neatCsv from 'neat-csv';

import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';
import parse from 'csv-parse';

interface TransactionCSV {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  public async execute(filename: string): Promise<Transaction[]> {
    // const createTransactionService = new CreateTransactionService();
    const transactions: Transaction[] = [];
    // const importedCSVFile: TransactionCSV[] = [];
    const filePath = path.join(uploadConfig.directory, filename);

    fs.readFile(filePath, async (error, data) => {
      await neatCsv(data).then((parsedData) => console.log(parsedData));
    })

    // await fs.createReadStream(filePath)
    //   .pipe(csv({ columns: true }))
    //   .on('data', (row: TransactionCSV) => importedCSVFile.push(row))
    //   .on('end', () => {
    //     importedCSVFile.map(async csvRow => {
    //       const { title, category, type, value } = csvRow;

    //       // console.log(title);

    //       const transaction = await createTransactionService.execute({
    //         title,
    //         category,
    //         type,
    //         value,
    //       });

    //       transactions.push(transaction);

    //       console.log(transaction);
    //     });
    //   });

    return transactions;
  }
}

export default ImportTransactionsService;
