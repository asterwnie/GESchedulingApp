<template>

  <div>  
    <label :for="ctrlId">{{ promptLabel }}</label>
    <input type="text" :id="ctrlId" :screenNum="screenNum" class="is-request-data form-control form-control-sm">
    <p :id="dataInvalidMsgId" style="display:none;" class="text-danger">Invalid input.</p>
    <p :id="dataRequiredMsgId" style="display:none;" class="text-danger">This field is required.</p>
  </div>

</template>

<script>
export default {
    props: ['screenNum', 'ctrlId', 'promptLabel', 'dataInvalidMsgId', 'dataRequiredMsgId']
}
</script>