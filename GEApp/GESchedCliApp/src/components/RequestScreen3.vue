<template>  
    <request-view :currentScreenNum="currentScreenNum"></request-view>
</template>

<script>
import requestView from '@/components/RequestCommon.vue'

export default {
  data () {
    return {
      currentScreenNum: 3
    }
  },

  components: {
    requestView: requestView
  }
}
</script>