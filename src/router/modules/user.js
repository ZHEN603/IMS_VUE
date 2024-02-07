import layout from '@/layout'
export default {
  path: '/user',
  component: layout,
  children: [{
    path: '',
    component: () => import('@/views/user'),
    name: 'user',
    meta: {
      icon: 'user',
      title: 'User'
    }
  }]
}
