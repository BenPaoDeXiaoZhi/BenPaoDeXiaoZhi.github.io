(function (_Scratch) {
    const {ArgumentType, BlockType, TargetType, Cast, translate, extensions, runtime} = _Scratch;

    translate.setup({
        zh: {
            'extensionName': '我的扩展 demo',
            'reporterBlock': '[TEXT]的第[LETTER_NUM] 个字母',
            'myReporter.TEXT_default': 'abcdefg'
        },
        en: {
            'extensionName': 'ext demo',
            'reporterBlock': 'letter [LETTER_NUM] of [TEXT]',
            'myReporter.TEXT_default': 'abcdefg'
        }
    });
    class MyExtension {
        constructor (_runtime) {
            /**
            * Store this for later communication with the Scratch VM runtime.
            * If this extension is running in a sandbox then 'runtime' is an async proxy object.
            * @type {Runtime}
            */
            this._runtime = _runtime;
        }

        /**
         * @return {object} This extension's metadata.
         */
        getInfo () {

            const add_new_costume = {
                opcode:'addNewCostume',
                blockType: BlockType.REPORTER,
                text: '向名为[TARGET_NAME]的角色添加URL为[URL],名为[COSTUME_NAME]的造型并设置旋转中心坐标为x:[CENTER_X],y:[CENTER_Y],并[WAIT],然后[SHOW]',
                arguments:{
                    TARGET_NAME:{
                        type:ArgumentType.STRING,
                        menu: 'select_sprite'
                    },
                    URL:{
                        type:ArgumentType.STRING,
                        defaultValue:'https://files.meng-files.us.kg/chr/momoka/momoka_spr-00.png'
                    },
                    COSTUME_NAME:{
                        type:ArgumentType.STRING,
                        defaultValue:'0721'
                    },
                    CENTER_X:{
                        type:ArgumentType.NUMBER,
                        defaultValue:0
                    },
                    CENTER_Y:{
                        type:ArgumentType.NUMBER,
                        defaultValue:0
                    },
                    WAIT:{
                        type:ArgumentType.NUMBER,
                        menu:'wait'
                    },
                    SHOW:{
                        type:ArgumentType.NUMBER,
                        menu:'show'
                    }
                }
            };
        
            return {
                /* Required: the machine-readable name of this extension.
                   Will be used as the extension's namespace.
                   Allowed characters are those matching the regular expression [w-]: A-Z, a-z, 0-9, and hyphen ("-"). */
                id: 'addImage',
        
                /* Core extensions only: override the default extension block colors. */
                color1: '#FF8C1A',
                color2: '#DB6E00',
        
                /* Optional: the human-readable name of this extension as string.
                   This and any other string to be displayed in the Scratch UI may either be
                   a string or a call to 'translate'; a plain string will not be
                   translated whereas a call to 'translate' will connect the string
                   to the translation map (see below). The 'translate' call is
                   similar to 'translate' from 'react-intl' in form, but will actually
                   call some extension support code to do its magic. For example, we will
                   internally namespace the messages such that two extensions could have
                   messages with the same ID without colliding.
                   See also: https://github.com/yahoo/react-intl/wiki/API#translate */
                name: '将第三方图片作为造型',
        
                /* Optional: URI for a block icon, to display at the edge of each block for this
                   extension. Data URI OK.
                   size  40x40, 1:1 aspect ratio
                */

                // blockIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',
        
                /* Optional: URI for an icon to be displayed in the blocks category menu.
                   If not present, the menu will display the block icon, if one is present.
                   Otherwise, the category menu shows its default filled circle.
                   Data URI OK.
                   size  40x40, 1:1 aspect ratio
                */

                // menuIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',
        
                /* Optional: Link to documentation content for this extension.
                   replace it with your document link */

                // docsURI: 'https://getgandi.com/',
        
                /* Required: the list of blocks implemented by this extension,
                   in the order intended for display. */
                blocks: [add_new_costume],
        
                /* Optional: define extension-specific menus here.*/
                
                menus: {
                    select_sprite: {
                        acceptReporters: true,
                        items: 'selectSprites'
                    },
                    wait: {
                        acceptReporters: true,
                        items: [
                            {text:'等待',value:'1'},
                            {text:'不等待',value:'0'}
                        ]
                    },
                    show: {
                        acceptReporters: true,
                        items: [
                            {text:'显示',value:'1'},
                            {text:'不显示',value:'0'}
                        ]
                    }
                }
            };
        }

        // dynamic menu it generator function
        selectSprites () {
            var menu_data = [{text:'当前角色',value:'__this__'}];
            var runtime_targets = this._runtime.targets;
            for(var chr_idx in runtime_targets){
                if (runtime_targets[chr_idx].isOriginal && !runtime_targets[chr_idx].isStage){
                    var chr_name = runtime_targets[chr_idx].getName();
                    menu_data.push({text: chr_name, value: chr_name});
                }
            }
            return menu_data;
        }
        
        getSpriteFromMenu(sprite_name){
            if (sprite_name == '__this__'){
                return this._runtime.getEditingTarget()
            }else{
                return this._runtime._runtime.getSpriteTargetByName(sprite_name)
            }
        }
        /**
         * 向名为[TARGET_NAME]的角色添加URL为[URL],名为[COSTUME_NAME]的造型并设置旋转中心坐标为x:[CENTER_X],y:[CENTER_Y]
         * @param {object} args -全部参数,TARGET_NAME,URL,COSTUME_NAME,CENTER_X,CENTER_Y
         */
        async addNewCostume(args){
            var {TARGET_NAME='',URL='',COSTUME_NAME='',CENTER_X=0,CENTER_Y=0,WAIT=1,SHOW=1} = args;
            var img_url = URL, target=this.getSpriteFromMenu(TARGET_NAME);
            const res = await fetch(URL,{method:'GET'});
            const res_mime = res.headers.get('content-type');
            if (!(this._typeIsBitmap(res_mime) || res_mime === 'image/svg+xml')){
                console.log(res);
                console.error(`不支持的MIME格式${res_mime}`);
                return -1;
            };
            const data_array = new Uint8Array(await res.arrayBuffer());
            const assetType = this._typeIsBitmap(res_mime) ? this._runtime.storage.AssetType.ImageBitmap : this._runtime.storage.AssetType.ImageVector;
            const dataType = (res_mime === "image/svg+xml" ? runtime.storage.DataFormat.SVG : runtime.storage.DataFormat.PNG);
            const asset = runtime.storage.createAsset(
                assetType,
                dataType,
                new Uint8Array(data_array),
                null,
                true
            );
            const md5ext = `${asset.assetId}.${asset.dataFormat}`;
            var costume = {
                'name':COSTUME_NAME,
                'dataFormat': asset.dataType,
                'asset':asset,
                'md5':md5ext,
                'assetId':asset.assetId,
                'isRuntimeAsyncLoad': true,
                'rotationCenterX':CENTER_X,
                'rotationCenterY':CENTER_Y,
                bitmapResolution: asset.dataFormat === 'svg' ? 1 : 2,
            }
            const allCostumes = target.getCostumes();
            if (allCostumes.findIndex((element) => element.assetId === asset.assetId && element.name === COSTUME_NAME) != -1){
                console.log(`相同造型已存在,md5:${md5ext}`)
                if (SHOW == 1){
                    const allCostumes = target.getCostumes();
                    let costumeIndex = allCostumes.findIndex((element) => element.assetId === asset.assetId && element.name === COSTUME_NAME);
                    target.setCostume(costumeIndex);
                }
                return 1;
            }
            if (WAIT == 1){
                await this._runtime.addAsyncCostumeToTarget(md5ext,costume,target,false)
                if (SHOW == 1){
                    const allCostumes = target.getCostumes();
                    let costumeIndex = allCostumes.findIndex((element) => element.assetId === asset.assetId && element.name === COSTUME_NAME);
                    target.setCostume(costumeIndex);
                }
            }
            else {
                const pro = this._runtime.addAsyncCostumeToTarget(md5ext,costume,target,false);
                if (SHOW == 1){
                    const allCostumes = target.getCostumes();
                    let costumeIndex = allCostumes.findIndex((element) => element.assetId === asset.assetId && element.name === COSTUME_NAME);
                    pro.then(()=>(function(){
                        target.setCostume(costumeIndex);
                    }))
                }
            }
            console.log(target,res,data_array,img_url,asset,COSTUME_NAME,CENTER_X,CENTER_Y,SHOW);
            return 0;
        }
        _typeIsBitmap(type) {
            return (
                type === "image/png" ||
                type === "image/bmp" ||
                type === "image/jpg" ||
                type === "image/jpeg" ||
                type === "image/jfif" ||
                type === "image/webp" ||
                type === "image/gif"
            );
        }
    }

    extensions.register(new MyExtension(runtime));

}(Scratch));

