import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { QueryNeo4jService } from '../app-services';

@Component({
  selector: 'app-unit-analyse-select-list',
  templateUrl: './unit-analyse-select-list.component.html',
  styleUrls: ['./unit-analyse-select-list.component.css']
})
export class UnitAnalyseSelectListComponent implements OnChanges {
  @Input() translate_which: readonly ("Experiment" | "PreData" | "PostData" | "CPA" | "Process")[] = []
  @Output() openSearch: EventEmitter<{translate_which:"Experiment" | "PreData" | "PostData" | "CPA" | "Process", selectedId:string}> = new EventEmitter<{translate_which:"Experiment" | "PreData" | "PostData" | "CPA" | "Process", selectedId:string}>()

  idList!: string[]
  selectedId: readonly string[] = []

  constructor(
    private queryNeo4jService: QueryNeo4jService,
  ) { }

  ngOnChanges() {
    if (this.translate_which[0]) {
      this.queryNeo4jService.queryOneType(this.translate_which[0]).then((res) => {
        this.idList = JSON.parse(res)
      })
    }
  }

  isSelected(value: string): boolean {
    return value === this.selectedId[0]
  }

  searchOne(data_type:"Experiment" | "PreData" | "PostData" | "CPA" | "Process", ID:string){
    this.openSearch.emit({translate_which:data_type, selectedId:ID})
  }
}
