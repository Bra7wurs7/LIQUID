import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { GenericPanelComponent } from '../generic-panel/generic-panel.component';

@Component({
  selector: 'app-category-panel',
  templateUrl: './category-panel.component.html',
  styleUrls: ['./category-panel.component.scss']
})
export class CategoryPanelComponent extends GenericPanelComponent implements OnInit {
  @Input() categories?: Map<string, Category>;
  @Input() categoryName?: string;

  category: Category = new Category()
  editMode: boolean = false;

  constructor() {
    super()
  }

  ngOnInit(): void {
    if(this.categoryName && this.categories) {
      this.category = this.categories.get(this.categoryName) ?? this.category;
    }
  }

}
