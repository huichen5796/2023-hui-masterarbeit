import { Component, Input, OnChanges } from '@angular/core';
import { QueryNeo4jService } from '../app-services';

@Component({
  selector: 'app-unit-analyse-select-list',
  templateUrl: './unit-analyse-select-list.component.html',
  styleUrls: ['./unit-analyse-select-list.component.css']
})
export class UnitAnalyseSelectListComponent implements OnChanges {
  @Input() which: readonly ("experiment" | "pre-data" | "post-data" | "cpa" | "process")[] = []

  idList!: string[]
  selectedId: readonly string[] = []

  translate: { [k: string]: ("Experiment" | "PreData" | "PostData" | "CPA" | "Process") } = {
    "experiment": 'Experiment',
    "pre-data": 'PreData',
    "post-data": 'PostData',
    "cpa": 'CPA',
    "process": 'Process'
  }

  callBack!: any

  constructor(
    private queryNeo4jService: QueryNeo4jService,
  ) { }

  ngOnChanges() {
    if (this.which[0]) {
      this.queryNeo4jService.queryOneType(this.translate[this.which[0]]).then((res) => {
        this.idList = JSON.parse(res)
      })
    }
  }

  isSelected(value: string): boolean {
    if (this.selectedId.indexOf(value) == -1){
      return false
    }
    else{
      return true
    }
  }

  searchOne(ID:string){
    this.queryNeo4jService.queryOneNode(this.translate[this.which[0]], ID).then((res) => {
      this.callBack = res
    })
  }
}
