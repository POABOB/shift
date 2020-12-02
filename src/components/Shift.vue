<template>
<div>
    <div id="results"></div>
    <div id="app">
        <div class="center">
            <h1>{{ clinicName }}</h1>
            <input type="hidden" id="img" />
            <!-- 先出現已排班員工，再出現位排班員工  -->
            <button v-for="(d) in employee_in_shift" :key="d.employee_id" class="btn medium green" @click="Cam(d.employee_id)">
                {{ d.name }}
            </button>
            <br />
            <hr v-show="hrShow" />
            <button v-for="(d) in employee_not_in_shift" :key="d.employee_id" class="btn medium green" @click="Cam(d.employee_id)">
                {{ d.name }}
            </button>
        </div>

        <modal :show.sync="showModal" title="員工打卡資料">
            <div id="time">
                <h1 id="datetime"></h1>
            </div>

            <table>
                <tbody>
                    <tr>
                        <th>員工名稱</th>
                        <td><span v-text="employeeData.name"></span></td>
                    </tr>
                    <tr>
                        <th>班別</th>
                        <td><span v-text="employeeData.shift_name"></span></td>
                    </tr>
                </tbody>
            </table>
            <div class="flex">
                <div id="my_camera"></div>
                <!-- if else 判斷是已經打卡，避免重複打卡 -->
                <div id="buttons" :class="{ none: isNone }">
                    <button :disabled="btnDisabled('on_1st')" @click="takeSnapshot(employeeData.employee_id, 'on_1st')" class="btn red">
                        <span v-text="onBtns('on_1st')"></span>
                    </button>
                    <button :disabled="btnDisabled('off_1st')" @click="takeSnapshot(employeeData.employee_id, 'off_1st')" class="btn red">
                        <span v-text="offBtns('off_1st')"></span>
                    </button>
                    <button :disabled="btnDisabled('on_2nd')" @click="takeSnapshot(employeeData.employee_id, 'on_2nd')" class="btn green">
                        <span v-text="onBtns('on_2nd')"></span>
                    </button>
                    <button :disabled="btnDisabled('off_2nd')" @click="takeSnapshot(employeeData.employee_id, 'off_2nd')" class="btn green">
                        <span v-text="offBtns('off_2nd')"></span>
                    </button>
                    <button :disabled="btnDisabled('on_3rd')" @click="takeSnapshot(employeeData.employee_id, 'on_3rd')" class="btn purple">
                        <span v-text="onBtns('on_3rd')"></span>
                    </button>
                    <button :disabled="btnDisabled('off_3rd')" @click="takeSnapshot(employeeData.employee_id, 'off_3rd')" class="btn purple">
                        <span v-text="offBtns('off_3rd')"></span>
                    </button>
                    <button class="btn yellow" :class="{ none: isNone }" @click="takeSnapshot(employeeData.employee_id)">
                        加班下班
                    </button>
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
                clinic_id: 33,
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
        console.log('2020-12-02');
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
            this.showModal = true;
            this.getEmployeeData(id);
            this.getEmployeeRecord(id);
            this.checkOverTimeBtn(id);
            this.$nextTick();
        },
        timer() {
            //時間更新
            const update = function () {
                let time = new Date().Format("yyyy-MM-dd hh:mm:ss");
                document.getElementById("datetime").innerHTML = time;
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
        takeSnapshot(employee_id, type = "") {
            //判斷date是否有落差
            if(this.date !== new Date().Format("yyyy-MM-dd")) {
                alert("資料重整中，請重新打卡...")
                location.reload();
            } else {
                //加班詢問
                if (type === "") {
                    //詢問是否打卡
                    if (confirm("是否打卡加班?")) {
                        //拍照並且詢問是否要打卡，若無則不執行saveRemote
                        const time = new Date().Format("yyyy-MM-dd hh:mm:ss");
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
                                            new Date().Format("yyyy-MM-dd ") +
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
                        this.saveRemote();
                    }
                } else {
                    //拍照並且詢問是否要打卡，若無則不執行saveRemote
                    const time = new Date().Format("yyyy-MM-dd hh:mm:ss");
                    Webcam.snap(function (dataUri) {
                        document.getElementById("img").value = dataUri;
                    });
                    // if (confirm("是否打卡?")) {
                    //上傳至local server
                    this.postData.employee_id = employee_id;
                    this.postData.datetime = time;
                    this.postData.type = type;
                    this.postData.over_time = 0;
                    this.saveRemote();
                    // }
                }
            }
        },
        btnDisabled(type = "") {
            // const arr = [
            //     "on_1st",
            //     "off_1st",
            //     "on_2nd",
            //     "off_2nd",
            //     "on_3rd",
            //     "off_3rd",
            // ];
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
                                    new Date().Format("yyyy-MM-dd ") + shift.data[0].shift[item]
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
                    return this.employeeRecord[type].datetime;
                } else if (this.employeeRecord[type + "_o"] !== "") {
                    return this.employeeRecord[type + "_o"].datetime + "(加班)";
                } else if (this.employeeRecord[type + "_o2"] !== "") {
                    return this.employeeRecord[type + "_o2"].datetime + "(加班)";
                } else {
                    if (type.slice(4, 5) === "1") {
                        return "第一班下班";
                    } else if (type.slice(4, 5) === "2") {
                        return "第二班下班";
                    } else {
                        return "第三班下班";
                    }
                }
            }
        },
        onBtns(type) {
            if (this.employeeRecord.employee_id !== 0) {
                if (this.employeeRecord[type] !== "") {
                    return this.employeeRecord[type].datetime;
                } else {
                    if (type.slice(3, 4) === "1") {
                        return "第一班上班";
                    } else if (type.slice(3, 4) === "2") {
                        return "第二班上班";
                    } else {
                        return "第三班上班";
                    }
                }
            }
        },
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
        // getEmployeeRecord() {},
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
    padding: 5% 10% 10% 10%;
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
    margin: 10px;
    padding: 15px 20px 25px 20px;
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
    height: 27%;
}

#buttons.none button {
    margin: 2px 0;
    width: 49%;
    height: 30%;
}

.btn.yellow {
    background: #f5edbf;
    border: 1px solid #cac974;
    width: 99% !important;
}

.btn.none {
    display: none;
}
</style>
