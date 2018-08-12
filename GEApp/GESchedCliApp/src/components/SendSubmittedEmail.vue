<template>  
    <div class="container-fluid">
        <div class="row">
            <div class="col col-12 col-md-1 col-lg-2"></div>
            <div class="col col-12 col-md-10 col-lg-8" style="color:gray">    
                <div class="alert alert-warning">
                    {{viewDescription}}
                </div>
            </div>
            <div class="col col-12 col-md-1 col-lg-2"></div>
        </div>
        <div style="height:8px"></div>

        <send-email-component-ctrl 
            :emailSubject="emailSubject"
            :emailTemplate="emailTemplate"
            :navOutButtonLabel="navOutButtonLabel"
            :navOutRoutePath="navOutRoutePath"
            :supportDoAnother="supportDoAnother"
            :defRecipientName="defRecipientName"
            :defRecipientEmail="adminEmailDistList"
            :needMostRecentUserAccessCode="needMostRecentUserAccessCode"
            :needMostRecentAdminAccessCode="needMostRecentAdminAccessCode">
        </send-email-component-ctrl>

        <div style="height:12px"></div>
        <div class="row">
          <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
          <div class="col col-12 col-auto" style="color:gray">
          <div class="site-name-footer" v-html="$store.state.appConfig.siteName"></div>
          <div class="site-address-footer" v-html="$store.state.appConfig.siteAddress"></div>
          <br>
          </div>
          <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
      </div>
  </div>
</template>
<script>
import sendEmailComponent from '@/components/admin/SendEmailCommon.vue'

export default {
    data () {
        return {
            navOutButtonLabel: "Done",
            navOutRoutePath: "/home",
            supportDoAnother: false,
            needMostRecentUserAccessCode: false,
            needMostRecentAdminAccessCode: false,

            defRecipientName: "Event Organizer",
        }
    },

    components: {
        sendEmailComponentCtrl: sendEmailComponent
    },

    
    computed: {
 
        title() {
            return this.$store.state.appConfig.requestSubmittedEmailViewTitle; 
        },

        viewDescription() {
            return this.$store.state.appConfig.requestSubmittedEmailViewDescription; 
        },
        
        emailSubject() {
            return this.$store.state.appConfig.requestSubmittedEmailSubject; 
        },

        emailTemplate() {
            return this.$store.state.appConfig.requestSubmittedEmailTemplate; 
        },

        adminEmailDistList() {
            return this.$store.state.appConfig.notifyAppAdminEmailDistributionList; 
        },
    },

    activated() {
        console.log('SendSubmittedEmail.vue activated.');

        this.$store.state.currentViewTitle = this.title;
        this.$store.state.enableNavBar = true;


    }
}
</script>