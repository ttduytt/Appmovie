import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IMovie } from '../movie.model';
import { MovieService } from '../service/movie.service';

@Component({
  standalone: true,
  templateUrl: './movie-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class MovieDeleteDialogComponent {
  movie?: IMovie;

  protected movieService = inject(MovieService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.movieService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
