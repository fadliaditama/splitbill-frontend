import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitDetailComponent } from './split-detail.component';

describe('SplitDetailComponent', () => {
  let component: SplitDetailComponent;
  let fixture: ComponentFixture<SplitDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SplitDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SplitDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
