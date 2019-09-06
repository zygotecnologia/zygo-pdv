<template>
  <q-layout view="lHh lpr lFf" container style="height: 100vh;">
    <q-header style="color: #35245c;">
      <q-bar class="q-electron-drag text-bold bg-white flex justify-between wrap">
        <div style="font-size: 0.825rem;">Zygo PDV</div>
        <q-btn
          style="width: 2rem; height: 2rem; margin-right: 0.25rem;"
          size="0.65rem"
          flat
          icon="minimize"
          @click="minimize"
        />
      </q-bar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      mainWin: this.$q.electron.remote.BrowserWindow.getAllWindows()[0],
      iconWin: this.$q.electron.remote.BrowserWindow.getAllWindows()[1]
    };
  },
  methods: {
    minimize() {
      this.mainWin.minimize();
      this.iconWin.restore();
    }

    // maximize() {
    //   this.mainWin.isMaximized()
    //     ? this.mainWin.unmaximize()
    //     : this.mainWin.maximize();
    // },

    // closeApp() {
    //   this.mainWin.close();
    //   this.iconWin.close();
    // }
  }
};
</script>
