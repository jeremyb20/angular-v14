import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveWagerComponent } from './live-wager.component';

describe('LiveWagerComponent', () => {
  let component: LiveWagerComponent;
  let fixture: ComponentFixture<LiveWagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveWagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveWagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
