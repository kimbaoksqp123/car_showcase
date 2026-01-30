import { Seeder } from '@jorgebodega/typeorm-seeding';
import { DataSource } from 'typeorm';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

const FLAG_ALL_TABLE = 'all';
const CSV_DIRECTORY = 'storages/data';

export default class ProdSeeder extends Seeder {
  private dataSource: DataSource;

  async run(dataSource: DataSource): Promise<any> {
    this.dataSource = dataSource;
    await this.readCsvData();
  }

  private isRegexTableName(tableName: string): boolean {
    return /^[a-zA-z0-9\_]+$/.test(tableName);
  }

  private async readCsvData() {
    const tableForce = this.tableRunForceByArgs();
    const tableVersion = await this.readTableVersion();
    
    // Get table order from version file (keys of tableVersion)
    const tableOrder = Object.keys(tableVersion);
    
    // Get all CSV files (except __version.csv)
    const files = fs.readdirSync(CSV_DIRECTORY)
      .filter(file => file.endsWith('.csv') && file !== '__version.csv');
    
    // Sort files based on table order from __version.csv
    const sortedFiles = this.sortFilesByTableOrder(files, tableOrder);
    
    for (const file of sortedFiles) {
      const tableName = path.parse(file).name;
      
      if (await this.isExistsDataInTable(tableName, tableForce, tableVersion)) {
        continue;
      }

      const csvContent = fs.readFileSync(path.join(CSV_DIRECTORY, file), 'utf8');
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      if (!records || records.length === 0) {
        continue;
      }

      console.log(`Seeding table: ${tableName}`);
      for (const record of records) {
        await this.insert(tableName, record, tableVersion);
      }
      console.log(`Finished seeding table: ${tableName}`);
    }
  }

  private sortFilesByTableOrder(files: string[], tableOrder: string[]): string[] {
    return files.sort((a, b) => {
      const tableNameA = path.parse(a).name;
      const tableNameB = path.parse(b).name;
      
      const indexA = tableOrder.indexOf(tableNameA);
      const indexB = tableOrder.indexOf(tableNameB);
      
      // If both tables are in the tableOrder array, sort by their index
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      // If only one table is in the tableOrder array, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // If neither table is in the tableOrder array, maintain their original order
      return 0;
    });
  }

  private async readTableVersion(): Promise<any> {
    const versionFile = path.join(CSV_DIRECTORY, '__version.csv');
    if (!fs.existsSync(versionFile)) {
      return {};
    }

    const csvContent = fs.readFileSync(versionFile, 'utf8');
    const records = parse(csvContent, {
      columns: false,
      skip_empty_lines: true,
      trim: true
    });

    const tableVersion = {};
    records.forEach(row => {
      if (row.length >= 2) {
        tableVersion[row[0]] = row[1];
      }
    });

    return tableVersion;
  }

  /**
   * false => run seeder
   * true => not run seeder
   *
   * @param tableName table check seeder
   * @param tableForce list table force run seeder
   * @returns
   */
  private async isExistsDataInTable(
    tableName: string,
    tableForce: string | Array<string>,
    tableVersion: any,
  ) {
    if (!this.isRegexTableName(tableName)) {
      return true;
    }

    // if include table force -> delete all data
    if (tableForce === FLAG_ALL_TABLE || tableForce.includes(tableName)) {
      await this.truncateTable(tableName);

      return false;
    }

    try {
      const firstItem = await this.dataSource.manager.query(
        `SELECT created_user_id FROM ${tableName} LIMIT 1`,
      );

      if (!firstItem || firstItem.length === 0) {
        return false;
      }

      if (
        Number(firstItem[0].created_user_id) === Number(tableVersion[tableName])
      ) {
        return true;
      }

      await this.truncateTable(tableName);
    } catch (error) {
      console.log(`Error checking table ${tableName}: ${error.message}`);
      return false;
    }

    return false;
  }

  private async insert(
    tableName: string,
    record: any,
    tableVersion: any,
  ) {
    const columns = Object.keys(record);
    const values = Object.values(record);
    
    if (columns.length === 0) {
      return;
    }

    let query = `INSERT INTO ${tableName} (`;
    let bindingsString = '';

    // Add original columns from CSV
    for (const column of columns) {
      query += `${column}, `;
      bindingsString += '?, ';
    }

    // Add standard tracking columns
    bindingsString += '?, ?, ?, ?';
    query += `created_user_id, created_at, updated_user_id, updated_at) values (${bindingsString});`;
    
    // Prepare final parameters array with all values
    const params = [
      ...values, 
      tableVersion[tableName] ?? 0, 
      new Date(), 
      0, 
      new Date()
    ];

    try {
      await this.dataSource.manager.query(query, params);
      console.info(`INSERT success: ${tableName} - ${JSON.stringify(record)}`);
    } catch (error) {
      console.error(`INSERT failed for ${tableName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * get list table run force: delete data table -> insert new
   */
  private tableRunForceByArgs(): Array<string> | string {
    const args = process.argv.slice(7);

    if (!args || !args.length) {
      return [];
    }

    let argTable: string = '';

    for (let i = 0; i <= args.length; i++) {
      if (!args[i]) {
        continue;
      }

      args[i] = args[i].trim();

      if (!args[i].startsWith('--table=')) {
        continue;
      }

      argTable = args[i].substring(8);
    }

    if (!argTable) {
      return [];
    }

    argTable = argTable.trim();

    if (argTable === FLAG_ALL_TABLE) {
      return FLAG_ALL_TABLE;
    }

    const table = [];

    argTable.split(',').map((i) => {
      if (!i) {
        return false;
      }
      table.push(i.trim());
    });

    return table;
  }

  /**
   * table available to delete
   */
  private masterTable() {
    return [
      'standards',
      'production_method_types'
    ];
  }

  private async truncateTable(tableName: string) {
    if (this.masterTable().includes(tableName)) {
      try {
        // For tables with foreign key constraints, we need to disable them temporarily
        if (tableName === 'standards') {
          // Disable foreign key checks before truncating
          await this.dataSource.manager.query('SET FOREIGN_KEY_CHECKS = 0');
          await this.dataSource.manager.query(`DELETE FROM ${tableName}`);
          // Enable foreign key checks after truncating
          await this.dataSource.manager.query('SET FOREIGN_KEY_CHECKS = 1');
        } else {
          await this.dataSource.manager.query(`DELETE FROM ${tableName}`);
        }
        console.log(`Truncated table: ${tableName}`);
      } catch (error) {
        console.error(`Error truncating table ${tableName}: ${error.message}`);
      }
    }
  }
}