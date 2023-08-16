import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { QueryNeo4jService } from '../app-services';

@Component({
  selector: 'app-unit-analyse-cpa',
  templateUrl: './unit-analyse-cpa.component.html',
  styleUrls: ['./unit-analyse-cpa.component.css']
})
export class UnitAnalyseCpaComponent {
  @Input() openSearch!: { which: "Experiment" | "PreData" | "PostData" | "CPA" | "Process", selectedId: string[] }
  @Output() deleteOne: EventEmitter<string> = new EventEmitter<string>()

  callBacks: any[] = []
  constructor(
    private queryNeo4jService: QueryNeo4jService,
  ) { }

  searchOne(ID: readonly string[], data_type: "Experiment" | "PreData" | "PostData" | "CPA" | "Process") {
    ID.forEach((element) => {
      this.queryNeo4jService.queryOneCPA(element).then((res) => {
        this.callBacks.push(res)
      })
    })

  }
  ngOnChanges() {
    this.callBacks = []
    this.showAnalyse = false
    this.toShow = {}
    if (this.openSearch['selectedId'].length !== 0) {
      this.searchOne(this.openSearch['selectedId'], this.openSearch['which'])
    }
  }

  getObjectKeys(obj: any): string[] {
    if (Object.keys(obj).length === 0) {
      return []
    }
    else {
      return Object.keys(obj);
    }
  }
  showAnalyse:boolean = false
  toShow:any = {}

  doShow(callBack:any){
    this.showAnalyse = true
    this.toShow = callBack
  }
  emm(input:string){
    return input+'_ID'
  }
}
