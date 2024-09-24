import request from "@/utils/request";
const HOME_BASE_URL = "/home";

// List数据查询
export function getsummaryList() {
  return request({
    url: `${HOME_BASE_URL}/summary`,
    method: "get"
  });

  // return {
  //   "code": 200,
  //   "data": {
  //     "oneToSixMonth": {
  //       "vetting": 2,
  //       "submitted": 16,
  //       "pendingRejection": 0,
  //       "pendingPayment": 1,
  //       "preVetting": 2,
  //       "querying": 1,
  //       "pendingApproval": 0
  //     },
  //     "overSixMonth": {
  //       "vetting": 0,
  //       "submitted": 0,
  //       "pendingRejection": 0,
  //       "pendingPayment": 0,
  //       "preVetting": 0,
  //       "querying": 0,
  //       "pendingApproval": 0
  //     },
  //     "belowOneMonth": {
  //       "vetting": 0,
  //       "submitted": 3,
  //       "pendingRejection": 0,
  //       "pendingPayment": 0,
  //       "preVetting": 0,
  //       "querying": 0,
  //       "pendingApproval": 0
  //     }
  //   },
  //   "message": "success"
  // }
}
