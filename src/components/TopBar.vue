<template>
  <header id="top-bar">
    <router-link to="/"><img :src="logo" class="logo" /></router-link>

    <div class="search">
      <input type="text" class="keyword" placeholder="검색" v-model="query" @keyup.enter="search()" />
      <button type="button" @click="search()"><ion-icon name="search" /></button>
    </div>

    
    <div class="right-menu">
      <template v-if="$root.me == null">
        <router-link to="/login" class="login-link">로그인</router-link>
      </template>
      <template v-else>
        <button type="button" aria-label="추가 메뉴" class="toggle-additional" @click="showAdditional = !showAdditional">
          <img :src="picture.userPicture($root.me.picture)" />
        </button>

        <div class="additional-menu" v-if="showAdditional">
          <div class="my-name">{{ $root.me.name }}</div>
          <ul>
            <li><router-link to="/users/me/edit">정보 수정</router-link></li>
            <li><a @click="logout">로그아웃</a></li>
          </ul>
        </div>
      </template>
    </div>
  </header>
</template>

<script>
import Cookies from 'js-cookie';
import picture from '../utils/picture';

export default {

  data: () => ({
    showAdditional: false,
    query: ''
  }),

  props: ['logo'],

  components: {
    //IonIcon
  },

  setup() {
    return {
      picture
    }
  },

  methods: {
    logout(e) {
      e.preventDefault();

      Cookies.remove('Authorization');
      location.reload();
    },

    search() {
      this.$router.push(`/search/${this.query}`);
      document.activeElement.blur();
    }
  },

  watch: {
    $route(route) {
      if(route.path.split('/')[1] != 'search')
        this.query = '';
    }
  }

  //setup: () => ({search})

}
</script>

<style lang="scss">
  @import "../stylesheets/dimensions.scss";
  @import "../stylesheets/colors.scss";

  #top-bar {
    box-sizing: border-box;
    height: $top-bar-height;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;

    box-shadow: 0 2px 12px #00000012;
    display: flex;
    align-items: center;
    padding: 0 32px;
    z-index: 100;
    background: white;

    .logo {
      height: 36px;
    }

    .search {
      display: flex;
      align-items: center;
      
      $height: 30px;
      height: $height;

      position: absolute;
      left: 50%;
      transform: translateX(-50%);

      .keyword {
        box-sizing: border-box;
        width: 381px;
        height: 100%;
        border: 1px solid #c7c7c7;
        border-radius: $height / 2 0 0 $height / 2;
        outline: none;
        padding: 0 14px;
      }

      button {
        box-sizing: border-box;
        width: 42px;
        height: 100%;
        background: $theme-blue;
        border: 0;
        border-radius: 0 $height / 2 $height / 2 0;
        padding: 0 2px 0 0;
        display: flex;
        justify-content: center;
        align-items: center;
        outline: none;
        cursor: pointer;

        ion-icon {
          color: white;
          font-size: 16px;
        }
      }
    }

    .right-menu {
      margin-left: auto;

      .login-link {
        box-sizing: border-box;
        display: block;
        width: 58px;
        height: 30px;
        line-height: 30px;
        background-color: $theme-blue;
        color: white;
        text-decoration: none;
        border-radius: 15px;
        text-align: center;
      }

      .toggle-additional {
        display: block;
        background: none;
        padding: 0;
        margin: 0;
        border: none;
        outline: none;
        cursor: pointer;
      }

      img {
        display: block;
        height: 32px;
        border-radius: 16px;
      }
    }

    .additional-menu {
      position: fixed;
      top: $top-bar-height + 8px;
      right: 8px;
      width: 120px;

      background: white;
      border-radius: 8px;
      box-shadow: 2px 4px 6px #00000017;
      padding: 8px 0;
      font-size: 14px;

      .my-name {
        padding: 4px 16px;
        font-weight: bold;
      }

      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        li {

          a {
            box-sizing: border-box;
            display: block;
            width: 100%;
            padding: 4px 16px;
            cursor: pointer;
            color: black;
            text-decoration: none;

            &:hover {
              background-color: #f0f0f0;
            }
          }
        }
      }
      
    }
  }
</style>