import * as vscode from 'vscode';
import { VillageLoader } from '../tools/VillageLoader';

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
        const filterQuery = await vscode.window.showInputBox({
            placeHolder: 'Filter query'
        });

        if (!filterQuery) {
            vscode.window.showErrorMessage('Filter query cant be empty.');
            return;
        }

        // execute filter
        const filteredData = data
            .filter(village => village.name.startsWith(filterQuery))
            .sort((a, b) => a.name.localeCompare(b.name));

        // output data
        let outputContent = '';

        outputContent +=
            `# Villages
Loaded from \`${pathToCSV}\`.\n
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

}