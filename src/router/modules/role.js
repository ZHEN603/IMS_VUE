import layout from '@/layout'
export default {
  path: '/role',
  component: layout,
  children: [{
    path: '',
    component: () => import('@/views/role'),
    name: 'role',
    meta: {
      icon: 'role',
      title: 'Role'
    }
  }]
}
