import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

import { WebsiteComponent } from './website/website.component';



const routes: Routes = [
  { path: 'mikrobuva', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)},
  { path: '', component: WebsiteComponent },
  // { path: '**', redirectTo: '' }
];


const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled'
};
@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
