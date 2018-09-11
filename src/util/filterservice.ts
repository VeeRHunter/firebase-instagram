import {UnsplashItUtil} from "./unsplashItutil";
import {Injectable} from "@angular/core";
/**
 * Created by Avell on 16/05/2017.
 */

@Injectable()
export class FilterService {

  filters;
  filtersChangedCustom: String[];

  constructor() {
  }

  init() {
    this.filtersChangedCustom = [];
  }

  getFilterName(filter) {
    var finishFilterName = filter.indexOf('(');
    var filterName = filter.substr(0, finishFilterName);

    return filterName;
  }

  getCustomFilters() {
    return this.filtersChangedCustom;
  }


  areadyExistsChange(filter, elementStyle) {

    let index = this.filtersChangedCustom.indexOf(filter);

    let currentFilter = elementStyle.split(' ');

    let indexAreadyExistsInFilter = currentFilter.findIndex(item => this.getFilterName(item).indexOf(filter) > -1)

    console.log(currentFilter, indexAreadyExistsInFilter);

    console.log("aready exists", index > -1 && indexAreadyExistsInFilter > -1)

    return index > -1 && indexAreadyExistsInFilter > -1;

  }

  removeCustomFilter(filter, elementStyle) {

      console.log("change")
      let index = this.filtersChangedCustom.indexOf(filter);
      this.filtersChangedCustom.splice(index, 1);

    console.log("filtro removido", this.filtersChangedCustom)

  }

  getStyleFilter(elementStyle, filter, isCustom) {

    filter = filter.trim();


    let currentFilter = elementStyle.split(' ');


    if (isCustom) {
      let filterName = this.getFilterName(filter);

      let indexExists = this.filtersChangedCustom.indexOf(filterName);

      if (indexExists == -1) {
        this.filtersChangedCustom.push(filterName);
      }


      let index = currentFilter.findIndex(item => item.indexOf(filterName) >= 0);

      if (index == -1) {
        currentFilter.push(filter);
      } else {
        currentFilter[index] = filter;
      }

    } else {


      let filters = filter.split(' ');

      //remove todos os itens que nao estao na lista salva e tambem nao estao nos filtros que vao ser colocados
      currentFilter = currentFilter.filter(filterCurrentItem => {
        let filterName = this.getFilterName(filterCurrentItem);
        return !(this.filtersChangedCustom.findIndex(item => item.indexOf(filterName) >= 0) == -1 && filters.findIndex(item => item.indexOf(filterName) >= 0) == -1)
      })


      //para cada filtro novo verifica se esta na lista dos proibidos
      var filtersToAdd = filters.filter(filterFind => {
        let filterName = this.getFilterName(filterFind);
        return this.filtersChangedCustom.findIndex(item => item.indexOf(filterName) >= 0) == -1

      });


      filtersToAdd.forEach(filter => {

        let filterName = this.getFilterName(filter);
        let index = currentFilter.findIndex(item => item.indexOf(filterName) >= 0);

        if (index == -1) {
          currentFilter.push(filter);
        } else {
          currentFilter[index] = filter;
        }
      })

    }

    let retorno = currentFilter.join(" ");
    return retorno;

  }


}
