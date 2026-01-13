const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
              {path: 'guest', component: () => import('pages/GuestEntery.vue') },
              {path: '', component: () => import('pages/LoginPage.vue') },
              {path: 'register', component: () => import('pages/RegisterPage.vue') },
              {path: 'parking', component: () => import('pages/ParkingMap.vue') },
              {path: 'spot', component: () => import('src/pages/ParkingSpot.vue') },
              {path: 'adminpage', component: () => import('src/pages/AdminWrapper.vue')},
              {path: 'adminlogin', component: () => import('src/pages/AdminLogin.vue') },
              
    ],
  },

  
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
