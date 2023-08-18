import { Component } from '@angular/core';

@Component({
  selector: 'app-unit-edit-database',
  templateUrl: './unit-edit-database.component.html',
  styleUrls: ['./unit-edit-database.component.css']
})
export class UnitEditDatabaseComponent {
  callBack!:any
  type!: string

  getObjectKeys(obj: any): string[] {
    if (Object.keys(obj).length === 0) {
      return []
    }
    else {
      return Object.keys(obj);
    }
  }

  parseArray(input: any): boolean {
    try {
      if (Array.isArray(input)) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  emm(input:string){
    return input+'_ID'
  }

  rename(type:("Experiment" | "Probe" | "Versuch"), orignalName:string, currentName:string){

  }
}
