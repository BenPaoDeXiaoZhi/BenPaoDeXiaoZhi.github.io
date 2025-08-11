const update = ({ vm, registerSettings}) => {
	console.log(vm.runtime)
	const register = registerSettings("更新特定扩展",
        "plugin-upadte-extension",
        [
            {
                key: "plugin-upadte-extension",
                label: "更新特定扩展",
                description: "点击右工作区右边最下面的图标，输入扩展id以更新",
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