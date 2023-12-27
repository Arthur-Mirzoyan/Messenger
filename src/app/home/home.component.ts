import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../user';
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
  protected user: User | null = null;

  constructor(
    private appService: AppService,
    private router: Router
  ) {}

  ngOnInit() {
    this.appService.getUser((user: any) => {
      console.log(user)
      if (!user) this.router.navigate(['/login']);
      else {
        this.user = user;
        this.appService.user = user;
      }
    });
  }
}
