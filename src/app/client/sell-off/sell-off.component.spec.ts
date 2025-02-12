import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellOffComponent } from './sell-off.component';

describe('SellOffComponent', () => {
  let component: SellOffComponent;
  let fixture: ComponentFixture<SellOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellOffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
