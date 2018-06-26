<template>

<div class="containerDiv container-fluid" style="width:100%">
  <div class="row">
    <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
    <div class="col col-12 col-auto" style="color:gray">
      <h4 class="text-center" v-html="$store.state.appConfig.siteName"></h4>
      <h6 class="text-center" v-html="$store.state.appConfig.siteAddress"></h6>
      <br>
    </div>
    <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
  </div>
  <div class="row">
    <div class="col col-12 col-md-2 col-lg-2"></div>

    <div id="searchUI" class="col col-12 col-md-3 col-lg-3 col-xl-2" style="margin-bottom:20px">
      <div class="card">
      <div class="card-header bg-primary text-light" id="headingOne" style="cursor:pointer;" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            Search Menu <i class="fa fa-search-plus" aria-hidden="true"></i>&nbsp;&nbsp;<i class="fa fa-caret-down" aria-hidden="true"></i>
      </div>
      <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
          <div id="filterMenu" class="card-body" style="padding:10px; width:100%;">

            <div id="inputRoomName" class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Room Name</span>
              </div>
              <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
            </div>

            <div id="inputBuilding" class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Building</span>
              </div>
              <select class="custom-select" id="sizeTypeGroupSelect">
                <option selected></option>
                  <option v-bind:id="buildingLabel" v-bind:value='buildingLabel' v-for="(buildingLabel, index) in buildings" :key="index">
                    {{buildingLabel}}
                  </option>
              </select>
            </div>
            
            <div id="inputSeatingCapacity" class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Seating Capacity</span>
              </div>
              <input type="number" placeholder="ex. 50" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
            </div>
    
            <div id="inputSizeType" class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Size Type</span>
              </div>
              <select class="custom-select" id="sizeTypeGroupSelect">
                <option selected></option>
                  <option v-bind:id="sizeLabel" v-bind:value='sizeLabel' v-for="(sizeLabel, index) in sizeTypes" :key="index">
                    {{sizeLabel}}
                  </option>
              </select>
            </div>

            
            <div id="inputCapabilities" class="card">
              <div style="text-align:left; cursor:pointer;" class="card-header input-group-text bg-light" id="headingTwo" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                    Capabilities&nbsp;&nbsp;<i class="fa fa-caret-down" aria-hidden="true"></i>
              </div>
              <div id="collapseTwo" class="collapse hide" aria-labelledby="headingTwo" data-parent="#accordion">
                <div class="card-body">
                  <div v-for="(capabilityLabel, index) in capabilities" :key="index" width="100%">
                    <input class="capabilityCheckbox" v-bind:id="capabilityLabel" type="checkbox"/>&nbsp;{{capabilityLabel}}
                  </div>
                </div>
              </div>
            </div>
              
            
            <br>
            <button type="button" class="btn btn-sm btn-primary float-right" v-on:click="filterView">Search</button>
            <button type="button" class="btn btn-sm btn-secondary" v-on:click="resetFilterView">Reset</button>
          </div>
        </div>
      </div>
    </div>

    <div id="roomUI" class="col col-12 col-md-5 col-lg-5 col-xl-6">
      <div class="card">
        <div class="card-header bg-secondary text-light">
          Rooms
        </div>
      </div>
      <div v-for="(room, index) in rooms" :key="index">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title">{{room.name}}</h6>
            <div class="card-text" :hidden="room.building == null || room.building == ''">Building: {{room.building}}</div>
            <div class="card-text" :hidden="room.sizeType == null || room.sizeType == ''">Size Type: {{room.sizeType}}</div>
            <div class="card-text" :hidden="room.seatingCapacity == null || room.seatingCapacity == ''">Seating Capacity: {{room.seatingCapacity}}</div>
            <div class="card-text" :hidden="room.capabilities == null || room.capabilities.length == 0">
              <hr>
              <span class="badge badge-info" v-for="(capability, index) in room.capabilities" :key="index">
                {{capability}}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col col-12 col-md-2 col-lg-2"></div>
  </div>
  </div>
</template>

<script>
import axios from 'axios';
import * as apiMgr from '@/common/apiMgr.js';

