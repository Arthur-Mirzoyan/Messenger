import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { ChatComponent } from '../chat/chat.component';
import { AppService } from '../app.service';

@Component({
  selector: 'home-comp',
  standalone: true,
  templateUrl: 'home.component.html',
  styleUrl: 'home.component.scss',
  imports: [FormsModule, NgClass, NgIf, SidebarComponent, ChatComponent],
})
export class HomeComponent {
  constructor(protected appService: AppService, private router: Router) {
    console.log('consturcter')
  }

  ngOnInit() {
    const userId = localStorage.getItem('userId');

    if (!userId) this.router.navigate(['/login']);
    else {
      this.appService.getUser(userId, (user: any) => {
        if (!user) this.router.navigate(['/login']);
        else this.appService.user = user;
      });
    }
  }
}
