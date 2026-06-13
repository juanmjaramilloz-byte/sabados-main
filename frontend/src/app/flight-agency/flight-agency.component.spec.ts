import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightAgencyComponent } from './flight-agency.component';

describe('FlightAgencyComponent', () => {
  let component: FlightAgencyComponent;
  let fixture: ComponentFixture<FlightAgencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightAgencyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlightAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
