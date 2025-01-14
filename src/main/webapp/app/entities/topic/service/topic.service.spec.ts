import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ITopic } from '../topic.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../topic.test-samples';

import { TopicService } from './topic.service';

const requireRestSample: ITopic = {
  ...sampleWithRequiredData,
};

describe('Topic Service', () => {
  let service: TopicService;
  let httpMock: HttpTestingController;
  let expectedResult: ITopic | ITopic[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(TopicService);
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

    it('should create a Topic', () => {
      const topic = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(topic).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Topic', () => {
      const topic = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(topic).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Topic', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Topic', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Topic', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTopicToCollectionIfMissing', () => {
      it('should add a Topic to an empty array', () => {
        const topic: ITopic = sampleWithRequiredData;
        expectedResult = service.addTopicToCollectionIfMissing([], topic);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(topic);
      });

      it('should not add a Topic to an array that contains it', () => {
        const topic: ITopic = sampleWithRequiredData;
        const topicCollection: ITopic[] = [
          {
            ...topic,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTopicToCollectionIfMissing(topicCollection, topic);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Topic to an array that doesn't contain it", () => {
        const topic: ITopic = sampleWithRequiredData;
        const topicCollection: ITopic[] = [sampleWithPartialData];
        expectedResult = service.addTopicToCollectionIfMissing(topicCollection, topic);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(topic);
      });

      it('should add only unique Topic to an array', () => {
        const topicArray: ITopic[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const topicCollection: ITopic[] = [sampleWithRequiredData];
        expectedResult = service.addTopicToCollectionIfMissing(topicCollection, ...topicArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const topic: ITopic = sampleWithRequiredData;
        const topic2: ITopic = sampleWithPartialData;
        expectedResult = service.addTopicToCollectionIfMissing([], topic, topic2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(topic);
        expect(expectedResult).toContain(topic2);
      });

      it('should accept null and undefined values', () => {
        const topic: ITopic = sampleWithRequiredData;
        expectedResult = service.addTopicToCollectionIfMissing([], null, topic, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(topic);
      });

      it('should return initial array if no Topic is added', () => {
        const topicCollection: ITopic[] = [sampleWithRequiredData];
        expectedResult = service.addTopicToCollectionIfMissing(topicCollection, undefined, null);
        expect(expectedResult).toEqual(topicCollection);
      });
    });

    describe('compareTopic', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTopic(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTopic(entity1, entity2);
        const compareResult2 = service.compareTopic(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTopic(entity1, entity2);
        const compareResult2 = service.compareTopic(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTopic(entity1, entity2);
        const compareResult2 = service.compareTopic(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
