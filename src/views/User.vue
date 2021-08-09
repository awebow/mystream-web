<template>
  <div>
      <ul>
          <li v-for="c in channels"><router-link :to="`/channels/${c.id}`">{{ c.name }}</router-link></li>
      </ul>
  </div>
</template>

<script>
import api from '../utils/api'
export default {
    data: () => ({
        channels: []
    }),

    mounted() {
        api.get('/users/me/channels').then(res => {
            this.channels = res.data;
        });
    }
}
</script>

<style>

</style>