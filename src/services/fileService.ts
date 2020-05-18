import * as vscode from "vscode";

export class FileService {
  templatePath: string = this.extensionPath + "/templates/";

  constructor(private extensionPath: string) {}

  public async GetTemplateFileAsync(
    type: string,
    templateName: string,
    args: any
  ) {
    var str = this.templatePath + type + "/" + templateName;

    var template = await vscode.workspace.openTextDocument(str);
    var templateText = template.getText();
    return this.PlaceHolderFiller(templateText, args);
  }

  private PlaceHolderFiller(str: string, args: any): string {
    for (var key in args) {
      var value = args[key];
      var templateKey = "%" + key + "%";
      var str = str.replace(templateKey, value);
    }

    return str;
  }
}
