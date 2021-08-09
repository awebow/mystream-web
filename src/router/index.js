import { createRouter, createWebHistory } from 'vue-router'
import Videos from '../views/Videos.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import User from '../views/User.vue';
import Channel from '../views/Channel.vue';
import Video from '../views/Video.vue';
import Search from '../views/Search.vue';
import Upload from '../views/Upload.vue';
import EditProfile from '../views/EditProfile.vue';
import CreateChannel from '../views/CreateChannel.vue';
import MyChannels from '../views/MyChannels.vue';
import Subscriptions from '../views/Subscriptions.vue';
import Cookies from 'js-cookie';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Videos
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
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/users/me',
    component: User,
    props: {me: true}
  },
  {
    path: '/channels/:id/upload',
    component: Upload
  },
  {
    path: '/channels/:id',
    component: Channel
  },
  {
    path: '/videos/:id',
    component: Video
  },
  {
    path: '/search/:query',
    component: Search
  },
  {
    path: '/users/me/edit',
    name: "EditProfile",
    component: EditProfile
  },
  {
    path: "/channels/create",
    component: CreateChannel
  },
  {
    path: "/channels/mine",
    component: MyChannels
  },
  {
    path: "/channels/subscribed",
    component: Subscriptions
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior: () => ({left: 0, top: 0}),
  routes
});

router.beforeEach(function(to, from, next) {
  var authRequired = ["EditProfile"];
  if(authRequired.indexOf(to.name) != -1 && Cookies.get("Authorization") == undefined)
    next("/login");

  next();
});

export default router;
