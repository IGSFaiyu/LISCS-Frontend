import { IDomEditor, IDropPanelMenu } from '@wangeditor/editor'

export class MyDropPanelMenu implements IDropPanelMenu {    // TS 语法
    // class MyDropPanelMenu {                           // JS 语法
    dropList: Array<string>;
    constructor(title: string, dropList: Array<string>) {
        this.title = title
        this.dropList = dropList
        // this.iconSvg = '<svg >...</svg>'
        this.tag = 'button'
        this.showDropPanel = true
    }

    // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
    isActive(editor: IDomEditor): boolean {    // TS 语法
        // isActive(editor) {                      // JS 语法
        return false
    }

    // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
    getValue(editor: IDomEditor): string | boolean {    // TS 语法
        // getValue(editor) {                               // JS 语法
        return ''
    }

    // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
    isDisabled(editor: IDomEditor): boolean {   // TS 语法
        // isDisabled(editor) {                     // JS 语法
        return false
    }

    // 点击菜单时触发的函数
    exec(editor: IDomEditor, value: string | boolean) {   // TS 语法
        // exec(editor, value) {                              // JS 语法
        // DropPanel menu ，这个函数不用写，空着即可
    }

    // 定义 DropPanel 内部的 DOM Element
    getPanelContentElem(editor: IDomEditor): DOMElement {   // TS 语法
        // getPanelContentElem(editor) {                        // JS 语法

        // const $list = $`<ul>
        //     <li>北京</li> <li>上海</li> <li>深圳</li>
        //   </ul>`

        // $list.on('click', 'li', function () {
        //     editor.insertText(this.innerHTML)
        //     editor.insertText(' ')
        // })

        // return $list[0] // 返回 DOM Element 类型

        // 动态创建一个 <ul> 列表
        const ul = document.createElement('ul')
        this.dropList.forEach(item => {
            const li = document.createElement('li')
            li.textContent = item
            li.onclick = () => handleClick(item)
            ul.appendChild(li)
        })
        const handleClick = (item: string) => {
            console.log(`Inserting text: ${item}`)
            editor.insertText("{" + item + "}")
            editor.insertText(' ')
        }
        return ul;
    }
}
