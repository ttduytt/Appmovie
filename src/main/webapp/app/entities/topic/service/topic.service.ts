import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITopic, NewTopic } from '../topic.model';

export type PartialUpdateTopic = Partial<ITopic> & Pick<ITopic, 'id'>;

export type EntityResponseType = HttpResponse<ITopic>;
export type EntityArrayResponseType = HttpResponse<ITopic[]>;

@Injectable({ providedIn: 'root' })
export class TopicService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/topics');

  create(topic: NewTopic): Observable<EntityResponseType> {
    return this.http.post<ITopic>(this.resourceUrl, topic, { observe: 'response' });
  }

  update(topic: ITopic): Observable<EntityResponseType> {
    return this.http.put<ITopic>(`${this.resourceUrl}/${this.getTopicIdentifier(topic)}`, topic, { observe: 'response' });
  }

  partialUpdate(topic: PartialUpdateTopic): Observable<EntityResponseType> {
    return this.http.patch<ITopic>(`${this.resourceUrl}/${this.getTopicIdentifier(topic)}`, topic, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITopic>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITopic[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTopicIdentifier(topic: Pick<ITopic, 'id'>): number {
    return topic.id;
  }

  compareTopic(o1: Pick<ITopic, 'id'> | null, o2: Pick<ITopic, 'id'> | null): boolean {
    return o1 && o2 ? this.getTopicIdentifier(o1) === this.getTopicIdentifier(o2) : o1 === o2;
  }

  addTopicToCollectionIfMissing<Type extends Pick<ITopic, 'id'>>(
    topicCollection: Type[],
    ...topicsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const topics: Type[] = topicsToCheck.filter(isPresent);
    if (topics.length > 0) {
      const topicCollectionIdentifiers = topicCollection.map(topicItem => this.getTopicIdentifier(topicItem));
      const topicsToAdd = topics.filter(topicItem => {
        const topicIdentifier = this.getTopicIdentifier(topicItem);
        if (topicCollectionIdentifiers.includes(topicIdentifier)) {
          return false;
        }
        topicCollectionIdentifiers.push(topicIdentifier);
        return true;
      });
      return [...topicsToAdd, ...topicCollection];
    }
    return topicCollection;
  }
}
