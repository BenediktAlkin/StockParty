import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockPricesFullComponent } from './stock-prices-full.component';

describe('StockPricesFullComponent', () => {
  let component: StockPricesFullComponent;
  let fixture: ComponentFixture<StockPricesFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockPricesFullComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockPricesFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
