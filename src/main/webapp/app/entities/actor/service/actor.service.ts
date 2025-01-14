import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IActor, NewActor } from '../actor.model';

export type PartialUpdateActor = Partial<IActor> & Pick<IActor, 'id'>;

export type EntityResponseType = HttpResponse<IActor>;
export type EntityArrayResponseType = HttpResponse<IActor[]>;

@Injectable({ providedIn: 'root' })
export class ActorService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/actors');

  create(actor: NewActor): Observable<EntityResponseType> {
    return this.http.post<IActor>(this.resourceUrl, actor, { observe: 'response' });
  }

  update(actor: IActor): Observable<EntityResponseType> {
    return this.http.put<IActor>(`${this.resourceUrl}/${this.getActorIdentifier(actor)}`, actor, { observe: 'response' });
  }

  partialUpdate(actor: PartialUpdateActor): Observable<EntityResponseType> {
    return this.http.patch<IActor>(`${this.resourceUrl}/${this.getActorIdentifier(actor)}`, actor, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IActor>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IActor[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getActorIdentifier(actor: Pick<IActor, 'id'>): number {
    return actor.id;
  }

  compareActor(o1: Pick<IActor, 'id'> | null, o2: Pick<IActor, 'id'> | null): boolean {
    return o1 && o2 ? this.getActorIdentifier(o1) === this.getActorIdentifier(o2) : o1 === o2;
  }

  addActorToCollectionIfMissing<Type extends Pick<IActor, 'id'>>(
    actorCollection: Type[],
    ...actorsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const actors: Type[] = actorsToCheck.filter(isPresent);
    if (actors.length > 0) {
      const actorCollectionIdentifiers = actorCollection.map(actorItem => this.getActorIdentifier(actorItem));
      const actorsToAdd = actors.filter(actorItem => {
        const actorIdentifier = this.getActorIdentifier(actorItem);
        if (actorCollectionIdentifiers.includes(actorIdentifier)) {
          return false;
        }
        actorCollectionIdentifiers.push(actorIdentifier);
        return true;
      });
      return [...actorsToAdd, ...actorCollection];
    }
    return actorCollection;
  }
}
