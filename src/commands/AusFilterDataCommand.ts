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

        // show info that the villages are loaded
        vscode.window.showInformationMessage('Villages are loaded');


        const filterdData =
            data
                .filter(village => village.name.startsWith('A'))
                .sort((a, b) => a.name.localeCompare(b.name));


        // output data
        let outputContent = '';

        outputContent = `
# Villages

Loaded from: \`${pathToCSV}\` \n
Total count: \`${filterdData.length}\` \n
`;

        outputContent += `| Code | Name | Type |\n`;
        outputContent += `| ---- | ---- | ---- |\n`;

        for (const village of filterdData) {
            outputContent += `| ${village.code} | ${village.name} | ${village.type} |\n`;
        }


        // output into new file
        const document = await vscode.workspace.openTextDocument({
            content: outputContent,
            language: 'markdown'
        });


        await vscode.window.showTextDocument(document);

        // open preview
        await vscode.commands.executeCommand('markdown.showPreview', document.uri);
    }

}