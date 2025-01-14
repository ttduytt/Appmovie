import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IMovie } from 'app/entities/movie/movie.model';
import { MovieService } from 'app/entities/movie/service/movie.service';
import { TopicService } from '../service/topic.service';
import { ITopic } from '../topic.model';
import { TopicFormService } from './topic-form.service';

import { TopicUpdateComponent } from './topic-update.component';

describe('Topic Management Update Component', () => {
  let comp: TopicUpdateComponent;
  let fixture: ComponentFixture<TopicUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let topicFormService: TopicFormService;
  let topicService: TopicService;
  let movieService: MovieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TopicUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TopicUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TopicUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    topicFormService = TestBed.inject(TopicFormService);
    topicService = TestBed.inject(TopicService);
    movieService = TestBed.inject(MovieService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Movie query and add missing value', () => {
      const topic: ITopic = { id: 456 };
      const movies: IMovie[] = [{ id: 28378 }];
      topic.movies = movies;

      const movieCollection: IMovie[] = [{ id: 11695 }];
      jest.spyOn(movieService, 'query').mockReturnValue(of(new HttpResponse({ body: movieCollection })));
      const additionalMovies = [...movies];
      const expectedCollection: IMovie[] = [...additionalMovies, ...movieCollection];
      jest.spyOn(movieService, 'addMovieToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ topic });
      comp.ngOnInit();

      expect(movieService.query).toHaveBeenCalled();
      expect(movieService.addMovieToCollectionIfMissing).toHaveBeenCalledWith(
        movieCollection,
        ...additionalMovies.map(expect.objectContaining),
      );
      expect(comp.moviesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const topic: ITopic = { id: 456 };
      const movies: IMovie = { id: 29739 };
      topic.movies = [movies];

      activatedRoute.data = of({ topic });
      comp.ngOnInit();

      expect(comp.moviesSharedCollection).toContain(movies);
      expect(comp.topic).toEqual(topic);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITopic>>();
      const topic = { id: 123 };
      jest.spyOn(topicFormService, 'getTopic').mockReturnValue(topic);
      jest.spyOn(topicService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ topic });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: topic }));
      saveSubject.complete();

      // THEN
      expect(topicFormService.getTopic).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(topicService.update).toHaveBeenCalledWith(expect.objectContaining(topic));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITopic>>();
      const topic = { id: 123 };
      jest.spyOn(topicFormService, 'getTopic').mockReturnValue({ id: null });
      jest.spyOn(topicService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ topic: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: topic }));
      saveSubject.complete();

      // THEN
      expect(topicFormService.getTopic).toHaveBeenCalled();
      expect(topicService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITopic>>();
      const topic = { id: 123 };
      jest.spyOn(topicService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ topic });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(topicService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareMovie', () => {
      it('Should forward to movieService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(movieService, 'compareMovie');
        comp.compareMovie(entity, entity2);
        expect(movieService.compareMovie).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
