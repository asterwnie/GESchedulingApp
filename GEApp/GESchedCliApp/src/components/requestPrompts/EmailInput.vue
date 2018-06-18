<template>
  <div>  
    <label :for="ctrlId">{{ promptLabel }}</label>
    <input type="text" :id="ctrlId" :screenNum="screenNum" class="is-request-data form-control form-control-sm">
    <p :id="dataInvalidMsgId" style="display:none;" class="text-danger">Please enter a valid email address.</p>
    <p :id="dataRequiredMsgId" style="display:none;" class="text-danger">Please enter an email address.</p>
  </div>
</template>

<script>
export default {
    props: ['screenNum', 'ctrlId', 'promptLabel', 'dataInvalidMsgId', 'dataRequiredMsgId']
}
</script>