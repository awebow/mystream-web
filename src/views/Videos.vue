<template>
  <nav class="video-nav">
    <VideoList :videos="videos" />
  </nav>
</template>

<script>
import api from '../utils/api';
import scrolls from '../utils/scrolls';
import VideoList from '@/components/VideoList.vue';

export default {
  components: { VideoList },

  data: () => ({
    videos: [],
    channels: new Map(),
    pagination: '',
    fetching: false,
    scrollHandler: null
  }),

  mounted() {
    this.getVideos().then(() => {
      if(this.pagination) {
        this.scrollHandler = scrolls.nearBottom(this.getVideos);
        this.scrollHandler.enable();
      }
    });
  },

  unmounted() {
    if(this.scrollHandler)
      this.scrollHandler.disable();
  },

  methods: {
    async getVideos() {
      try {
        let res = await api.get(`/videos?pagination=${this.pagination}`);
        let videos = res.data.data;
        this.pagination = res.data.pagination;

        for(let v of videos) {
          if(!this.channels.has(v.channel_id)) {
            res = await api.get(`/channels/${v.channel_id}`);
            this.channels.set(v.channel_id, res.data);
          }

          v.channel = this.channels.get(v.channel_id);
          delete v.channel_id;
        }

        this.videos = this.videos.concat(videos);

        if(this.pagination == null)
          this.scrollHandler.disable();
      } catch(e) {
        console.log(e);
      }
    }
  },

}
</script>

<style lang="scss">
  .video-nav {
    flex: 1;
  }

  
</style>