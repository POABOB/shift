<template>
  <div>
    <div id="results"></div>
    <div id="app">
      <div class="center">
        <h1>{{clinicName}}</h1>
        <input type="hidden" id="img" />
        <!-- 先出現已排班員工，再出現位排班員工  -->
        <div v-for="(d,index) in employee" :key="index">
          <button class="btn medium green" @click="Cam(d.employee_id)">{{ d.name }}</button>
          <br />
        </div>
      </div>

      <modal :show.sync="showModal" title="員工打卡資料">
        <div id="time">
          <h1 id="datetime"></h1>
        </div>

        <table>
          <tbody>
            <tr>
              <th>員工名稱</th>
              <td>{{employeeData.name}}</td>
            </tr>
            <tr>
              <th>班別</th>
              <td>{{employeeData.shift_name}}</td>
            </tr>
          </tbody>
        </table>
        <div class="flex">
          <div id="my_camera"></div>
          <!-- if else 判斷是已經打卡，避免重複打卡 -->
          <div id="buttons">
            <button
              :disabled="employeeRecord.on_1st !== ''"
              @click="takeSnapshot(employeeData.employee_id, 'on_1st')"
              class="btn red"
            >{{employeeRecord.on_1st ? employeeRecord.on_1st.datetime : '早上上班'}}</button>
            <button
              :disabled="employeeRecord.off_1st !== ''"
              @click="takeSnapshot(employeeData.employee_id, 'off_1st')"
              class="btn red"
            >{{employeeRecord.off_1st ? employeeRecord.off_1st.datetime : '早上下班'}}</button>
            <button
              :disabled="employeeRecord.on_2nd !== ''"
              @click="takeSnapshot(employeeData.employee_id, 'on_2nd')"
              class="btn green"
            >{{employeeRecord.on_2nd ? employeeRecord.on_2nd.datetime : '下午上班'}}</button>
            <button
              :disabled="employeeRecord.off_2nd !== ''"
              @click="takeSnapshot(employeeData.employee_id, 'off_2nd')"
              class="btn green"
            >{{employeeRecord.off_2nd ? employeeRecord.off_2nd.datetime : '下午下班'}}</button>
            <button
              :disabled="employeeRecord.on_3rd !== ''"
              @click="takeSnapshot(employeeData.employee_id, 'on_3rd')"
              class="btn purple"
            >{{employeeRecord.on_3rd ? employeeRecord.on_3rd.datetime : '晚上上班'}}</button>
            <button
              :disabled="employeeRecord.off_3rd !== ''"
              @click="takeSnapshot(employeeData.employee_id, 'off_3rd')"
              class="btn purple"
            >{{employeeRecord.off_3rd ? employeeRecord.off_3rd.datetime : '晚上下班'}}</button>
          </div>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
import modal from "./modal.vue";
import axios from "axios";
import ImageHelper from "../utils/imghelper";
import Webcam from "webcamjs";

