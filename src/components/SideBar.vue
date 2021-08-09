<template>
  <aside id="side-bar">
    <nav class="my-channels" v-if="me">
      <h1>내 채널</h1>
      <router-link to="/channels/create" class="new-channel" v-if="channelCreatable">
        <ion-icon name="add-circle" />
        새 채널
      </router-link>
      <ul>
        <li v-for="c in myChannels">
          <router-link :to="`/channels/${c.id}`">
            <img :src="picture.channelPicture(c.picture)" />
            <span class="channel-name">{{ c.name }}</span>
          </router-link>
        </li>
      </ul>
      <router-link to="/channels/mine" v-if="moreMyChannels" class="more">더 보기</router-link>
    </nav>

    <nav class="subscribed" v-if="me">
      <h1>구독 채널</h1>
      <ul>
        <li v-for="c in subscribed">
          <router-link :to="`/channels/${c.id}`">
            <img :src="picture.channelPicture(c.picture)" />
            <span class="channel-name">{{ c.name }}</span>
          </router-link>
        </li>
      </ul>
      <router-link to="/channels/subscribed" v-if="moreSubscribed" class="more">더 보기</router-link>
    </nav>

    <div class="guide-login" v-if="me == null">
      <p>로그인하여 관심있는 채널을 구독하세요</p>
      <router-link to="/login">로그인</router-link>
    </div>
  </aside>
</template>

<script>
import api from '../utils/api';
import picture from '../utils/picture';

export default {

  data: () => ({
    myChannels: [],
    moreMyChannels: false,
    subscribed: [],
    moreSubscribed: false
  }),

  props: ['me'],

  mounted() {
    this.updateData();
  },
  
  watch: {
    me() {
      this.updateData();
    }
  },

  methods: {
    updateData() {
      if(this.me == null) {
        this.myChannels = [];
      }
      else {
        api.get("/users/me/channels?limit=5").then(res => {
          this.myChannels = res.data.data;
          this.moreMyChannels = res.data.pagination != null;
        });

        api.get("/channels/subscribed?limit=5").then(res => {
          this.subscribed = res.data.data;
          this.moreSubscribed = res.data.pagination != null;
        })
      }
    }
  },

  computed: {
    channelCreatable: () => (process.env.VUE_APP_CHANNEL_CREATABLE || "").toUpperCase() != "FALSE"
  },

  setup() {
    return {
      picture
    }
  }

}
</script>

<style lang="scss">
  @import "../stylesheets/dimensions.scss";
  @import "../stylesheets/colors.scss";

  #side-bar {
    position: fixed;
    width: $side-bar-width;
    top: $top-bar-height;
    left: 0;
    bottom: 0;
    box-sizing: border-box;

    flex: 0 0 212px;
    background: #fcfcfc;

    nav {
      margin: 12px 0;
      display: flex;
      flex-direction: column;

      h1 {
        margin: 0;
        padding: 0 16px;
        font-size: 16px;
        line-height: 23px;
        margin-bottom: 8px;
      }

      ul {
        margin: 0;
        padding: 0;
        list-style: none;
        font-size: 15px;
      }

      .more {
        font-size: 14px;
        color: #6e6e6e;
        text-decoration: none;
        align-self: flex-end;
        margin-right: 16px;

        &:hover {
          color: #575757;
        }
      }
    }

    .guide-login {
      padding: 0 16px;
      font-size: 15px;

      text-align: center;
      color: $text-dark-grey;

      a {
        display: block;
        width: 72px;
        height: 32px;
        line-height: 32px;

        margin: 0 auto;
        background: $theme-blue;
        color: white;
        text-decoration: none;
        border-radius: 4px;

        &:hover:not(:disabled) {
            background-color: $theme-blue-emp;
        }
      }
    }
  }

  .my-channels, .subscribed {
    position: relative;

    .new-channel {
      display: flex;
      align-items: center;

      font-size: 14px;
      line-height: 24px;
      text-decoration: none;
      color: #6e6e6e;

      position: absolute;
      top: 0;
      right: 8px;

      &:hover {
        color: #575757;
      }

      ion-icon {
        margin-right: 4px;
      }
    }

    li a {
      display: flex;
      align-items: center;
      padding: 4px 16px;
      color: black;
      text-decoration: none;

      &:hover {
        background: #e7e7e7;
      }

      img {
        height: 24px;
        border-radius: 24px;
        margin-right: 8px;
      }
    }
  }
</style>