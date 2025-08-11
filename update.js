const update = ({ vm, registerSettings}) => {
        console.log(vm.runtime.extensionManager)
        const mgr=vm.runtime.extensionManager
        const load = mgr.loadExtensionURL
        console.log(load)
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
                        label: "url or id",
                        type: "input",
                        description: "url o id",
                        inputProps: {
                                placeholder: "https://m.ccw.site/plugins/...",
                                onPressEnter: (e) => {
                                  e.target.blur();
                                },
                                onBlur: (e) => {
                                  load(e.target.value,true);
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
                dispose(){
                        register.dispose()
                }
        }
}
Scratch.plugins.register(update)