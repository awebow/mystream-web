<template>
  <nav id="subscriptions">
    <h1>구독 채널</h1>
    <ChannelList :items="channels" />
  </nav>
</template>

<script>
import ChannelList from '@/components/ChannelList.vue';
import api from '../utils/api';
import scrolls from '../utils/scrolls';

export default {

  data: () => ({
    channels: [],
    pagination: '',
    scrollHandler: null
  }),

  components: { ChannelList },

  mounted() {
    this.fetch().then(() => {
      if(this.pagination) {
        this.scrollHandler = scrolls.nearBottom(this.fetch);
        this.scrollHandler.enable();
      }
    });
  },

  unmounted() {
    if(this.scrollHandler)
      this.scrollHandler.disable();
  },

  methods: {
    async fetch() {
      try {
        let res = await api.get("/channels/subscribed?" + new URLSearchParams({
          pagination: this.pagination
        }));
        
        this.channels = this.channels.concat(res.data.data);
        this.pagination = res.data.pagination;

        if(this.pagination && this.scrollHandler)
          this.scrollHandler.disable();
      }
      catch(err) {
        console.log(err);
      }
    }
  }

}
</script>

<style lang="scss">
  #subscriptions {
    flex: 1;

    h1 {
      font-size: 18px;
      margin: 16px 16px 0 16px;
    }
  }
</style>