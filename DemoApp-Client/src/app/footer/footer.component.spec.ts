import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the footer component', () => {
    expect(component).toBeTruthy();
  });

  it('should automatically compute and render the current year using Signals', () => {
    const expectedYear = new Date().getFullYear();
    expect(component.currentYear()).toBe(expectedYear);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(expectedYear.toString());
  });

  it('should update current date and year signal when refreshDate is called', () => {
    component.refreshDate();
    expect(component.currentYear()).toBe(new Date().getFullYear());
  });
});
