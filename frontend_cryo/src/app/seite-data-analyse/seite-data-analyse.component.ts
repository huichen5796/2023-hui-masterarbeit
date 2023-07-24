import { Component } from '@angular/core';

@Component({
  selector: 'app-seite-data-analyse',
  templateUrl: './seite-data-analyse.component.html',
  styleUrls: ['./seite-data-analyse.component.css']
})
export class SeiteDataAnalyseComponent {
  listItems: { [ket: string]: string[] } = {
    "analyse of": ["Experiment", "PreData", "PostData", "CPA", "Process"]
  }

  which: readonly ("Experiment" | "PreData" | "PostData" | "CPA" | "Process")[] = []

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  isSelected(value: string): boolean {
    return value === this.which[0];
  }
  
}
