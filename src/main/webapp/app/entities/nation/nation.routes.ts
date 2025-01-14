import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import NationResolve from './route/nation-routing-resolve.service';

const nationRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/nation.component').then(m => m.NationComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/nation-detail.component').then(m => m.NationDetailComponent),
    resolve: {
      nation: NationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/nation-update.component').then(m => m.NationUpdateComponent),
    resolve: {
      nation: NationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/nation-update.component').then(m => m.NationUpdateComponent),
    resolve: {
      nation: NationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default nationRoute;
