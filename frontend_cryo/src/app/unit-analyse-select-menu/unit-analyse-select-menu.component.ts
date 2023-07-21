import { Component, Input, OnChanges } from '@angular/core';
import { QueryNeo4jService } from '../app-services';

@Component({
  selector: 'app-unit-analyse-select-menu',
  templateUrl: './unit-analyse-select-menu.component.html',
  styleUrls: ['./unit-analyse-select-menu.component.css']
})
export class UnitAnalyseSelectMenuComponent implements OnChanges {
  @Input() which: readonly ("experiment" | "pre-data" | "post-data" | "cpa" | "process")[] = []

  selectedId: string = ''

  translate: { [k: string]: ("Experiment" | "PreData" | "PostData" | "CPA" | "Process") } = {
    "experiment": 'Experiment',
    "pre-data": 'PreData',
    "post-data": 'PostData',
    "cpa": 'CPA',
    "process": 'Process'
  }

  ngOnChanges() {
    this.selectedId = ''
  }

  onDataReceived(data:{translate_which:string, selectedId:string}){
    this.selectedId = data['selectedId']
  }
}