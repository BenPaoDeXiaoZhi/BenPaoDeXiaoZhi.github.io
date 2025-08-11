const update = ({ vm, registerSettings}) => {
        console.log(vm.runtime.extensionManager)
        const mgr=vm.runtime.extensionManager
        const load = mgr.loadExtensionURL
        const register = registerSettings("更新特定扩展",
        "plugin-upadte-extension",
        [
            {
                key: "plugin-upadte-extension",
                label: "更新特定扩展",
                description: "输入id或url，更新扩展",
                items: [],
            },
        ],
        "",)
        return {
                dispose(){
                        register.dispose()
                }
        }
}
Scratch.plugins.register(update)