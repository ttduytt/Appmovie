import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INation, NewNation } from '../nation.model';

export type PartialUpdateNation = Partial<INation> & Pick<INation, 'id'>;

export type EntityResponseType = HttpResponse<INation>;
export type EntityArrayResponseType = HttpResponse<INation[]>;

@Injectable({ providedIn: 'root' })
export class NationService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/nations');

  create(nation: NewNation): Observable<EntityResponseType> {
    return this.http.post<INation>(this.resourceUrl, nation, { observe: 'response' });
  }

  update(nation: INation): Observable<EntityResponseType> {
    return this.http.put<INation>(`${this.resourceUrl}/${this.getNationIdentifier(nation)}`, nation, { observe: 'response' });
  }

  partialUpdate(nation: PartialUpdateNation): Observable<EntityResponseType> {
    return this.http.patch<INation>(`${this.resourceUrl}/${this.getNationIdentifier(nation)}`, nation, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<INation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<INation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getNationIdentifier(nation: Pick<INation, 'id'>): number {
    return nation.id;
  }

  compareNation(o1: Pick<INation, 'id'> | null, o2: Pick<INation, 'id'> | null): boolean {
    return o1 && o2 ? this.getNationIdentifier(o1) === this.getNationIdentifier(o2) : o1 === o2;
  }

  addNationToCollectionIfMissing<Type extends Pick<INation, 'id'>>(
    nationCollection: Type[],
    ...nationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const nations: Type[] = nationsToCheck.filter(isPresent);
    if (nations.length > 0) {
      const nationCollectionIdentifiers = nationCollection.map(nationItem => this.getNationIdentifier(nationItem));
      const nationsToAdd = nations.filter(nationItem => {
        const nationIdentifier = this.getNationIdentifier(nationItem);
        if (nationCollectionIdentifiers.includes(nationIdentifier)) {
          return false;
        }
        nationCollectionIdentifiers.push(nationIdentifier);
        return true;
      });
      return [...nationsToAdd, ...nationCollection];
    }
    return nationCollection;
  }
}
