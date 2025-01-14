import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../topic.test-samples';

import { TopicFormService } from './topic-form.service';

describe('Topic Form Service', () => {
  let service: TopicFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicFormService);
  });

  describe('Service methods', () => {
    describe('createTopicFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTopicFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            movies: expect.any(Object),
          }),
        );
      });

      it('passing ITopic should create a new form with FormGroup', () => {
        const formGroup = service.createTopicFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            movies: expect.any(Object),
          }),
        );
      });
    });

    describe('getTopic', () => {
      it('should return NewTopic for default Topic initial value', () => {
        const formGroup = service.createTopicFormGroup(sampleWithNewData);

        const topic = service.getTopic(formGroup) as any;

        expect(topic).toMatchObject(sampleWithNewData);
      });

      it('should return NewTopic for empty Topic initial value', () => {
        const formGroup = service.createTopicFormGroup();

        const topic = service.getTopic(formGroup) as any;

        expect(topic).toMatchObject({});
      });

      it('should return ITopic', () => {
        const formGroup = service.createTopicFormGroup(sampleWithRequiredData);

        const topic = service.getTopic(formGroup) as any;

        expect(topic).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITopic should not enable id FormControl', () => {
        const formGroup = service.createTopicFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTopic should disable id FormControl', () => {
        const formGroup = service.createTopicFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
