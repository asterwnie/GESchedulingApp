<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col col-sm-1 col-md-2 col-lg-4"></div>
        <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">
        <form class="needs-validation" novalidate>
          <button class="btn btn-primary btn-block" type="submit" @click.prevent="$router.push('dofirst')">New Request</button>
        </form>
        <br/>
        <br/>

    <div class="card">
      <div class="card-header text-center">
        <b>Status</b>
      </div>
    </div>


    <div v-for="(requestItem, index) in requestItems" :key="index">
      <div class="card">
        <div class="card-body">
          <h6 class="card-title">{{requestItem.meetingTitle}}</h6>
          <h8 class="card-title">Status:  <span :class="requestItem.statusBadge">{{requestItem.requestStatus}}</span></h8>
          <p class="card-text">{{requestItem.meetingComment}}</p>
          <p class="card-text">Last updated:  {{requestItem.lastModified}}</p>
          <a href="#" class="btn btn-primary btn-sm">{{requestItem.buttonLabel}}</a>
        </div>
    </div>
    </div>


  </div>
  </div>
</div>
</template>

<script>
const existingRequestsData = [
        { 
          statusBadge: 'badge badge-info',
          requestStatus: "Under Review",  
          meetingTitle: 'Special Project Kick-off Meeting', 
          meetingComment: 'You request will be process within congue convallis, at magna senectus pellentesque quisque viverra, ligula etiam malesuada.', 
          lastModified: '5/22/2018 03:30 PM',
          buttonLabel: 'View'
        },
        { 
          statusBadge: 'badge badge-secondary',
          requestStatus: 'Not Submited',  
          meetingTitle: 'University Student Tour', 
          lastModified: '5/22/2018 03:30 PM',
          buttonLabel: 'Edit'
        },
        { 
          statusBadge: 'badge badge-danger',
          requestStatus: "Rejected",  
          meetingTitle: 'Big Boss Retirement Party', 
          meetingComment: 'Congue convallis dictumst ad vulputate aliquet curae sit, at magna senectus pellentesque quisque integer luctus rutrum viverra, ligula etiam sagittis ullamcorper leo porta etiam tempor eu diam potenti rutrum sollicitudin laoreet elit malesuada.', 
          lastModified: '5/19/18 8:10 PM',
          buttonLabel: 'Edit'
        },
        { 
          statusBadge: 'badge badge-success',
          requestStatus: "Completed",  
          meetingTitle: 'Quarterly Team Meeting', 
          meetingComment: 'You request has been processed.', 
          lastModified: '5/22/2018 03:30 PM',
          buttonLabel: 'View'
        }
      ]

export default {
  data () {
    return {
      title: "Home",
      requestItems: existingRequestsData
      }
  },

  activated() {
      console.log('Home.vue activated.');
      this.$store.state.currentViewTitle = this.title;
      this.$store.state.enableNavBar = true;
  },

  created() {
    console.log('Home.vue created.');
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>