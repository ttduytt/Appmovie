import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { INation } from 'app/entities/nation/nation.model';
import { NationService } from 'app/entities/nation/service/nation.service';
import { IActor } from 'app/entities/actor/actor.model';
import { ActorService } from 'app/entities/actor/service/actor.service';
import { ITopic } from 'app/entities/topic/topic.model';
import { TopicService } from 'app/entities/topic/service/topic.service';
import { MovieService } from '../service/movie.service';
import { IMovie } from '../movie.model';
import { MovieFormGroup, MovieFormService } from './movie-form.service';

@Component({
  standalone: true,
  selector: 'jhi-movie-update',
  templateUrl: './movie-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MovieUpdateComponent implements OnInit {
  isSaving = false;
  movie: IMovie | null = null;

  nationsSharedCollection: INation[] = [];
  actorsSharedCollection: IActor[] = [];
  topicsSharedCollection: ITopic[] = [];

  protected movieService = inject(MovieService);
  protected movieFormService = inject(MovieFormService);
  protected nationService = inject(NationService);
  protected actorService = inject(ActorService);
  protected topicService = inject(TopicService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: MovieFormGroup = this.movieFormService.createMovieFormGroup();

  compareNation = (o1: INation | null, o2: INation | null): boolean => this.nationService.compareNation(o1, o2);

  compareActor = (o1: IActor | null, o2: IActor | null): boolean => this.actorService.compareActor(o1, o2);

  compareTopic = (o1: ITopic | null, o2: ITopic | null): boolean => this.topicService.compareTopic(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ movie }) => {
      this.movie = movie;
      if (movie) {
        this.updateForm(movie);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const movie = this.movieFormService.getMovie(this.editForm);
    if (movie.id !== null) {
      this.subscribeToSaveResponse(this.movieService.update(movie));
    } else {
      this.subscribeToSaveResponse(this.movieService.create(movie));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMovie>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(movie: IMovie): void {
    this.movie = movie;
    this.movieFormService.resetForm(this.editForm, movie);

    this.nationsSharedCollection = this.nationService.addNationToCollectionIfMissing<INation>(this.nationsSharedCollection, movie.nation);
    this.actorsSharedCollection = this.actorService.addActorToCollectionIfMissing<IActor>(
      this.actorsSharedCollection,
      ...(movie.actors ?? []),
    );
    this.topicsSharedCollection = this.topicService.addTopicToCollectionIfMissing<ITopic>(
      this.topicsSharedCollection,
      ...(movie.topics ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.nationService
      .query()
      .pipe(map((res: HttpResponse<INation[]>) => res.body ?? []))
      .pipe(map((nations: INation[]) => this.nationService.addNationToCollectionIfMissing<INation>(nations, this.movie?.nation)))
      .subscribe((nations: INation[]) => (this.nationsSharedCollection = nations));

    this.actorService
      .query()
      .pipe(map((res: HttpResponse<IActor[]>) => res.body ?? []))
      .pipe(map((actors: IActor[]) => this.actorService.addActorToCollectionIfMissing<IActor>(actors, ...(this.movie?.actors ?? []))))
      .subscribe((actors: IActor[]) => (this.actorsSharedCollection = actors));

    this.topicService
      .query()
      .pipe(map((res: HttpResponse<ITopic[]>) => res.body ?? []))
      .pipe(map((topics: ITopic[]) => this.topicService.addTopicToCollectionIfMissing<ITopic>(topics, ...(this.movie?.topics ?? []))))
      .subscribe((topics: ITopic[]) => (this.topicsSharedCollection = topics));
  }
}
