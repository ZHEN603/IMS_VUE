import layout from '@/layout'
export default {
  path: '/inbound',
  component: layout,
  children: [{
    path: '',
    component: () => import('@/views/inbound'),
    name: 'inbound',
    meta: {
      icon: 'inbound',
      title: 'Inbound'
    }
  }]
}
