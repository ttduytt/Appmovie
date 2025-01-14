import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IActor } from '../actor.model';
import { ActorService } from '../service/actor.service';

@Component({
  standalone: true,
  templateUrl: './actor-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ActorDeleteDialogComponent {
  actor?: IActor;

  protected actorService = inject(ActorService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.actorService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
