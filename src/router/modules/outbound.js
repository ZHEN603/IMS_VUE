import layout from '@/layout'
export default {
  path: '/outbound',
  component: layout,
  children: [{
    path: '',
    component: () => import('@/views/outbound'),
    name: 'outbound',
    meta: {
      icon: 'outbound',
      title: 'Outbound'
    }
  }]
}
