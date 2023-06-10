import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropsBuilderComponent } from './props-builder.component';

describe('PropsBuilderComponent', () => {
  let component: PropsBuilderComponent;
  let fixture: ComponentFixture<PropsBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropsBuilderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropsBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
