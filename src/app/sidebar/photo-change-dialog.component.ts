import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppService } from '../app.service';
import { User } from '../user';
import { NgIf } from '@angular/common';

@Component({
  selector: 'photo-change-dialog',
  standalone: true,
  templateUrl: 'photo-change-dialog.component.html',
  styleUrl: 'photo-change-dialog.component.scss',
  imports: [FormsModule, NgIf, ReactiveFormsModule],
})
export class PhotoChangeDialog {
  public selectedPhotoUrl: string = '';
  public isOpen: boolean = false;

  public photoInput = new FormControl('photoInput');
  public nameInput = new FormControl('nameInput');
  public usernameInput = new FormControl('usernameInput');

  constructor(protected appService: AppService) {}

  @ViewChild('photoChangeDialog', { static: false })
  photoChangeDialog!: ElementRef;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  open() {
    this.isOpen = true;

    // this.photoInput.value = '';
    console.log(this.photoInput, this.nameInput)

    this.photoChangeDialog.nativeElement.showModal();
  }

  showSelectedPhoto() {
    this.selectedPhotoUrl = URL.createObjectURL(
      this.fileInput.nativeElement.files[0]
    );
  }

  closePhotoChangeDialog() {
    this.isOpen = false;
    this.photoChangeDialog.nativeElement.close();
  }

  updateUserData() {
    console.log(
      this.photoInput.dirty,
      this.nameInput.dirty,
      this.usernameInput.dirty
    );
  }
}
