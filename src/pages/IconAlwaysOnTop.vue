<template>
  <q-page class="flex flex-center">
    <q-btn class="icon-always-on-top" flat @click="toggleMainWindow()">
      <img alt="Zygo logo" src="statics/icon-zygo.png" />
    </q-btn>

    <q-icon size="1.5rem" dense name="drag_indicator" ref="iconDrag" class="bt-drag" />
  </q-page>
</template>

<script>
export default {
  name: "PageIcon",
  data() {
    return {
      mainWin: this.$q.electron.remote.BrowserWindow.getAllWindows()[0],
      iconWin: this.$q.electron.remote.BrowserWindow.getAllWindows()[1]
    };
  },
  methods: {
    toggleMainWindow() {
      if (this.mainWin.isMinimized() || !this.mainWin.isFocused()) {
        this.mainWin.restore();
        this.mainWin.focus();
        this.iconWin.minimize();
      } else {
        this.mainWin.minimize();
        this.iconWin.restore();
      }
    }
  }
};
</script>

<style scoped>
.q-page {
  overflow: hidden;
  height: 7.5rem;
  width: 7.5rem;
}

.bt-drag {
  -webkit-app-region: drag;
  background: #fff;
  padding: 0;
  position: absolute;
  left: 0.3rem;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px rgba(0, 0, 0, 0.14),
    0 1px 10px rgba(0, 0, 0, 0.12);
  border-radius: 50%;
}

.icon-always-on-top {
  border-radius: 50%;
  height: 6.25rem;
  width: 6.25rem;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px rgba(0, 0, 0, 0.14),
    0 1px 10px rgba(0, 0, 0, 0.12);
}

.icon-always-on-top img {
  height: 6.25rem;
  width: 6.25rem;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}
</style>
