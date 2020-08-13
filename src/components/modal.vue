<template>
  <div class="Modal-rootOverlay" v-show="show" @click.self="close">
    <div class="Modal-Card" :class="[mod, position]">
      <div v-if="title" class="title">{{ title }}</div>
      <div class="body">
        <slot></slot>
      </div>
      <div class="actions">
        <slot name="actions">
          <button class="btn" @click="close">close</button>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "modal",
  props: {
    show: Boolean,
    mod: String,
    title: String,
    position: {
      type: String,
      default: "Y_center"
    }
  },
  watch: {
    show(isShow) {
      document.body.style.cssText = isShow
        ? "height:100vh;overflow:hidden;"
        : "";
    }
  },
  methods: {
    close() {
      this.$emit("update:show", false);
      document.body.style = "";
    }
  }
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font: 100%/1.6 "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: #444;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}
.Card {
  padding: 1em;
  margin: 1rem;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
}
.Wrap {
  padding: 1em;
  margin: auto;
  max-width: 1200px;
}
a,
.link {
  color: #477dca;
}
.link {
  text-decoration: underline;
}
.Tag {
  font-family: monospace;
  background: #f0f8ff;
  padding: 0.3em;
  margin: 1em 0;
}
.Tag:before {
  content: "[ ";
}
.Tag:after {
  content: " ] ";
}
.Tag:before,
.Tag:after {
  color: #00f;
}
.H1,
h1,
h2,
h3,
h4,
h5 {
  line-height: 1;
  margin: 0 0 1em;
}
h1,
h2 {
  color: #3c4858;
  font-weight: 400;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}
