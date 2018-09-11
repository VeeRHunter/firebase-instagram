import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ProfilenamePipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'profilename',
})
export class ProfilenamePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(items: any[], filter: String): any {
    if (!items || !filter) {
        return items;
    }
    
    return items.filter(item => item.name?item.name.indexOf(filter) !== -1: null);
}
}
