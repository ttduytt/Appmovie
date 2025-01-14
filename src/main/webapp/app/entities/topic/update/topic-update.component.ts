import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IMovie } from 'app/entities/movie/movie.model';
import { MovieService } from 'app/entities/movie/service/movie.service';
import { ITopic } from '../topic.model';
import { TopicService } from '../service/topic.service';
import { TopicFormGroup, TopicFormService } from './topic-form.service';

@Component({
  standalone: true,
  selector: 'jhi-topic-update',
  templateUrl: './topic-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TopicUpdateComponent implements OnInit {
  isSaving = false;
  topic: ITopic | null = null;

  moviesSharedCollection: IMovie[] = [];

  protected topicService = inject(TopicService);
  protected topicFormService = inject(TopicFormService);
  protected movieService = inject(MovieService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TopicFormGroup = this.topicFormService.createTopicFormGroup();

  compareMovie = (o1: IMovie | null, o2: IMovie | null): boolean => this.movieService.compareMovie(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ topic }) => {
      this.topic = topic;
      if (topic) {
        this.updateForm(topic);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const topic = this.topicFormService.getTopic(this.editForm);
    if (topic.id !== null) {
      this.subscribeToSaveResponse(this.topicService.update(topic));
    } else {
      this.subscribeToSaveResponse(this.topicService.create(topic));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITopic>>): void {
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

  protected updateForm(topic: ITopic): void {
    this.topic = topic;
    this.topicFormService.resetForm(this.editForm, topic);

    this.moviesSharedCollection = this.movieService.addMovieToCollectionIfMissing<IMovie>(
      this.moviesSharedCollection,
      ...(topic.movies ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.movieService
      .query()
      .pipe(map((res: HttpResponse<IMovie[]>) => res.body ?? []))
      .pipe(map((movies: IMovie[]) => this.movieService.addMovieToCollectionIfMissing<IMovie>(movies, ...(this.topic?.movies ?? []))))
      .subscribe((movies: IMovie[]) => (this.moviesSharedCollection = movies));
  }
}
