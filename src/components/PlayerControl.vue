<template>
  <div class="player-control" ref="control">
    <PlayerMenu class="video-settings" v-if="menu == 'settings'" :items="settingItems" />
    <PlayerMenu class="quality-settings" v-if="menu == 'quality'" :items="qualityItems()" />
    <PlayerMenu class="speed-settings" v-if="menu == 'speed'" :items="speedItems()" />
  </div>
</template>

<script>
import PlayerMenu from './PlayerMenu';

export default {
  data() {
    return {
      menu: null,
      settingItems: [
        {
          label: "화질",
          value: "자동",
          onClick: () => this.menu = "quality"
        },
        {
          label: "재생 속도",
          value: "1배속",
          onClick: () => this.menu = "speed"
        }
      ],
      quality: "auto",
      speed: 1
    }
  },

  components: { PlayerMenu },

  props: ['setQuality', 'setSpeed', 'qualities'],

  mounted() {
  },

  methods: {
    qualityItems() {
      return [{
        label: "자동",
        selected: this.quality == "auto",
        onClick: () => this.setQuality("auto")
      }].concat(this.qualities.map((e, i) => ({
        label: this.qualityName(e),
        selected: this.quality == i,
        onClick: () => this.setQuality(i)
      })));
    },

    speedItems() {
      return [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(e => ({
        label: `${e}배속`,
        selected: this.speed == e,
        onClick: () => this.setSpeed(e)
      }));
    },

    qualityName: quality => `${quality.width}×${quality.height}@${quality.frameRate}Hz`,
    
    toggleSettings() {
      if(this.menu == "settings" || this.menu == "quality" || this.menu == "speed")
        this.menu = null;
      else
        this.menu = "settings";
    },

    qualityChanged(quality) {
      this.quality = quality;
      this.settingItems[0].value = quality == "auto" ? "자동" : this.qualityName(this.qualities[quality]);
    },

    speedChanged(speed) {
      this.speed = speed;
      this.settingItems[1].value = `${speed}배속`;
    }
  }
}
</script>

<style lang="scss">
  .player-control {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>