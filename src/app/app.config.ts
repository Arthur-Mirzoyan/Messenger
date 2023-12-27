import { ApplicationConfig } from '@angular/core';
import { Routes, provideRouter } from '@angular/router';

import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  { path: 'chats', component: HomeComponent },
  { path: 'login', component: RegistrationComponent },
  // { path: '**', redirectTo: 'login' },
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(appRoutes)],
};
