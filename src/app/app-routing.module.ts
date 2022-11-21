import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuResolver, DataResolver, UserResolver } from './data.resolver/data.resolver.module';
import { AddBuildingContactComponent } from './pages/add-building-contact/add-building-contact.component';
import { ContactListComponent } from './pages/contact-list/contact-list.component';
import { DatasourceListComponent } from './pages/datasource-list/datasource-list.component';
import { DocumentPageComponent } from './pages/document-page/document-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { InstructionsPageComponent } from './pages/instructions-page/instructions-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { TemplatePageComponent } from './pages/template-page/template-page.component';

const routes: Routes = [
  {path: '', component: HomePageComponent, resolve: { data: DataResolver } },
  // :id=PLAN, :id2=SECTION_ID
  {path: 'instructions/:id/:id2', component: InstructionsPageComponent, resolve: { data: DataResolver } },
  // :id=PLAN, :id=BUILDING_NBR, :id3=SECTION_ID
  {path: 'plan/:id/:id2/:id3', component: DocumentPageComponent, resolve: { data: DataResolver } },
  // ADMIN ONLY
  {path: 'data', component: DatasourceListComponent, resolve: { data: DataResolver } },
  // :id=PLAN, :id2=BUILDING_NBR
  {path: 'contacts/:id/:id2', component: ContactListComponent, resolve: { data: DataResolver } },
  {path: 'questions/:id/:id2', component: ContactListComponent, resolve: { data: DataResolver } },
  {path: 'tenants/:id/:id2', component: DatasourceListComponent, resolve: { data: DataResolver } },
  {path: 'data-sources', component: DatasourceListComponent, resolve: { data: DataResolver } },
  // :id=PLAN, :id2=BUILDING_NBR, :id3=current for edit
  {path: 'add-building-contact/:id/:id2/:id3', component: AddBuildingContactComponent, resolve: { data: DataResolver } },
  {path: 'add-building-contact/:id/:id2', component: AddBuildingContactComponent, resolve: { data: DataResolver } },
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
