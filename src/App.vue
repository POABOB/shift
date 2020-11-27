<template>
<div id="app">
    <Shift />
</div>
</template>

<script>
import Shift from "./components/Shift.vue";
document.title = "打卡排班系統";
export default {
    name: "App",
    components: {
        Shift,
    },
};
</script>
