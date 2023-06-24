import { Component } from '@angular/core';
import { ConnectTestService } from '../app-services';

@Component({
  selector: 'app-seite-welcome',
  templateUrl: './seite-welcome.component.html',
  styleUrls: ['./seite-welcome.component.css']
})
export class SeiteWelcomeComponent {
  resourcesCards: { href: string, icon: string, span: string }[] = [
    { href: '/about-us', icon: 'perm_identity', span: 'About Us' },
    { href: '/about-this', icon: 'insert_chart_outlined', span: 'About This' },
    { href: '/technology', icon: 'developer_board', span: 'Technology' },
    { href: '/database', icon: 'cloud_queue', span: 'Database' },
    { href: '/nn', icon: 'blur_on', span: 'Neural Networks' }
  ]

  functionCards: { value: string, span: string }[] = [
    { value: 'ds', span: 'Data storage' },
    { value: 'da', span: 'Data analyse' },
    { value: 'srp', span: 'Survivalrate predict' },
    { value: 'po', span: 'Parameter optimize' },
    { value: 'fb', span: 'Feedback' }
  ]

  terminal_info: string = 'default'

  constructor(
    private connectTestService: ConnectTestService
    ) { 
      this.connectTestService.testBackend().then((rep) => {
        this.terminal_info = rep
        console.log(rep)
      })
    }
}
