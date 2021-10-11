import { Pipe, PipeTransform } from '@angular/core';
import { Any } from 'typed-any-access';

@Pipe({
  name: 'fillAttribute'
})
export class FillAttributePipe implements PipeTransform {

  //TODO: Look for contentSlotId (value) in the note's attributes map and return the content
  transform(value: string, ...args: any[]): unknown {
    return new Any(args[0]).get(value).stringOrNull();
  }

}
