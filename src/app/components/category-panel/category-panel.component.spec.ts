import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryPanelComponent } from './category-panel.component';

describe('CategoryPanelComponent', () => {
  let component: CategoryPanelComponent;
  let fixture: ComponentFixture<CategoryPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
