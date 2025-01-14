import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ActorResolve from './route/actor-routing-resolve.service';

const actorRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/actor.component').then(m => m.ActorComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/actor-detail.component').then(m => m.ActorDetailComponent),
    resolve: {
      actor: ActorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/actor-update.component').then(m => m.ActorUpdateComponent),
    resolve: {
      actor: ActorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/actor-update.component').then(m => m.ActorUpdateComponent),
    resolve: {
      actor: ActorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default actorRoute;
