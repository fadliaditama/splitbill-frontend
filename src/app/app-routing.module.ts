import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  // Rute untuk auth dengan lazy loading
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },

  // Rute untuk dashboard dengan lazy loading yang dilindungi oleh AuthGuard
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard],
  },

  // Rute default, arahkan ke login
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  // Jika URL tidak ditemukan, arahkan juga ke login
  { path: '**', redirectTo: '/auth/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
