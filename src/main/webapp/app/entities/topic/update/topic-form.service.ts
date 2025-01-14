import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ITopic, NewTopic } from '../topic.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITopic for edit and NewTopicFormGroupInput for create.
 */
type TopicFormGroupInput = ITopic | PartialWithRequiredKeyOf<NewTopic>;

type TopicFormDefaults = Pick<NewTopic, 'id' | 'movies'>;

type TopicFormGroupContent = {
  id: FormControl<ITopic['id'] | NewTopic['id']>;
  name: FormControl<ITopic['name']>;
  movies: FormControl<ITopic['movies']>;
};

export type TopicFormGroup = FormGroup<TopicFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TopicFormService {
  createTopicFormGroup(topic: TopicFormGroupInput = { id: null }): TopicFormGroup {
    const topicRawValue = {
      ...this.getFormDefaults(),
      ...topic,
    };
    return new FormGroup<TopicFormGroupContent>({
      id: new FormControl(
        { value: topicRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(topicRawValue.name),
      movies: new FormControl(topicRawValue.movies ?? []),
    });
  }

  getTopic(form: TopicFormGroup): ITopic | NewTopic {
    return form.getRawValue() as ITopic | NewTopic;
  }

  resetForm(form: TopicFormGroup, topic: TopicFormGroupInput): void {
    const topicRawValue = { ...this.getFormDefaults(), ...topic };
    form.reset(
      {
        ...topicRawValue,
        id: { value: topicRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TopicFormDefaults {
    return {
      id: null,
      movies: [],
    };
  }
}
