import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { QueryNeo4jService } from '../app-services';

@Component({
  selector: 'app-unit-analyse-cell',
  templateUrl: './unit-analyse-cell.component.html',
  styleUrls: ['./unit-analyse-cell.component.css']
})
export class UnitAnalyseCellComponent implements OnChanges{
  @Input() openSearch!: { which: "Experiment" | "PreData" | "PostData" | "CPA" | "Process", selectedId: string[] }
  @Output() deleteOne: EventEmitter<string> = new EventEmitter<string>()

  callBacks: any[] = []
  minimizeItems:string[] = []

  itemShow: { [key: string]: string[] } = {
    Viability: ["Viability_(%)", "Total_cells_/_ml_(x_10^6)", "Total_viable_cells_/_ml_(x_10^6)"],
    Morphology: ["Average_diameter_(microns)", "Average_circularity", "Cell_type"],
  }

  topItems: string[] = ["Sample_ID", "RunDate", "Machine"]
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
    if (this.openSearch['selectedId'].length !==0) {
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
