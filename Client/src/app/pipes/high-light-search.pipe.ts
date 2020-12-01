import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highLightSearch'
})
export class HighLightSearchPipe implements PipeTransform {

  transform(value: any, args: any): any {
    if (!args) { return value; }
    var regex = new RegExp(args, 'gi'); //'gi' for case insensitive.
    return value.replace(regex, "<mark>$&</mark>");
  }

}
