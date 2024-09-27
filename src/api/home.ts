import request from "@/utils/request";
import testData from "../assets/testData.json";
const HOME_BASE_URL = "/home";

// List数据查询
export function getsummaryList() {
  // return request({
  //   url: `${HOME_BASE_URL}/summary`,
  //   method: "get"
  // });

  return {
    "code": 200,
    "data": {
      "belowOneQuarter": {
        "submitted": testData.filter(el => el.internalStatus == 1).length,
        "processing": testData.filter(el => el.internalStatus > 1 && el.internalStatus < 6).length,
        "followUpAction": testData.filter(el => el.internalStatus == 6).length,
        "endorsed": testData.filter(el => el.internalStatus > 6 && el.internalStatus < 9).length,
        "rejected": testData.filter(el => el.internalStatus == 10).length,
        "usedQuota": testData.filter(el => el.internalStatus == 9).length,
      },
      "belowTwoQuarter": {
        "submitted": 2,
        "processing": 5,
        "followUpAction": 1,
        "endorsed": 2,
        "rejected": 50,
        "usedQuota": 150
      },
      
      "all": {
        "submitted": 0,
        "processing": 0,
        "followUpAction": 0,
        "endorsed": 0,
        "rejected": 50,
        "usedQuota": "150/12000",
        "total": 200
      },
    },
    "message": "success"
  }
}
