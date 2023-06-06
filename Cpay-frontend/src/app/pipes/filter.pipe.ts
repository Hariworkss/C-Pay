import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(filteredUsers: any[],searchTerm: String,propertyName:string): any[] {
    const result:any=[]
    if(!filteredUsers||searchTerm==''||propertyName==''){
      return filteredUsers
    }
    filteredUsers.forEach((item:any)=>{          //includes returns true/false
      if(item[propertyName].trim().toLowerCase().includes(searchTerm.toLocaleLowerCase())){
        result.push(item)
      }
    })

    return result;
  }

}
