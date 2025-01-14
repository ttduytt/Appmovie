import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITopic } from '../topic.model';
import { TopicService } from '../service/topic.service';

const topicResolve = (route: ActivatedRouteSnapshot): Observable<null | ITopic> => {
  const id = route.params.id;
  if (id) {
    return inject(TopicService)
      .find(id)
      .pipe(
        mergeMap((topic: HttpResponse<ITopic>) => {
          if (topic.body) {
            return of(topic.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default topicResolve;
