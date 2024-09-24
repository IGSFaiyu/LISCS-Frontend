<template>
  <div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      class="custom-form"
      style="width: 60%; margin: 0 auto"
    >
      <div class="custom-form-title">Part I: Course/Examination details</div>
      <section style="display: contents">
        <el-form-item
          class="custom-form-item width-100"
          label="1. Have any qualification(s) been awarded upon completion of course/examination?"
          prop="q1Ans"
        >
          <el-radio-group v-model="form.q1Ans" @change="q1AnsChange">
            <el-radio :value="1">Yes</el-radio>
            <el-radio :value="0">No</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="form.q1Ans === 1"
          class="custom-form-item width-100"
          label="If yes, specify"
          prop="q1Specify"
        >
          <el-input v-model="form.q1Specify" type="textarea" />
        </el-form-item>
        <el-form-item
          class="custom-form-item width-100"
          label="2. Has any certificate been given upon completion of the course/examination?"
          prop="q2Ans"
        >
          <el-radio-group v-model="form.q2Ans" @change="q1AnsChange">
            <el-radio :value="1">Yes</el-radio>
            <el-radio :value="0">No</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          class="custom-form-item width-100"
          label="3. Please indicate the category of the course/examination by ticking the box below. (You can choose more than one option.)"
          prop="q3Ans"
        >
          <el-select v-model="form.q3Ans" multiple @change="q3AnsChange">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="custom-form-item width-100"
          label="Others (Please specify)"
          prop="q3Other"
        >
          <el-input v-model="form.q3Other" type="textarea" />
        </el-form-item>
      </section>
      <div class="custom-form-title">
        Part II: Questions on the course taken
      </div>
      <section style="display: contents">
        <div style="color: #757d8a">
          <img src="@/assets/images/evaluationRange.png" style="width: 100%" />
        </div>
        <el-form-item
          v-for="(item, index) in formItemList1"
          :key="index"
          class="custom-form-item width-100"
          :label="item.label"
          :prop="item.prop"
        >
          <el-radio-group
            v-model="form[item.prop]"
            v-if="item.type === 'multiCheck'"
          >
            <el-radio
              v-for="(item, index) in rangeOption"
              :key="index"
              :value="item"
            />
          </el-radio-group>
          <el-radio-group
            v-model="form[item.prop]"
            v-else-if="item.type === 'twoCheck'"
          >
            <el-radio :value="1">{{
              item.prop === "q12Specify" ? "too light" : "Yes"
            }}</el-radio>
            <el-radio :value="0">{{
              item.prop === "q12Specify" ? "too heavy" : "No"
            }}</el-radio>
          </el-radio-group>
          <el-input
            v-else-if="item.type === 'input'"
            v-model="form[item.prop]"
            type="textarea"
          />
        </el-form-item>
      </section>
      <div class="custom-form-title">
        Part III: Questions on the examination taken
      </div>
      <section style="display: contents">
        <!-- <div style="color: #757d8a">
          <img src="@/assets/images/evaluationRange.png" style="width: 100%" />
        </div> -->
        <el-form-item
          v-for="(item, index) in formItemList2"
          :key="index"
          class="custom-form-item width-100"
          :label="item.label"
          :prop="item.prop"
        >
          <el-radio-group
            v-model="form[item.prop]"
            v-if="item.type === 'twoCheck'"
          >
            <el-radio :value="1">{{ "Yes" }}</el-radio>
            <el-radio :value="0">{{ "No" }}</el-radio>
          </el-radio-group>
          <el-input
            v-else-if="item.type === 'input'"
            v-model="form[item.prop]"
            type="textarea"
          />
          <el-radio-group v-model="form[item.prop]" v-else>
            <el-radio
              v-for="(item, index) in rangeOption"
              :key="index"
              :value="item"
            />
          </el-radio-group>
        </el-form-item>
      </section>
      <div class="custom-form-button">
        <el-button
          type="primary"
          @click="clickButton('save')"
          class="default-button"
          >Save</el-button
        >
        <el-button
          type="primary"
          @click="clickButton('submit')"
          class="default-button"
          >Submit</el-button
        >
        <el-button class="default-button cancel">Cancel</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { saveEvaluation, getEvaluation } from "@/api/index";
