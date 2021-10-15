import { Component, Input, OnInit } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Category } from 'src/app/models/category.model';
import { GenericPanelComponent } from '../generic-panel/generic-panel.component';
import * as uuid from 'uuid';
import { ConfirmationService } from 'primeng/api';
import { AttributeContainer, AttributeItem, NoteAttribute } from 'src/app/models/noteAttribute.model';

@Component({
  selector: 'app-category-panel',
  templateUrl: './category-panel.component.html',
  styleUrls: ['./category-panel.component.scss'],
  providers: []
})
export class CategoryPanelComponent extends GenericPanelComponent implements OnInit {
  @Input() categories?: Map<string, Category>;
  @Input() categoryName?: string;

  category: Category = new Category()
  editMode: boolean = false;
  addCellMode: boolean = false;
  editContainerMode: boolean = false;
  editItemMode: boolean = false;
  deleteCellMode: boolean = false;

  cellIndex: number = -1;
  oldCell: NoteAttribute | undefined;
  parentContainer: NoteAttribute[] | undefined;

  newCellType: 'container' | 'item' | undefined;
  newCellWidth: 'full' | 'max' | 'min' | 'unset' = 'unset';
  newCellBorder: boolean = false;

  newCellDirection: 'row' | 'col' = 'row';
  newCellJustify: 'start' | 'end' | 'center' | 'around' | 'between' | 'evenly' = 'start';
  newCellAlign: 'stretch' | 'start' | 'center' | 'end' | 'baseline' = 'stretch';

  newCellSeparator: 'thin' | 'medium' | 'wide' | 'none' = 'none';
  newCellFontSize: 'small' | 'medium' | 'large' = 'medium';
  newCellStyle: 'none' | 'italic' | 'bold' | 'both' = 'none';
  newCellConstant: boolean = false;
  newCellId: string = uuid.v4();

  constructor(private confirmationService: ConfirmationService) {
    super()
  }

  ngOnInit(): void {
    if (this.categoryName && this.categories) {
      this.category = this.categories.get(this.categoryName) ?? this.category;
    }
  }

  onGenerateNewIdClick() {
    this.confirmationService.confirm({
      message: 'Generate new Variable Item ID? This will remove association between this table cell and values given to it inside of notes.',
      header: 'Generate new ID',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.newCellId = uuid.v4();
      }
    });
  }

  onNewCellButtonClick(index: number, panel: OverlayPanel, event: Event, container: NoteAttribute[]) {
    this.oldCell = undefined;
    this.parentContainer = container;

    this.cellIndex = index;
    this.newCellType = undefined;
    this.newCellWidth = 'unset';
    this.newCellBorder = false;

    this.newCellDirection = 'row';
    this.newCellJustify = 'start';
    this.newCellAlign = 'stretch';

    this.newCellSeparator = 'none';
    this.newCellFontSize = 'medium';
    this.newCellStyle = 'none';
    this.newCellConstant = false;
    this.newCellId = uuid.v4();

    panel.toggle(event);
  }

  deleteCell(child: NoteAttribute, container: NoteAttribute[]){
    this.confirmationService.confirm({
      message: 'Delete this Cell?',
      header: 'Delete Cell',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        container.splice(container.indexOf(child), 1);
      }
    });
  }

  onEditCellClick(child: NoteAttribute, panel: OverlayPanel, event: Event, container: NoteAttribute[]) {
    this.oldCell = child;
    this.parentContainer = container;
    this.cellIndex = container.indexOf(child);

    this.newCellType = child.isContainer ? 'container' : 'item';
    this.newCellWidth = child.width;
    this.newCellBorder = child.bordered;

    if(child instanceof AttributeContainer) {
      this.newCellDirection = child.direction;
      this.newCellJustify = child.justify;
      this.newCellAlign = child.align;
    }

    if(child instanceof AttributeItem) {
      this.newCellSeparator = child.separator;
      this.newCellFontSize = child.fontSize;
      this.newCellStyle = (child.bold ? (child.italic ? 'both' : 'bold') : (child.italic ? 'italic' : 'none'));
      this.newCellConstant = child.constant;
      this.newCellId = child.contentSlotId;
    }

    panel.toggle(event);
  }

  saveCellToChildren(children: NoteAttribute[] | undefined) {
    let newNoteAttribute: NoteAttribute;
    switch (this.newCellType) {
      case 'container':
        newNoteAttribute = new AttributeContainer(
          this.oldCell ? (this.oldCell as AttributeContainer).children : [],
          this.newCellDirection,
          this.newCellJustify,
          this.newCellAlign,
          this.newCellWidth,
          this.newCellBorder,
          'both',
        )
        break;
      case 'item':
        newNoteAttribute = new AttributeItem(
          this.oldCell ? (this.oldCell as AttributeItem).content : '',
          this.newCellSeparator,
          this.newCellFontSize,
          this.newCellStyle === 'italic' || this.newCellStyle === 'both',
          this.newCellStyle === 'bold' || this.newCellStyle === 'both',
          this.newCellConstant,
          this.newCellWidth,
          this.newCellBorder,
          'both',
          this.newCellId,
        )
        break;
      default:
        newNoteAttribute = new AttributeContainer();
        break;
    }
    if(children) {
      children.splice(this.cellIndex, this.oldCell ? 1 : 0, newNoteAttribute)
    }
  }

  getDirectionName(abb: string) {
    switch (abb) {
      case 'col':
        return 'column';
      case 'row':
        return 'row';
      default:
        return '';
    }
  }

  newContainer(): AttributeContainer {
    return new AttributeContainer([], 'col');
  }

}
