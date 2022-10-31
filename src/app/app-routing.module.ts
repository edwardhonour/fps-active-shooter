import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuResolver, DataResolver, UserResolver } from './data.resolver/data.resolver.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { InstructionsPageComponent } from './pages/instructions-page/instructions-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { TemplatePageComponent } from './pages/template-page/template-page.component';

const routes: Routes = [
  {path: '', component: HomePageComponent, resolve: { data: DataResolver } },
  {path: 'instructions/:id', component: InstructionsPageComponent, resolve: { data: DataResolver } },
  {path: 'template/:id', component: TemplatePageComponent, resolve: { menudata: MenuResolver, data: DataResolver, userdata: UserResolver } },
  {path: 'doc/:id', component: LandingPageComponent, resolve: { menudata: MenuResolver, data: DataResolver, userdata: UserResolver } },
  {path: 'doc/:id/:id2', component: LandingPageComponent, resolve: { menudata: MenuResolver, data: DataResolver, userdata: UserResolver } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
