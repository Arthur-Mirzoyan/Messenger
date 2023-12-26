import { Component } from '@angular/core';
import { RegistrationService } from './registration.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
    private registrationService: RegistrationService,
    private router: Router
  ) {}

  async logIn() {
    let userExists = await this.registrationService.getUser(
      this.userName,
      this.password
    );

    if (userExists.length) {
      localStorage.setItem('userId', userExists[0]?.id);
      this.router.navigate(['/']);
    }
  }
}
