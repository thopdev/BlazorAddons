// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import * as fs from 'fs';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "blazorcomponents" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json


	let disposable = vscode.commands.registerCommand('blazorcomponents.createComponent', async (event) => {


		var dirpath: string = event.fsPath;
		if (fs.lstatSync(dirpath).isFile()) {
			dirpath = path.dirname(dirpath);
		}

		var relativePath = vscode.workspace.asRelativePath(dirpath, true);
		var namespace: string = relativePath.split("/").join(".");

		if (relativePath === vscode.workspace.rootPath) {
			namespace = namespace.split(".").splice(-1)[0];
		}



		var componentName = await vscode.window.showInputBox({ placeHolder: "Component", ignoreFocusOut: true, prompt: "Please enter a component name" });

		if (componentName === undefined) {
			return;
		}

		componentName = componentName.charAt(0).toUpperCase() + componentName.substring(1);

		try {
			vscode.workspace.openTextDocument(context.extensionPath + '/templates/' + "ComponentBase").then((doc: vscode.TextDocument) => {
				var text = doc.getText();
				text = text.replace('%ClassName%', componentName);
				text = text.replace('%Namespace%', namespace);
				fs.writeFileSync(dirpath + "\\" + componentName + ".razor.cs", text);
			});

			vscode.workspace.openTextDocument(context.extensionPath + '/templates/' + "Component").then((doc: vscode.TextDocument) => {
				var text = doc.getText();
				text = text.replace('%ComponentName%', componentName + "");
				fs.writeFileSync(dirpath + "\\" + componentName + ".razor", text);
			});


		} catch (e) {
			console.log(e);
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
