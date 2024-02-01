import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdbSettingsComponent } from './idb-settings.component';

describe('IdbSettingsComponent', () => {
  let component: IdbSettingsComponent;
  let fixture: ComponentFixture<IdbSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdbSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdbSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
