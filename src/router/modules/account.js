import layout from '@/layout'
export default {
  path: '/account',
  component: layout,
  children: [{
    path: '',
    component: () => import('@/views/account'),
    name: 'account',
    meta: {
      icon: 'user',
      title: 'Account'
    }
  }]
}
