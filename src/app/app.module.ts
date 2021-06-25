import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  NbButtonModule, NbCardModule,
  NbCheckboxModule,
  NbIconModule, NbInputModule, NbLayoutModule,
  NbListModule,
  NbSelectModule,
  NbThemeModule
} from "@nebular/theme";
import { FormsModule } from "@angular/forms";
import { NbEvaIconsModule } from "@nebular/eva-icons";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NbThemeModule.forRoot({name: 'default'}),
    NbLayoutModule,
    NbEvaIconsModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbIconModule,
    NbListModule,
    NbCheckboxModule,
    NbSelectModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
