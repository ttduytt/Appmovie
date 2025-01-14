import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import TopicResolve from './route/topic-routing-resolve.service';

const topicRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/topic.component').then(m => m.TopicComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/topic-detail.component').then(m => m.TopicDetailComponent),
    resolve: {
      topic: TopicResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/topic-update.component').then(m => m.TopicUpdateComponent),
    resolve: {
      topic: TopicResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/topic-update.component').then(m => m.TopicUpdateComponent),
    resolve: {
      topic: TopicResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default topicRoute;
