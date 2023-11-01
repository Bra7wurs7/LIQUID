import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'workspaceTooltip'
})
export class WorkspaceTooltipPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
