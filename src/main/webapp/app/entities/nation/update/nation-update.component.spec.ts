import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { NationService } from '../service/nation.service';
import { INation } from '../nation.model';
import { NationFormService } from './nation-form.service';

import { NationUpdateComponent } from './nation-update.component';

describe('Nation Management Update Component', () => {
  let comp: NationUpdateComponent;
  let fixture: ComponentFixture<NationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let nationFormService: NationFormService;
  let nationService: NationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NationUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(NationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    nationFormService = TestBed.inject(NationFormService);
    nationService = TestBed.inject(NationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const nation: INation = { id: 456 };

      activatedRoute.data = of({ nation });
      comp.ngOnInit();

      expect(comp.nation).toEqual(nation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INation>>();
      const nation = { id: 123 };
      jest.spyOn(nationFormService, 'getNation').mockReturnValue(nation);
      jest.spyOn(nationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ nation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: nation }));
      saveSubject.complete();

      // THEN
      expect(nationFormService.getNation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(nationService.update).toHaveBeenCalledWith(expect.objectContaining(nation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INation>>();
      const nation = { id: 123 };
      jest.spyOn(nationFormService, 'getNation').mockReturnValue({ id: null });
      jest.spyOn(nationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ nation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: nation }));
      saveSubject.complete();

      // THEN
      expect(nationFormService.getNation).toHaveBeenCalled();
      expect(nationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INation>>();
      const nation = { id: 123 };
      jest.spyOn(nationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ nation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(nationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
