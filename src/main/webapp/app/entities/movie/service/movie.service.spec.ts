import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IMovie } from '../movie.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../movie.test-samples';

import { MovieService, RestMovie } from './movie.service';

const requireRestSample: RestMovie = {
  ...sampleWithRequiredData,
  release: sampleWithRequiredData.release?.format(DATE_FORMAT),
};

describe('Movie Service', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;
  let expectedResult: IMovie | IMovie[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(MovieService);
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

    it('should create a Movie', () => {
      const movie = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(movie).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Movie', () => {
      const movie = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(movie).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Movie', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Movie', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Movie', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMovieToCollectionIfMissing', () => {
      it('should add a Movie to an empty array', () => {
        const movie: IMovie = sampleWithRequiredData;
        expectedResult = service.addMovieToCollectionIfMissing([], movie);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(movie);
      });

      it('should not add a Movie to an array that contains it', () => {
        const movie: IMovie = sampleWithRequiredData;
        const movieCollection: IMovie[] = [
          {
            ...movie,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMovieToCollectionIfMissing(movieCollection, movie);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Movie to an array that doesn't contain it", () => {
        const movie: IMovie = sampleWithRequiredData;
        const movieCollection: IMovie[] = [sampleWithPartialData];
        expectedResult = service.addMovieToCollectionIfMissing(movieCollection, movie);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(movie);
      });

      it('should add only unique Movie to an array', () => {
        const movieArray: IMovie[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const movieCollection: IMovie[] = [sampleWithRequiredData];
        expectedResult = service.addMovieToCollectionIfMissing(movieCollection, ...movieArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const movie: IMovie = sampleWithRequiredData;
        const movie2: IMovie = sampleWithPartialData;
        expectedResult = service.addMovieToCollectionIfMissing([], movie, movie2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(movie);
        expect(expectedResult).toContain(movie2);
      });

      it('should accept null and undefined values', () => {
        const movie: IMovie = sampleWithRequiredData;
        expectedResult = service.addMovieToCollectionIfMissing([], null, movie, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(movie);
      });

      it('should return initial array if no Movie is added', () => {
        const movieCollection: IMovie[] = [sampleWithRequiredData];
        expectedResult = service.addMovieToCollectionIfMissing(movieCollection, undefined, null);
        expect(expectedResult).toEqual(movieCollection);
      });
    });

    describe('compareMovie', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMovie(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMovie(entity1, entity2);
        const compareResult2 = service.compareMovie(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMovie(entity1, entity2);
        const compareResult2 = service.compareMovie(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMovie(entity1, entity2);
        const compareResult2 = service.compareMovie(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
