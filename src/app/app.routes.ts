import { Routes } from '@angular/router';
import { authGuard } from './guard/auth/auth-guard';
import { guestGuard } from './guard/guest/guest-guard';

export const routes: Routes = [
  {
    path: 'login',
    // canActivate:[guestGuard],
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    // canActivate:[guestGuard],
    loadComponent: () => import('./signup/signup.component').then((m) => m.SignupComponent),
  },
  {
    path: 'home',
    // canActivate:[authGuard],
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'task',
    // canActivate:[authGuard],
    loadComponent: () => import('./add-task/add-task.component').then((m) => m.AddTaskComponent),
  },
  {
    path: 'setting',
    // canActivate:[authGuard],
    loadComponent: () => import('./setting/setting.component').then((m) => m.SettingComponent),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
