import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorDetailComponent } from './color-detail.component';

describe('ColorDetailComponent', () => {
  let component: ColorDetailComponent;
  let fixture: ComponentFixture<ColorDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
