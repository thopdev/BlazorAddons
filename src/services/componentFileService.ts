import { FileService } from "./fileService";
import * as fs from "fs";
import { ComponentDto as IComponentDto } from "../interfaces/templates/ComponentDto";

export class ComponentFileService {
  razorComponentPath: string = "component.razor.template";
  classComponentPath: string = "component.razor.cs.template";
  templateType: string = "components";
  constructor(private fileService: FileService) {}

  public async GetRazorComponentAsync(args: any): Promise<string> {
    return this.fileService.GetTemplateFileAsync(
      this.templateType,
      this.razorComponentPath,
      args
    );
  }

  public async GetClassComponentAsync(args: any): Promise<string> {
    return this.fileService.GetTemplateFileAsync(
      this.templateType,
      this.classComponentPath,
      args
    );
  }

  public async CreateClassComponent(path: string, componentDto: IComponentDto) {
    fs.writeFileSync(
      `${path}/${componentDto.ComponentName}.razor.cs`,
      await this.GetClassComponentAsync(componentDto)
    );
  }

  public async CreateRazorComponent(path: string, componentDto: IComponentDto) {
    var text = await this.GetRazorComponentAsync(componentDto);

    fs.writeFileSync(`${path}/${componentDto.ComponentName}.razor`, text);
  }
}
