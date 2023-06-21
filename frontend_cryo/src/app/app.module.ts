import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// angualr material //
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Components //
import { AppRoutingModule } from './app-routers/app-routing.module';
import { AppComponent } from './app.component';
import { SeiteWelcomeComponent } from './seite-welcome/seite-welcome.component';
import { SeiteAboutUsComponent } from './seite-about-us/seite-about-us.component';
import { SeiteAboutThisComponent } from './seite-about-this/seite-about-this.component';
import { SeiteTechnologyComponent } from './seite-technology/seite-technology.component';
import { SeiteDatabaseComponent } from './seite-database/seite-database.component';
import { SeiteNnComponent } from './seite-nn/seite-nn.component';


@NgModule({
  declarations: [
    AppComponent,
    SeiteWelcomeComponent,
    SeiteAboutUsComponent,
    SeiteAboutThisComponent,
    SeiteTechnologyComponent,
    SeiteDatabaseComponent,
    SeiteNnComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatDialogModule,
    MatStepperModule,
    MatInputModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatListModule,
    MatSliderModule,
    MatProgressBarModule,
    MatGridListModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatTableModule,
    MatSidenavModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatInputModule,
    MatSortModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatRadioModule,
    RouterModule,
    HttpClientModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

