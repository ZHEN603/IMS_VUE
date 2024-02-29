import layout from '@/layout'
export default {
  path: '/inventory',
  component: layout,
  children: [{
    path: '',
    component: () => import('@/views/inventory'),
    name: 'inventory',
    meta: {
      icon: 'inventory',
      title: 'Inventory'
    }
  }]
}
