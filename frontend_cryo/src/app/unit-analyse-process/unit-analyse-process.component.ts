import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { QueryNeo4jService } from '../app-services';

@Component({
  selector: 'app-unit-analyse-process',
  templateUrl: './unit-analyse-process.component.html',
  styleUrls: ['./unit-analyse-process.component.css']
})
export class UnitAnalyseProcessComponent implements OnChanges {
  @Input() openSearch!: { which: "Experiment" | "PreData" | "PostData" | "CPA" | "Process", selectedId: string[] }
  @Output() deleteOne: EventEmitter<string> = new EventEmitter<string>()
  callBacks: any[] = []

  minimizeItems:string[] = []

  topItems: string[] = [
    "Freezing_device",
    "Cooling_rate",
    "Preservation_container",
    "Storage_temperature",
    "Storage_medium",
    "Storage_duration",
    "Thawing_temperature",
    "Washing_steps",
    "Dilution_medium",
    "Dilution_factor"
  ]
  constructor(
    private queryNeo4jService: QueryNeo4jService,
  ) { }

  searchOne(ID: readonly string[], data_type: "Experiment" | "PreData" | "PostData" | "CPA" | "Process") {
    ID.forEach((element) => {
      this.queryNeo4jService.queryOneNode(data_type, element).then((res) => {
        this.callBacks.push(res)
      })
    })

  }

  ngOnChanges() {
    this.callBacks = []
    if (this.openSearch['selectedId']) {
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

  delete(item:string) {
    this.deleteOne.emit(item)
  }

  minimize(value:string){
    if (this.minimizeItems.indexOf(value) == -1) {
      this.minimizeItems.push(value)
    } else{
      this.minimizeItems = this.minimizeItems.filter((item: string) => item !== value);
    }
    this.minimizeItems = [...this.minimizeItems]
  }
}
