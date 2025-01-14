import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { INation } from 'app/entities/nation/nation.model';
import { NationService } from 'app/entities/nation/service/nation.service';
import { IActor } from 'app/entities/actor/actor.model';
import { ActorService } from 'app/entities/actor/service/actor.service';
import { ITopic } from 'app/entities/topic/topic.model';
import { TopicService } from 'app/entities/topic/service/topic.service';
import { IMovie } from '../movie.model';
import { MovieService } from '../service/movie.service';
import { MovieFormService } from './movie-form.service';

import { MovieUpdateComponent } from './movie-update.component';

describe('Movie Management Update Component', () => {
  let comp: MovieUpdateComponent;
  let fixture: ComponentFixture<MovieUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let movieFormService: MovieFormService;
  let movieService: MovieService;
  let nationService: NationService;
  let actorService: ActorService;
  let topicService: TopicService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MovieUpdateComponent],
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
      .overrideTemplate(MovieUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MovieUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    movieFormService = TestBed.inject(MovieFormService);
    movieService = TestBed.inject(MovieService);
    nationService = TestBed.inject(NationService);
    actorService = TestBed.inject(ActorService);
    topicService = TestBed.inject(TopicService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Nation query and add missing value', () => {
      const movie: IMovie = { id: 456 };
      const nation: INation = { id: 9778 };
      movie.nation = nation;

      const nationCollection: INation[] = [{ id: 15620 }];
      jest.spyOn(nationService, 'query').mockReturnValue(of(new HttpResponse({ body: nationCollection })));
      const additionalNations = [nation];
      const expectedCollection: INation[] = [...additionalNations, ...nationCollection];
      jest.spyOn(nationService, 'addNationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ movie });
      comp.ngOnInit();

      expect(nationService.query).toHaveBeenCalled();
      expect(nationService.addNationToCollectionIfMissing).toHaveBeenCalledWith(
        nationCollection,
        ...additionalNations.map(expect.objectContaining),
      );
      expect(comp.nationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Actor query and add missing value', () => {
      const movie: IMovie = { id: 456 };
      const actors: IActor[] = [{ id: 13194 }];
      movie.actors = actors;

      const actorCollection: IActor[] = [{ id: 11092 }];
      jest.spyOn(actorService, 'query').mockReturnValue(of(new HttpResponse({ body: actorCollection })));
      const additionalActors = [...actors];
      const expectedCollection: IActor[] = [...additionalActors, ...actorCollection];
      jest.spyOn(actorService, 'addActorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ movie });
      comp.ngOnInit();

      expect(actorService.query).toHaveBeenCalled();
      expect(actorService.addActorToCollectionIfMissing).toHaveBeenCalledWith(
        actorCollection,
        ...additionalActors.map(expect.objectContaining),
      );
      expect(comp.actorsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Topic query and add missing value', () => {
      const movie: IMovie = { id: 456 };
      const topics: ITopic[] = [{ id: 4669 }];
      movie.topics = topics;

      const topicCollection: ITopic[] = [{ id: 12810 }];
      jest.spyOn(topicService, 'query').mockReturnValue(of(new HttpResponse({ body: topicCollection })));
      const additionalTopics = [...topics];
      const expectedCollection: ITopic[] = [...additionalTopics, ...topicCollection];
      jest.spyOn(topicService, 'addTopicToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ movie });
      comp.ngOnInit();

      expect(topicService.query).toHaveBeenCalled();
      expect(topicService.addTopicToCollectionIfMissing).toHaveBeenCalledWith(
        topicCollection,
        ...additionalTopics.map(expect.objectContaining),
      );
      expect(comp.topicsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const movie: IMovie = { id: 456 };
      const nation: INation = { id: 10561 };
      movie.nation = nation;
      const actors: IActor = { id: 9305 };
      movie.actors = [actors];
      const topics: ITopic = { id: 16237 };
      movie.topics = [topics];

      activatedRoute.data = of({ movie });
      comp.ngOnInit();

      expect(comp.nationsSharedCollection).toContain(nation);
      expect(comp.actorsSharedCollection).toContain(actors);
      expect(comp.topicsSharedCollection).toContain(topics);
      expect(comp.movie).toEqual(movie);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMovie>>();
      const movie = { id: 123 };
      jest.spyOn(movieFormService, 'getMovie').mockReturnValue(movie);
      jest.spyOn(movieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ movie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: movie }));
      saveSubject.complete();

      // THEN
      expect(movieFormService.getMovie).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(movieService.update).toHaveBeenCalledWith(expect.objectContaining(movie));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMovie>>();
      const movie = { id: 123 };
      jest.spyOn(movieFormService, 'getMovie').mockReturnValue({ id: null });
      jest.spyOn(movieService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ movie: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: movie }));
      saveSubject.complete();

      // THEN
      expect(movieFormService.getMovie).toHaveBeenCalled();
      expect(movieService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMovie>>();
      const movie = { id: 123 };
      jest.spyOn(movieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ movie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(movieService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareNation', () => {
      it('Should forward to nationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(nationService, 'compareNation');
        comp.compareNation(entity, entity2);
        expect(nationService.compareNation).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareActor', () => {
      it('Should forward to actorService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(actorService, 'compareActor');
        comp.compareActor(entity, entity2);
        expect(actorService.compareActor).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTopic', () => {
      it('Should forward to topicService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(topicService, 'compareTopic');
        comp.compareTopic(entity, entity2);
        expect(topicService.compareTopic).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
