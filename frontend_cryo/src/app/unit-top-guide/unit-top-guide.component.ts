import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-unit-top-guide',
  templateUrl: './unit-top-guide.component.html',
  styleUrls: ['./unit-top-guide.component.css']
})
export class UnitTopGuideComponent {
  @Input() back!:string
  @Input() backUrl!:string
  @Input() forward!:string
  @Input() forwardUrl!:string
}