p {
  margin-bottom: 0.75em;
}
.col {
  -webkit-box-flex: 1;
  flex: 1;
  margin-left: 1em;
}
@media (min-width: 600px) {
  .flex-row {
    display: -webkit-box;
    display: flex;
    flex-wrap: wrap;
  }
  .w_25 {
    -webkit-box-flex: 2.5;
    flex: 2.5;
  }
  .w_75 {
    -webkit-box-flex: 7.5;
    flex: 7.5;
  }
  .w_50 {
    -webkit-box-flex: 5;
    flex: 5;
  }
}
.form-group {
  display: -webkit-box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
}
.form-group > * {
  width: 240px;
  margin-bottom: 1em;
}
.checked-group label {
  display: block;
}
.form-line {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  margin: -0.3em;
}
.form-line + .form-line {
  margin-top: 0.7em;
}
.form-line .btn,
.form-line button,
.form-line input,
.form-line select {
  margin: 0.35em;
}
.form-line label {
  white-space: nowrap;
  padding-right: 0.7em;
}
fieldset {
  border: 1px solid #dee2e6;
  padding: 1em 1.4em 1.4em;
  margin: 1em 0;
}
legend {
  padding: 0 0.3em;
}
label {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
  white-space: nowrap;
  display: inline-table;
}
input[type="color"],
input[type="range"] {
  vertical-align: middle;
}
input[type="color"] {
  height: 3em;
  background: transparent;
  border: 0;
  cursor: pointer;
}
input[type="file"] {
  background-color: #fff;
}
button::-moz-focus-inner {
  border: 0;
}
select:not([multiple]):-moz-focusring {
  color: transparent;
  text-shadow: 0 0 0 #000;
}
.disabled,
[disabled] {
  pointer-events: none;
  opacity: 0.5;
}
input,
.btn,
button,
select,
textarea {
  font-size: 0.8rem;
  outline: 0;
}
input.sm,
.btn.sm,
button.sm,
select.sm,
textarea.sm {
  font-size: 0.6rem;
}
input.lg,
.btn.lg,
button.lg,
select.lg,
textarea.lg {
  font-size: 1rem;
}
input.xl,
.btn.xl,
button.xl,
select.xl,
textarea.xl {
  font-size: 1.2rem;
}
input:not([type="range"]):not([type="color"]),
select,
textarea {
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
}
input:not([type="color"]):not([type="range"]):not([type="radio"]):not([type="checkbox"]),
.select,
select:not([multiple]),
textarea,
.btn,
button {
  padding: 0 1em;
  height: 2.4em;
  line-height: 1;
  border-radius: 0.3em;
}
input:not([type="color"]):not([type="range"]):not([type="radio"]):not([type="checkbox"]),
.select,
select,
textarea {
  border: 1px solid #bdc3c7;
}
input:not([type="color"]):not([type="range"]):not([type="radio"]):not([type="checkbox"]):focus,
.select:focus,
select:focus,
textarea:focus {
  border-radius: 0;
  border-top-color: #477dca;
}
.btn {
  -webkit-box-align: center;
  align-items: center;
  white-space: nowrap;
  text-decoration: none;
}
.btn.rounded {
  border-radius: 2em;
}
.btn,
button {
  /* display: -webkit-inline-box;
    display: inline-flex; */
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  border: 1px solid transparent;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-transition: background 0.3s;
  transition: background 0.3s;
  background: #3498db;
  /* color: #fff; */
}
.btn:active,
button:active {
  -webkit-transform: translateY(2px);
  transform: translateY(2px);
}
.btn:hover,
button:hover {
  background: #48acef;
}
.btn.fill.lite {
  color: #477dca;
  background: #fffafa;
}
.btn.fill.lite:hover {
  text-decoration: underline;
}
.btn.fill.red {
  background: #ed5565;
}
.btn.fill.red:hover {
  background: #f17784;
}
.btn.fill.green {
  background: #26a69a;
}
.btn.fill.green:hover {
  background: #3abaae;
}
.btn.fill.orange {
  background: #ff9800;
}
.btn.fill.orange:hover {
  background: #ffad33;
}
.btn.flat {
  background-color: transparent;
  box-shadow: none;
  color: #444;
  text-transform: uppercase;
  font-weight: 500;
}
.btn.flat:hover {
  background: rgba(119, 119, 119, 0.2);
}
.btn.flat.blue {
  color: #3498db;
}
.btn.flat.blue:hover {
  background: rgba(52, 152, 219, 0.2);
}
.btn.flat.red {
  color: #ed5565;
}
.btn.flat.red:hover {
  background: rgba(237, 85, 101, 0.2);
}
.btn.flat.green {
  color: #26a69a;
}
.btn.flat.green:hover {
  background: rgba(38, 166, 154, 0.2);
}
.btn.flat.orange {
  color: #ff9800;
}
.btn.flat.orange:hover {
  background: rgba(255, 152, 0, 0.2);
}
.btn.outline {
  border: 0.16em solid currentColor;
  -webkit-transition: none;
  transition: none;
  background: #fffafa;
  color: #999;
}
.btn.outline:hover {
  color: #fff !important;
  border-color: transparent;
  background: #9e9e9e;
}
.btn.outline.blue {
  color: #3498db;
}
.btn.outline.blue:hover {
  background: #3498db;
}
.btn.outline.red {
  color: #ed5565;
}
.btn.outline.red:hover {
  background: #ed5565;
}
.btn.outline.green {
  color: #26a69a;
}
.btn.outline.green:hover {
  background: #26a69a;
}
.btn.outline.orange {
  color: #ff9800;
}
.btn.outline.orange:hover {
  background: #ff9800;
}
.btn.sm {
  font-size: 0.6rem;
}
.btn.lg {
  font-size: 1rem;
}
.btn.xl {
  font-size: 1.2rem;
}
.button-group {
  display: -webkit-inline-box;
  display: inline-flex;
  margin: 0.35em;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  border-radius: 0.3em;
  font-size: 0.8rem;
}
.button-group.sm {
  font-size: 0.6rem;
}
.button-group.lg {
  font-size: 1rem;
}
.button-group.xl {
  font-size: 1.2rem;
}
.button-group .btn {
  font-size: inherit;
  border-color: transparent;
  box-shadow: none;
  border-radius: 0;
}
.button-group .btn:first-child {
  border-radius: 0.3em 0 0 0.3em;
}
.button-group .btn:last-child {
  border-radius: 0 0.3em 0.3em 0;
}
.button-group .btn + .btn {
  border-left: 1px solid #dee2e6;
}
select:not([multiple]),
.select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
  background: #fff
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='22' height='12'><polygon points='0,0 12,0 6,12' fill='orange'/></svg>")
    100% no-repeat;
  padding-right: 30px;
}
select[multiple] {
  cursor: pointer;
  padding: 0.2em;
}
select[multiple] option {
  padding: 0.2em;
  padding-left: 0.8em;
}
select[multiple] option:first-child {
  background: #efefef;
}
input[type="checkbox"],
input[type="radio"] {
  padding: 0;
  border: 2px solid #2196f3;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
  height: 20px;
  width: 20px !important;
  vertical-align: sub;
  margin: 0 0.5em;
}
input[type="checkbox"]:checked,
input[type="radio"]:checked {
  background: #2196f3;
  -webkit-animation: bounce 0.3s;
  animation: bounce 0.3s;
}
input[type="checkbox"] {
  border-radius: 0.2em;
}
input[type="checkbox"]:checked {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path fill='none' stroke-width='3' stroke='white' d='M3,7 L7,11 L13,4'/></svg>");
}
input[type="radio"] {
  border-radius: 50%;
}
input[type="radio"]:checked {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><circle cx='8' cy='8' r='4' fill='white'/></svg>");
}
nav a,
.list-Card li,
.btn,
button {
  position: relative;
  overflow: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}
