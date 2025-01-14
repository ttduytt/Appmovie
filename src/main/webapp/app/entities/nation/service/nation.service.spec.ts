import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { INation } from '../nation.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../nation.test-samples';

import { NationService } from './nation.service';

const requireRestSample: INation = {
  ...sampleWithRequiredData,
};

describe('Nation Service', () => {
  let service: NationService;
  let httpMock: HttpTestingController;
  let expectedResult: INation | INation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(NationService);
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

    it('should create a Nation', () => {
      const nation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(nation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Nation', () => {
      const nation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(nation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Nation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Nation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Nation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addNationToCollectionIfMissing', () => {
      it('should add a Nation to an empty array', () => {
        const nation: INation = sampleWithRequiredData;
        expectedResult = service.addNationToCollectionIfMissing([], nation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(nation);
      });

      it('should not add a Nation to an array that contains it', () => {
        const nation: INation = sampleWithRequiredData;
        const nationCollection: INation[] = [
          {
            ...nation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addNationToCollectionIfMissing(nationCollection, nation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Nation to an array that doesn't contain it", () => {
        const nation: INation = sampleWithRequiredData;
        const nationCollection: INation[] = [sampleWithPartialData];
        expectedResult = service.addNationToCollectionIfMissing(nationCollection, nation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(nation);
      });

      it('should add only unique Nation to an array', () => {
        const nationArray: INation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const nationCollection: INation[] = [sampleWithRequiredData];
        expectedResult = service.addNationToCollectionIfMissing(nationCollection, ...nationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const nation: INation = sampleWithRequiredData;
        const nation2: INation = sampleWithPartialData;
        expectedResult = service.addNationToCollectionIfMissing([], nation, nation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(nation);
        expect(expectedResult).toContain(nation2);
      });

      it('should accept null and undefined values', () => {
        const nation: INation = sampleWithRequiredData;
        expectedResult = service.addNationToCollectionIfMissing([], null, nation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(nation);
      });

      it('should return initial array if no Nation is added', () => {
        const nationCollection: INation[] = [sampleWithRequiredData];
        expectedResult = service.addNationToCollectionIfMissing(nationCollection, undefined, null);
        expect(expectedResult).toEqual(nationCollection);
      });
    });

    describe('compareNation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareNation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareNation(entity1, entity2);
        const compareResult2 = service.compareNation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareNation(entity1, entity2);
        const compareResult2 = service.compareNation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareNation(entity1, entity2);
        const compareResult2 = service.compareNation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
