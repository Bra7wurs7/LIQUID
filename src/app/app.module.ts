import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TreeModule } from 'primeng/tree';
import { NotePanelComponent } from './components/note-panel/note-panel.component';
import { MenubarModule } from 'primeng/menubar';
import { PanelModule } from 'primeng/panel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ParseMarkupPipe } from './pipes/parseMarkup/parse-markup.pipe';
import { HttpClientModule } from '@angular/common/http';
import { FillAttributePipe } from './pipes/fillAttribute/fill-attribute.pipe';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DragDropModule } from 'primeng/dragdrop';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CategoryPanelComponent } from './components/category-panel/category-panel.component';
import { TooltipModule } from 'primeng/tooltip';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { LocalDriveService } from './services/localDrive/local-drive.service';
import { IndexedDbService } from './services/indexedDb/indexed-db.service';
import {DialogModule} from 'primeng/dialog';
import {TableModule} from 'primeng/table';


@NgModule({
  declarations: [
    AppComponent,
    NotePanelComponent,
    ParseMarkupPipe,
    FillAttributePipe,
    CategoryPanelComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
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
    InputTextareaModule,
    SplitButtonModule,
    ContextMenuModule,
    DragDropModule,
    OverlayPanelModule,
    MenuModule,
    ToastModule,
    TooltipModule,
    SelectButtonModule,
    ConfirmDialogModule,
    AutoCompleteModule,
    DialogModule,
    TableModule,
  ],
  providers: [ConfirmationService, MessageService, LocalDriveService, IndexedDbService],
  bootstrap: [AppComponent]
})
export class AppModule { }
