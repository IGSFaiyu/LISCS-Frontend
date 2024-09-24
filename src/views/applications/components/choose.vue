<template>
  <div>
    <!-- <div class="page-title">{{ "Application" }}</div> -->
    <div style="margin-top: 100px; display: flex; justify-content: center">
      <div
        class="new-button"
        style="margin-right: 20px"
        @click="handleSelect('Form 1')"
      >
        <div>
          <img src="@/assets/images/Maritime.png" alt />
        </div>
        {{ "Form 1" }}
      </div>
      <div class="new-button" @click="handleSelect('Form 2')">
        <div>
          <img src="@/assets/images/Aviation.png" alt />
        </div>
        {{ "Form 2" }}
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["changeType"]);

const handleSelect = (val) => {
  emit("changeType", val);
};
</script>

<style lang="scss" scoped></style>
