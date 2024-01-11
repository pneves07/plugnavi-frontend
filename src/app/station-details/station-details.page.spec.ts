import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StationDetailsPage } from './station-details.page';

describe('StationDetailsPage', () => {
  let component: StationDetailsPage;
  let fixture: ComponentFixture<StationDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StationDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
