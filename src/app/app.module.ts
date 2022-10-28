import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthModule } from '@auth0/auth0-angular';
import { AuthInitializerComponent } from './auth-initializer/auth-initializer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/material/material.module';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    AuthInitializerComponent
  ],
  imports: [
    BrowserModule,

    AuthModule.forRoot({
      domain: environment.domain,
      clientId: environment.clientId,
      cacheLocation: 'localstorage'
    }),

    AppRoutingModule,
    MaterialModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
