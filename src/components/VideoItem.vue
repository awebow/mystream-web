<template>
  <li class="video-item">
    <router-link :to="`/videos/${data.id}`" class="video-link">
      <img :src="thumbnailUrl(data.id)" class="thumbnail" />
      <div class="info">
        <template v-if="type =='grid'">
          <img :src="channelPicture()" class="profile" />
          <div class="data">
            <component :is="`h${level}`" class="title">{{ data.title }}</component>
            <div class="ch-name">{{ data.channel.name }}</div>
            <div class="posted-at">{{ formatDate(data.posted_at) }}</div>
          </div>
        </template>

        <template v-else>
          <component :is="`h${level}`" class="title">{{ data.title }}</component>
          <div class="posted-at">{{ formatDate(data.posted_at) }}</div>
          <div class="channel-info">
            <img :src="channelPicture()" class="profile" />
            <div class="ch-name">{{ data.channel.name }}</div>
          </div>

          <div class="description">
            <p>
              {{ data.description.replaceAll('\n', ' ') }}
            </p>
          </div>
        </template>
      </div>
    </router-link>
  </li>
</template>

<script>
import storage from '../utils/storage';
import time from '../utils/time';
import default_pic_ch from '@/assets/default_pic_ch.svg';

export default {

  methods: {
    thumbnailUrl: id => storage.videoUrl(`/${id}/thumbnail.jpg`),
    channelPicture() {
      var picture = this.data.channel.picture;
      return picture == null ? default_pic_ch : storage.imageUrl(`/${picture}/512x512.jpg`);
    },
    formatDate: date => time.relative(date, new Date())
  },

  props: {
    data: Object,
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
  @import "../stylesheets/colors.scss";

  .video-item {
    box-sizing: border-box;
    min-width: 0;

    .video-link {
      display: block;
      text-decoration: none;
      box-sizing: border-box;
      padding: 12px;
      border-radius: 8px;

      &:hover {
        background-color: $darken-overlay;
      }

      .thumbnail {
        display: block;
        width: 100%;
      }

      .info {
        display: flex;
        align-items: center;
        margin-top: 8px;
        min-width: 0;
        
        .data {
          min-width: 0;
          flex: 1;
        }
      }

      .profile {
        display: block;
        height: 52px;
        border-radius: 50%;
        margin-right: 8px;
      }

      .title {
        font-size: 16px;
        font-weight: 500;
        margin: 0;
        line-height: 130%;
        color: black;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .ch-name, .posted-at, .description p {
        font-size: 14px;
        line-height: 130%;
        color: $text-dark-grey;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }

  .row {
    .video-item {
      height: 192px;

      .video-link {
        display: flex;
        align-items: stretch;
        height: 100%;
        gap: 16px;

        .thumbnail {
          width: auto;
        }

        .info {
          flex-direction: column;
          align-items: stretch;
          margin-top: 0;

          .posted-at {
            flex: 0 1 auto;
          }

          .channel-info {
            display: flex;
            align-items: center;
            margin: 12px 0;

            .profile {
              height: 24px;
            }
          }

          .description p {
            margin: 0;
            white-space: normal;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            max-height: 73px;
            text-align: justify;
          }
        }
      }
    }
  }
</style>