<template>
<div>
    <div id="results"></div>
    <div id="app">
        <div class="container-fluid ">
            <div class="row">
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 sidebar">
                    <span class="version" v-text="version"></span>
                    <h3>公告欄</h3>
                    <div class="announce">
                        <div>
                            <h4 v-text="announce.title"></h4>
                            <div class="ck-content" v-html="announce.content"></div>
                        </div>
                    </div>
                    <!-- <div class="announce" @click="$refs.announce.openModal()" v-show="announce.valid">
                        <span>{{ (announce.start_at.substr(0,10)) }} {{ announce.title }}</span>
                    </div> -->
                </div>
                <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 main">
                    <input type="hidden" id="img" />
                    <div class="info">
                        <div class="title">
                            <h4 v-text="clinicName"></h4>
                        </div>
                        <div class="time" id="datetime"></div>
                    </div>
                    <div class="buttons">
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
        </div>
        <div class="mask" id="mask" @click="modalToggle()"></div>
        <!-- modal start -->
        <div class="windows" :class="{ none: windowsBtn }" id="windows">
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
            <ul class="nav nav-pills custom justify-content-center">
                <li class="nav-item">
                    <span class="nav-link" @click="tab(0)" :class="{ active: nav[0] }">打卡</span>
                </li>
                <li class="nav-item">
                    <span class="nav-link"  @click="tab(1)" :class="{ active: nav[1] }">簽到</span>
                </li>
            </ul>
            <div class="tab-content" id="pills-tabContent">
                <div class="tab-pane fade" :class="{ active: nav[0] , show: nav[0]}">
                    <div class="work">
                        <div class="work-1">
                            <div class="work-1-title">第一班</div>
                            <div class="start" :class="{ disabled: btnDisabled('on_1st') }" @click="takeSnapshot(employeeData.employee_id, 'on_1st')">
                                <img width="25" height="25" src="@/assets/images/start.png" class="icon">
                                <h5 v-text="onBtns('on_1st')"></h5>
                            </div>
                            <div class="off" :class="{ disabled: btnDisabled('off_1st') }" @click="takeSnapshot(employeeData.employee_id, 'off_1st')">
                                <img width="25" height="25" src="@/assets/images/off.png" class="icon">
                                <h5 v-text="offBtns('off_1st')"></h5>
                            </div>
                        </div>
                        <div class="work-2">
                            <div class="work-2-title">第二班</div>
                            <div class="start" :class="{ disabled: btnDisabled('on_2nd') }" @click="takeSnapshot(employeeData.employee_id, 'on_2nd')">
                                <img width="25" height="25" src="@/assets/images/start.png" class="icon">
                                <h5 v-text="onBtns('on_2nd')"></h5>
                            </div>
                            <div class="off" :class="{ disabled: btnDisabled('off_2nd') }" @click="takeSnapshot(employeeData.employee_id, 'off_2nd')">
                                <img width="25" height="25" src="@/assets/images/off.png" class="icon">
                                <h5 v-text="offBtns('off_2nd')"></h5>
                            </div>
                        </div>
                        <div class="work-3">
                            <div class="work-3-title">第三班</div>
                            <div class="start" :class="{ disabled: btnDisabled('on_3rd') }" @click="takeSnapshot(employeeData.employee_id, 'on_3rd')">
                                <img width="25" height="25" src="@/assets/images/start.png" class="icon">
                                <h5 v-text="onBtns('on_3rd')"></h5>
                            </div>
                            <div class="off" :class="{ disabled: btnDisabled('off_3rd') }" @click="takeSnapshot(employeeData.employee_id, 'off_3rd')">
                                <img width="25" height="25" src="@/assets/images/off.png" class="icon">
                                <h5 v-text="offBtns('off_3rd')"></h5>
                            </div>
                        </div>
                    </div>
                    <button class="red button" :class="{ none: isOnNone }" @click="takeSnapshot(employeeData.employee_id, 'on')">
                        早到上班
                    </button>
                    <button class="red button" :class="{ none: isOffNone }" @click="takeSnapshot(employeeData.employee_id, 'off')">
                        加班下班
                    </button>
                    <input type="button" value="✕  關閉" class="button" @click="modalToggle()" />
                </div>
                <div class="tab-pane fade" :class="{ active: nav[1] , show: nav[1]}">
                    <div class="work check">
                        <div class="work-1">
                            <div class="work-1-title">自由打卡</div>
                            <div class="start" :class="{ disabled: checkBtnDisabled('on_1st') }" @click="takeCheckSnapshot(employeeData.employee_id, 'on_1st')">
                                <img width="25" height="25" src="@/assets/images/start.png" class="icon">
                                <h5 v-text="checkBtns('on_1st')"></h5>
                            </div>
                            <div class="off" :class="{ disabled: checkBtnDisabled('off_1st') }" @click="takeCheckSnapshot(employeeData.employee_id, 'off_1st')">
                                <img width="25" height="25" src="@/assets/images/off.png" class="icon">
                                <h5 v-text="checkBtns('off_1st')"></h5>
                            </div>
                        </div>
                    </div>
                    <input type="button" value="✕  關閉" class="button" @click="modalToggle()" />
                </div>
            </div>
        </div>
        <!-- modal end -->
        <!-- component modal start -->
        <!-- <modal ref="announce">
            <template v-slot:header>
                <h2 v-text="announce.title"></h2>
            </template>

            <template v-slot:body>
                <div class="ck-content" v-html="announce.content"></div>
            </template>

            <template v-slot:footer>
                <div class="d-flex justify-content-center">
                    <button class="btn btn-secondary" @click="$refs.announce.closeModal()">關閉</button>
                </div>
            </template>
        </modal> -->
        <!-- component modal end -->
    </div>
