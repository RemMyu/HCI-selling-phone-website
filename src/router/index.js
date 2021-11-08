import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Blog from '../views/Blog.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/blogs',
    name: 'Blog',
    component: Blog
  },
  {
    path: '/blog/:id',
    name: 'post',
    props: true,
    component: Blog
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
