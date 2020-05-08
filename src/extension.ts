import * as vscode from "vscode";

import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "blazorcomponents.createComponent",
    async (event) => {
      var dirpath: string = event.fsPath;
      if (fs.lstatSync(dirpath).isFile()) {
        dirpath = path.dirname(dirpath);
      }

      var relativePath = vscode.workspace.asRelativePath(dirpath, true);
      var namespace: string = relativePath.split("/").join(".");

      if (relativePath === vscode.workspace.rootPath) {
        namespace = namespace.split(".").splice(-1)[0];
      }

      var componentName = await vscode.window.showInputBox({
        placeHolder: "Component",
        ignoreFocusOut: true,
        prompt: "Please enter a component name",
      });

      if (componentName === undefined) {
        return;
      }

      componentName =
        componentName.charAt(0).toUpperCase() + componentName.substring(1);

      try {
        var componentBaseText = await GetTemplateFileAsync("ComponentBase", {
          ClassName: componentName,
          Namespace: namespace,
        });
        fs.writeFileSync(
          `${dirpath}/${componentName}.razor.cs`,
          componentBaseText
        );

        var componentText = await GetTemplateFileAsync("Component", {
          ComponentName: componentName,
        });
        fs.writeFileSync(`${dirpath}/${componentName}.razor`, componentText);
      } catch (e) {
        console.log(e);
      }
    }
  );

  async function GetTemplateFileAsync(templateName: string, args: any) {
    var template = await vscode.workspace.openTextDocument(
      context.extensionPath + "/tempaltes/" + templateName
    );
    var templateText = template.getText();
    return StringReplacer(templateText, args);
  }

  function StringReplacer(str: string, args: any): string {
    for (var key in args) {
      str.replace(`%${key}%`, args[key]);
    }

    return str;
  }

  context.subscriptions.push(disposable);
}

export function deactivate() {}
