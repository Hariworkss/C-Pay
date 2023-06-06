import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(allTransaction: any[],searchTerm: String,propertyName:string): any[] {
    const result:any=[]
    if(!allTransaction||searchTerm==''||propertyName==''){
      return allTransaction
    }
    allTransaction.forEach((item:any)=>{          //includes returns true/false
      if(item[propertyName].trim().toLowerCase().includes(searchTerm.toLocaleLowerCase())){
        result.push(item)
      }
    })

    return result;
  }

}
