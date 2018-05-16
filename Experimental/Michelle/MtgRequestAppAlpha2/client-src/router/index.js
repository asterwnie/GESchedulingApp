import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import Friends from '../components/Friends.vue'
import Form1 from '../components/Form1.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
    {
      path: '/form1',
      name: 'Form1',
      component: Form1
    },
    {
      path: '/friends/:friend1/:friend2/:friend3/:friend4/:friend5',
      name: 'Friends',
      props: true,
      component: Friends
    }
  ]
})