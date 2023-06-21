import { Component } from '@angular/core';
import { QueryNeo4jService } from '../app-services';

@Component({
  selector: 'app-seite-about-this',
  templateUrl: './seite-about-this.component.html',
  styleUrls: ['./seite-about-this.component.css']
})
export class SeiteAboutThisComponent {

  constructor(
    private queryNeo4jService: QueryNeo4jService,

  ) {
  }
  click(){
    this.queryNeo4jService.queryTest().then((rep)=>{
      console.log(rep)
    })
  }
}
