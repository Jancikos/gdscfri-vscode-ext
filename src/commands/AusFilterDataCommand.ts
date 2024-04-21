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
    }

}