import { Component, HostListener, Input } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'sidebar-comp',
  standalone: true,
  templateUrl: 'sidebar.component.html',
  styleUrl: 'sidebar.component.scss',
})
export class SidebarComponent {
  constructor(protected appService: AppService) {}

  @HostListener('window:beforeunload', ['$event']) unloadHandler() {
    const userJSON = JSON.stringify(this.appService.user);
    localStorage.setItem('###', userJSON);
  }

  @HostListener('window:load', ['$event']) onloadHandler() {
    const userJSON = localStorage.getItem('###') || '';
    try {
      localStorage.removeItem('###');
      this.appService.user = JSON.parse(userJSON);
    } catch (err: any) {}
  }
}
