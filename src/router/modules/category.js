import layout from '@/layout'
export default {
  path: '/category',
  component: layout,
  name: 'Category',
  children: [{
    path: '',
    component: () => import('@/views/category'),
    name: 'Category',
    meta: {
      icon: 'tree',
      title: 'Category'
    }
  }]
}
