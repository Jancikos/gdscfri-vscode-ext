import * as vscode from 'vscode';

export class AusFilterDataCommand {

    public static async run() {
        vscode.window.showInformationMessage('Aus Filter Data command');
    }

}