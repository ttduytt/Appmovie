import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../nation.test-samples';

import { NationFormService } from './nation-form.service';

describe('Nation Form Service', () => {
  let service: NationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NationFormService);
  });

  describe('Service methods', () => {
    describe('createNationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createNationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });

      it('passing INation should create a new form with FormGroup', () => {
        const formGroup = service.createNationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });
    });

    describe('getNation', () => {
      it('should return NewNation for default Nation initial value', () => {
        const formGroup = service.createNationFormGroup(sampleWithNewData);

        const nation = service.getNation(formGroup) as any;

        expect(nation).toMatchObject(sampleWithNewData);
      });

      it('should return NewNation for empty Nation initial value', () => {
        const formGroup = service.createNationFormGroup();

        const nation = service.getNation(formGroup) as any;

        expect(nation).toMatchObject({});
      });

      it('should return INation', () => {
        const formGroup = service.createNationFormGroup(sampleWithRequiredData);

        const nation = service.getNation(formGroup) as any;

        expect(nation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing INation should not enable id FormControl', () => {
        const formGroup = service.createNationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewNation should disable id FormControl', () => {
        const formGroup = service.createNationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
