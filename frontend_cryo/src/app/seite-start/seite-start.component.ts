import { Component } from '@angular/core';
import { QueryNeo4jService } from '../app-services';

@Component({
  selector: 'app-seite-start',
  templateUrl: './seite-start.component.html',
  styleUrls: ['./seite-start.component.css']
})
export class SeiteStartComponent {
  output!: string
  value: string = 'MATCH (n) RETURN n'
  value1: string = 'MATCH (n) RETURN n'

  constructor(
    private queryNeo4jService: QueryNeo4jService,

  ) {
  }
  click() {
    this.queryNeo4jService.test().then((rep) => {
      this.output = rep
      console.log(rep)
    })
  }

  testInput() {

    this.queryNeo4jService.queryTest(this.value).then((rep) => {
      this.output = rep
      console.log(rep)
    })

  }

  testInputCpa() {

    this.queryNeo4jService.queryTestCpa(this.value1).then((rep) => {
      this.output = rep
      console.log(rep)
    })

  }
}
