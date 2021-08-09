<template>
  <ul class="video-list" :class="{row: type == 'row'}">
    <VideoItem v-for="v in videos" :key="v.id" :data="v" :type="type" :level="level" />
  </ul>
</template>

<script>
import VideoItem from '@/components/VideoItem.vue';

export default {

  components: { VideoItem },

  props: {
    videos: Array,
    type: {
      type: String,
      default: 'grid'
    },
    level: {
      type: Number,
      default: 1
    }
  }

}
</script>

<style lang="scss">
  .video-list {
    list-style: none;
    text-align: left;
    box-sizing: border-box;
    display: grid;
    width: 100%;
    margin: 0;
    column-gap: 6px;

    padding: 12px;
    grid-template-columns: repeat(4, 1fr);

    &.row {
      display: flex;
      flex-direction: column;
    }

    @media screen and (max-width: 768px) {
      padding: 6px;
      grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (min-width: 768px) and (max-width: 1024px) {
      padding: 12px;
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>