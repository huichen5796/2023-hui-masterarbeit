import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { QueryNeo4jService, CalculatorService } from '../app-services';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-unit-analyse-cell',
  templateUrl: './unit-analyse-cell.component.html',
  styleUrls: ['./unit-analyse-cell.component.css']
})
export class UnitAnalyseCellComponent implements OnChanges, AfterViewInit {
  @Input() openSearch!: { which: "Experiment" | "PreData" | "PostData" | "CPA" | "Process", selectedId: string[] }
  @Output() deleteOne: EventEmitter<string> = new EventEmitter<string>()
  callBacks: any[] = []
  dataSource = new MatTableDataSource([])
  showTable: boolean = false
  itemShow: { [key: string]: string[] } = {
    Viability: ["Viability_(%)", "Total_cells_/_ml_(x_10^6)", "Total_viable_cells_/_ml_(x_10^6)"],
    Morphology: ["Average_diameter_(microns)", "Average_circularity", "Cell_type"],
  }
  topItems: string[] = ["Sample_ID", "RunDate", "Machine"]
  tableHeader = ['Sample_ID', ...this.itemShow['Viability'], ...this.itemShow['Morphology']]
  hidden:boolean = false
  currentIndex = 0;
  containerOffset = 0;
  cardWidth = 400;
  isAtStart = true;
  isAtEnd = true;

  constructor(
    private queryNeo4jService: QueryNeo4jService,
    private calculatorService: CalculatorService,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  result:any = {"Sample_ID": 'CONCLUSION'}

  searchOne(ID: readonly string[], data_type: "Experiment" | "PreData" | "PostData" | "CPA" | "Process") {
    ID.forEach((element) => {
      this.queryNeo4jService.queryOneNode(data_type, element).then((res) => {
        this.callBacks.push(res)
        this.callBacks = [...this.callBacks]
        if (ID.length === this.callBacks.length && this.callBacks.length !==0){
          this.tableHeader.forEach(item=>{
            if (['Sample_ID', 'Cell_type'].indexOf(item) === -1){
              this.calculatorService.getMeanAndVariance(this.callBacks.map(obj => obj[item])).then((res)=>{
                this.result[item] = res
                this.result = {...this.result}
                this.dataSource = new MatTableDataSource(this.makeSource())
                this.ngAfterViewInit()
              })
            }
          })
        }
      })
    })

  }
  makeSource():any {
    this.showTable = true
      return this.callBacks.concat(this.result)
  }
  ngOnChanges() {
    this.callBacks = []
    this.showTable = false
    this.dataSource = new MatTableDataSource([])
    this.containerOffset = 0;
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


  viewData(){
    this.hidden=!this.hidden
  }
  clickedRow(row:any){
    if (this.callBacks.indexOf(row) != -1){
      const position = -this.cardWidth * this.callBacks.indexOf(row)
      if (this.containerOffset != position){
        this.currentIndex = this.callBacks.indexOf(row)
        this.containerOffset = position
        this.hidden = false
        this.updateButtonStates();
      }
    }
  }
  isString(input: any): boolean {
    return typeof input === 'string';
  }

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  // /** Announce the change in sort state for assistive technology. */
  // announceSortChange(sortState: Sort) {
  //   console.log(sortState)
  //   if (sortState.direction) {
  //     this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
  //   } else {
  //     this._liveAnnouncer.announce('Sorting cleared');
  //   }
  // }
}
