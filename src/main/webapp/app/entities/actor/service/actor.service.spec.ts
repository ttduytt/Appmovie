import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IActor } from '../actor.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../actor.test-samples';

import { ActorService } from './actor.service';

const requireRestSample: IActor = {
  ...sampleWithRequiredData,
};

describe('Actor Service', () => {
  let service: ActorService;
  let httpMock: HttpTestingController;
  let expectedResult: IActor | IActor[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ActorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Actor', () => {
      const actor = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(actor).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Actor', () => {
      const actor = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(actor).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Actor', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Actor', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Actor', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addActorToCollectionIfMissing', () => {
      it('should add a Actor to an empty array', () => {
        const actor: IActor = sampleWithRequiredData;
        expectedResult = service.addActorToCollectionIfMissing([], actor);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(actor);
      });

      it('should not add a Actor to an array that contains it', () => {
        const actor: IActor = sampleWithRequiredData;
        const actorCollection: IActor[] = [
          {
            ...actor,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addActorToCollectionIfMissing(actorCollection, actor);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Actor to an array that doesn't contain it", () => {
        const actor: IActor = sampleWithRequiredData;
        const actorCollection: IActor[] = [sampleWithPartialData];
        expectedResult = service.addActorToCollectionIfMissing(actorCollection, actor);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(actor);
      });

      it('should add only unique Actor to an array', () => {
        const actorArray: IActor[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const actorCollection: IActor[] = [sampleWithRequiredData];
        expectedResult = service.addActorToCollectionIfMissing(actorCollection, ...actorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const actor: IActor = sampleWithRequiredData;
        const actor2: IActor = sampleWithPartialData;
        expectedResult = service.addActorToCollectionIfMissing([], actor, actor2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(actor);
        expect(expectedResult).toContain(actor2);
      });

      it('should accept null and undefined values', () => {
        const actor: IActor = sampleWithRequiredData;
        expectedResult = service.addActorToCollectionIfMissing([], null, actor, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(actor);
      });

      it('should return initial array if no Actor is added', () => {
        const actorCollection: IActor[] = [sampleWithRequiredData];
        expectedResult = service.addActorToCollectionIfMissing(actorCollection, undefined, null);
        expect(expectedResult).toEqual(actorCollection);
      });
    });

    describe('compareActor', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareActor(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareActor(entity1, entity2);
        const compareResult2 = service.compareActor(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareActor(entity1, entity2);
        const compareResult2 = service.compareActor(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareActor(entity1, entity2);
        const compareResult2 = service.compareActor(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