export default {
  data () {
    return {
    }
  },

  computed: {
    title() {
      return this.$store.state.appConfig.findRoomViewTitle; 
    },
    viewDescription() {
      return this.$store.state.appConfig.roomsViewDescription; 
    },
    rooms() {
      return this.$store.state.roomSearchResult;
    },
    sizeTypes(){
      return this.$store.state.appConfig.sizeTypes;
    },
    capabilities(){
      return this.$store.state.appConfig.roomCapabilities;
    },
    buildings(){
      return this.$store.state.appConfig.buildings;
    },
  },

  activated() {
    console.log('FindRoom.vue activated.');
    let vm = this;

    if (this.$store.state.appConfig.findRoomViewTitle == null) {
      this.$router.push('/login'); // Config data lost, force back to login to refetch data.
      return;
    }

    this.$store.state.currentViewTitle = this.title;
    this.$store.state.enableNavBar = true;
    
    // empty roomSearchResult, then re-add all rooms
    if(vm.$store.state.roomSearchResult != null){
      while(vm.$store.state.roomSearchResult.length > 0) {
        vm.$store.state.roomSearchResult.pop();
      }
    }
    $.each(this.$store.state.rooms, function (index, room) {
      vm.$store.state.roomSearchResult.push(room);
    });
  },

  methods: {

    filterView: function(event) {
      if(event){
        var queryString = '';
        var vm = this;

        //collapse search menu
        $("#headingOne").click();


        //gather name to query
        var nameToQuery = '';
        var nameInputLocation = $("#inputRoomName input");

        nameToQuery = nameInputLocation.val();

        //gather building to query
        var buildingToQuery = '';
        var buildingSet = $("#inputBuilding select option");

        $.each(buildingSet, function( index, item ){
          if (item.selected){
            buildingToQuery = item.id;
          }
        });

        //gather seating capacity to query
        var seatingCapacityToQuery = '';
        var seatingCapacityInputLocation = $("#inputSeatingCapacity input");

        seatingCapacityToQuery = seatingCapacityInputLocation.val();

        //gather sizeType to query
        var sizeTypeToQuery = '';
        var sizeTypeSet = $("#inputSizeType select option");

        $.each(sizeTypeSet, function( index, item ){
          if (item.selected){
            sizeTypeToQuery = item.id;
          }
        });

        //gather capabilities to query
        var capabilitiesToQuery = [];
        var capabilitySet = $(".capabilityCheckbox");

        $.each(capabilitySet, function( index, item ){
          if (item.checked){
            capabilitiesToQuery.push(item.id);
          }
        });


        //append to queryString
        queryString += '&';

        if (sizeTypeToQuery!='') {
          queryString += `sizeTypeContains=${encodeURIComponent(sizeTypeToQuery)}`;
          queryString += '&'
        }

        if (buildingToQuery!='') {
          queryString += `buildingContains=${encodeURIComponent(buildingToQuery)}`;
          queryString += '&'
        }

        if (capabilitiesToQuery.length!=0) {
          var capabilityString = 'hasTheseCapabilities=';
          for(let capability in capabilitiesToQuery){
            capabilityString += `${encodeURIComponent(capabilitiesToQuery[capability])}|`;
          }
          //trim last |
          capabilityString = capabilityString.substring(0, capabilityString.length-1);
          queryString += capabilityString;
          queryString += '&'
        }

        if (nameToQuery!=''){
          queryString += `nameContains=${encodeURIComponent(nameToQuery)}`;
          queryString += '&'
        }

        if (seatingCapacityToQuery!=''){
          queryString += `seatingCapacityGreaterOrEqual=${encodeURIComponent(seatingCapacityToQuery)}`;
          //queryString += '&'
        }

        //clean up last & if needed
        var lastChar = queryString.charAt(queryString.length-1);
        if (lastChar == '&'){
          queryString = queryString.substring(0, queryString.length-1);
        }

        console.log(`FindRoom.vue - Query string: ${queryString}`);

  
        //get queried rooms
        var url = apiMgr.getRoomsUrl() + queryString; 

            axios.get(url)
                .then(res => {
                    console.log("getRoomsUrl return status: " + res.status);
                    
                    while(vm.$store.state.roomSearchResult.length > 0) {
                      vm.$store.state.roomSearchResult.pop();
                    }
                    var foundRooms = res.data;
                    $.each(foundRooms, function (index, room) {
                      vm.$store.state.roomSearchResult.push(room);
                    });
                    
                    vm.isFetchingRooms = false;
                    //vm.$forceUpdate();
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                })

        
      }
    },

    resetFilterView: function(event){
       if(event){
        //collapse search menu
        $("#headingOne").click();

        //reset all input boxes and checkboxes
        ///.....


         //get full list of rooms
        var vm = this;
        var url = apiMgr.getRoomsUrl(); 

            axios.get(url)
                .then(res => {
                    console.log("getRoomsUrl return status: " + res.status);
                    vm.$store.state.roomSearchResult = res.data;
                    vm.isFetchingRooms = false;
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                })
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