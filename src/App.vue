<template>
  <template v-if="loaded">
    <TopBar :logo="logo" />

    <div id="mid-wrapper" :class="{'has-sidebar': sidebarVisible}">
      <SideBar v-if="sidebarVisible" :me="me" />
      <router-view/>
    </div>
  </template>
</template>

<script>
import Cookies from 'js-cookie';
import TopBar from '@/components/TopBar.vue';
import SideBar from '@/components/SideBar.vue';
import api from './utils/api';
import default_logo from '@/assets/default_logo.svg';

export default {
  components: {
    TopBar,
    SideBar
  },

  data: () => ({
    me: null,
    imageMeta: null,
    loaded: false
  }),

  mounted() {
    if(Cookies.get("Authorization") != undefined) {
      api.get("/users/me").then(res => {
        this.me = res.data;
        this.loaded = true;
      });
    }
    else
      this.loaded = true;
  },

  computed: {
    sidebarVisible() {
      return this.$route.path != '/login' && this.$route.path != '/register';
    },

    logo() {
      return process.env.VUE_APP_LOGO_SRC || default_logo;
    }
  }
}
</script>

<style lang="scss">
@import "stylesheets/dimensions.scss";

html, body {
  margin: 0;
  font-family: "Noto Sans CJK KR", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f6f7f9;
  word-break: break-word;
  overflow-wrap: anywhere;
}

#app {
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-height: 100vh;
  padding-top: $top-bar-height;
}

#mid-wrapper.has-sidebar {
  padding-left: $side-bar-width;
}
</style>
