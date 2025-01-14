import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IMovie } from 'app/entities/movie/movie.model';
import { MovieService } from 'app/entities/movie/service/movie.service';
import { IComment } from '../comment.model';
import { CommentService } from '../service/comment.service';
import { CommentFormGroup, CommentFormService } from './comment-form.service';

@Component({
  standalone: true,
  selector: 'jhi-comment-update',
  templateUrl: './comment-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CommentUpdateComponent implements OnInit {
  isSaving = false;
  comment: IComment | null = null;

  moviesSharedCollection: IMovie[] = [];

  protected commentService = inject(CommentService);
  protected commentFormService = inject(CommentFormService);
  protected movieService = inject(MovieService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CommentFormGroup = this.commentFormService.createCommentFormGroup();

  compareMovie = (o1: IMovie | null, o2: IMovie | null): boolean => this.movieService.compareMovie(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comment }) => {
      this.comment = comment;
      if (comment) {
        this.updateForm(comment);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const comment = this.commentFormService.getComment(this.editForm);
    if (comment.id !== null) {
      this.subscribeToSaveResponse(this.commentService.update(comment));
    } else {
      this.subscribeToSaveResponse(this.commentService.create(comment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IComment>>): void {
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

  protected updateForm(comment: IComment): void {
    this.comment = comment;
    this.commentFormService.resetForm(this.editForm, comment);

    this.moviesSharedCollection = this.movieService.addMovieToCollectionIfMissing<IMovie>(this.moviesSharedCollection, comment.movie);
  }

  protected loadRelationshipsOptions(): void {
    this.movieService
      .query()
      .pipe(map((res: HttpResponse<IMovie[]>) => res.body ?? []))
      .pipe(map((movies: IMovie[]) => this.movieService.addMovieToCollectionIfMissing<IMovie>(movies, this.comment?.movie)))
      .subscribe((movies: IMovie[]) => (this.moviesSharedCollection = movies));
  }
}
