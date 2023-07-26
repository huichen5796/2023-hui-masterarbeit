import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { QueryNeo4jService } from '../app-services';

@Component({
  selector: 'app-unit-analyse-cell',
  templateUrl: './unit-analyse-cell.component.html',
  styleUrls: ['./unit-analyse-cell.component.css']
})
export class UnitAnalyseCellComponent implements OnChanges {
  @Input() openSearch!: { which: "Experiment" | "PreData" | "PostData" | "CPA" | "Process", selectedId: string[] }
  @Output() deleteOne: EventEmitter<string> = new EventEmitter<string>()

  callBacks: any[] = []

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
  hidden:boolean = false
  ngOnChanges() {
    this.callBacks = []
    this.containerOffset = 0;
    this.showAnalyse = false
    this.toShow = {}
    this.isAtStart = true;
    this.hidden = false
    if (this.openSearch['selectedId'].length == 1) {
      this.isAtEnd = true;
    } else if (this.openSearch['selectedId'].length == 0) {
      this.isAtEnd = true;
    } else {
      this.isAtEnd = false;
    }

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
  delete(item: string) {
    // this.deleteOne.emit(item)
    this.hidden = true
  }

  currentIndex = 0;
  containerOffset = 0;
  cardWidth = 400;
  isAtStart = true;
  isAtEnd = true;

  slideLeft() {
    this.currentIndex = Math.max(this.currentIndex - 1, 0);
    this.containerOffset = -this.currentIndex * this.cardWidth;
    this.updateButtonStates();
  }

  slideRight() {
    this.currentIndex = Math.min(this.currentIndex + 1, this.callBacks.length - 1);
    this.containerOffset = -this.currentIndex * this.cardWidth;
    this.updateButtonStates();
  }

  updateButtonStates() {
    this.isAtStart = this.currentIndex === 0;
    this.isAtEnd = this.currentIndex === this.callBacks.length - 1;
  }
  showAnalyse:boolean = false
  toShow:any = {}

  doShow(callBack:any){
    this.showAnalyse = true
    this.toShow = callBack
  }
  viewData(){
    this.hidden=!this.hidden
  }
}
