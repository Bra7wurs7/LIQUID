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
import { PanelModule } from 'primeng/panel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ParseMarkupPipe } from './pipes/parseMarkup/parse-markup.pipe';
import { HttpClientModule } from '@angular/common/http';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DragDropModule } from 'primeng/dragdrop';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { IndexedDbService } from './services/indexedDb/indexed-db.service';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { HierarchicalListComponent } from './components/hierarchical-list/hierarchical-list.component';
import { ContextMenusService } from './services/contextMenus/context-menus.service';
import { ArticleHierarchyListStringFilterPipe } from './pipes/articleHierarchyListStringFilter/article-hierarchy-list-filter.pipe';
import { MapToListPipe } from './pipes/mapToList/map-to-list.pipe';
import { ArticleHierarchyListRootFilterPipe } from './pipes/articleHierarchyListRootFilter/article-hierarchy-list-root-filter.pipe';
import { ArticleHierarchyMapGetPipe } from './pipes/articleHierarchyMapGet/article-hierarchy-map-get.pipe';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ArticleNameAndCategoriesToStringPipe } from './pipes/articleNameAndCategoriesToString/article-name-and-categories-to-string.pipe';
import { MenuComponent } from './components/menu/menu.component';
import { UrlDomainPipe } from './pipes/urlDomain/url-domain.pipe';
import { ConversationViewerComponent } from './components/conversation-viewer/conversation-viewer.component';
import { AlertsListComponent } from './components/alerts-list/alerts-list.component';
import { ArticleHierarchyNodesFilterPipe } from './pipes/articleHierarchyNodeFilter/article-hierarchy-nodes-filter.pipe';


@NgModule({
  declarations: [
    AppComponent,
    NotePanelComponent,
    ParseMarkupPipe,
    PrivacyPolicyComponent,
    HierarchicalListComponent,
    ArticleHierarchyListStringFilterPipe,
    MapToListPipe,
    ArticleHierarchyListRootFilterPipe,
    ArticleHierarchyMapGetPipe,
    MenuComponent,
    ConversationViewerComponent,
    AlertsListComponent,
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
    RatingModule,
    CascadeSelectModule,
    ArticleNameAndCategoriesToStringPipe,
    UrlDomainPipe,
    ArticleHierarchyNodesFilterPipe,
  ],
  providers: [ConfirmationService, MessageService, IndexedDbService, ContextMenusService],
  bootstrap: [AppComponent]
})
export class AppModule { }
