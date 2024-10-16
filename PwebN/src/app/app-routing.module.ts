import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth.guard';
import { NoticiasComponent } from './noticias/noticias.component';
import { NoticiasTabla2Component } from './noticias-tabla-2/noticias-tabla-2.component';
import { ConfiguracionDePublicidadComponent } from './configuracion-de-publicidad/configuracion-de-publicidad.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },  // Protege esta ruta
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent},
  { path: 'noticias', component: NoticiasComponent },
  { path: 'noticias-create', component: NoticiasTabla2Component},
  { path: 'configuracion-de-publicidad', component: ConfiguracionDePublicidadComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
