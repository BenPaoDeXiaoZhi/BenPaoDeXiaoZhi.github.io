const update = ({ vm, registerSettings }) => {
    console.log(vm.runtime.extensionManager)
    const mgr = vm.runtime.extensionManager
    const register = registerSettings("更新特定扩展",
        "plugin-upadte-extension",
        [
            {
                key: "plugin-upadte-extension",
                label: "更新特定扩展",
                description: "输入id或url，更新扩展",
                items: [
                    {
                        key: "pluginFileUrl",
                        label: "id",
                        type: "input",
                        description: "id",
                        inputProps: {
                            placeholder: "扩展id",
                            onPressEnter: (e) => {
                                e.target.blur();
                            },
                            onBlur(e) {
                                (async()=>{
                                    console.log(e)
                                    mgr.loadExtensionURL(await vm.runtime.ccwAPI.getExtensionURLById('spineAnimation'),true)
                                    alert(`扩展${e.target.value}已更新`)
                                })()
                                
                            },
                        },
                        value: "",
                        autoSave: false,
                    }
                ]
            }
        ],
        "",)
    return {
        dispose() {
            register.dispose()
        }
    }
}
Scratch.plugins.register(update)
