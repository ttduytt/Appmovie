import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { INation, NewNation } from '../nation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts INation for edit and NewNationFormGroupInput for create.
 */
type NationFormGroupInput = INation | PartialWithRequiredKeyOf<NewNation>;

type NationFormDefaults = Pick<NewNation, 'id'>;

type NationFormGroupContent = {
  id: FormControl<INation['id'] | NewNation['id']>;
  name: FormControl<INation['name']>;
};

export type NationFormGroup = FormGroup<NationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class NationFormService {
  createNationFormGroup(nation: NationFormGroupInput = { id: null }): NationFormGroup {
    const nationRawValue = {
      ...this.getFormDefaults(),
      ...nation,
    };
    return new FormGroup<NationFormGroupContent>({
      id: new FormControl(
        { value: nationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(nationRawValue.name),
    });
  }

  getNation(form: NationFormGroup): INation | NewNation {
    return form.getRawValue() as INation | NewNation;
  }

  resetForm(form: NationFormGroup, nation: NationFormGroupInput): void {
    const nationRawValue = { ...this.getFormDefaults(), ...nation };
    form.reset(
      {
        ...nationRawValue,
        id: { value: nationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): NationFormDefaults {
    return {
      id: null,
    };
  }
}
