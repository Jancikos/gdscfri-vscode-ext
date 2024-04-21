import * as vscode from 'vscode';
import { VillageLoader } from '../tools/VillageLoader';
import { Village } from '../models/Village';

export class AusFilterDataCommand {

    public static async run() {
        const config = vscode.workspace.getConfiguration();

        vscode.window.showInformationMessage('Aus Filter Data command');

        // load the villages
        const pathToCSV = config.get('gdscfri.aus.pathToVillages');
        if (!pathToCSV) {
            vscode.window.showErrorMessage('Path to villages is not set. Set it in extension settings.');
            return;
        }

        const villageLoader = new VillageLoader(pathToCSV as string);
        const data = villageLoader.loadVillages();

        // filter the data
        const filterTypes = AusFilterDataCommand.getFilterTypes();

        // select filter type
        const filterTypeTitle = await vscode.window.showQuickPick(
            filterTypes.map(type => type.title), {
            placeHolder: 'Select filter type'
        });

        const filterType = filterTypes.find(type => type.title === filterTypeTitle);
        if (!filterType) {
            vscode.window.showErrorMessage('Filter type not selected.');
            return;
        }

        const filterQuery =
            filterType.filterFunction
                ? await vscode.window.showInputBox({
                    placeHolder: 'Filter query'
                })
                : undefined;
        if (!filterQuery && filterType.filterFunction) {
            vscode.window.showErrorMessage('Filter query cant be empty.');
            return;
        }

        // execute filter
        const filteredData = data
            .filter(
                village =>
                    filterType.filterFunction
                        ? filterType.filterFunction(village, filterQuery)
                        : true
            )
            .sort((a, b) => a.name.localeCompare(b.name));

        // output data
        let outputContent = '';

        outputContent +=
            `# Villages
Loaded from \`${pathToCSV}\`.\n
Filter type \`${filterType.title}\`.\n
Filter query \`${filterQuery}\`.\n
Total count \`${filteredData.length}\`.\n

`;

        outputContent += '| Code | Name | Type |\n';
        outputContent += '| ---- | ---- | ---- |\n';
        filteredData.forEach(village => {
            outputContent += `| ${village.code} | ${village.name} | ${village.type} |\n`;
        });

        // output filteredData into new file
        const document = await vscode.workspace.openTextDocument({
            content: outputContent,
            language: 'markdown'
        });

        await vscode.window.showTextDocument(document);
        // show markdown preview
        await vscode.commands.executeCommand('markdown.showPreview', document.uri);
    }

    public static getFilterTypes(): FilterType[] {
        return [
            new FilterType('Starts with', (village, filterQuery) => village.name.startsWith(filterQuery || '')),
            new FilterType('Ends with', (village, filterQuery) => village.name.endsWith(filterQuery || '')),
            new FilterType('Contains', (village, filterQuery) => village.name.includes(filterQuery || '')),
            new FilterType('None')
        ];
    }
}

class FilterType {
    title: string;
    filterFunction?: (village: Village, filterQuery: string | undefined) => boolean;
    constructor(title: string, filterFunction?: (village: Village, filterQuery: string | undefined) => boolean) {
        this.title = title;
        this.filterFunction = filterFunction;
    }
}