<template>

<div class="containerDiv container-fluid" style="width:100%">
  <div class="row">
      <div class="col col-sm-1 col-md-2 col-lg-4"></div>
      <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%">

        <div style="color:gray">
          <h4 class="text-center" v-html="$store.state.appConfig.siteName"></h4>
          <h6 class="text-center" v-html="$store.state.appConfig.siteAddress"></h6>
          <br>
        </div>

        <div id="filterMenu" class="card" style="padding:10px; width:100%;">

          <div id="searchMenu" style="display:flex;">
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Search</span>
              </div>
              <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
            </div>
          </div>

          <div id="filterButtons" style="display:flex;">
            <div class="input-group input-group-sm mb-3">
              
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Filter</span>
              </div>

              <!--use custom forms instead? https://getbootstrap.com/docs/4.1/components/input-group/-->
              <select class="custom-select" id="sizeTypeGroupSelect">
                <option selected>Room Type</option>
                <div v-for="(sizeLabel, index) in sizeTypes" :key="index">
                  <option v-bind:value='index' v-bind:id="sizeLabel" v-on:click="filterView">{{sizeLabel}}</option>
                </div>
              </select>
              
              <!--modify for multi-check - maybe modo?-->
              <div class="dropdown capabilities">
                <button class="btn btn-sm btn-info dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Capabilities
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <div v-for="(capabilityLabel, index) in capabilities" :key="index" width="100%">
                    <a class="dropdown-item" v-bind:id="capabilityLabel" v-on:click="filterView">{{capabilityLabel}}</a> <!--note: removed href="#"-->
                  </div>
                </div>
              </div>

              <button type="button" class="btn btn-sm btn-secondary" v-on:click="resetFilterView">Reset</button>
            </div>

          </div>
        </div>

        <br>

        <!--for each room, display by filter type-->
        <div v-for="(room, index) in rooms" :key="index">
          <!--only show rooms if showAllRooms=true, or a match is found for sizeType or capabilities-->
            <div :hidden="!(showAllRooms | (room.sizeType==showRoomFilter | (room.capabilities.indexOf(showRoomFilter) > -1)))">
                <div class="card">
                  <div class="card-body">
                    <h6 class="card-title">{{room.name}}</h6>
                    <p class="card-text" :hidden="room.sizeType == null || room.sizeType == ''">Size Type: {{room.sizeType}}</p>

                  </div>
                </div>
            </div>
        </div>
      </div>
    <div class="col col-sm-1 col-md-2 col-lg-4"></div>
  </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      showRoomFilter: '',
      showAllRooms: true,
    }
  },

  computed: {
    title() {
      return this.$store.state.appConfig.roomsViewTitle; 
    },
    viewDescription() {
      return this.$store.state.appConfig.roomsViewDescription; 
    },
    rooms() {
      return this.$store.state.rooms;
    },
    sizeTypes(){
      return this.$store.state.appConfig.sizeTypes;
    },
    capabilities(){
      return this.$store.state.appConfig.roomCapabilities;
    },
  },

  activated() {
    console.log('FindRoom.vue activated.');

    if (this.$store.state.appConfig.roomsViewTitle == null) {
      this.$router.push('login'); // Config data lost, force back to login to refetch data.
    }

    this.$store.state.currentViewTitle = this.title;
    this.$store.state.enableNavBar = true;
  },

  methods: {

    //may revisit to narrow by BOTH room type and Capability
    //right now, it can only each room type OR capabilitys
    filterView: function(event) {
      if(event){
        this.showRoomFilter = event.target.id;
        this.showAllRooms = false;
      }
      
    },

    resetFilterView: function(event){
       if(event){
        this.showRoomFilter = '';
        this.showAllRooms = true;
      }
      
    }


  }
}
</script>

<!-- Style scoped to the html template define in this file only -->
<style scoped>
/*div {
  display: inline-block;
  margin: 20px 20px;
}*/
.dropdown-menu{
  flex-direction: column;
}
.containerDiv {
  display: inline-block;
  margin-top: 16px;
}
</style>