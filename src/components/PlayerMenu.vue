<template>
  <ul class="player-menu">
    <li v-for="item in items" :key="item.label" @click="item.onClick != undefined ? item.onClick() : {}">
      <button type="button" :aria-label="item.label" :class="{ selected: item.selected }">
        <div class="item-label">{{ item.label }}</div>
        <div class="item-value" v-if="item.value != undefined">{{ item.value }}</div>
      </button>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['items']
}
</script>

<style lang="scss">
  @import "../stylesheets/colors.scss";

  .player-menu {
      position: absolute;
      width: 200px;
      right: 10px;
      bottom: 50px;

      list-style: none;
      background: #000000AA;
      color: white;
      z-index: 15;

      margin: 0;
      padding: 0;

      li {
        width: 100%;

        button {
          display: flex;
          box-sizing: border-box;
          width: 100%;
          background: none;
          border: none;
          border-radius: 0;
          outline: none;

          text-align: left;
          font: inherit;
          color: inherit;
          cursor: pointer;
          padding: 12px;
          font-size: 15px;

          &:hover {
            background: #ffffff99;
          }

          &.selected {
            background: $theme-blue;
          }

          .item-value {
            margin-left: auto;
          }
        }
      }
    }
</style>