</div>
</template>

<script>
import axios from "axios";
import ImageHelper from "../utils/imghelper";
import Webcam from "webcamjs";
// import Modal from "./Modal.vue";
// require('date-time-format-timezone'); 
// webrtc
import adapter from 'webrtc-adapter';
// 下拉式重整
import PullToRefresh from 'pulltorefreshjs';
export default {
    title: "打卡排班系統",
    name: "Shift",
    // components : {
    //     Modal
    // },
    data() {
        return {
            clinicId:33,
            clinicName: "",
            version: "v1.7",
            date: "0000-00-00",
            mode: {
                prd: "34.80.179.232",
                dev: "localhost",
            },
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
            //當日簽到紀錄
            checkRecord: [],
            //選取時員工資料
            employeeData: {
                employee_id: 0,
                name: "",
                shift_name: "",
                shift: [],
            },
            //員工打卡紀錄
            employeeRecord: {on_1st: "", on_1st_o: "", on_1st_o2: "", off_1st: "", off_1st_o: "", off_1st_o2: "", off_1st_e2: "", on_2nd: "", on_2nd_o: "", on_2nd_o2: "", off_2nd: "", off_2nd_o: "", off_2nd_o2: "", off_2nd_e2: "", on_3rd: "", on_3rd_o: "", on_3rd_o2: "", off_3rd: "", off_3rd_o: "", off_3rd_o2: "", off_3rd_e2: ""},
            //員工簽到紀錄
            employeeCheckRecord: {on_1st: "", off_1st: ""},
            isOnNone: true,
            isOffNone: true,
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
                height: 250,
                dest_width: 100,
                dest_height: 83.34,
                image_format: "jpeg",
                jpeg_quality: 50,
                flip_horiz: true,
                mandatory: {
                    facingMode: {
                        exact: "environment",
                    },
                },
            },
            showModal: false,
            nav: {
                0: true,
                1: false
            },
            loading: false,
            announce: {
                valid: false,
                title: '尚無公告',
                start_at: '0000-00-00',
                end_at: '0000-00-00',
                content: ''
            }
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
        const ptr = PullToRefresh.init({
            mainElement: '#app',
            onRefresh() {
                window.location.reload();
            }
        });
    },
    methods: {
        Cam(id) {
            //建立webcam配置
            Webcam.set(this.webcam);
            Webcam.attach("#my_camera");
            this.getEmployeeData(id);
            this.getEmployeeRecord(id);
            this.checkOverTimeBtn(id);
            this.checkEarlyBtn(id);
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
                    
                    if (data[4] !== null) {
                        this.announce.valid = true;
                        this.announce.title = data[4].title;
                        this.announce.start_at = data[4].start_at;
                        this.announce.end_at = data[4].end_at;
                        this.announce.content = data[4].content;
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
                    `http://${this.mode.prd}/api_v1.1/shift/record/new?id=${btoa(
            this.clinicId + "." + this.date
          )}`
                )
                .then((res) => {
                    const data = res.data.data;
                    this.record = data[0] ?? [];
                    this.checkRecord = data[1] ?? [];
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
                console.log(_shift.data[0].shift);
                for (let prop in _shift.data[0].shift) {
                    const timeFormat = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
                    if (prop.slice(0, 3) === "off") {
                        if(_shift.data[0].shift[prop].match(timeFormat) !== null) {
                            this.employeeData.shift.push(prop);
                        }
                    } else if (prop.slice(0, 2) === "on") {
                        if(_shift.data[0].shift[prop].match(timeFormat)  !== null) {
                            this.employeeData.shift.push(prop);
                        }
                    }
                }
            } else {
                this.employeeData.shift_name = "無排班";
            }
        },
        getEmployeeRecord(id) {
            //獲取打卡紀錄
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

            //獲取簽到紀錄
            const checkData = this.checkRecord.filter((data) => data.employee_id == id);
            for (let prop in this.employeeCheckRecord) {
                let _d = checkData.find((d) => d.type == prop);
                // this.employeeRecord[prop] = _d ? Object.assign({}, this.employeeRecord[prop], _d) : "";
                this.employeeCheckRecord[prop] = _d ?? "";
                //將 年月日 去除
                if (_d) {
                    this.employeeCheckRecord[prop].datetime = _d.datetime.slice(-8);
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
            if(this.loading === true) {
                alert("資料提交中，請稍後再試...");
            } else {
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
                this.loading = true;
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
                            alert(res.data.message);
                        }
                        this.loading = false;
                    })
                    .catch((error) => {
                        this.loading = false;
                        alert(error);
                    });
            }
        },
        takeSnapshot(employee_id, type = "") {
            //判斷date是否有落差
            const d = this.changeTimezone(new Date(), 'Asia/Taipei');
            if(this.date !== d.Format("yyyy-MM-dd")) {
                alert("資料重整中，請重新打卡...")
                location.reload();
            } else {
                //加班詢問
                if (type === "off") {
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
                } else if(type === "on") {
                    //詢問是否打卡
                    if (confirm("是否早到打卡?")) {
                        //拍照並且詢問是否要打卡，若無則不執行saveRemote
                        const time = d.Format("yyyy-MM-dd hh:mm:ss");
                        Webcam.snap(function (dataUri) {
                            document.getElementById("img").value = dataUri;
                        });

                        //判斷加班時數
                        //獲取該員工排班
                        const shift = this.shift.find((d) => d.employee_id == employee_id);
                        //獲取可下班的shift
                        let onShift = this.employeeData.shift.filter(
                            (d) => d.slice(0, 2) === "on"
                        );
                        //獲取未打卡，且可打卡的班別
                        let shift_data = [];
                        onShift.forEach((item) => {
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
                                if (overTime <  -parseInt(this.attendance.is_before.param1)) {
                                    shift_data.push({
                                        type: item,
                                        time: shift.data[0].shift[item],
                                        over: (-overTime - (parseInt(this.attendance.is_before.param1) - parseInt(this.attendance.is_before.param2))),
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
                    //判斷之前班別是否有打卡完整，沒有的話出現提示
                    //如果employeeData.shift長度>=4，代表有兩班以上
                    if(type.slice(-3) !== "1st") {
                        if(this.employeeData.shift.length >= 4) {
                            if (this.employeeData.shift.includes('on_1st') && this.employeeData.shift.includes('off_1st')) {
                                if (
                                    !((this.employeeRecord['off_1st'] !== "" ||
                                    this.employeeRecord['off_1st_o'] !== "" ||
                                    this.employeeRecord['off_1st_o2'] !== "" ||
                                    this.employeeRecord['off_1st_e2'] !== "") &&
                                    (this.employeeRecord['on_1st'] !== "" ||
                                    this.employeeRecord['on_1st_o'] !== "" ||
                                    this.employeeRecord['on_1st_o2'] !== ""))
                                ) {
                                    if(!confirm('第一班打卡尚未齊全，是否要打卡?')) {
                                        return;
                                    }
                                }
                            }
                            
                            if(type.slice(-3) === '3rd') {
                                if (this.employeeData.shift.includes('on_2nd') && this.employeeData.shift.includes('off_2nd')) {
                                    if (
                                        !((this.employeeRecord['off_2nd'] !== "" ||
                                        this.employeeRecord['off_2nd_o'] !== "" ||
                                        this.employeeRecord['off_2nd_o2'] !== "" ||
                                        this.employeeRecord['off_2nd_e2'] !== "") &&
                                        (this.employeeRecord['on_2nd'] !== "" ||
                                        this.employeeRecord['on_2nd_o'] !== "" ||
                                        this.employeeRecord['on_2nd_o2'] !== ""))
                                    ) {
                                        if(!confirm('第二班打卡尚未齊全，是否要打卡?')) {
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    

                    //拍照並且詢問是否要打卡，若無則不執行saveRemote
                    const time = d.Format("yyyy-MM-dd hh:mm:ss");
                    Webcam.snap(function (dataUri) {
                        document.getElementById("img").value = dataUri;
                    });

                    
                    let overTime = 0;
                    // 判斷是否早退
                    if(type.slice(0,3) === "off") {
                        //有設定要計算早退
                        if(parseInt(this.attendance.is_early.onORoff) === 1) {
                            const shift = this.shift.find((d) => d.employee_id == employee_id);
                            if(shift !== undefined) {
                                const shift_time = shift.data[0].shift[type];
                                var date = new Date(`${this.date} ${shift_time}`);
                                var date2 = new Date();
                                overTime = -((date2.getHours() - date.getHours()) * 60 + (date2.getMinutes() - date.getMinutes()));
                                if(overTime > parseInt(this.attendance.is_early.param1)) {
                                    type = type+"_e2";
                                    overTime = overTime - parseInt(this.attendance.is_early.param1);
                                } else {
                                    overTime = 0;
                                }
                            }
                        }
                    }

                    // // TODO 判斷是否遲到
                    // if(type.slice(0,2) === "on") {
                    //     //有設定要計算早退
                    //     if(parseInt(this.attendance.is_delay.onORoff) === 1) {
                    //         const shift = this.shift.find((d) => d.employee_id == employee_id);
                    //         const shift_time = shift.data[0].shift[type];
                    //         var date = new Date();
                    //         var date2 = new Date(`${this.date} ${shift_time}`); 
                    //         overTime = (date2.getHours() - date.getHours()) * 60 + (date2.getMinutes() - date.getMinutes());
                    //         if(-overTime > parseInt(this.attendance.is_delay.param1)) {
                    //             type = type+"_l2";
                    //         } else {
                    //             overTime = 0;
                    //         }
                    //     }
                    // }
                    
                    // if (confirm("是否打卡?")) {
                    //上傳至local server
                    this.postData.employee_id = employee_id;
                    this.postData.datetime = time;
                    this.postData.type = type;
                    this.postData.over_time = overTime;
                    this.postData.clinic_id = this.clinicId;
                    this.saveRemote();
                    // }
                }
            }
        },
        saveCheckRemote() {
            if(this.loading === true) {
                alert("資料提交中，請稍後再試...");
            } else {
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
                this.loading = true;
                //插入遠端server
                axios
                    .post(
                        `http://${this.mode.prd}/api_v1.1/shift/record/check/add?id=${btoa(
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
                )} 簽到/退完成`
                            );
                            this.getShiftRecord();
                            this.modalToggle();
                            this.$nextTick();
                        } else {
                            alert(res.data.message);
                        }
                        this.loading = false;
                    })
                    .catch((error) => {
                        this.loading = false;
                        alert(error);
                    });
            }
        },
        takeCheckSnapshot(employee_id, type = "") {
            //判斷date是否有落差
            const d = this.changeTimezone(new Date(), 'Asia/Taipei');
            if(this.date !== d.Format("yyyy-MM-dd")) {
                alert("資料重整中，請重新打卡...")
                location.reload();
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
                this.postData.clinic_id = this.clinicId;
                this.saveCheckRemote();
                // }
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
                            this.employeeRecord[type + "_o2"] !== "" ||
                            this.employeeRecord[type + "_e2"] !== ""
                        ) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        //判斷type是否有值 on
                        if (
                            this.employeeRecord[type] !== "" ||
                            this.employeeRecord[type + "_o"] !== "" ||
                            this.employeeRecord[type + "_o2"] !== ""
                        ) {
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
                            //判斷是否下一班是否已經打上班卡，如果有則不顯示
                            let num = parseInt(item.slice(4,5));
                            if(num === 1) {
                                //當第一班超時未下班前，查看其他班是否上班已打，如果打了就不顯示
                                //如果後面的班數有打下班也不顯示
                                if(
                                    (this.employeeRecord["off_1st"] !== "" || this.employeeRecord["off_1st_o"] !== "" || this.employeeRecord["off_1st_o2"] !== "" || this.employeeRecord["off_1st_e2"] !== "") ||
                                    (this.employeeRecord["on_2nd"] !== "" || this.employeeRecord["on_2nd_o"] !== "" || this.employeeRecord["on_2nd_o2"] !== "") ||
                                    (this.employeeRecord["on_3rd"] !== "" || this.employeeRecord["on_3rd_o"] !== "" || this.employeeRecord["on_3rd_o2"] !== "") ||
                                    (this.employeeRecord["off_2nd"] !== "" || this.employeeRecord["off_2nd_o"] !== "" || this.employeeRecord["off_2nd_o2"] !== "" || this.employeeRecord["off_2nd_e2"] !== "") ||
                                    (this.employeeRecord["off_3rd"] !== "" || this.employeeRecord["off_3rd_o"] !== "" || this.employeeRecord["off_3rd_o2"] !== "" || this.employeeRecord["off_3rd_e2"] !== "")
                                ) {
                                    this.isOffNone = true;
                                } else {
                                    this.isOffNone = false;
                                    break;
                                }
                            } else if(num === 2) {
                                if(
                                    (this.employeeRecord["off_2nd"] !== "" || this.employeeRecord["off_2nd_o"] !== "" || this.employeeRecord["off_2nd_o2"] !== "" || this.employeeRecord["off_2nd_e2"] !== "") ||
                                    (this.employeeRecord["on_3rd"] !== "" || this.employeeRecord["on_3rd_o"] !== "" || this.employeeRecord["on_3rd_o2"] !== "") ||
                                    (this.employeeRecord["off_3rd"] !== "" || this.employeeRecord["off_3rd_o"] !== "" || this.employeeRecord["off_3rd_o2"] !== "" || this.employeeRecord["off_3rd_e2"] !== "")
                                ) {
                                    this.isOffNone = true;
                                } else {
                                    this.isOffNone = false;
                                    break;
                                }
                            } else if(num === 3) {
                                if(
                                    (this.employeeRecord["off_3rd"] !== "" || this.employeeRecord["off_3rd_o"] !== "" || this.employeeRecord["off_3rd_o2"] !== "" || this.employeeRecord["off_3rd_e2"] !== "")
                                ) {
                                    this.isOffNone = true;
                                } else {
                                    this.isOffNone = false;
                                    break;
                                }
                            }
                        } else {
                            this.isOffNone = true;
                        }
                    } else {
                        this.isOffNone = true;
                    }
                }
            } else {
                this.isOffNone = true;
            }
        },
        //早到按鈕
        checkEarlyBtn(employee_id) {
            //確認考勤是有開啟，且有排班
            if (
                this.attendance.is_before.onORoff == 1 &&
                this.employeeData.shift.length !== 0
            ) {
                //獲取排班
                const shift = this.shift.find((d) => d.employee_id == employee_id);

                //獲取可下班的shift
                let onShift = this.employeeData.shift.filter(
                    (d) => d.slice(0, 2) === "on"
                );
                //判斷有幾班，分別做判斷
                //獲取未打卡，且可打卡的班別
                if(onShift.length === 1) {
                    //只有單獨一班
                    if (
                        this.employeeRecord[onShift[0]] == "" &&
                        this.employeeRecord[onShift[0] + "_o"] == "" &&
                        this.employeeRecord[onShift[0] + "_o2"] == ""
                    ) {
                        //現在時間減去下班時間
                        let overTime = Math.floor(
                            new Date(
                                new Date() -
                                new Date(
                                    this.date + " " + shift.data[0].shift[onShift[0]]
                                )
                            ).getTime() / 60000
                        );
                        if (overTime < -parseInt(this.attendance.is_before.param1)) {
                            //判斷是否下一班是否已經打上班卡，如果有則不顯示
                            if(
                                (this.employeeRecord[`${onShift[0]}`] !== "" || this.employeeRecord[`${onShift[0]}_o`] !== "" || this.employeeRecord[`${onShift[0]}_o2`] !== "")
                            ) {
                                this.isOnNone = true;
                            } else {
                                this.isOnNone = false;
                            }
                        } else {
                            this.isOnNone = true;
                        }
                    } else {
                        this.isOnNone = true;
                    }
                } else if(onShift.length === 2 && onShift.find(d => d.match('2nd')) === undefined) {
                    //排列方式1 12 123
                    for (let item of onShift) {
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
                            if (overTime < -parseInt(this.attendance.is_before.param1)) {
                                //判斷是否下一班是否已經打上班卡，如果有則不顯示
                                console.log(overTime);
                                let num = parseInt(item.slice(3, 4));
                                if(num === 1) {
                                    if(
                                        (this.employeeRecord["on_1st"] !== "" || this.employeeRecord["on_1st_o"] !== "" || this.employeeRecord["on_1st_o2"] !== "") ||
                                        (this.employeeRecord["off_1st"] !== "" || this.employeeRecord["off_1st_o"] !== "" || this.employeeRecord["off_1st_o2"] !== "" || this.employeeRecord["off_1st_e2"] !== "") ||
                                        (this.employeeRecord["on_3rd"] !== "" || this.employeeRecord["on_3rd_o"] !== "" || this.employeeRecord["on_3rd_o2"] !== "") ||
                                        (this.employeeRecord["off_3rd"] !== "" || this.employeeRecord["off_3rd_o"] !== "" || this.employeeRecord["off_3rd_o2"] !== "" || this.employeeRecord["off_3rd_e2"] !== "")
                                    ) {
                                        this.isOnNone = true;
                                        break;
                                    } else {
                                        console.log(1);
                                        this.isOnNone = false;
                                        break;
                                    }
                                } else if(num === 3) {
                                    if(
                                        !(//(this.employeeRecord["on_1st"] !== "" || this.employeeRecord["on_1st_o"] !== "" || this.employeeRecord["on_1st_o2"] !== "") &&
                                        (this.employeeRecord["off_1st"] !== "" || this.employeeRecord["off_1st_o"] !== "" || this.employeeRecord["off_1st_o2"] !== "" || this.employeeRecord["off_1st_e2"] !== "") &&
                                        ((this.employeeRecord["on_3rd"] === "" && this.employeeRecord["on_3rd_o"] === "" && this.employeeRecord["on_3rd_o2"] === "") &&
                                        (this.employeeRecord["off_3rd"] === "" && this.employeeRecord["off_3rd_o"] === "" && this.employeeRecord["off_3rd_o2"] === "" && this.employeeRecord["off_3rd_e2"] === "")))
                                    ) {
                                        this.isOnNone = true;
                                        break;
                                    } else {
                                        this.isOnNone = false;
                                        break;
                                    }
                                }
                            } else {
                                this.isOnNone = true;
                            }
                        } else {
                            this.isOnNone = true;
                        }
                    }
                } else if(onShift.length === 2 && onShift.find(d => d.match('1st')) === undefined) {
                    //排列方式1 12 123
                    for (let item of onShift) {
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
                            if (overTime < -parseInt(this.attendance.is_before.param1)) {
                                //判斷是否下一班是否已經打上班卡，如果有則不顯示
                                console.log(overTime);
                                let num = parseInt(item.slice(3, 4));
                                if(num === 2) {
                                    if(
                                        (this.employeeRecord["on_2nd"] !== "" || this.employeeRecord["on_2nd_o"] !== "" || this.employeeRecord["on_2nd_o2"] !== "") ||
                                        (this.employeeRecord["off_2nd"] !== "" || this.employeeRecord["off_2nd_o"] !== "" || this.employeeRecord["off_2nd_o2"] !== "" || this.employeeRecord["off_2nd_e2"] !== "") ||
                                        (this.employeeRecord["on_3rd"] !== "" || this.employeeRecord["on_3rd_o"] !== "" || this.employeeRecord["on_3rd_o2"] !== "") ||
                                        (this.employeeRecord["off_3rd"] !== "" || this.employeeRecord["off_3rd_o"] !== "" || this.employeeRecord["off_3rd_o2"] !== "" || this.employeeRecord["off_3rd_e2"] !== "")
                                    ) {
                                        this.isOnNone = true;
                                        break;
                                    } else {
                                        console.log(1);
                                        this.isOnNone = false;
                                        break;
                                    }
                                } else if(num === 3) {
                                    if(
                                        !(//(this.employeeRecord["on_2nd"] !== "" || this.employeeRecord["on_2nd_o"] !== "" || this.employeeRecord["on_2nd_o2"] !== "") &&
                                        (this.employeeRecord["off_2nd"] !== "" || this.employeeRecord["off_2nd_o"] !== "" || this.employeeRecord["off_2nd_o2"] !== "" || this.employeeRecord["off_2nd_e2"] !== "") &&
                                        ((this.employeeRecord["on_3rd"] === "" && this.employeeRecord["on_3rd_o"] === "" && this.employeeRecord["on_3rd_o2"] === "") &&
                                        (this.employeeRecord["off_3rd"] === "" && this.employeeRecord["off_3rd_o"] === "" && this.employeeRecord["off_3rd_o2"] === "" && this.employeeRecord["off_3rd_e2"] === "")))
                                    ) {
                                        this.isOnNone = true;
                                        break;
                                    } else {
                                        this.isOnNone = false;
                                        break;
                                    }
                                }
                            } else {
                                this.isOnNone = true;
                            }
                        } else {
                            this.isOnNone = true;
                        }
                    }
                } else {
                    //排列方式1 12 123
                    for (let item of onShift) {
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
                            if (overTime < -parseInt(this.attendance.is_before.param1)) {
                                //判斷是否下一班是否已經打上班卡，如果有則不顯示
                                console.log(overTime);
                                let num = parseInt(item.slice(3, 4));
                                if(num === 1) {
                                    if(
                                        (this.employeeRecord["on_1st"] !== "" || this.employeeRecord["on_1st_o"] !== "" || this.employeeRecord["on_1st_o2"] !== "") ||
                                        (this.employeeRecord["off_1st"] !== "" || this.employeeRecord["off_1st_o"] !== "" || this.employeeRecord["off_1st_o2"] !== "" || this.employeeRecord["off_1st_e2"] !== "") ||
                                        (this.employeeRecord["on_2nd"] !== "" || this.employeeRecord["on_2nd_o"] !== "" || this.employeeRecord["on_2nd_o2"] !== "") ||
                                        (this.employeeRecord["off_2nd"] !== "" || this.employeeRecord["off_2nd_o"] !== "" || this.employeeRecord["off_2nd_o2"] !== "" || this.employeeRecord["off_2nd_e2"] !== "") ||
                                        (this.employeeRecord["on_3rd"] !== "" || this.employeeRecord["on_3rd_o"] !== "" || this.employeeRecord["on_3rd_o2"] !== "") ||
                                        (this.employeeRecord["off_3rd"] !== "" || this.employeeRecord["off_3rd_o"] !== "" || this.employeeRecord["off_3rd_o2"] !== "" || this.employeeRecord["off_3rd_e2"] !== "")
                                    ) {
                                        this.isOnNone = true;
                                        break;
                                    } else {
                                        console.log(1);
                                        this.isOnNone = false;
                                        break;
                                    }
                                } else if(num === 2) {
                                    //上一班下班必須得打卡，還有其他班上下班不能打卡才顯示
                                    if(
                                        !(//(this.employeeRecord["on_1st"] !== "" || this.employeeRecord["on_1st_o"] !== "" || this.employeeRecord["on_1st_o2"] !== "") &&
                                        (this.employeeRecord["off_1st"] !== "" || this.employeeRecord["off_1st_o"] !== "" || this.employeeRecord["off_1st_o2"] !== "" || this.employeeRecord["off_1st_e2"] !== "") &&
                                        ((this.employeeRecord["on_2nd"] === "" && this.employeeRecord["on_2nd_o"] === "" && this.employeeRecord["on_2nd_o2"] === "") &&
                                        (this.employeeRecord["off_2nd"] === "" && this.employeeRecord["off_2nd_o"] === "" && this.employeeRecord["off_1st_o2"] === "" && this.employeeRecord["off_2nd_e2"] === "") &&
                                        (this.employeeRecord["on_3rd"] === "" && this.employeeRecord["on_3rd_o"] === "" && this.employeeRecord["on_3rd_o2"] === "") &&
                                        (this.employeeRecord["off_3rd"] === "" && this.employeeRecord["off_3rd_o"] === "" && this.employeeRecord["off_3rd_o2"] === "" && this.employeeRecord["off_3rd_e2"] === "")))
                                    ) {
                                        this.isOnNone = true;
                                        break;
                                    } else {
                                        //判斷第一班的overtime是否還小於第一班表定時間
                                        var time1 = new Date(`${this.date} ${shift.data[0].shift['on_1st']}`);
                                        var time2 = new Date();
                                        overTime = -((time2.getHours() - time1.getHours()) * 60 + (time2.getMinutes() - time1.getMinutes()));
                                        if(overTime > parseInt(this.attendance.is_early.param1)) {
                                            this.isOnNone = true;
                                        } else {
                                            this.isOnNone = false;
                                        }
                                        break;
                                    }
                                } else if(num === 3) {
                                    if(
                                        !(//(this.employeeRecord["on_2nd"] !== "" || this.employeeRecord["on_2nd_o"] !== "" || this.employeeRecord["on_2nd_o2"] !== "") &&
                                        (this.employeeRecord["off_2nd"] !== "" || this.employeeRecord["off_2nd_o"] !== "" || this.employeeRecord["off_2nd_o2"] !== "" || this.employeeRecord["off_2nd_e2"] !== "") &&
                                        ((this.employeeRecord["on_3rd"] === "" && this.employeeRecord["on_3rd_o"] === "" && this.employeeRecord["on_3rd_o2"] === "") &&
                                        (this.employeeRecord["off_3rd"] === "" && this.employeeRecord["off_3rd_o"] === "" && this.employeeRecord["off_3rd_o2"] === "" && this.employeeRecord["off_3rd_e2"] === "")))
                                    ) {
                                        this.isOnNone = true;
                                        break;
                                    } else {
                                        //判斷第二班的overtime是否還小於第二班表定時間
                                        var time3 = new Date(`${this.date} ${shift.data[0].shift['on_2nd']}`);
                                        var time4 = new Date();
                                        overTime = -((time4.getHours() - time3.getHours()) * 60 + (time4.getMinutes() - time3.getMinutes()));
                                        if(overTime > parseInt(this.attendance.is_early.param1)) {
                                            this.isOnNone = true;
                                        } else {
                                            this.isOnNone = false;
                                        }
                                        break;
                                    }
                                }
                            } else {
                                this.isOnNone = true;
                            }
                        } else {
                            this.isOnNone = true;
                        }
                    }
                }
                
            } else {
                this.isOnNone = true;
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
                } else if (this.employeeRecord[type + "_e2"] !== "") {
                    return this.employeeRecord[type + "_e2"].datetime.substr(0, 5) + "(早)";
                } else {
                    return "下班";
                }
            }
        },
        onBtns(type) {
            if (this.employeeRecord.employee_id !== 0) {
                if (this.employeeRecord[type] !== "") {
                    return this.employeeRecord[type].datetime.substr(0, 5);
                } else if (this.employeeRecord[type + "_o"] !== "") {
                    return this.employeeRecord[type + "_o"].datetime.substr(0, 5) + "(加)";
                } else if (this.employeeRecord[type + "_o2"] !== "") {
                    return this.employeeRecord[type + "_o2"].datetime.substr(0, 5) + "(加)";
                } else {
                    return "上班";
                }
            }
        },
        checkBtns(type) {
            if (this.employeeCheckRecord.employee_id !== 0) {
                if (this.employeeCheckRecord[type] !== "") {
                    return this.employeeCheckRecord[type].datetime.substr(0, 5);
                } else {
                    if(type.slice(0, 2) === 'on') {
                        return "簽到";
                    } else {
                        return "簽退";
                    }
                }
            }
        },
        checkBtnDisabled(type = "") {
            if (this.employeeCheckRecord[type] !== "") {
                return true;
            } else {
                return false;
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
        },
        tab(index = 0) {
            this.nav[index] = true;
            if(index === 0) {
                this.nav[1] = false;
            } else {
                this.nav[0] = false;
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
        },
        windowsBtn() {
            return this.isOnNone && this.isOffNone;
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
  height: 100%;
  width: 100vw;
}
.sidebar{
  min-height: 100vh;
  height: 100%;
  background:linear-gradient(315deg, #787FB9 , #A8ACD2 );
  text-align: center;
  padding: 7% 0 0;
}
.sidebar img{
  width: 95%;
}
.sidebar .announce{
    cursor: pointer;
    padding: 3px 10px;
    width: fit-content;
    margin: 0 auto;
    overflow : hidden;
    text-overflow : ellipsis;
    white-space : nowrap;
    width: 100%;
    background-color: rgba(255, 255, 255, 1);
    height: 500px;
    overflow-y: scroll;
    max-width: 420px;
    word-break: break-all;
    white-space: pre-wrap;
}
.sidebar .announce > div{
    opacity:1;
}
.sidebar .time{
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
    min-height: 100vh;
  /* height: 100vh; */
  background:linear-gradient(315deg, #646DC1 , #BCC1EF );
}
.main {
    background-image: url('~@/assets/images/01.png'),
        linear-gradient(315deg, #646DC1 , #BCC1EF );
    background-repeat  : no-repeat,no-repeat;
    background-position: bottom right,left;
    background-size: 500px 300px,100%;
}
.main .title{
  background-color:#CED2F8;
  border-radius: 45px;
  display: inline-block;
    margin-top: .5rem;
}
.main .title h4{
  color:#3F489C;
  font-weight: bold;
  line-height: 200%;
  padding: 1px 30px;
  margin-bottom: 0;
  float: left;
}
.main .time{
  color:#fff;
  display: inline-block;
  float: right;
  size: 1rem;
  margin-top: 1rem;
  font-size: 1.5rem;
}


.main .name{
  display: inline-block;
  border-radius: 45px;
  border: 0px;
  width: 140px;
  background: #fff;
  margin:10px 10px;
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
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 100%;
  width: 100vw;  
}
.windows {
  width: 600px;
  height: 690px;
  background-color: #ffffff;
  opacity: 1;
  margin: 0px auto;
  display: none;
  z-index: 3;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -315px;
  margin-top: -375px;
  overflow-x: hidden;
  overflow-y: auto;
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
  height: 180px;
  padding: 10px 20px 0;
}
.windows .work.check {
    padding: 10px 200px 0;
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
  height: 40px;
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
    margin: -25px 0 0 0;
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
.nav-item {
    cursor: pointer;
    width: 100px;
    text-align: center;
}
.nav-pills.custom .nav-link.active {
    background-color: #3F489C;
}
.nav-pills.custom .nav-item:first-child .nav-link {
    border-radius: 50px 0 0 50px;
    border: 1px solid #BFBFBF;
    border-right: 0px;
}
.nav-pills.custom .nav-item:last-child .nav-link {
    border-radius: 0 50px 50px 0;
    border: 1px solid #BFBFBF;
}
.overflow-hidden {
  overflow: hidden;
}
figure.media > div > div {
    height: 300px !important;
}
figure.media > div > div > iframe {
    width: 500px !important;
}
figure > img {
    width: 100%;
}
.buttons {
    text-align: center;
}

@media only screen and (max-width: 600px) {
    figure.media > div > div > iframe {
        width: 300px !important;
    }
    figure.media > div > div {
        height: 200px !important;
    }
    .sidebar {
        padding: 100px 0;
        min-height: auto;
    }
    .main .title,
    .main .time {
        float: inherit;
    }
    .main .info,
    .buttons {
        text-align: center;
    }
    .main {
        background-image:linear-gradient(315deg, #646DC1 , #BCC1EF );
        background-repeat: no-repeat;
        background-position: left;
        background-size: 100%;
    }
    .sidebar .announce{
        height: 300px;
        max-width: 420px;
    }
    .windows {
        position: fixed;
        margin-top: -315px;
    }
    .mask {
        position: fixed;
    }
}
.ck-content .image-style-side, .ck-content .image-style-align-left, .ck-content .image-style-align-center, .ck-content .image-style-align-right {
	max-width: 50%;
}
 .ck-content .image-style-side {
	float: right;
	margin-left: 1.5em;
}
 .ck-content .image-style-align-left {
	float: left;
	margin-right: 1.5em;
}
 .ck-content .image-style-align-center {
	margin-left: auto;
	margin-right: auto;
}
 .ck-content .image-style-align-right {
	float: right;
	margin-left: 1.5em;
}
.announce::-webkit-scrollbar {  
    width: 4px;
   height:10px;
   background-color:#b5b1b1;
}  
.announce::-webkit-scrollbar-track{  
    -webkit-box-shadow: inset 0 0 6px rgba(255,255,255);  
    border-radius: 50px; 
    background-color:white;
}

.announce::-webkit-scrollbar-thumb{  
    border-radius: 50px;  
    -webkit-box-shadow: inset 0 0 6px rgba(255,255,255);  
   background-color:#b5b1b1;
} 
</style>