import { ElMessage } from "element-plus";

const props = defineProps({
  courseApplicationId: String,
  isPeriod: Boolean,
  isExamDate: Boolean,
});
const { courseApplicationId, isPeriod, isExamDate } = toRefs(props);
console.log(courseApplicationId, "courseApplicationId");
const rangeOption = ref([1, 2, 3, 4, 5, 6]);

const categoryOptions = ref([
  {
    label: "Air Traffic Management",
    value: "Air Traffic Management",
  },
  {
    label: "Aircraft Engineering",
    value: "Aircraft Engineering",
  },
  {
    label: "Airline Operations",
    value: "Airline Operations",
  },
  {
    label: "Airport Operations",
    value: "Airport Operations",
  },
  {
    label: "Aviation Security",
    value: "Aviation Security",
  },
  { label: "Legal", value: "Legal" },
  { label: "Air Cargo", value: "Air Cargo" },
  { label: "Language", value: "Language" },
  {
    label: "Airworthiness and Aircraft Safety",
    value: "Airworthiness and Aircraft Safety",
  },
  {
    label: "Others (Please specify)",
    value: "Others",
  },
]);

const formItemList1 = ref([
  {
    label:
      "4. The course developed my ability to apply theory to practice in the aviation industry?",
    prop: "q4Ans",
    type: "multiCheck",
  },
  {
    label:
      "5. The course met my need in terms of self enhancement and/or  professional development in the aviation industry.",
    prop: "q5Ans",
    type: "multiCheck",
  },
  {
    label: "6. The instructor displayed mastery of the subject matter.",
    prop: "q6Ans",
    type: "multiCheck",
  },
  {
    label: "7. The course was well organised and clear.",
    prop: "q7Ans",
    type: "multiCheck",
  },
  {
    label:
      "8. The course materials were useful and well-integrated into  lectures/ discussions.",
    prop: "q8Ans",
    type: "multiCheck",
  },
  {
    label: "9. Overall, the instructor taught this course effectively.",
    prop: "q9Ans",
    type: "multiCheck",
  },
  {
    label: "10. Overall, I am satisfied with the course.",
    prop: "q10Ans",
    type: "multiCheck",
  },
  {
    label:
      "11. Upon completion of the course, I am more determined to stay  in and contribute to the aviation industry.",
    prop: "q11Ans",
    type: "multiCheck",
  },
  {
    label: "12. The workload of the course was appropriate.",
    prop: "q12Ans",
    type: "multiCheck",
  },
  {
    label: "If you choose 4 or below in question 12, you consider the workload",
    prop: "q12Specify",
    type: "twoCheck",
  },
  {
    label:
      "13. Would you recommend this course to those interested to join or already working in the aviation sector?",
    prop: "q13Ans",
    type: "twoCheck",
  },
  {
    label: "14. Which part(s) of the course did you like most in the course?",
    prop: "q14Ans",
    type: "input",
  },
  {
    label: "15. Which part(s) of the course need to be improved?",
    prop: "q15Ans",
    type: "input",
  },
  {
    label:
      "16. If there were no subsidy from the Maritime and Aviation Training Fund, would you have taken this course?",
    prop: "q16Ans",
    type: "twoCheck",
  },
  {
    label: "17. Other suggestion(s).",
    prop: "q17Ans",
    type: "input",
  },
]);
const formItemList2 = ref([
  {
    label:
      "18. The examination developed my ability to apply  theory to practice in the aviation industry.",
    prop: "q18Ans",
  },
  {
    label:
      "19. The examination met my need in terms of self enhancement  in the aviation industry.",
    prop: "q19Ans",
  },
  {
    label:
      "20. Upon passing the examination, I can further my professional  development in the aviation industry.",
    prop: "q20Ans",
  },
  {
    label:
      "21. Upon passing the examination, I am more determined to  stay in and contribute to the aviation industry.",
    prop: "q21Ans",
  },
  {
    label:
      "22. Would you recommend this examination to those interested to join or already working in the aviation sector?",
    prop: "q22Ans",
    type: "twoCheck",
  },
  {
    label:
      "23. If there were no subsidy from the Maritime and Aviation Training Fund, would you have taken this examination?",
    prop: "q23Ans",
    type: "twoCheck",
  },
  {
    label: "24. Other suggestion(s).",
    prop: "q24Ans",
    type: "input",
  },
]);

