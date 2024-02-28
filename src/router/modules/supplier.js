import layout from '@/layout'
export default {
  path: '/supplier',
  component: layout,
  children: [{
    path: '',
    component: () => import('@/views/supplier'),
    name: 'supplier',
    meta: {
      icon: 'supplier',
      title: 'Supplier'
    }
  }]
}
