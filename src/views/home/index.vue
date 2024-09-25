<template>
  <div class="app-container">
    <div class="homeTitle">Shortcut By Application</div>
    <div class="shortcutDiv">
      <div class="shortcutBox" @click="toDashboard('All')">
        <label>Dashboard</label>
      </div>
      <div class="shortcutBox" @click="toDashboard('Draft')">
        <label>Draft</label>
      </div>
      <div class="shortcutBox" @click="toDashboard('Pending Approval')">
        <label>Pending Approval</label>
      </div>
      <div class="shortcutBox" @click="toDashboard('Approved')">
        <label>Approved</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const toDashboard = (type) => {
  router.push({
    path: "/dashboard",
    query: {
      activeName: type,
    },
  });
};
</script>

<style lang="scss" scoped>
.homeTitle {
  font-size: 30px;
  font-weight: bold;
}
.shortcutDiv {
  display: flex;
  flex-wrap: wrap;
}
.shortcutBox {
  width: 150px;
  height: 150px;
  margin: 10px;
  border-radius: 5px;
  border: 1px solid #147cdc;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}
</style>
