import { Component, Input } from '@angular/core';
import { QueryNeo4jService } from '../app-services';

@Component({
  selector: 'app-unit-analyse-cell',
  templateUrl: './unit-analyse-cell.component.html',
  styleUrls: ['./unit-analyse-cell.component.css']
})
export class UnitAnalyseCellComponent {
  @Input() openSearch!:{translate_which:"Experiment" | "PreData" | "PostData" | "CPA" | "Process", selectedId:string}

  callBack!: any
  constructor(
    private queryNeo4jService: QueryNeo4jService,
  ) { }

  searchOne(ID:string, data_type:"Experiment" | "PreData" | "PostData" | "CPA" | "Process"){
    this.queryNeo4jService.queryOneNode(data_type, ID).then((res) => {
      this.callBack = res
    })
  }

  ngOnChanges() {
    if (this.openSearch) {
      this.searchOne(this.openSearch['selectedId'], this.openSearch['translate_which'])
    }
  }
}
