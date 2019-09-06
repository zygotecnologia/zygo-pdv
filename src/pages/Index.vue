<template>
  <q-page>
    <webview ref="zygoPdv" src="https://pdv.zygotecnologia.com/?embed=electron" />
    <q-btn dense icon="more_vert" flat class="bt-settings absolute-top-right">
      <q-menu style="min-width: 300px" transition-show="jump-down" transition-hide="jump-up">
        <q-list style="min-width: 300px">
          <q-item>
            <q-item-section>
              <q-toggle
                @click.native="setStartWithSystem()"
                v-model="settings.startWithSystem"
                label="Iniciar com o sistema"
              />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-btn
                dense
                color="primary"
                @click="confirmReset = true"
                label="Restaurar configurações iniciais"
              />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-btn
                dense
                color="negative"
                @click="confirmClose = true"
                label="Encerrar aplicação"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

    <q-dialog v-model="confirmReset" persistent>
      <q-card>
        <q-card-section class="row items-center">Deseja restaurar todas as configurações?</q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="OK"
            color="primary"
            v-close-popup
            @click="resetSettings(), resetConfirmation = true"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmClose" persistent>
      <q-card>
        <q-card-section class="row items-center">Deseja encerrar a aplicação?</q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="OK" color="primary" v-close-popup @click="mainWin.close()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="resetConfirmation" persistent>
      <q-card>
        <q-card-section class="row items-center">Configurações iniciais restauradas.</q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  name: "PageIndex",
  data() {
    return {
      mainWin: this.$q.electron.remote.BrowserWindow.getAllWindows()[0],
      iconWin: this.$q.electron.remote.BrowserWindow.getAllWindows()[1],
      settings: {},
      defaultSettings: {
        startWithSystem: true
      },
      confirmReset: false,
      resetConfirmation: false,
      confirmClose: false,
      webview: {
        // CSS INJETADO NA WEBVIEW
        css: `
          #page-header {}

          #page-header img {
            height: 5rem;
          }

          #main-container {}
        `,

        // JS INJETADO NA WEBVIEW
        js: ``
      }
    };
  },
  methods: {
    saveUserSettings() {
      localStorage.setItem("zygo_pdv", JSON.stringify(this.settings));
    },

    resetSettings() {
      this.settings = JSON.parse(JSON.stringify(this.defaultSettings));
      this.setStartWithSystem();
    },

    setStartWithSystem() {
      ipcRenderer.send("setStartWithSystem", this.settings.startWithSystem);
      this.saveUserSettings();
    }
  },
  mounted() {
    const webview = this.$refs.zygoPdv;
    webview.addEventListener("dom-ready", () => {
      webview.insertCSS(this.webview.css);
      webview.executeJavaScript(this.webview.js);
    });

    this.settings =
      JSON.parse(localStorage.getItem("zygo_pdv")) ||
      JSON.parse(JSON.stringify(this.defaultSettings));

    this.setStartWithSystem();
  }
};
</script>

<style scoped>
webview {
  width: 100vw;
  height: calc(100vh - 2rem);
  padding-top: 2rem;
}
.bt-settings {
  right: 1rem;
  top: 0.5rem;
}
</style>