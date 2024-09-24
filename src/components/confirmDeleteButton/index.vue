<template>
  <tiny-popconfirm
    ref="popconfirmRef"
    :title="title ? title : 'Record will be deleted.Are you sure to continue?'"
    type="info"
    trigger="click"
    width="200"
    custom-class="popconfirm-info system-content-1"
  >
    <template #reference>
      <img
        style="cursor: pointer; margin-left: 10px"
        src="@/assets/images/delete.png"
      />
    </template>
    <template #footer>
      <tiny-button
        type="primary"
        @click="clickConfirmButton('confirm', data.row)"
      >
        Yes
      </tiny-button>
      <tiny-button type="primary" @click="clickConfirmButton('cancel')">
        No
      </tiny-button>
    </template>
  </tiny-popconfirm>
</template>

<script setup>
import { ref, toRefs } from "vue";
import {
  Input as TinyInput,
  Button as TinyButton,
  Popconfirm as TinyPopconfirm,
} from "@opentiny/vue";

const popconfirmRef = ref();
const emit = defineEmits(["deleteMethod"]);

const props = defineProps({
  data: Object,
  type: String,
  color: String,
  icon: String,
  title: String,
});
const { data, type, color, icon, title } = toRefs(props);

const clickConfirmButton = (params, currentRow) => {
  if (params === "confirm" && currentRow) {
    emit("deleteMethod", popconfirmRef, currentRow, type);
  } else popconfirmRef.value.hide();
};
</script>

<style lang="less" scoped>
.redColor {
  color: red;
  cursor: pointer;
  font-size: 2rem;
}
.text-color {
  color: #1976d2;
  cursor: pointer;
}
.operation-text {
  margin-left: 1rem;
}
</style>
