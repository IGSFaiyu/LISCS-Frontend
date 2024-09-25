<template>
  <div>
    <div :class="'chooseTitle' + (!choose1 ? ' hiddenChoose' : '')">
      <label>PDF FROM</label>
      <button class="chooseArrowDown" @click="choose1 = !choose1">
        <img src="@/assets/images/arrow-down.png" />
      </button>
    </div>
    <div v-if="choose1" class="chooseBody">
      <div class="new-button" @click="handleSelect('Upload PDF Form')">
        <div style="height: 160px">
          <img
            src="@/assets/images/file-pdf-solid.png"
            alt
            width="160px"
            height="143px"
          />
        </div>
        {{ "PDF Upload" }}
      </div>
    </div>
    <div
      :class="'chooseTitle' + (!choose2 ? ' hiddenChoose' : '')"
      style="margin-top: 10px"
    >
      <label>LISCS FROM</label>
      <button class="chooseArrowDown" @click="choose2 = !choose2">
        <img src="@/assets/images/arrow-down.png" />
      </button>
    </div>
    <div v-if="choose2" class="chooseBody">
      <div
        class="new-button"
        style="margin-right: 20px"
        @click="
          handleSelect(
            'Labour Importation Scheme for the Construction Sector Application Form'
          )
        "
      >
        <div style="height: 160px">
          <img src="@/assets/images/Maritime.png" alt />
        </div>
        {{ "Labour Importation Scheme for the Construction Sector Application Form" }}
      </div>
      <div
        class="new-button"
        style="margin-right: 20px"
        @click="
          handleSelect('(b)	Annex I – Particulars of Employer(s) of the Imported Labour ')
        "
      >
        <div style="height: 160px">
          <img src="@/assets/images/Aviation.png" alt />
        </div>
        {{ "(b)	Annex I – Particulars of Employer(s) of the Imported Labour " }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const choose1 = ref(true);
const choose2 = ref(true);

const emit = defineEmits(["changeType"]);

const handleSelect = (val) => {
  emit("changeType", val);
};
</script>

<style lang="scss" scoped>
.chooseTitle {
  font-size: 20px;
  font-weight: bold;
  background-color: #ccc;
  padding: 10px 7px;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  :hover {
    background-color: #888888 !important;
  }

  .chooseArrowDown {
    background: none;

    img {
      width: 30px;
      height: 30px;
      background-color: #ffffff00;
    }
  }
}

.hiddenChoose {
  border-bottom-left-radius: 7px;
  border-bottom-right-radius: 7px;
}

.chooseBody {
  padding: 10px 7px;
  border-bottom-left-radius: 7px;
  border-bottom-right-radius: 7px;
  border: 1px solid #ccc;
  // margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
