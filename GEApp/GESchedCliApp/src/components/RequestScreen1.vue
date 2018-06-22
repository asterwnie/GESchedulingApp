<template>  
    <request-view :currentScreenNum="currentScreenNum"></request-view>
</template>

<script>
import requestView from '@/components/RequestCommon.vue'

export default {
    data () {
    return {
      currentScreenNum: 1
    }
  },

  components: {
    requestView: requestView
  }
}
</script>