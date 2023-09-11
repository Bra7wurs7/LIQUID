import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchicalListComponent } from './hierarchical-list.component';

describe('HierarchicalListComponent', () => {
  let component: HierarchicalListComponent;
  let fixture: ComponentFixture<HierarchicalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HierarchicalListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HierarchicalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
