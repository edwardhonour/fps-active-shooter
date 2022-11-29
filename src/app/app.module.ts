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
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { NgxEditorModule } from 'ngx-editor';
import { DocumentPageComponent } from './pages/document-page/document-page.component';
import { DatasourceListComponent } from './pages/datasource-list/datasource-list.component';
import { ContactListComponent } from './pages/contact-list/contact-list.component';
import { AddBuildingContactComponent } from './pages/add-building-contact/add-building-contact.component';
import { DataSourcesComponent } from './pages/data-sources/data-sources.component';
import { PlanQuestionListComponent } from './pages/plan-question-list/plan-question-list.component';
import { SectionListComponent } from './display/section-list/section-list.component';
import { PageHeaderComponent } from './display/page-header/page-header.component';
import { ListComponentComponent } from './display/list-component/list-component.component';
import { DatasourceFormComponent } from './forms/datasource-form/datasource-form.component';
import { ContactsFormComponent } from './forms/contacts-form/contacts-form.component';
import { QuestionMaintFormComponent } from './forms/question-maint-form/question-maint-form.component';
import { QuestionFormComponent } from './forms/question-form/question-form.component';
import { PageFooterComponent } from './display/page-footer/page-footer.component';
import { PlanMenuComponent } from './display/plan-menu/plan-menu.component';
import { FacilityInfoComponent } from './display/facility-info/facility-info.component';
import { PlanTemplatePageComponent } from './pages/plan-template-page/plan-template-page.component';
import { PlanTemplateMenuComponent } from './display/plan-template-menu/plan-template-menu.component';
import { AddSectionFormComponent } from './forms/add-section-form/add-section-form.component';
import { DocumentMenuComponent } from './display/document-menu/document-menu.component';
import { DataTagListComponent } from './display/data-tag-list/data-tag-list.component';
import { UploadFormComponent } from './forms/upload-form/upload-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LandingPageComponent,
    DocumentPageComponent,
    DatasourceListComponent,
    ContactListComponent,
    AddBuildingContactComponent,
    DataSourcesComponent,
    PlanQuestionListComponent,
    SectionListComponent,
    PageHeaderComponent,
    ListComponentComponent,
    DatasourceFormComponent,
    ContactsFormComponent,
    QuestionMaintFormComponent,
    QuestionFormComponent,
    PageFooterComponent,
    PlanMenuComponent,
    FacilityInfoComponent,
    PlanTemplatePageComponent,
    PlanTemplateMenuComponent,
    AddSectionFormComponent,
    DocumentMenuComponent,
    DataTagListComponent,
    UploadFormComponent
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
