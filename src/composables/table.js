import { saveView } from "@/api/index";
import { ElMessage } from "element-plus";
import { ref } from 'vue';

export function tableComposable() {
  const colGridRef = ref(null);
  const settingId = ref('')
  const tableName = ref('')

  function hideBoolCol(column) {
    const columnList = column.split(",").map((item) => item.trim());
    const colGrid = colGridRef.value;
    const col = columnList.map((item) => {
      return colGrid
        .getTableColumn()
        .fullColumn.filter((a) => a.property === item)[0];
    });
    col.visible ? colGrid.hideColumn(col) : colGrid.showColumn(col);
    colGrid.refreshColumn();
  }

  async function saveSetting(settingConfigs) {
    try {
      console.log(settingConfigs.sortType);
      console.log(settingConfigs.pageSize);
      console.log(settingConfigs.columns);
      const visibleColumns = settingConfigs.columns.filter(
        (item) => item.visible
      );
      const params = {
        settingId: settingId.value,
        tableName: tableName.value,
        tableSetting: visibleColumns.map((item) => item.property).join(", "),
      };
      let { code, data, message } = await saveView(params);
      if (code === 200) {
        console.log("table setting" + " " + message);
      } else {
        ElMessage.error(message);
      }
    } catch (err) {
      console.log("Error fetching data:", err);
    }
  }


  return {
    colGridRef,
    settingId,
    tableName,
    hideBoolCol,
    saveSetting
  };
}
