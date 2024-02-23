import layout from '@/layout'
export default {
  path: '/company',
  component: layout,
  children: [{
    path: '',
    component: () => import('@/views/company'),
    name: 'company',
    meta: {
      icon: 'company',
      title: 'Company'
    }
  }]
}
