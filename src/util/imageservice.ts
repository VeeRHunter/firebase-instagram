import {UnsplashItUtil} from "./unsplashItutil";
import {Injectable} from "@angular/core";
import {ImageEntity} from "./ImageEntity";
/**
 * Created by Avell on 16/05/2017.
 */

@Injectable()
export class ImageService{

  images;

  constructor( public unsplash : UnsplashItUtil){

  }

  init(){

    this.unsplash.getListOfImages(100).then(list =>{
      this.images = list;


    })

  }

  getImages(){

    return this.images;
  }


}
