<template>
<div>
  <b-container>
    <b-row>
        <b-col>{{friend1}}</b-col>
        <b-col>{{friend2}}</b-col>
        <b-col>{{friend3}}</b-col>
        <b-col>{{friend4}}</b-col>
        <b-col>{{friend5}}</b-col>
    </b-row>
  </b-container>
  <br/>
  <div class="form-check">
      <input type="checkbox" class="filled-in form-check-input" id="friendscheckbox">
      <label class="form-check-label" for="friendscheckbox">Accept as friends! (the Booststrap styling is not working here under IE 11! Works on Chrome.)</label>
  </div>
</div>
</template>

<script>
export default {  
  props: [
    'friend1',
    'friend2',
    'friend3',
    'friend4',
    'friend5'
  ]

}
</script>