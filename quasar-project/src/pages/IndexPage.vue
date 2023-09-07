<template>
  <q-page class="flex flex-center">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <div v-else-if="data">
      <ul>
        <li v-for="item in data" :key="item.id">
          <a @click="$emit('setPostId', item.id)" href="#">{{ item.title }}</a>
        </li>
      </ul>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { api } from 'boot/axios'

export default defineComponent({
  name: 'IndexPage',
  setup () {
    const { data, error, isError, isLoading } = useQuery({
      queryFn: () => api.get('https://jsonplaceholder.typicode.com/posts').then(({ data }) => data),
      queryKey: ['posts']
    })

    return { data, error, isError, isLoading }
  }
})
</script>
