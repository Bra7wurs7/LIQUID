import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CardModule } from 'primeng/card';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TreeModule } from 'primeng/tree';
import { NoteCardComponent } from './components/note-card/note-card.component';
import { MenubarModule } from 'primeng/menubar';
import { PanelModule } from 'primeng/panel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ParseMarkupPipe } from './pipes/parseMarkup/parse-markup.pipe';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    NoteCardComponent,
    ParseMarkupPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    CardModule,
    SidebarModule,
    ButtonModule,
    InputTextModule,
    ScrollPanelModule,
    PanelMenuModule,
    TreeModule,
    MenubarModule,
    PanelModule,
    InputSwitchModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
