import layout from '@/layout'
export default {
  path: '/permission',
  component: layout,
  name: 'permission',
  children: [{
    path: '',
    name: 'permission',
    component: () => import('@/views/permission'),
    meta: {
      title: 'Permission',
      icon: 'permission'
    }
  }]
}