nav a:after,
.list-Card li:after,
.btn:after,
button:after {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, #000 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  -webkit-transform: scale(10, 10);
  transform: scale(10, 10);
  opacity: 0;
  -webkit-transition: opacity 1s, -webkit-transform 0.5s;
  transition: opacity 1s, -webkit-transform 0.5s;
  transition: transform 0.5s, opacity 1s;
  transition: transform 0.5s, opacity 1s, -webkit-transform 0.5s;
}
nav a:active:after,
.list-Card li:active:after,
.btn:active:after,
button:active:after {
  -webkit-transform: scale(0, 0);
  transform: scale(0, 0);
  opacity: 0.2;
  -webkit-transition: 0s;
  transition: 0s;
}
.Modal-rootOverlay {
  z-index: 100;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  display: -webkit-box;
  display: flex;
  cursor: pointer;
  background: rgba(68, 68, 68, 0.7);
  overflow: hidden;
  overflow-y: overlay;
}
.Modal-Card {
  cursor: auto;
  background: #fff;
}
.Modal-Card .title {
  font-size: 1.4rem;
  line-height: 1.3;
  padding: 0.75rem 1.5rem;
}
.Modal-Card .body {
  background: #f1f1f1;
  padding: 1rem 1.5rem;
}
.Modal-Card .body p {
  margin-bottom: 0;
}
.Modal-Card .actions {
  text-align: right;
  padding: 0.75rem 1.5rem 1.2rem;
}
.Modal-Card.XL {
  max-width: 1080px;
  margin: auto;
}
.Modal-Card.SM {
  max-width: 460px;
}
.Modal-Card.toCenter {
  margin: auto;
}
.Y_center {
  margin: 10% auto auto;
  border-radius: 0.2em;
  width: 90%;
  max-width: 780px;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  opacity: 0;
  -webkit-animation: Y_center 0.2s 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    forwards;
  animation: Y_center 0.2s 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
.lModal,
.rModal {
  padding: 1em;
  max-width: 400px;
  align-self: start;
  min-height: 100%;
  -webkit-animation: translateX 0.2s 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    forwards;
  animation: translateX 0.2s 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
.rModal {
  margin-left: auto;
  -webkit-transform: translateX(100%);
  transform: translateX(100%);
}
.lModal {
  margin-right: auto;
  -webkit-transform: translateX(-100%);
  transform: translateX(-100%);
}
@-webkit-keyframes bounce {
  0%,
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  50% {
    -webkit-transform: scale(0.7);
    transform: scale(0.7);
  }
}
@keyframes bounce {
  0%,
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  50% {
    -webkit-transform: scale(0.7);
    transform: scale(0.7);
  }
}
@-webkit-keyframes Y_center {
  to {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes Y_center {
  to {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }
}
@-webkit-keyframes translateX {
  to {
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }
}
@keyframes translateX {
  to {
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }
}
</style>
