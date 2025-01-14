import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { INation } from '../nation.model';
import { NationService } from '../service/nation.service';

const nationResolve = (route: ActivatedRouteSnapshot): Observable<null | INation> => {
  const id = route.params.id;
  if (id) {
    return inject(NationService)
      .find(id)
      .pipe(
        mergeMap((nation: HttpResponse<INation>) => {
          if (nation.body) {
            return of(nation.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default nationResolve;
