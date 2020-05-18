import * as vscode from "vscode";

export class InputBoxService {
  public async GetComponentName(): Promise<string | undefined> {
    return await vscode.window.showInputBox({
      placeHolder: "Component",
      ignoreFocusOut: true,
      prompt: "Please enter a component name",
    });
  }
}
