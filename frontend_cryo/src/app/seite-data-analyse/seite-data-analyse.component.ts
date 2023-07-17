import { Component } from '@angular/core';

@Component({
  selector: 'app-seite-data-analyse',
  templateUrl: './seite-data-analyse.component.html',
  styleUrls: ['./seite-data-analyse.component.css']
})
export class SeiteDataAnalyseComponent {
  listItems: { [ket: string]: string[] } = {
    "analyse of": ["experiment", "pre-data", "post-data", "cpa", "process"]
  }

  which: readonly ("experiment" | "pre-data" | "post-data" | "cpa" | "process")[] = []

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  isSelected(value: string): boolean {
    return value === this.which[0];
  }
}
