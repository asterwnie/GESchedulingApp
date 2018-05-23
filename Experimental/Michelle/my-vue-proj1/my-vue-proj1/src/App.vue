<template>
  <div id="app">
    <router-link to="/home">Home</router-link>&nbsp;||&nbsp;<router-link to="/friends/Michelle/Meir/Flo/Alyssa/Cyra">Friends</router-link>
    <br/>

    <b-navbar toggleable="md" type="dark" variant="info">

      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand to="/home">Home</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item to="/friends/Michelle/Meir/Flo/Alyssa/Cyra">Friends</b-nav-item>
          <b-nav-item to="/form1">Show Form</b-nav-item>
          <b-nav-item href="#">Action 2</b-nav-item>
          <b-nav-item href="#">Action 3</b-nav-item>
          <b-nav-item href="#">Action 4</b-nav-item>
          <b-nav-item href="#" disabled>Action 5</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    
    <div>
      <b-dropdown id="Menu" text="Menu" class="m-md-2">
        <b-dropdown-item to="/home">Home</b-dropdown-item>
        <b-dropdown-item to="/friends/Michelle/Meir/Flo/Alyssa/Cyra">Friends</b-dropdown-item>
      </b-dropdown>
    </div>
    <br/>

<!--This is where the page is injected by the current route-->
    <router-view/>

  </div>
</template>

<script>
import Home from './components/Home.vue'

export default {
  name: 'app',
  components: {
    Home
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
