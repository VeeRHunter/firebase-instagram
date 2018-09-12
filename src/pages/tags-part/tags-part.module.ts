import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TagsPartPage } from './tags-part';

@NgModule({
  declarations: [
    TagsPartPage,
  ],
  imports: [
    IonicPageModule.forChild(TagsPartPage),
  ],
  exports: [
    TagsPartPage
  ]
})
export class TagsPartPageModule {}
