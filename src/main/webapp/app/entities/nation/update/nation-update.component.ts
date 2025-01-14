import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { INation } from '../nation.model';
import { NationService } from '../service/nation.service';
import { NationFormGroup, NationFormService } from './nation-form.service';

@Component({
  standalone: true,
  selector: 'jhi-nation-update',
  templateUrl: './nation-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class NationUpdateComponent implements OnInit {
  isSaving = false;
  nation: INation | null = null;

  protected nationService = inject(NationService);
  protected nationFormService = inject(NationFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: NationFormGroup = this.nationFormService.createNationFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ nation }) => {
      this.nation = nation;
      if (nation) {
        this.updateForm(nation);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const nation = this.nationFormService.getNation(this.editForm);
    if (nation.id !== null) {
      this.subscribeToSaveResponse(this.nationService.update(nation));
    } else {
      this.subscribeToSaveResponse(this.nationService.create(nation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INation>>): void {
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

  protected updateForm(nation: INation): void {
    this.nation = nation;
    this.nationFormService.resetForm(this.editForm, nation);
  }
}
