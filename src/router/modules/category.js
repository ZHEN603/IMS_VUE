import layout from '@/layout'
export default {
  path: '/category',
  component: layout,
  children: [{
    path: '',
    component: () => import('@/views/category'),
    name: 'category',
    meta: {
      icon: 'tree',
      title: 'Category'
    }
  }]
}
