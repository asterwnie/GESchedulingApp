<template>
  <div>
    <TopBar/>
    <Page/>
  </div>
</template>

<script>
import TopBar from "./TopBar.vue"
import Page from "./Page.vue"

export default {
  components: {
    TopBar,
    Page
  }
}
</script>
