import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import FindRoom from '@/components/FindRoom.vue'
import DoFirst from '@/components/DoFirst.vue'
import NewRequest from '@/components/NewRequest.vue'
import AttentionNotes from '@/components/AttentionNotes.vue'
import SubmitRequest from '@/components/SubmitRequest.vue'
import ITHelp from '@/components/ITHelp.vue'
import About from '@/components/About.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      alias: '/Login'
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home
    },
    {
        path: '/findroom',
        name: 'FindRoom',
        component: FindRoom
    },
    {
      path: '/dofirst',
      name: 'DoFirst',
      component: DoFirst
    },
    {
      path: '/newrequest',
      name: 'NewRequest',
      component: NewRequest
    },
    {
      path: '/attentionnotes',
      name: 'AttentionNotes',
      component: AttentionNotes
    },
    {
      path: '/submitrequest',
      name: 'SubmitRequest',
      component: SubmitRequest
    },
    {
      path: '/ithelp',
      name: 'ITHelp',
      component: ITHelp
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
  ]
})