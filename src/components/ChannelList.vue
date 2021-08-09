<template>
  <ul class="channel-list">
    <ChannelItem v-for="i in items" :key="i.id" :data="i" />
  </ul>
</template>

<script>
import ChannelItem from './ChannelItem.vue';

export default {
  components: { ChannelItem },
  props: ['items']
}
</script>

<style lang="scss">
  .channel-list {
    list-style: none;
    padding: 12px;
    margin: 0;
  }
</style>