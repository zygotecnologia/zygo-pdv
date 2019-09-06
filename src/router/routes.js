const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
    ]
  },
  {
    path: '/',
    component: () => import('layouts/CleanLayout.vue'),
    children: [
      { path: 'floatingIcon', component: () => import('pages/IconAlwaysOnTop.vue') }
    ]
  }
]

routes.push({
  path: '*',
  component: () => import('pages/Index.vue')
})

export default routes
