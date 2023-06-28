import { Component } from '@angular/core';

@Component({
  selector: 'app-seite-welcome',
  templateUrl: './seite-welcome.component.html',
  styleUrls: ['./seite-welcome.component.css']
})
export class SeiteWelcomeComponent {
  resourcesCards: { href: string, icon: string, span: string }[] = [
    { href: '/about-us', icon: 'perm_identity', span: 'About Us' },
    { href: '/about-this', icon: 'help_outline', span: 'About This' },
    { href: '/technology', icon: 'developer_board', span: 'Technology' },
    { href: '/database', icon: 'cloud_queue', span: 'Database' },
    { href: '/nn', icon: 'blur_on', span: 'Neural Networks' }
  ]

  functionCards: { icon: string, span: string, href: string }[] = [
    { icon: 'storage', span: 'Data storage', href:'/data-storage' },
    { icon: 'insert_chart_outlined', span: 'Data analyse', href:'/data-analyse' },
    { icon: 'bubble_chart', span: 'Survivalrate predict', href:'/data-storage' },
    { icon: 'trending_up', span: 'Parameter optimize', href:'/data-storage' },
    { icon: 'favorite_border', span: 'Feedback', href:'/data-storage' }
  ]
}
