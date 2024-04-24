import * as fs from 'fs';
import { Village } from "../models/Village";


export class VillageLoader {
    pathToCSV: string;

    constructor(pathToCSV: string) {
        this.pathToCSV = pathToCSV;
    }


    loadVillages(): Village[] {
        const fileContent = fs.readFileSync(this.pathToCSV, 'utf8');

        const rows = fileContent.split('\n');
        
        const data: Village[] = [];
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const columns = row.split(';');

            if (columns.length < 18) {
                continue;
            }

            const [name, code, type] = columns.slice(4, 7);

            if (code === '' || name === '' || type === '') {
                continue;
            }

            const village = new Village(code, name, type);
            data.push(village);
        }
        
        return data;
    }
}