export default {
  title: "打卡排班系統",
  name: "Shift",
  components: {
    modal,
  },
  data() {
    return {
      clinicId: 33,
      clinicName: "",
      date: new Date().Format("yyyy-MM-dd"),
      mode: {
        prd: "34.80.179.232",
        dev: "localhost",
      },
      showModal: false,
      //員工列
      employee: [],
      //當日排班
      shift: [],
      //當日紀錄
      record: [],
      //選取時員工資料
      employeeData: {
        employee_id: 0,
        name: "",
        shift_name: "",
      },
      //員工打卡紀錄
      employeeRecord: {
        on_1st: "",
        off_1st: "",
        on_2nd: "",
        off_2nd: "",
        on_3rd: "",
        off_3rd: "",
      },
      //欲提交資料的格式
      postData: {
        employee_id: null,
        datetime: null,
        clinic_id: 33,
        type: null,
      },
      //拍照參數設定
      webcam: {
        width: 300,
        height: 300,
        dest_width: 300,
        dest_height: 300,
        image_format: "jpeg",
        jpeg_quality: 90,
        flip_horiz: true,
        mandatory: {
          facingMode: {
            exact: "environment",
          },
        },
      },
    };
  },
  created() {
    //一次性資料
    this.getClinicName();
    this.getShiftTable();
    this.getEmployeeList();

    //利用token獲取診所人員紀錄
    this.getShiftRecord();
  },
  mounted() {
    //時間
    this.timer();
  },
  methods: {
    Cam(id) {
      //建立webcam配置
      Webcam.set(this.webcam);
      Webcam.attach("#my_camera");
      this.showModal = true;
      this.getEmployeeData(id);
      this.getEmployeeRecord(id);
    },
    timer() {
      //時間更新
      const update = function () {
        document.getElementById("datetime").innerHTML = new Date().Format(
          "yyyy-MM-dd hh:mm:ss"
        );
      };
      setInterval(update, 1000);
    },
    getShiftRecord() {
      //獲取該診所所有員工當日打卡紀錄
      axios
        .get(
          `http://${this.mode.dev}/api_v1.1/shift/record?id=${btoa(
            this.clinicId + "." + this.date
          )}`
        )
        .then((res) => {
          this.record = res.data.data ?? [];
        })
        .catch((error) => {
          alert(error);
        });
    },
    getClinicName() {
      //獲取該診所名稱
      axios
        .get(
          `http://${this.mode.dev}/api_v1.1/shift/clinic/name?id=${btoa(
            this.clinicId + "." + this.date
          )}`
        )
        .then((res) => {
          this.clinicName = res.data.data.name;
        })
        .catch((error) => {
          alert(error);
        });
    },
    getEmployeeList() {
      //獲取員工列表
      axios
        .get(
          `http://${this.mode.dev}/api_v1.1/shift/employee/list?id=${btoa(
            this.clinicId + "." + this.date
          )}`
        )
        .then((res) => {
          //排序
          const data = res.data.data;
          if (data.length !== 0) {
            const _shift = this.shift;
            const value = data.sort((data) =>
              _shift.find(
                (data2) =>
                  data2.employee_id == data.employee_id &&
                  data2.data[0].shift.shift_id == 0
              )
                ? 1
                : -1
            );
            this.employee = value;
          } else {
            this.employee = [];
          }
        })
        .catch((error) => {
          alert(error);
        });
    },
    async getShiftTable() {
      //獲取排班表
      const res = await axios.get(
        `http://${this.mode.dev}/api_v1.1/shift/table/list?id=${btoa(
          this.clinicId + "." + this.date
        )}`
      );
      if (res.data.data) {
        let data = res.data.data;
        data.forEach((item) => {
          // 刪除多餘的排班，只求當天
          let index = item.data.length - 1;
          while (index >= 0) {
            if (item.data[index].date !== this.date) {
              item.data.splice(index, 1);
            }
            index -= 1;
          }
        });
        this.shift = data;
      } else {
        this.shift = [];
      }
    },
    getEmployeeData(id) {
      //員工資料
      this.employeeData = this.employee.find((data) => data.employee_id == id);
      //員工排班
      const _shift = this.shift.find((data) => data.employee_id == id);
      console.log(_shift);
      this.employeeData.shift_name = _shift
        ? _shift.data[0].shift.shift_name
        : "無排班";
    },
    getEmployeeRecord(id) {
      //獲取紀錄
      const data = this.record.filter((data) => data.employee_id == id);
      for (let prop in this.employeeRecord) {
        let _d = data.find((d) => d.type == prop);
        this.employeeRecord[prop] = _d ?? "";
        //將 年月日 去除
        if (_d) {
          this.employeeRecord[prop].datetime = _d.datetime.slice(-8);
        }
      }
    },
    DataURIToBlob(dataURI) {
      //圖片轉換
      //base64轉Blob
      const splitDataURI = dataURI.split(",");
      const byteString =
        splitDataURI[0].indexOf("base64") >= 0
          ? atob(splitDataURI[1])
          : decodeURI(splitDataURI[1]);
      const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

      const ia = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i);

      return new Blob([ia], { type: mimeString });
    },
    saveRemote() {
      //提交資料
      let form = new FormData();
      ImageHelper.resizeAndRotateImage(
        this.DataURIToBlob(document.getElementById("img").value),
        300,
        function (resizeImageObj) {
          document.getElementById("img").value = resizeImageObj;
        }
      );
      form.append(
        "img",
        this.DataURIToBlob(document.getElementById("img").value)
      );
      form.append("data", JSON.stringify(this.postData));
      let config = {
        header: { "Content-Type": "multipart/form-data" },
      };
      //插入遠端server
      axios
        .post(
          `http://${this.mode.dev}/api_v1.1/shift/record/add?id=${btoa(
            this.clinicId + "." + this.date
          )}`,
          form,
          config
        )
        .then((res) => {
          if (res.data.code === 200) {
            alert("打卡成功!");
            this.getShiftRecord();
            this.showModal = false;
            this.$nextTick();
          } else {
            alert("打卡失敗!");
          }
        })
        .catch((error) => {
          alert(error);
        });
    },
    takeSnapshot(employee_id, type) {
      //拍照並且詢問是否要打卡，若無則不執行saveRemote
      const time = new Date().Format("yyyy-MM-dd hh:mm:ss");
      Webcam.snap(function (dataUri) {
        document.getElementById("img").value = dataUri;
      });
      if (confirm("是否打卡?")) {
        //上傳至local server
        this.postData.employee_id = employee_id;
        this.postData.datetime = time;
        this.postData.type = type;
        this.saveRemote();
      }
    },
  },
  watch: {
    showModal: {
      //控制modal
      handler: function () {
        if (this.showModal === false) {
          Webcam.reset();
        }
      },
    },
  },
};
</script>

<style lang="css">
* {
  padding: 0px;
  margin: 0px;
  box-sizing: border-box;
}

html {
  font-family: "Quicksand", sans-serif;
  line-height: 1.5;
}

h2,
h3 {
  margin-top: 0;
}
#results {
  border: 1px solid;
  background: #ccc;
  position: absolute;
  top: 10px;
  right: 10px;
}
img {
  width: 400px;
  height: 300px;
}
#my_camera,
#time {
  text-align: center;
  margin: 0 auto;
}
table,
td,
th {
  border: 1px solid #ddd;
  text-align: left;
}
table {
  border-collapse: collapse;
  width: 100%;
}
th,
td {
  padding: 15px;
}

.center {
  text-align: center;
}

.center button {
  margin: 5px 0;
}

.btn {
  color: #000;
}

.btn.green {
  background: #d5e7d4;
  border: 1px solid #a1c690;
}

.btn.green:hover {
  background: #a1c690;
}

.btn.red:hover {
  background: #cc8481;
}

.btn.red {
  background: #f6cfcc;
  border: 1px solid #cc8481;
}

.btn.purple {
  background: #e2d4e6;
  border: 1px solid #b39abf;
}

.btn.purple:hover {
  background: #b39abf;
}

.flex {
  display: flex;
}

#my_camera {
  width: 40%;
}
#buttons {
  width: 60%;
  padding: 35px 10px 25px 10px;
}
#buttons button {
  margin: 2px 0;
  width: 49%;
  height: 30%;
}
</style>
