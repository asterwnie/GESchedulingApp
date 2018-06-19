<template>

  <div>
    <button type="button" class="btn btn-secondary btn-sm" @click.prevent="$router.push('findroom')">Find</button>&nbsp;<label :for="ctrlId">{{ promptLabel }}</label>
    <textarea :id="ctrlId" :screenNum="screenNum" class="is-request-data form-control form-control-sm"></textarea>
    <p :id="dataInvalidMsgId" style="display:none;" class="input-required-msg text-danger">Invalid input.</p>
    <p :id="dataRequiredMsgId" style="display:none;" class="input-invalid-msg text-danger">This field is required.</p>
  </div>

</template>

<script>
export default {
    props: ['screenNum', 'ctrlId', 'promptLabel', 'dataInvalidMsgId', 'dataRequiredMsgId']
}
</script>