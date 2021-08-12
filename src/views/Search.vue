<template>
  <nav id="search-result">
    <h1>채널</h1>
    <ChannelList :items="channels" />
    
    <template v-if="this.$route.query.type != 'channel'">
      <router-link to="?type=channel" class="more gray-btn" v-if="moreChannels">더 보기</router-link>

      <h1>동영상</h1>
      <VideoList :videos="videos" type="row" level="2" />
    </template>
  </nav>
</template>

<script>
import ChannelList from '@/components/ChannelList.vue';
import VideoList from '@/components/VideoList.vue';
import api from '../utils/api';
import scrolls from '../utils/scrolls';

export default {
  components: {ChannelList, VideoList},

  data: () => ({
    videos: [],
    channels: [],
    moreChannels: false,
    channelMap: new Map(),
    pagination: '',
    fetching: false,
    scrollHandler: null
  }),

  mounted() {
    this.search(this.$route.params.query).then(() => {
      this.scrollHandler = scrolls.nearBottom(this.search);
      this.scrollHandler.enable();
    });
  },

  unmounted() {
    if(this.scrollHandler)
      this.scrollHandler.disable();
  },

  methods: {
    async search() {
      document.title = `${this.$route.query} - ${process.env.VUE_APP_TITLE}`;

      let channelLimit = this.$route.query.type == 'channel' ? 20 : 2;
      let res = await api.get('/channels?' + new URLSearchParams({
        query: this.$route.params.query,
        limit: channelLimit,
        pagination: this.$route.query.type == 'channel' ? this.pagination || '' : ''
      }).toString());
      this.channels = this.channels.concat(res.data.data);

      if(this.$route.query.type == 'channel') {
        this.pagination = res.data.pagination;
      }
      else {
        this.moreChannels = res.data.pagination != null;

        res = await api.get("/videos?" + new URLSearchParams({
          query: this.$route.params.query,
          pagination: this.pagination || ''
        }));
        let videos = res.data.data;
        this.pagination = res.data.pagination;

        for(let v of videos) {
          if(!this.channelMap.has(v.channel_id)) {
            res = await api.get(`/channels/${v.channel_id}`);
            this.channelMap.set(v.channel_id, res.data);
          }

          v.channel = this.channelMap.get(v.channel_id);
          delete v.channel_id;
        }

        this.videos = this.videos.concat(videos);
      }

      if(this.pagination && this.scrollHandler)
        this.scrollHandler.disable();
    }
  },

  watch: {
    '$route.params.query': function(query) {
      if(query != undefined) {
        this.videos = [];
        this.channels = [];

        this.scrollHandler.disable();

        this.pagination = "";
        this.search(query).then(() => this.scrollHandler.enable());
      }
    },

    '$route.query.type': function(type) {
      this.videos = [];
      this.channels = [];

      this.scrollHandler.disable();

      this.pagination = "";
      this.search(this.$route.params.query).then(() => this.scrollHandler.enable());
    }
  }
}
</script>

<style lang="scss">
  @import "../stylesheets/controls.scss";
  @import "../stylesheets/colors.scss";

  #search-result {
    @include default-controls;

    flex: 1;

    h1 {
      font-size: 18px;
      margin: 16px 16px 0 16px;
    }

    

    a.more {
      margin-left: 16px;
      margin-right: 16px;
      border-radius: 8px;
      height: 28px;
      line-height: 28px;
      color: $text-dark-grey;
    }
  }
</style>