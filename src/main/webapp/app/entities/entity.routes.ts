import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'Authorities' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'actor',
    data: { pageTitle: 'Actors' },
    loadChildren: () => import('./actor/actor.routes'),
  },
  {
    path: 'blog',
    data: { pageTitle: 'Blogs' },
    loadChildren: () => import('./blog/blog.routes'),
  },
  {
    path: 'comment',
    data: { pageTitle: 'Comments' },
    loadChildren: () => import('./comment/comment.routes'),
  },
  {
    path: 'movie',
    data: { pageTitle: 'Movies' },
    loadChildren: () => import('./movie/movie.routes'),
  },
  {
    path: 'nation',
    data: { pageTitle: 'Nations' },
    loadChildren: () => import('./nation/nation.routes'),
  },
  {
    path: 'permission',
    data: { pageTitle: 'Permissions' },
    loadChildren: () => import('./permission/permission.routes'),
  },
  {
    path: 'topic',
    data: { pageTitle: 'Topics' },
    loadChildren: () => import('./topic/topic.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
