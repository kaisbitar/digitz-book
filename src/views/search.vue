<template>
  <div class="fullBook">
    <autoComplete/>
  </div>
</template>

<script>

// @ is an alias to /src
import autoComplete from "@/components/autoComplete.vue";

export default {
  name: "Home",
  components: {  
    autoComplete
  }
};
</script>
