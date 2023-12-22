import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapToList'
})
export class MapToListPipe implements PipeTransform {

  transform<K, V>(value: Map<K, V>): V[] {
    return [...value.values()];
  }

}
