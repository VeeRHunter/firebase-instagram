import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'hashtag',
    pure: false
})
export class HashtagPipe implements PipeTransform {
    transform(items: any[], filter: String): any {
        if (!items || !filter) {
            return items;
        }
        
        return items.filter(item => item.postText?item.postText.toUpperCase().indexOf(filter.toUpperCase()) !== -1: null);
    }
}