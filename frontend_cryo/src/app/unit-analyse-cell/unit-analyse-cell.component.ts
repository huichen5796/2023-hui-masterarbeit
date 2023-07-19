import { Component, Input } from '@angular/core';
import { QueryNeo4jService } from '../app-services';

@Component({
  selector: 'app-unit-analyse-cell',
  templateUrl: './unit-analyse-cell.component.html',
  styleUrls: ['./unit-analyse-cell.component.css']
})
export class UnitAnalyseCellComponent {
  @Input() openSearch!: { translate_which: "Experiment" | "PreData" | "PostData" | "CPA" | "Process", selectedId: string }

  callBack!: any

  itemShow: { [key: string]: string[] } = {
    Viability: ["Viability_(%)", "Total_cells_/_ml_(x_10^6)", "Total_viable_cells_/_ml_(x_10^6)"],
    Morphology: ["Average_diameter_(microns)", "Average_circularity", "Cell_type"],
  }

  topItems: string[] = ["Sample_ID", "RunDate", "Machine"]
  constructor(
    private queryNeo4jService: QueryNeo4jService,
  ) { }

  searchOne(ID: string, data_type: "Experiment" | "PreData" | "PostData" | "CPA" | "Process") {
    this.queryNeo4jService.queryOneNode(data_type, ID).then((res) => {
      this.callBack = res
    })
  }

  ngOnChanges() {
    if (this.openSearch['selectedId']) {
      this.searchOne(this.openSearch['selectedId'], this.openSearch['translate_which'])
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
}
