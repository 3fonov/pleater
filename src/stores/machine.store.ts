import { MachineConfig } from "../modules/machineConfig";
import { defineStore } from "pinia"
import { ref } from "vue";

export const useMachineStore = defineStore('machineStore', () => {
    const config = ref(new MachineConfig());
    return { config }
},

    { persist: true }
)