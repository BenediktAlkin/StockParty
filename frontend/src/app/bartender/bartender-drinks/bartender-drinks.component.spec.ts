import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BartenderDrinksComponent } from './bartender-drinks.component';

describe('BartenderDrinksComponent', () => {
  let component: BartenderDrinksComponent;
  let fixture: ComponentFixture<BartenderDrinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BartenderDrinksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BartenderDrinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
