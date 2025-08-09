import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SplitDetailComponent } from './components/split-detail/split-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HistoryDetailComponent } from './components/history-detail/history-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'split/:id', component: SplitDetailComponent },
  { path: 'history/:id', component: HistoryDetailComponent }
];

@NgModule({
  declarations: [
    HomeComponent,
    SplitDetailComponent,
    HistoryDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DashboardModule { }
