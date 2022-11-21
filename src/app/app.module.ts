import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxTablePaginationModule } from 'ngx-table-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { TemplatePageComponent } from './pages/template-page/template-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { InstructionsPageComponent } from './pages/instructions-page/instructions-page.component';
import { NgxEditorModule } from 'ngx-editor';
import { DocumentPageComponent } from './pages/document-page/document-page.component';
import { DatasourceListComponent } from './pages/datasource-list/datasource-list.component';
import { ContactListComponent } from './pages/contact-list/contact-list.component';
import { AddBuildingContactComponent } from './pages/add-building-contact/add-building-contact.component';
import { DataSourcesComponent } from './pages/data-sources/data-sources.component';
import { PlanQuestionListComponent } from './pages/plan-question-list/plan-question-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    TemplatePageComponent,
    LandingPageComponent,
    InstructionsPageComponent,
    DocumentPageComponent,
    DatasourceListComponent,
    ContactListComponent,
    AddBuildingContactComponent,
    DataSourcesComponent,
    PlanQuestionListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxTablePaginationModule,
    Ng2SearchPipeModule,
    NgxEditorModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
