import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IMovie } from 'app/entities/movie/movie.model';
import { MovieService } from 'app/entities/movie/service/movie.service';
import { ActorService } from '../service/actor.service';
import { IActor } from '../actor.model';
import { ActorFormService } from './actor-form.service';

import { ActorUpdateComponent } from './actor-update.component';

describe('Actor Management Update Component', () => {
  let comp: ActorUpdateComponent;
  let fixture: ComponentFixture<ActorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let actorFormService: ActorFormService;
  let actorService: ActorService;
  let movieService: MovieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ActorUpdateComponent],
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
      .overrideTemplate(ActorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    actorFormService = TestBed.inject(ActorFormService);
    actorService = TestBed.inject(ActorService);
    movieService = TestBed.inject(MovieService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Movie query and add missing value', () => {
      const actor: IActor = { id: 456 };
      const movies: IMovie[] = [{ id: 21586 }];
      actor.movies = movies;

      const movieCollection: IMovie[] = [{ id: 14911 }];
      jest.spyOn(movieService, 'query').mockReturnValue(of(new HttpResponse({ body: movieCollection })));
      const additionalMovies = [...movies];
      const expectedCollection: IMovie[] = [...additionalMovies, ...movieCollection];
      jest.spyOn(movieService, 'addMovieToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ actor });
      comp.ngOnInit();

      expect(movieService.query).toHaveBeenCalled();
      expect(movieService.addMovieToCollectionIfMissing).toHaveBeenCalledWith(
        movieCollection,
        ...additionalMovies.map(expect.objectContaining),
      );
      expect(comp.moviesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const actor: IActor = { id: 456 };
      const movies: IMovie = { id: 6327 };
      actor.movies = [movies];

      activatedRoute.data = of({ actor });
      comp.ngOnInit();

      expect(comp.moviesSharedCollection).toContain(movies);
      expect(comp.actor).toEqual(actor);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActor>>();
      const actor = { id: 123 };
      jest.spyOn(actorFormService, 'getActor').mockReturnValue(actor);
      jest.spyOn(actorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: actor }));
      saveSubject.complete();

      // THEN
      expect(actorFormService.getActor).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(actorService.update).toHaveBeenCalledWith(expect.objectContaining(actor));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActor>>();
      const actor = { id: 123 };
      jest.spyOn(actorFormService, 'getActor').mockReturnValue({ id: null });
      jest.spyOn(actorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actor: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: actor }));
      saveSubject.complete();

      // THEN
      expect(actorFormService.getActor).toHaveBeenCalled();
      expect(actorService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActor>>();
      const actor = { id: 123 };
      jest.spyOn(actorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(actorService.update).toHaveBeenCalled();
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
