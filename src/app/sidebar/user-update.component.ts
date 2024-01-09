import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { AppService } from '../app.service';

@Component({
  selector: 'user-update-comp',
  standalone: true,
  templateUrl: 'user-update.component.html',
  styleUrl: 'user-update.component.scss',
  imports: [FormsModule, NgIf, ReactiveFormsModule],
})
export class UserUpdateComponent {
  public dialogForm!: FormGroup;
  public selectedPhotoUrl: string = '';
  protected isFormNameInputReadonly: boolean = true;
  protected isFormUsernameInputReadonly: boolean = true;

  constructor(private appService: AppService) {
    this.dialogForm = new FormGroup({
      formName: new FormControl(this.appService.user.name, Validators.required),
      formUsername: new FormControl(
        this.appService.user.username,
        Validators.required
      ),
    });
  }

  @ViewChild('dialog', { static: false }) private dialog:
    | ElementRef
    | undefined;

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef | undefined;

  @Output() onClose = new EventEmitter();

  showSelectedPhoto() {
    this.selectedPhotoUrl = URL.createObjectURL(
      this.fileInput?.nativeElement.files[0]
    );
  }

  open() {
    this.dialog?.nativeElement.showModal();
  }

  close() {
    this.dialog?.nativeElement.close();
    this.onClose.emit();
  }

  updateUserData() {
    console.log(this.dialogForm);
  }

  changeCurrentState(inputName: string) {
    if (inputName === 'formName')
      this.isFormNameInputReadonly = !this.isFormNameInputReadonly;
    else this.isFormUsernameInputReadonly = !this.isFormUsernameInputReadonly;
  }
}
