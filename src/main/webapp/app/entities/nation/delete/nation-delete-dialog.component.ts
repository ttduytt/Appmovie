import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { INation } from '../nation.model';
import { NationService } from '../service/nation.service';

@Component({
  standalone: true,
  templateUrl: './nation-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class NationDeleteDialogComponent {
  nation?: INation;

  protected nationService = inject(NationService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.nationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
