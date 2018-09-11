/**
 * Created by Avell on 11/05/2017.
 */
import {Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges, Renderer} from '@angular/core';
import {FilterService} from "../util/filterservice";
@Directive({
  selector: '[brightness]'
})
export class ImageFilterDirective implements OnChanges {


  constructor(private el: ElementRef, public renderer: Renderer, private filterService: FilterService) {
  }

  @Input() type: string;
  @Input() ngModel;
  @Input() imageId;


  ngOnChanges(changes: SimpleChanges): void {
    this.ngAfterContentInit();
  }


  ngAfterContentInit() {

    let myElement = (<HTMLInputElement>document.getElementById(this.imageId))
    let tempFilter = myElement;

    if (this.ngModel != null) {
      let x = parseInt(this.ngModel + "");
      let value = -(0.00001) * (x * x) + (0.003) * x + 1
      console.log(`${this.type}(${value})`)

      var filter = this.filterService.getStyleFilter(myElement.style.filter, `${this.type}(${value})`, true);
      this.renderer.setElementStyle(myElement, 'filter', filter);

    }


  }


}
