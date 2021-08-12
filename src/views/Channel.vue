<template>
  <main class="channel" v-if="channel">
    <div class="header">
      <div class="info">
        <img :src="picture.channelPicture(channel.picture)" class="picture" />
        <div class="texts">
          <h1>{{ channel.name }}</h1>
          <span class="subscribers">구독자 {{ subscription ? subscription.subscribers : channel.subscribers }}명</span>
        </div>
      </div>
      <template v-if="subscription && !ownership">
        <button type="button" class="subscribe" v-if="!subscription.subscribed" @click="subscribe">구독하기</button>
        <button type="button" class="unsubscribe" v-else @click="unsubscribe">구독취소</button>
      </template>
      <router-link :to="`/channels/${$route.params.id}/upload`"
        class="upload-video" v-if="ownership">새 동영상</router-link>
    </div>
    <VideoList :videos="videos" />
  </main>
</template>

<script>
import Cookies from 'js-cookie';
import api from '../utils/api';
import picture from '../utils/picture';
import VideoList from '../components/VideoList.vue';
import scrolls from '../utils/scrolls';

export default {
  data: () => ({
    channel: null,
    ownership: false,
    videos: [],
    subscription: null,
    scrollHandler: null,
    pagination: ''
  }),

  components: { VideoList },

  mounted() {
    this.loadData();
  },

  unmounted() {
    if(this.scrollHandler)
      this.scrollHandler.disable();
  },

  methods: {
    subscribe() {
      api.post(`/channels/${this.$route.params.id}/subscriptions`, null)
        .then(res => this.subscription = res.data);
    },

    unsubscribe() {
      api.delete(`/channels/${this.$route.params.id}/subscriptions`)
        .then(res => this.subscription = res.data);
    },

    loadData() {
      if(this.scrollHandler) {
        this.scrollHandler.disable();
        this.scrollHandler = null;
      }

      this.pagination = '';
      this.videos = [];
      this.ownership = false;
      this.subscription = null;

      api.get(`/channels/${this.$route.params.id}`).then(res => {
        this.channel = res.data;
        document.title = `${this.channel.name} - ${process.env.VUE_APP_TITLE}`;

        if(this.$root.me) {
          api.get(`/channels/${this.$route.params.id}/permissions`).then(res => {
            this.ownership = res.data.ownership;

            api.get(`/channels/${this.$route.params.id}/subscriptions`)
              .then(res => this.subscription = res.data);
          });
        }

        this.fetchVideos().then(() => {
          if(this.pagination) {
            this.scrollHandler = scrolls.nearBottom(this.fetchVideos);
            this.scrollHandler.enable();
          }
        });
      });
    },

    async fetchVideos() {
      let res = await api.get(`/channels/${this.$route.params.id}/videos?` + new URLSearchParams({
        pagination: this.pagination
      }));
      
      let videos = res.data.data;
      for(let v of videos) {
        v.channel = this.channel;
        delete v.channel_id;
      }

      this.videos = this.videos.concat(videos);
      this.pagination = res.data.pagination;
      
      if(this.pagination && this.scrollHandler)
        this.scrollHandler.disable();
    }
  },

  setup() {
    return {
      picture
    }
  },

  watch: {
    "$route.params.id": function() {
      this.loadData();
    }
  }
}
</script>

<style lang="scss">
  @import "../stylesheets/colors.scss";

  .channel {
    flex: 1;

    .header {
      display: flex;
      align-items: center;
      background-color: #fafafb;
      padding: 36px 48px;

      .info {
        flex: 1;
        display: flex;
        align-items: center;

        .picture {
          width: 96px;
          height: 96px;
          border-radius: 48px;
        }

        .texts {
          margin-left: 24px;
          flex: 1;

          h1 {
            font-size: 28px;
            margin: 0;
            line-height: 100%;
          }

          .subscribers {
            color: $text-dark-grey;
            font-size: 15px;
          }
        }
      }

      .upload-video, .subscribe, .unsubscribe {
        display: block;
        height: 32px;
        background-color: $theme-blue;
        line-height: 32px;
        text-align: center;
        border: none;
        outline: none;
        cursor: pointer;
        border-radius: 4px;
        padding: 0 8px;
        font-size: 15px;

        color: white;
        text-decoration: none;
      }
    }
  }
</style>