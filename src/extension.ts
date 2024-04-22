import * as vscode from 'vscode';
import { AusFilterDataCommand } from './commands/AusFilterDataCommand';

export function activate(context: vscode.ExtensionContext) {
    const cmdAusFilterData = vscode.commands.registerCommand('gdscfri.aus-filter-data', AusFilterDataCommand.run);
    context.subscriptions.push(cmdAusFilterData);
}
