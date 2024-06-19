<script setup lang="ts">
import { onMounted, ref } from 'vue'

const text = ref("")

function main() {
  const recognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.onresult = function(event) {
    var interim_transcript = '';
    var final_transcript = '';

    for (var i = 0; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }

    text.value = '<b>最终结果：</b> ' + final_transcript + '<br/><b>临时结果：</b> ' + interim_transcript;
  };
}

onMounted(() => {
  main()
})
</script>

<template>
  {{ text }}
</template>

<style scoped lang="scss">

</style>