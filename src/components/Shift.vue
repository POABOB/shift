<template>
<div>
    <div id="results"></div>
    <div id="app">
        <div class="container-fluid ">
            <div class="row">
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 sidebar">
                    <span class="version" v-text="version"></span>
                    <div class="time" id="datetime"></div>
                    <div class="title">
                        <h4 v-text="clinicName"></h4>
                    </div>
                    <img src="@/assets/images/01.png" alt="">
                </div>
                <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 main">
                    <input type="hidden" id="img" />
                    <!-- 先出現已排班員工，再出現位排班員工  -->
                    <button v-for="(d) in employee_in_shift" :key="d.employee_id" class="name" @click="Cam(d.employee_id)">
                        {{ d.name }}
                    </button>
                    <br />
                    <hr v-show="hrShow" />
                    <button v-for="(d) in employee_not_in_shift" :key="d.employee_id" class="name" @click="Cam(d.employee_id)">
                        {{ d.name }}
                    </button>
                </div>
            </div>
        </div>
        <div class="mask" id="mask" @click="modalToggle()"></div>
        <!-- modal start -->
        <div class="windows" :class="{ none: isNone }" id="windows">
            <div class="windows-title">
                <div class="title">員工打卡資料</div>
                <div class="tltle-time"><span v-text="date"></span></div>
            </div>
            <div class="time" id="datetime2"></div>
            <div class="personal">
                <div class="personal-left">
                    <div id="my_camera"></div>
                </div>
                <div class="personal-right">
                    <h5>員工姓名</h5>
                    <div class="input"><span v-text="employeeData.name"></span></div>
                    <h5>班別</h5>
                    <div class="input"><span v-text="employeeData.shift_name"></span></div>
                </div>
            </div>
            <div class="work">
                <div class="work-1">
                    <div class="work-1-title">第一班</div>
                    <div class="start" :class="{ disabled: btnDisabled('on_1st') }" @click="takeSnapshot(employeeData.employee_id, 'on_1st')">
                        <img src="@/assets/images/start.png" class="icon">
                        <h5 v-text="onBtns('on_1st')"></h5>
                    </div>
                    <div class="off" :class="{ disabled: btnDisabled('off_1st') }" @click="takeSnapshot(employeeData.employee_id, 'off_1st')">
                        <img src="@/assets/images/off.png" class="icon">
                        <h5 v-text="offBtns('off_1st')"></h5>
                    </div>
                </div>
                <div class="work-2">
                    <div class="work-2-title">第二班</div>
                    <div class="start" :class="{ disabled: btnDisabled('on_2nd') }" @click="takeSnapshot(employeeData.employee_id, 'on_2nd')">
                        <img src="@/assets/images/start.png" class="icon">
                        <h5 v-text="onBtns('on_2nd')"></h5>
                    </div>
                    <div class="off" :class="{ disabled: btnDisabled('off_2nd') }" @click="takeSnapshot(employeeData.employee_id, 'off_2nd')">
                        <img src="@/assets/images/off.png" class="icon">
                        <h5 v-text="offBtns('off_2nd')"></h5>
                    </div>
                </div>
                <div class="work-3">
                    <div class="work-3-title">第三班</div>
                    <div class="start" :class="{ disabled: btnDisabled('on_3rd') }" @click="takeSnapshot(employeeData.employee_id, 'on_3rd')">
                        <img src="@/assets/images/start.png" class="icon">
                        <h5 v-text="onBtns('on_3rd')"></h5>
                    </div>
                    <div class="off" :class="{ disabled: btnDisabled('off_3rd') }" @click="takeSnapshot(employeeData.employee_id, 'off_3rd')">
                        <img src="@/assets/images/off.png" class="icon">
                        <h5 v-text="offBtns('off_3rd')"></h5>
                    </div>
                </div>
            </div>
            <button class="red button" :class="{ none: isNone }" @click="takeSnapshot(employeeData.employee_id)">
                加班下班
            </button>
            <input type="button" value="✕  關閉" class="button" @click="modalToggle()" />
        </div>
        <!-- modal end -->
    </div>
</div>
</template>

<script>
import axios from "axios";
import ImageHelper from "../utils/imghelper";
import Webcam from "webcamjs";
require('date-time-format-timezone'); 

