<template>
    <transition name="fade">
        <div class="_modal" v-if="show">
            <!-- 點擊背景關閉modal -->
            <div class="modal_backdrop" @click="closeModal()"/>
            <div class="modal_dialog">
                <div class="modal_header">
                    <!-- 標題 -->
                    <slot name="header"/>
                    <!-- x -->
                    <svg class="modal_close" @click="closeModal()" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512">
                        <path
                            fill="currentColor"
                            d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                        ></path>
                    </svg>
                </div>
                <div class="modal_body">
                    <slot name="body"/>
                </div>
                <div class="modal_footer">
                    <slot name="footer"/>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: "Modal",
    data() {
        return {
            show: false
        };
    },
    methods: {
        closeModal() {
            this.show = false;
            document.querySelector("body").classList.remove("overflow-hidden");
        },
        openModal() {
            this.show = true;
            document.querySelector("body").classList.add("overflow-hidden");
            console.log(this.$el);
            const div = document.querySelector( '.media' )
            if(div !== null) {
                document.querySelector( 'figure.media > div > div' ).style.height = '300px';
                document.querySelector( 'figure.media > div > div > iframe' ).style.width = '500px';
            } else {
                console.log(1);
            }

        }
    }
}
</script>

<style scoped>
._modal {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 9;
	overflow-x: hidden;
	overflow-y: auto;
    /* display: none; */
}
 .modal_backdrop {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.3);
	z-index: 2;
}
 .modal_dialog {
	position: relative;
	width: 70%;
	background-color: #fff;
	/* border-radius: 5px; */
	margin: 50px auto;
	display: flex;
	flex-direction: column;
	z-index: 3;
}
 @media screen and (max-width: 992px) {
	.modal_dialog {
		width: 90%;
	}
}
 .modal_close {
	width: 30px;
	height: 30px;
    cursor: pointer;
}
 .modal_header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	padding: 20px 20px 10px;
}
 .modal_body {
	padding: 10px 20px 10px;
	overflow: auto;
	display: flex;
	flex-direction: column;
	align-items: stretch;
}
 .modal_footer {
	padding: 10px 20px 20px;
}
 .fade-enter-active, .fade-leave-active {
	transition: opacity 0.2s;
}
 .fade-enter, .fade-leave-to {
	opacity: 0;
}
</style>