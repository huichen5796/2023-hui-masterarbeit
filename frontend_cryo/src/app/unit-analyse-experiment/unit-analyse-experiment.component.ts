import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { QueryNeo4jService } from '../app-services';


@Component({
  selector: 'app-unit-analyse-experiment',
  templateUrl: './unit-analyse-experiment.component.html',
  styleUrls: ['./unit-analyse-experiment.component.css']
})
export class UnitAnalyseExperimentComponent {
  @Input() openSearch!: { which: "Experiment" | "PreData" | "PostData" | "CPA" | "Process", selectedId: string[] }
  @Output() deleteOne: EventEmitter<string> = new EventEmitter<string>()

  callBacks: any[] = []

  constructor(
    private queryNeo4jService: QueryNeo4jService,
  ) { }

  searchOne(ID: readonly string[], data_type: "Experiment" | "PreData" | "PostData" | "CPA" | "Process") {
    ID.forEach((element) => {
      this.queryNeo4jService.queryOneExperiment(element).then((res) => {
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
}