export default {
    title: "打卡排班系統",
    name: "Shift",
    data() {
        return {
            clinicId: 33,
            clinicName: "",
            version: "v1.4",
            date: "0000-00-00",
            mode: {
                prd: "34.80.179.232",
                dev: "localhost",
            },
            showModal: false,
            //員工列
            employee: [],
            employee_in_shift: [],
            employee_not_in_shift: [],
            //當日排班
            shift: [],
            //考勤設定
            attendance: [],
            //當日紀錄
            record: [],
            //選取時員工資料
            employeeData: {
                employee_id: 0,
                name: "",
                shift_name: "",
                shift: [],
            },
            //員工打卡紀錄
            employeeRecord: {
                on_1st: "",
                off_1st: "",
                off_1st_o: "",
                off_1st_o2: "",
                on_2nd: "",
                off_2nd: "",
                off_2nd_o: "",
                off_2nd_o2: "",
                on_3rd: "",
                off_3rd: "",
                off_3rd_o: "",
                off_3rd_o2: "",
            },
            isNone: true,
            //欲提交資料的格式
            postData: {
                employee_id: null,
                datetime: null,
                clinic_id: 0,
                type: null,
                over_time: 0,
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
        if(!navigator.userAgent.match('Chrome')) {
            alert('不支援該瀏覽器！');
        }
        //時區校正
       const d = this.changeTimezone(new Date(), 'Asia/Taipei');
        this.date = d.Format("yyyy-MM-dd");
       //一次性資料
        this.getClinicData();

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
            this.getEmployeeData(id);
            this.getEmployeeRecord(id);
            this.checkOverTimeBtn(id);
            this.$nextTick();
            this.modalToggle()
        },
        changeTimezone(date, ianatz) {
            // suppose the date is 12:00 UTC
            var invdate = new Date(date.toLocaleString('en-US', {
                timeZone: ianatz
            }));

            // then invdate will be 07:00 in Toronto
            // and the diff is 5 hours
            var diff = date.getTime() - invdate.getTime();

            // so 12:00 in Toronto is 17:00 UTC
            return new Date(date.getTime() - diff); // needs to substract
        },
        timer() {
            //時間更新
            const update = function () {
                //時區校正START
                const date = new Date();
                var invdate = new Date(date.toLocaleString('en-US', {
                    timeZone: 'Asia/Taipei'
                }));
                var diff = date.getTime() - invdate.getTime();
                const d = new Date(date.getTime() - diff);
                //時區校正END
                let time = d.Format("yyyy-MM-dd hh:mm:ss");
                document.getElementById("datetime").innerHTML = time;
                document.getElementById("datetime2").innerHTML = time.substr(-8);
                if(time.substr(11, 18) == "00:00:01") {
                    location.reload();
                }
            };
            setInterval(update, 1000);
        },
        getClinicData() {
            axios
                .get(
                    `http://${this.mode.prd}/api_v1.1/shift/clinic?id=${btoa(
            this.clinicId + "." + this.date
          )}`
                )
                .then((res) => {
                    let data = res.data.data;
                    //診所名稱
                    this.clinicName = data[0].name;

                    //考勤設定
                    this.attendance = data[1];
                    //排班表
                    if (data[2] !== null) {
                        data[2].forEach((item) => {
                            // 刪除多餘的排班，只求當天
                            let index = item.data.length - 1;
                            while (index >= 0) {
                                if (item.data[index].date !== this.date) {
                                    item.data.splice(index, 1);
                                }
                                index -= 1;
                            }
                        });
                        this.shift = data[2];
                    } else {
                        this.shift = [];
                    }

                    //員工列表
                    if (data[3] !== null) {
                        let _in = [];
                        let _not_in = [];
                        if (this.shift !== null) {
                            data[3].forEach((item) => {
                                const d = this.shift.find(
                                    (d) => d.employee_id == item.employee_id
                                );
                                // 休假也算無排班
                                if (d !== undefined && d.data[0].shift.shift_id !== 0) {
                                    _in.push({
                                        employee_id: item.employee_id,
                                        name: item.name,
                                    });
                                } else {
                                    _not_in.push({
                                        employee_id: item.employee_id,
                                        name: item.name,
                                    });
                                }
                            });
                        } else {
                            _not_in = JSON.parse(JSON.stringify(this.employee));
                        }
                        this.employee = data[3];
                        this.employee_in_shift = _in;
                        this.employee_not_in_shift = _not_in;
                    } else {
                        this.employee = [];
                        alert("尚未新增員工!");
                    }
                })
                .catch((error) => {
                    alert(error);
                });
        },
        getShiftRecord() {
            //獲取該診所所有員工當日打卡紀錄
            axios
                .get(
                    `http://${this.mode.prd}/api_v1.1/shift/record?id=${btoa(
            this.clinicId + "." + this.date
          )}`
                )
                .then((res) => {
                    const data = res.data.data;
                    this.record = data ?? [];
                })
                .catch((error) => {
                    alert(error);
                });
        },
        getEmployeeData(id) {
            //員工資料
            this.employeeData = this.employee.find((data) => data.employee_id == id);
            //員工排班
            const _shift = this.shift.find((data) => data.employee_id == id);
            this.employeeData.shift = [];
            //休假歸類為無排班
            if (_shift !== undefined && _shift.data[0].shift.shift_id !== 0) {
                this.employeeData.shift_name = _shift.data[0].shift.shift_name;
                for (let prop in _shift.data[0].shift) {
                    if (prop.slice(0, 3) === "off") {
                        this.employeeData.shift.push(prop);
                    } else if (prop.slice(0, 2) === "on") {
                        this.employeeData.shift.push(prop);
                    }
                }
            } else {
                this.employeeData.shift_name = "無排班";
            }
        },
        getEmployeeRecord(id) {
            //獲取紀錄
            const data = this.record.filter((data) => data.employee_id == id);
            for (let prop in this.employeeRecord) {
                let _d = data.find((d) => d.type == prop);
                // this.employeeRecord[prop] = _d ? Object.assign({}, this.employeeRecord[prop], _d) : "";
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
                splitDataURI[0].indexOf("base64") >= 0 ?
                atob(splitDataURI[1]) :
                decodeURI(splitDataURI[1]);
            const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

            const ia = new Uint8Array(byteString.length);
            for (let i = 0; i < byteString.length; i++)
                ia[i] = byteString.charCodeAt(i);

            return new Blob([ia], {
                type: mimeString,
            });
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
                header: {
                    "Content-Type": "multipart/form-data",
                },
            };
            //插入遠端server
            axios
                .post(
                    `http://${this.mode.prd}/api_v1.1/shift/record/add?id=${btoa(
            this.clinicId + "." + this.date
          )}`,
                    form,
                    config
                )
                .then((res) => {
                    if (res.data.code === 200) {
                        this.$toastr.s(
                            `${this.employeeData.name} 於 ${this.postData.datetime.slice(
                -8
              )} 打卡完成`
                        );
                        this.getShiftRecord();
                        this.modalToggle();
                        this.$nextTick();
                    } else {
                        alert("打卡失敗!");
                    }
                })
                .catch((error) => {
                    alert(error);
                });
        },
        takeSnapshot(employee_id, type = "") {
            //判斷date是否有落差
            const d = this.changeTimezone(new Date(), 'Asia/Taipei');
            if(this.date !== d.Format("yyyy-MM-dd")) {
                alert("資料重整中，請重新打卡...")
                location.reload();
            } else {
                //加班詢問
                if (type === "") {
                    //詢問是否打卡
                    if (confirm("是否打卡加班?")) {
                        //拍照並且詢問是否要打卡，若無則不執行saveRemote
                        const time = d.Format("yyyy-MM-dd hh:mm:ss");
                        Webcam.snap(function (dataUri) {
                            document.getElementById("img").value = dataUri;
                        });

                        //判斷加班時數
                        //獲取該員工排班
                        const shift = this.shift.find((d) => d.employee_id == employee_id);
                        //獲取可下班的shift
                        let offShift = this.employeeData.shift.filter(
                            (d) => d.slice(0, 3) === "off"
                        );
                        //獲取未打卡，且可打卡的班別
                        let shift_data = [];
                        offShift.forEach((item) => {
                            if (
                                this.employeeRecord[item] == "" ||
                                this.employeeRecord[item + "_o"] == "" ||
                                this.employeeRecord[item + "_o2"] == ""
                            ) {
                                //現在時間減去下班時間
                                let overTime = Math.floor(
                                    new Date(
                                        new Date() -
                                        new Date(
                                            this.date + " " +
                                            shift.data[0].shift[item]
                                        )
                                    ).getTime() / 60000
                                );
                                if (overTime > parseInt(this.attendance.is_overtime.param1)) {
                                    this.attendance.is_overtime.param2;
                                    shift_data.push({
                                        type: item,
                                        time: shift.data[0].shift[item],
                                        over: (overTime - (parseInt(this.attendance.is_overtime.param1) - parseInt(this.attendance.is_overtime.param2))),
                                    });
                                }
                            }
                        });

                        let over_time = 0;
                        shift_data.forEach((item) => {
                            if (over_time === 0) {
                                type = item.type + "_o";
                                over_time = item.over;
                            } else if (over_time > item.over) {
                                type = item.type + "_o";
                                over_time = item.over;
                            }
                        });

                        this.postData.employee_id = employee_id;
                        this.postData.datetime = time;
                        this.postData.type = type;
                        this.postData.over_time = over_time;
                        this.postData.clinic_id = this.clinicId;
                        this.saveRemote();
                    }
                } else {
                    //拍照並且詢問是否要打卡，若無則不執行saveRemote
                    const time = d.Format("yyyy-MM-dd hh:mm:ss");
                    Webcam.snap(function (dataUri) {
                        document.getElementById("img").value = dataUri;
                    });
                    // if (confirm("是否打卡?")) {
                    //上傳至local server
                    this.postData.employee_id = employee_id;
                    this.postData.datetime = time;
                    this.postData.type = type;
                    this.postData.over_time = 0;
                    this.postData.clinic_id = this.clinicId;
                    this.saveRemote();
                    // }
                }
            }
        },
        btnDisabled(type = "") {
            // 先判斷是否有排班
            if (this.employeeData.shift.length === 0) {
                if (this.employeeRecord[type] !== "") {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (this.employeeData.shift.includes(type)) {
                    if (type.slice(0, 3) === "off") {
                        //判斷type是否有值 off，其中一個有值就disable
                        if (
                            this.employeeRecord[type] !== "" ||
                            this.employeeRecord[type + "_o"] !== "" ||
                            this.employeeRecord[type + "_o2"] !== ""
                        ) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        //判斷type是否有值 on
                        if (this.employeeRecord[type] !== "") {
                            return true;
                        } else {
                            return false;
                        }
                    }
                } else {
                    return true;
                }
            }
        },
        //加班按鈕
        checkOverTimeBtn(employee_id) {
            //確認考勤是有開啟，且有排班
            if (
                this.attendance.is_overtime.onORoff == 1 &&
                this.employeeData.shift.length !== 0
            ) {
                //獲取排班
                const shift = this.shift.find((d) => d.employee_id == employee_id);

                //獲取可下班的shift
                let offShift = this.employeeData.shift.filter(
                    (d) => d.slice(0, 3) === "off"
                );
                //獲取未打卡，且可打卡的班別
                for (let item of offShift) {
                    if (
                        this.employeeRecord[item] == "" &&
                        this.employeeRecord[item + "_o"] == "" &&
                        this.employeeRecord[item + "_o2"] == ""
                    ) {
                        //現在時間減去下班時間
                        let overTime = Math.floor(
                            new Date(
                                new Date() -
                                new Date(
                                    this.date + " " + shift.data[0].shift[item]
                                )
                            ).getTime() / 60000
                        );
                        if (overTime > parseInt(this.attendance.is_overtime.param1)) {
                            // console.log(overTime);
                            this.isNone = false;
                            break;
                        } else {
                            this.isNone = true;
                        }
                    } else {
                        this.isNone = true;
                    }
                }
            } else {
                this.isNone = true;
            }
        },
        offBtns(type) {
            if (this.employeeRecord.employee_id !== 0) {
                if (this.employeeRecord[type] !== "") {
                    return this.employeeRecord[type].datetime.substr(0, 5);
                } else if (this.employeeRecord[type + "_o"] !== "") {
                    return this.employeeRecord[type + "_o"].datetime.substr(0, 5) + "(加)";
                } else if (this.employeeRecord[type + "_o2"] !== "") {
                    return this.employeeRecord[type + "_o2"].datetime.substr(0, 5) + "(加)";
                } else {
                    return "下班";
                }
            }
        },
        onBtns(type) {
            if (this.employeeRecord.employee_id !== 0) {
                if (this.employeeRecord[type] !== "") {
                    return this.employeeRecord[type].datetime.substr(0, 5);
                } else {
                    return "上班";
                }
            }
        },
        modalToggle() {
            if(this.showModal === false) {
                document.all.mask.style.display = 'block';
                document.all.windows.style.display = 'block';
                this.showModal = true;
            } else{
                document.getElementById('mask').style.display = 'none';
                document.getElementById('windows').style.display = 'none';
                this.showModal = false;
            }
        }
    },
    computed: {
        hrShow() {
            if (
                this.employee_in_shift.length == 0 ||
                this.employee_not_in_shift.length == 0
            ) {
                return false;
            } else {
                return true;
            }
        }
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
html {
  font-family: Microsoft JhengHei;
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
}
body {
  margin: 0px;
  padding: 0px;
}
.container-fluid{
  height: 100vh;
  width: 100vw;
}
.sidebar{
  height: 100vh;
  background:linear-gradient(315deg, #787FB9 , #A8ACD2 );
  text-align: center;
}
.sidebar img{
  width: 95%;
}
.sidebar .time{
  margin-top: 20%;
  color: #fff;
}
.sidebar .title{
  background-color:#CED2F8;
  border-radius: 45px;
  margin-left: 20%;
  margin-right: 20%;
  margin-top: 1%;
  margin-bottom: 20%;
}
.sidebar .title h4{
  color:#3F489C;
  font-weight: bold;
  line-height: 200%;
}
.main{
  height: 100vh;
  background:linear-gradient(315deg, #646DC1 , #BCC1EF );
}
.main .name{
  display: inline-block;
  border-radius: 45px;
  border: 0px;
  width: 140px;
  background: #fff;
  margin:20px 10px;
  box-shadow: 0 1px 20px  #9DA2CF;  
  color: #515151;
  text-align: center;
  line-height: 45px;
  font-size: 18px;
  font-weight: 600;
}
.mask {
  background-color: #000000;
  opacity: 0.5;
  display: none;
  z-index: 2;
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;  
}
.windows {
  width: 600px;
  height: 680px;
  background-color: #ffffff;
  opacity: 1;
  margin: 0px auto;
  display: none;
  z-index: 3;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -315px;
  margin-top: -350px;
}
.windows-title{
  background-color: #646DC1;
  width: 600px;
  height: 40px;
  padding-left: 20px;
  padding-right: 20px;
}
.windows-title .title{
  color: #fff;
  display: inline-block;
  line-height: 40px;
}
.windows-title .tltle-time{
  color: #fff;
  display: inline-block;
  line-height: 200%;
  width: 450px;
  text-align: right;
  line-height: 40px;

}
.windows .time{
  background-color: #F0F0F0;
  margin: 20px auto;
  width: 200px;
  color: #4D57B7;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  border:1px #E2E2E2 solid;
  border-radius: 10px;
}
.windows .personal{
  display: flex;
}
.windows .personal-left{
  flex: 1;
  padding-left: 10px;
  padding-right: 10px;
}
.windows .personal-left img{
  width: 100%;
}
.windows .personal-right{
  flex: 1;
}
.windows .personal-right h5{
  color: #8B8B8B;
}
.windows .personal-right .input{
  padding: 5px 10px;
  margin-bottom: 20px;
  width: 260px;
  border-radius: 5px;
  background-color: #EAEAEA;
  color: #777CAE;
  font-weight: bold;
  font-size: 20px;
}
.windows .work{
  display: flex;
  height: 220px;
  padding: 40px 20px 0px;
}
.windows .work .work-1{
  flex:1;
  background-color: #79C9B9;
  border-radius: 5px;
  width: 20%;
  margin-right: 10px;
}
.windows .work .work-1 .work-1-title{
  background-color: #8CD1C3;
  height: 30px;
  color: #fff;
  font-weight: bold;
  text-align: center;
  line-height: 30px;
  border-radius: 5px 5px 0% 0%;
}
.windows .work .work-2{
  flex:1;
  background-color: #E3BA59;
  margin-right: 10px;
  margin-left: 10px;
  border-radius: 5px;
  width: 20%;
}
.windows .work .work-2 .work-2-title{
  background-color: #E7C470;
  height: 30px;
  color: #fff;
  font-weight: bold;
  text-align: center;
  line-height: 30px;
  border-radius: 5px 5px 0% 0%;
}
.windows .work .work-3{
  flex:1;
  background-color: #6491AC;
  margin-left: 10px;
  border-radius: 5px;
  width: 20%;
}
.windows .work .work-3 .work-3-title{
  background-color: #7AA1B8;
  height: 30px;
  color: #fff;
  font-weight: bold;
  text-align: center;
  line-height: 30px;
  border-radius: 5px 5px 0% 0%;
}
.icon{
  display: inline-block;
  width: 25px;
  height: auto;
  border-radius: 50%;
  position: relative;
  top:-3px;
  left: -5px;
}
.start{
  background-color: #ffffff;
  border-radius: 45px;
  width: 140px;
  height: 50px;
  margin: 15px auto;
  box-shadow: 0px 0px  #000;  
  padding-left: 20px;
  font-size: 18px;
  font-weight: 600;
  cursor:pointer;
}
.start h5{
  line-height: 50px;
  display: inline-block;
  color: #2A8998;
  font-weight: bold;
}
.off{
  background-color: #ffffff;
  border-radius: 45px;
  width: 140px;
  height: 50px;
  margin: 15px auto;
  box-shadow: 0px 0px  #000;  
  padding-left: 20px;
  font-size: 18px;
  font-weight: 600;
  cursor:pointer;
}
.off h5{
  line-height: 50px;
  display: inline-block;
  color: #BB7B99;
  font-weight: bold;
}
.button{
  background-color: #BFBFBF;
  border: 0px;
  border-radius: 45px;
  width: 560px;
  height: 50px;
  margin: 10px 20px 0px;
  padding-left: 20px;
  font-size: 18px;
  color: #fff;
  text-align: center;
}


/* 深色主題 */


.dark .sidebar{
  background:none;
  background-color: #1C354C;
  text-align: center;
}
.dark .sidebar img{
  width: 90%;
}
.dark .sidebar .title{
  background-color:#435B72;
  margin-bottom: 10%;
}
.dark .sidebar .title h4{
  color:#fff;
}
.dark .main{
  background:linear-gradient(315deg, #295994 , #425B73 );
}
.dark .main .name{
  background: #65819D;
  box-shadow: 0px 0px #000;  
  color: #fff;
}
.dark .windows {
  background-color: #203648;
}
.dark .windows-title{
  background-color: #6E7C88;
}
.dark .windows .time{
  background-color: #465C6E;
  color: #fff;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  border:0px ;
}
.dark .windows .personal-right h5{
  color: #BCBCBD;
}
.dark .windows .personal-right .input{
  background-color: #465C6E;
  color: #52DAFC;
}
.dark .windows .work .work-box{
  flex:1;
  background-color: #465C6E;
  border-radius: 5px;
  width: 20%;
  margin-right: 10px;
}
.dark .windows .work .work-title{
  background-color: #607383;
  height: 30px;
  color: #fff;
  font-weight: bold;
  text-align: center;
  line-height: 30px;
  border-radius: 5px 5px 0% 0%;
}
.dark .start{
  background-color: #364755;
}
.dark .start h5{
  color: #52BD96;
}
.dark .off{
  background-color: #364755;
}
.dark .off h5{
  color: #C582AC;
}
.dark .button{
  background-color: #192A38;
}
#my_camera {
    margin: -50px 0 -50px 0;
}

.red.button{
  background-color: #C582AC;
}
/* div disabled */
.start.disabled, .off.disabled {
    background-color: #eee;
    pointer-events: none;
    opacity: 0.5;
}
/* isNONE css change */
.button.none {
    display: none;
}
.windows.none {
    height: 630px;
}
.version {
    position: absolute;
    top: 10px;
    left: 10px;
    color: #eee;
    opacity: 0.5;
}
</style>
