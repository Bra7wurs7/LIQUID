import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchicalListItemComponent } from './hierarchical-list-item.component';

describe('HierarchicalListItemComponent', () => {
  let component: HierarchicalListItemComponent;
  let fixture: ComponentFixture<HierarchicalListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HierarchicalListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HierarchicalListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