const formRef = ref();

const form = ref({
  q1Ans: null,
  q1Specify: "",
  q2Ans: null,
  q3Ans: [],
  q3Other: "",
  q4Ans: null,
  q5Ans: null,
  q6Ans: null,
  q7Ans: null,
  q8Ans: null,
  q9Ans: null,
  q10Ans: null,
  q11Ans: null,
  q12Ans: null,
  q12Specify: null,
  q13Ans: null,
  q14Ans: "",
  q15Ans: "",
  q16Ans: null,
  q17Ans: "",
  q18Ans: null,
  q19Ans: null,
  q20Ans: null,
  q21Ans: null,
  q22Ans: null,
  q23Ans: null,
  q24Ans: "",
});

const rules = ref({
  // part1
  q1Ans: { required: true, trigger: "change" },
  q1Specify: [],
  q2Ans: { required: true, trigger: "change" },
  q3Ans: [
    {
      required: true,
      Atrigger: "change",
      type: "array",
    },
  ],
});

onMounted(async () => {
  if (courseApplicationId.value !== "") {
    getDetail(courseApplicationId.value);
  }
  if (isPeriod.value) {
    /** 填写period，则part2 必填 */
    formItemList1.value.forEach((item) => {
      const { prop } = item;
      rules.value[prop] = {
        required: true,
        trigger: "change",
      };
    });
  } else if (isExamDate.value) {
    /** 填写examDate，则part3 必填 */
    formItemList2.value.forEach((item) => {
      const { prop } = item;
      rules.value[prop] = {
        required: true,
        trigger: "change",
      };
    });
  }
});

async function getDetail(id) {
  try {
    let { code, data, message } = await getEvaluation(id);
    if (code === 200) {
      let tempData = {};
      Object.entries(data).forEach(([key, value]) => {
        if (key === "q3Ans") {
          value = value.split(",");
        }
        tempData[key] = value;
      });
      Object.assign(form.value, tempData);
    } else ElMessage.error(message);
  } catch (err) {
    Object.assign(detailsForm, detailInitialValObj);
    console.log(err);
  }
}
const clickButton = () => {
  formRef.value
    .validate()
    .then(async () => {
      handleSaveNew();
    })
    .catch((err) => {
      ElMessage.warning("required");
    });
};

const handleSaveNew = async () => {
  try {
    const params = {};
    for (const item in form.value) {
      if (
        Array.isArray(form.value[item]) &&
        typeof form.value[item][0] !== "string"
      ) {
        params[item] = form.value[item][0];
      } else {
        params[item] = form.value[item];
      }
    }
    params.courseApplicationId = courseApplicationId.value;
    if (!params.q3Ans) {
      params.q3Ans = "";
    } else {
      params.q3Ans = form.value.q3Ans.toString();
    }
    console.log(params, "params");
    let { code, message } = await saveEvaluation(params);
    if (code === 200) {
      ElMessage.success(message);
    } else {
      ElMessage.error(message);
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * 根据 Q1  选项变更后续校验规则
 * @param val
 */
function q1AnsChange(val) {
  if (val === 1) {
    rules.value.q1Specify = [
      {
        required: true,
        /* validator: numberValidateRequired, */ trigger: "change",
      },
    ];
  } else {
    form.q1Specify = "";
    rules.value.q1Specify = [];
  }
  formRef.value.clearValidate();
}

/**
 * 根据 Q3  选项变更后续校验规则
 * @param val
 */
function q3AnsChange(val) {
  const index = val.findIndex((element) => element === othersVal);
  if (index !== -1) {
    rules.value.q3Other = [{ required: true, trigger: "change" }];
  } else {
    rules.value.q3Other = [];
    form.value.q3Other = "";
  }
  formRef.value.clearValidate();
}
</script>

<style lang="scss" scoped></style>
