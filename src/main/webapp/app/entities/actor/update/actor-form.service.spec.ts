import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../actor.test-samples';

import { ActorFormService } from './actor-form.service';

describe('Actor Form Service', () => {
  let service: ActorFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActorFormService);
  });

  describe('Service methods', () => {
    describe('createActorFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createActorFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            age: expect.any(Object),
            height: expect.any(Object),
            movies: expect.any(Object),
          }),
        );
      });

      it('passing IActor should create a new form with FormGroup', () => {
        const formGroup = service.createActorFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            age: expect.any(Object),
            height: expect.any(Object),
            movies: expect.any(Object),
          }),
        );
      });
    });

    describe('getActor', () => {
      it('should return NewActor for default Actor initial value', () => {
        const formGroup = service.createActorFormGroup(sampleWithNewData);

        const actor = service.getActor(formGroup) as any;

        expect(actor).toMatchObject(sampleWithNewData);
      });

      it('should return NewActor for empty Actor initial value', () => {
        const formGroup = service.createActorFormGroup();

        const actor = service.getActor(formGroup) as any;

        expect(actor).toMatchObject({});
      });

      it('should return IActor', () => {
        const formGroup = service.createActorFormGroup(sampleWithRequiredData);

        const actor = service.getActor(formGroup) as any;

        expect(actor).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IActor should not enable id FormControl', () => {
        const formGroup = service.createActorFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewActor should disable id FormControl', () => {
        const formGroup = service.createActorFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
