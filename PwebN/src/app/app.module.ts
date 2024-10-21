import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProfileComponent } from './profile/profile.component';
import { HeaderComponent } from './header/header.component';
import { NoticiasComponent } from './noticias/noticias.component';
import { NoticiasTabla1Component } from './noticias-tabla-1/noticias-tabla-1.component';
import { NoticiasTabla2Component } from './noticias-tabla-2/noticias-tabla-2.component';
import { ConfiguracionDePublicidadComponent } from './configuracion-de-publicidad/configuracion-de-publicidad.component';
import { TransmisionesEnVivoComponent } from './transmisiones-en-vivo/transmisiones-en-vivo.component';
import { ParametrosDeCobroComponent } from './parametros-de-cobro/parametros-de-cobro.component';
import { HorariosDeAtencionComponent } from './horarios-de-atencion/horarios-de-atencion.component';
import { ConfigurarPublicidadComponent } from './configurar-publicidad/configurar-publicidad.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SidebarComponent,
    ProfileComponent,
    HeaderComponent,
    NoticiasComponent,
    NoticiasTabla1Component,
    NoticiasTabla2Component,
    ConfiguracionDePublicidadComponent,
    TransmisionesEnVivoComponent,
    ParametrosDeCobroComponent,
    HorariosDeAtencionComponent,
    ConfigurarPublicidadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
