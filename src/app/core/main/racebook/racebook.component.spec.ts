import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RacebookComponent } from './racebook.component';

describe('RacebookComponent', () => {
  let component: RacebookComponent;
  let fixture: ComponentFixture<RacebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RacebookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RacebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
