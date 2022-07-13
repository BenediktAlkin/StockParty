import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockPricesComponent } from './stock-prices.component';

describe('StockPricesComponent', () => {
  let component: StockPricesComponent;
  let fixture: ComponentFixture<StockPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockPricesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
