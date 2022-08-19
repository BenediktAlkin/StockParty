import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BartenderDrinkComponent } from './bartender-drink.component';

describe('BartenderDrinkComponent', () => {
  let component: BartenderDrinkComponent;
  let fixture: ComponentFixture<BartenderDrinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BartenderDrinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BartenderDrinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
