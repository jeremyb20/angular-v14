import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CockfightComponent } from './cockfight.component';

describe('CockfightComponent', () => {
  let component: CockfightComponent;
  let fixture: ComponentFixture<CockfightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CockfightComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CockfightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
