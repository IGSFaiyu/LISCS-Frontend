<template>
  <div>
    <!-- <div class="page-title">{{ "Application" }}</div> -->
    <div style="margin-top: 100px; display: flex; justify-content: center">
      <div
        class="new-button"
        style="margin-right: 20px"
        @click="handleSelect('Labour Importation Scheme for the Construction Sector Application Form')"
      >
        <div>
          <img src="@/assets/images/Maritime.png" alt />
        </div>
        {{ "Labour Importation Scheme for the Construction Sector Application Form" }}
      </div>
      <div class="new-button" @click="handleSelect('(b)	Annex I – Particulars of Employer(s) of the Imported Labour ')">
        <div>
          <img src="@/assets/images/Aviation.png" alt />
        </div>
        {{ "(b)	Annex I – Particulars of Employer(s) of the Imported Labour " }}
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
