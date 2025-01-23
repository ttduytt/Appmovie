import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMovieSearchComponent } from './list-movie-search.component';

describe('ListMovieSearchComponent', () => {
  let component: ListMovieSearchComponent;
  let fixture: ComponentFixture<ListMovieSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMovieSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListMovieSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
