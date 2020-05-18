import * as vscode from "vscode";

import * as fs from "fs";
import * as path from "path";

import { FileService } from "./services/fileService";
import { ComponentFileService } from "./services/componentFileService";
import { InputBoxService } from "./services/inputBoxService";
import { ComponentDto } from "./interfaces/templates/ComponentDto";

export function activate(context: vscode.ExtensionContext) {
  const fileService = new FileService(context.extensionPath);
  const componentFileService = new ComponentFileService(fileService);
  const inputBoxService = new InputBoxService();

  const disposable = vscode.commands.registerCommand(
    "blazorcomponents.createComponent",
    async (event) => {
      var dirpath: string = event.fsPath;
      if (fs.lstatSync(dirpath).isFile()) {
        dirpath = path.dirname(dirpath);
      }

      var relativePath = vscode.workspace.asRelativePath(dirpath, true);
      var namespace: string = relativePath
        .split("\\")
        .join(".")
        .split("/")
        .join(".");

      if (relativePath === vscode.workspace.rootPath) {
        namespace = namespace.split(".").splice(-1)[0];
      }

      var componentName = await inputBoxService.GetComponentName();

      if (componentName === undefined) {
        return;
      }

      componentName =
        componentName.charAt(0).toUpperCase() + componentName.substring(1);

      var componentDto: ComponentDto = {
        ComponentName: componentName,
        Namespace: namespace,
      };

      componentFileService.CreateClassComponent(dirpath, componentDto);
      componentFileService.CreateRazorComponent(dirpath, componentDto);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
