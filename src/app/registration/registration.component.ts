import { Component } from '@angular/core';
import { RegistrationService } from './registration.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppService } from '../app.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'registration-comp',
  standalone: true,
  templateUrl: 'registration.component.html',
  styleUrl: 'registration.component.scss',
  imports: [FormsModule, ReactiveFormsModule, NgIf, RouterLink],
  providers: [RegistrationService],
})
export class RegistrationComponent {
  public registrationForm: FormGroup;
  public submitionErrorOccures: boolean = false;
  public isSigningUp: boolean = false;

  constructor(
    public appService: AppService,
    private registrationService: RegistrationService,
    private router: Router
  ) {
    this.registrationForm = new FormGroup({
      formName: new FormControl('', [Validators.required]),
      formUsername: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      formPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(16),
      ]),
    });
  }

  ngOnInit() {
    this.isSigningUp = this.router.url === '/signup';
  }

  async submit() {
    this.submitionErrorOccures = false;

    if (this.areUsernameAndPasswordValid()) {
      if (!this.isSigningUp) this.logIn();
      else this.singUp();
    }
  }

  changeMode() {
    if (this.router.url === '/login') this.router.navigate(['/signup']);
    else this.router.navigate(['/login']);
  }

  private areUsernameAndPasswordValid() {
    return (
      this.registrationForm.controls['formUsername'].valid &&
      this.registrationForm.controls['formPassword'].valid
    );
  }

  private async logIn() {
    let user = await this.registrationService.userExists(
      this.registrationForm.controls['formUsername'].value,
      this.registrationForm.controls['formPassword'].value
    );

    if (user) {
      if (this.appService.isBrowser)
        localStorage.setItem('userId', user.userId);
      this.appService.user.userId = user.userId;
      this.router.navigate(['/chats']);
    } else {
      this.submitionErrorOccures = true;
    }
  }

  private async singUp() {
    if (this.registrationForm.controls['formName'].valid) {
      let user = await this.registrationService.userExists(
        this.registrationForm.controls['formUsername'].value,
        this.registrationForm.controls['formPassword'].value
      );

      if (user) this.submitionErrorOccures = true;
      else {
        this.registrationService
          .createUser(
            this.registrationForm.controls['formName'].value,
            this.registrationForm.controls['formUsername'].value,
            this.registrationForm.controls['formPassword'].value
          )
          .then(() => {
            this.router.navigate(['/login']);
          });
      }
    }
  }
}
