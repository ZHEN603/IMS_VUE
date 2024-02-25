import layout from '@/layout'
export default {
  path: '/product',
  component: layout,
  name: 'product',
  children: [{
    path: '',
    name: 'product',
    component: () => import('@/views/product'),
    meta: {
      title: 'Product',
      icon: 'product'
    }
  }]
}
