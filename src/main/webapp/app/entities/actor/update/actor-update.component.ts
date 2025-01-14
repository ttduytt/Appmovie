import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IMovie } from 'app/entities/movie/movie.model';
import { MovieService } from 'app/entities/movie/service/movie.service';
import { IActor } from '../actor.model';
import { ActorService } from '../service/actor.service';
import { ActorFormGroup, ActorFormService } from './actor-form.service';

@Component({
  standalone: true,
  selector: 'jhi-actor-update',
  templateUrl: './actor-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ActorUpdateComponent implements OnInit {
  isSaving = false;
  actor: IActor | null = null;

  moviesSharedCollection: IMovie[] = [];

  protected actorService = inject(ActorService);
  protected actorFormService = inject(ActorFormService);
  protected movieService = inject(MovieService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ActorFormGroup = this.actorFormService.createActorFormGroup();

  compareMovie = (o1: IMovie | null, o2: IMovie | null): boolean => this.movieService.compareMovie(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ actor }) => {
      this.actor = actor;
      if (actor) {
        this.updateForm(actor);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const actor = this.actorFormService.getActor(this.editForm);
    if (actor.id !== null) {
      this.subscribeToSaveResponse(this.actorService.update(actor));
    } else {
      this.subscribeToSaveResponse(this.actorService.create(actor));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActor>>): void {
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

  protected updateForm(actor: IActor): void {
    this.actor = actor;
    this.actorFormService.resetForm(this.editForm, actor);

    this.moviesSharedCollection = this.movieService.addMovieToCollectionIfMissing<IMovie>(
      this.moviesSharedCollection,
      ...(actor.movies ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.movieService
      .query()
      .pipe(map((res: HttpResponse<IMovie[]>) => res.body ?? []))
      .pipe(map((movies: IMovie[]) => this.movieService.addMovieToCollectionIfMissing<IMovie>(movies, ...(this.actor?.movies ?? []))))
      .subscribe((movies: IMovie[]) => (this.moviesSharedCollection = movies));
  }
}
