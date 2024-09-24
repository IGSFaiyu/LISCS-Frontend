<template>
  <div>
    <div style="margin: 20px 0; float: right">
      <el-button type="primary" @click="toggleSelection()"
        >Batch Send</el-button
      >
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column
        v-for="item in columns"
        :key="item.value"
        :prop="item.value"
        :label="item.title"
      />
      <el-table-column label="Action" width="100">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.$index, scope.row)"
            >Review</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from "vue";

const tableData = ref([
  {
    number: "111",
  },
]);
const columns = ref([
  {
    title: "Appliction Number",
    value: "number",
    width: "200",
  },
  {
    title: "Last Update Date",
    value: "date",
    width: "200",
  },
  {
    title: "Internal Status",
    value: "status",
    width: "200",
  },
  {
    title: "Mail Type",
    value: "type",
    width: "200",
  },
  {
    title: "MATF Course/Examination Code",
    value: "code",
    width: "200",
  },
  {
    title: "Name of Course Provider/Examination Authority",
    value: "authority",
    width: "200",
  },
  {
    title: "Course/Examination Title",
    value: "title",
    width: "200",
  },
  {
    title: "Modified On",
    value: "modifiedOn",
    width: "180",
  },
  {
    title: "Modified By",
    value: "modifiedBySnap",
    width: "180",
  },
]);

function handleEdit() {
  // 跳转至详情页
}
</script>
