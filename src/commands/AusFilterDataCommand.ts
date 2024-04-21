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

        // output data
        let outputContent = '';

        outputContent +=
            `# Villages
Loaded from \`${pathToCSV}\`.\n
Total count \`${data.length}\`.\n

`;

        outputContent += '| Name | Code | Type |\n';
        outputContent += '| ---- | ---- | ---- |\n';
        data.forEach(village => {
            outputContent += `| ${village.name} | ${village.code} | ${village.type} |\n`;
        });

        // output data into new file
        const document = await vscode.workspace.openTextDocument({
            content: outputContent,
            language: 'markdown'
        });

        await vscode.window.showTextDocument(document);
        // show markdown preview
        await vscode.commands.executeCommand('markdown.showPreview', document.uri);


    }

}