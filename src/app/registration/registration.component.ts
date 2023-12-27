import { Component } from '@angular/core';
import { RegistrationService } from './registration.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'registration-comp',
  standalone: true,
  templateUrl: 'registration.component.html',
  styleUrl: 'registration.component.scss',
  imports: [FormsModule],
  providers: [RegistrationService],
})
export class RegistrationComponent {
  public userName: string = '';
  public password: string = '';

  constructor(
    public appService: AppService,
    private registrationService: RegistrationService,
    private router: Router
  ) {}

  async logIn() {
    let userExists = await this.registrationService.getUser(
      this.userName,
      this.password
    );

    if (userExists.length) {
      const userId = userExists[0].userId;
      localStorage.setItem('userId', userId);
      this.appService.user.userId = userId;
      this.router.navigate(['/chats']);
    }
  }
}
