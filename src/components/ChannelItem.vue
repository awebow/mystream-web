<template>
  <li class="channel-item">
    <router-link :to="`/channels/${data.id}`">
      <img :src="picture.channelPicture(data.picture)" />
      <div class="info">
        <address class="channel-name">{{ data.name }}</address>
        <div class="channel-stats">
          <span class="subscribers">구독자 {{ data.subscribers }}명</span>
          ·
          <span class="video-count">동영상 {{ data.videos }}개</span>
        </div>
        <p class="description">{{ data.description.replaceAll('\n', '') }}</p>
      </div>
    </router-link>
  </li>
</template>

<script>
import picture from '../utils/picture';

export default {

  props: ['data'],
  setup() {
    return {
      picture
    }
  }

}
</script>

<style lang="scss">
  @import "../stylesheets/colors.scss";

  .channel-item a {
    display: flex;
    box-sizing: border-box;
    height: 160px;
    padding: 12px;

    align-items: stretch;
    gap: 16px;

    color: $text-dark-grey;
    text-decoration: none;
    font-size: 14px;
    border-radius: 8px;

    &:hover {
      background-color: $darken-overlay;
    }

    img {
      border-radius: 50%;
    }

    .info {
      address {
        color: black;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
      }

      overflow: hidden;

      .channel-stats {
        margin-bottom: 4px;
      }

      .description {
        text-overflow: ellipsis;
        margin: 0;
        line-height: 140%;
        text-align: justify;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
      }
    }
  }
</style>