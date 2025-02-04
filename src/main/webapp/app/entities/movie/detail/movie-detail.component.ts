import { Component, input, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import dayjs, { Dayjs } from 'dayjs/esm';
import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IMovie } from '../movie.model';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import { MovieService } from '../service/movie.service';
import { CommentService } from '../../comment/service/comment.service';
import { IComment } from '../../comment/comment.model';
import { CommentFormGroup, CommentFormService } from '../../comment/update/comment-form.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewComment } from '../../comment/comment.model';
import { AccountService } from '../../../core/auth/account.service';
import { AccountCustom } from '../../../core/auth/accountCustom';
import { Account } from '../../../core/auth/account.model';

@Component({
  standalone: true,
  selector: 'jhi-movie-detail',
  templateUrl: './movie-detail.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    HasAnyAuthorityDirective,
  ],
  styleUrl: '../../../../content/scss/movieDetail.scss',
})
export class MovieDetailComponent implements OnInit {
  movieId?: number;
  //các biến để lấy thông tin user
  accountParsed: AccountCustom = {} as AccountCustom;
  accountState: Account = {} as Account;
  userId: number = -1;

  comments?: IComment[];
  movie = input<IMovie | null>(null);
  protected readonly movieService = inject(MovieService);
  protected readonly commentService = inject(CommentService);
  protected commentFormService = inject(CommentFormService);
  protected readonly accountService = inject(AccountService);

  editForm: CommentFormGroup = this.commentFormService.createCommentFormGroup();

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    this.accountService.getAuthenticationState().subscribe({
      next: account => {
        if (account) {
          this.accountState = account;
          this.accountParsed = JSON.parse(JSON.stringify(this.accountState));
          this.userId = this.accountParsed.id;
          if (this.userId > 0) {
            this.getComment();
          }
        }
      },
      error: error => {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      },
    });
  }

  previousState(): void {
    window.history.back();
  }

  getYear(date: Dayjs | null | undefined): string {
    return date ? date.year().toString() : '';
  }

  updateView(id: number) {
    this.movieService.updateViewMovie(id).subscribe();
  }

  getComment() {
    if (this.movie()) {
      this.movieId = this.movie()?.id;
      if (this.movieId) {
        this.commentService.getCommentByMovie(this.movieId, 'like').subscribe(listComment => {
          const filteredCommentUser = listComment.filter(
            comment => comment.user !== null && comment.user !== undefined && comment.user.id === this.userId,
          );

          const theRest = listComment.filter(
            comment => comment.user === null || comment.user === undefined || comment.user.id !== this.userId,
          );
          this.comments = [...filteredCommentUser, ...theRest];
        });
      }
    }
  }

  onSelectChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.getCommentAndSort(selectedValue);
  }

  getCommentAndSort(sortBy: string) {
    if (this.movie()) {
      this.movieId = this.movie()?.id;
      if (this.movieId) {
        this.commentService.getCommentByMovie(this.movieId, sortBy).subscribe(listComment => {
          this.comments = listComment;
        });
      }
    }
  }

  saveComment() {
    const currentDate = dayjs(); // Lấy ngày hiện tại dưới dạng Dayjs

    // Tạo payload theo yêu cầu backend
    if (this.userId !== 0 && this.movieId) {
      const payload: NewComment = {
        id: null, // Vì NewComment yêu cầu id là null
        content: this.editForm.value.content || null,
        date: currentDate, // Chuyển đổi sang kiểu Dayjs
        movie: { id: this.movieId },
        user: { id: this.userId },
        like: 0, // Nếu bạn không cần trường `like`, đặt null
        name: null, // Nếu bạn không cần trường `name`, đặt null
      };

      this.commentService.create(payload).subscribe({
        next: () => alert('Comment created successfully!'),
        error: err => console.error('Error creating comment:', err),
      });
    }
  }

  DeleteComment(idComment: number, idUser?: number): void {
    if (idUser && idUser === this.userId) {
      this.commentService.delete(idComment).subscribe({
        next: () => alert('Comment delete successfully!'),
        error: err => console.error('Error creating comment:', err),
      });
    } else {
      alert('bạn ko có quền xóa comment này');
    }
  }
}
