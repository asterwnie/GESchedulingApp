<template>

  <div>
    <div class="dropdown">

    <label :for="ctrlId">{{ promptLabel }}</label><br>
    <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Quick Pick
    </button>
    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <a class="dropdown-item" href="#">Forum</a>
    <a class="dropdown-item" href="#">Room 1</a>
    <a class="dropdown-item" href="#">Room 2</a>
    </div>
    </div>
    <button type="button" class="btn btn-secondary btn-sm" @click.prevent="$router.push('findroom')">Find</button>
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