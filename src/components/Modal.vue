<template>
  <div class="modal-bg" :class="{ closing }">
    <div class="modal">
      <h1>{{ title }}</h1>
      <div class="content"><slot></slot></div>
      <div class="buttons">
        <button type="button" v-for="b in buttons"
          @click="handleClick(b)">{{ b.label }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  data: () => ({
    closing: false
  }),

  props: ['title', 'content', 'buttons', 'onClose'],

  methods: {
    handleClick(b) {
      if(b.onClick != null)
        b.onClick();

      this.closing = true;
      setTimeout(() => {
        if(b.closeAfter)
          this.$props.onClose();
      }, 200);
    }
  }
  
}
</script>

<style lang="scss">
  @import "../stylesheets/colors.scss";

  .modal-bg {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #000000e8;

    @keyframes fadeIn {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }

    animation: 0.2s fadeIn;
    transition: opacity 0.5s;

    &.closing {
      opacity: 0;
    }

    .modal {
      display: flex;
      flex-direction: column;

      min-width: 300px;
      min-height: 100px;
      padding: 16px;

      background-color: white;
      border-radius: 16px;

      h1 {
        margin: 0;
        font-size: 20px;
      }

      .content {
        font-size: 16px;
      }

      .buttons {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        flex: 1;
        gap: 4px;

        button {
          min-width: 72px;
          height: 32px;

          border: none;
          outline: none;
          border-radius: 4px;
          cursor: pointer;

          background-color: $theme-blue;
          color: white;

          &:hover:not(:disabled) {
              background-color: $theme-blue-emp;
          }
        }
      }
    }
  }
</style>