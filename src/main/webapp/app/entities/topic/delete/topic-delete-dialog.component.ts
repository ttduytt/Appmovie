import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITopic } from '../topic.model';
import { TopicService } from '../service/topic.service';

@Component({
  standalone: true,
  templateUrl: './topic-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TopicDeleteDialogComponent {
  topic?: ITopic;

  protected topicService = inject(TopicService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.topicService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
