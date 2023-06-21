import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeiteAboutUsComponent } from '../seite-about-us/seite-about-us.component';
import { SeiteWelcomeComponent } from '../seite-welcome/seite-welcome.component';
import { SeiteAboutThisComponent } from '../seite-about-this/seite-about-this.component';
import { SeiteTechnologyComponent } from '../seite-technology/seite-technology.component';
import { SeiteDatabaseComponent } from '../seite-database/seite-database.component';
import { SeiteNnComponent } from '../seite-nn/seite-nn.component';


const routes: Routes = [
  { path: '', component: SeiteWelcomeComponent },
  { path: 'about-us', component: SeiteAboutUsComponent },
  { path: 'about-this', component: SeiteAboutThisComponent },
  { path: 'technology', component: SeiteTechnologyComponent },
  { path: 'database', component: SeiteDatabaseComponent },
  { path: 'nn', component: SeiteNnComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
