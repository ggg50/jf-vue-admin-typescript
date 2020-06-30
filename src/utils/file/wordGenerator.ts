
// 生成 word bolb 或者下载

import { saveAs } from 'file-saver'
import { Document, Packer, Paragraph } from 'docx'

export const testText = `::: hljs-center

X X 仲 裁 委 员 会
裁 决 书

:::


::: hljs-right

<font color=#fc0303>{受案号}</font>

:::

被申请人（反请求申请人）: 4444
身份证号码: 33
送达地址: 333
送达手机: 33
送达邮箱: 33


××仲裁委员会（以下简称本委）根据申请人<font color=#fc0303>{申请人姓名}</font>（以下简称××）与被申请人<font color=#fc0303>{被申请人姓名}</font>（以下简称××）于<font color=#fc0303>{合同签订时间}</font>签订的“<font color=#fc0303>{合同名称}</font>”中的仲裁条款（或仲裁协议）和申请人的仲裁申请，于<font color=#fc0303>{受理日期}</font>受理了申请人关于<font color=#fc0303>{合同名称}</font><font color=#fc0303>{案由}</font>的仲裁申请。
根据《××仲裁委员会仲裁规则》（以下简称《仲裁规则》）第××条、第××条的规定，本委向被申请人送达了仲裁通知书、仲裁申请书副本、《仲裁规则》、仲裁员名册等材料。被申请人于××年××月××日向本委提交了（或未提交）书面答辩。本委于××年××月××日向申请人送达了答辩书副本。

被申请人于<font color=#fc0303>{申请日期}</font>提出反请求，本委于<font color=#fc0303>{送达日期}</font>向申请人送达反请求申请书副本，申请人<font color=#fc0303>{答辩文本}</font>书面答辩。根据《仲裁规则》第××条的规定，本委对申请人的仲裁请求与被申请人的反请求予以合并审理裁决。
<font color=#fc0303>{申请日期}</font>被申请人向本委（或人民法院）提交仲裁协议效力异议。根据《仲裁规则》第××条的规定，本案仲裁程序中止。本委（或人民法院）于××年××月××日作出﹝××﹞×仲裁字第××号决定书或﹝××﹞××号民事裁定书，驳回被申请人的仲裁协议效力异议，本案仲裁程序于<font color=#fc0303>{恢复日期}</font>起恢复。（如出现其他仲裁程序中止、中断情形的，应写明中止、中断事由，及起止时间）。
（案件适用程序）根据《仲裁规则》第××条的规定，本案适用在线书面审理。
根据本委《仲裁规则》第××条，本委主任指定×××组成独任仲裁庭对本案进行审理，仲裁庭于××年××月××日成立。
本委按照《仲裁规则》的规定向双方当事人送达了仲裁庭组成及开庭通知书。
<font color=#fc0303>{申请日期}</font>，原仲裁员<font color=#fc0303>{申请人姓名}</font>向本委申请回避（或<font color=#fc0303>{申请日期}</font>，申请人/被申请人向本委提出要求<font color=#fc0303>{仲裁员姓名}</font>仲裁员回避的申请），本委主任经审查，认为该申请符合《仲裁法》第三十四条、《仲裁规则》第××条的规定，于××年××月××日作出﹝××﹞×仲裁字第××号决定书，同意×××仲裁员回避。根据《仲裁规则》第××条的规定，本委主任重新指定×××为仲裁员，并于××年××月××日重新组成本案仲裁庭。本委按照《仲裁规则》的规定向双方当事人送达了仲裁庭组成及开庭通知书。
申请人/被申请人于<font color=#fc0303>{申请日期}</font>向本委提出财产/证据保全申请。根据《仲裁法》第二十八条或第四十六条的规定，本委于××年××月××日向×××人民法院提交了财产/证据保全申请。人民法院于××年××月××日作出×××号民事裁定书，裁定如下：
（只有当此保全程序已经全部走完且法院已经作出了裁定书的情况下才写这个程序，否则不用写。）
仲裁庭于<font color=#fc0303>{开庭日期}</font>在网络仲裁平台在线书面审理本案。
根据《仲裁规则》第××条的规定，由于本案和﹝××﹞×仲裁字第×××号等××个案件的被申请人相同，且案件标的为同一种类（或者有关联），经双方当事人同意，仲裁庭对该批案进行合并审理，分案裁决。
经申请人（或被申请人）申请（或经仲裁庭合议），仲裁庭认为需要对本案所涉的×××事项/问题进行专门性鉴定。×××事务所于××年××月××日接受本委委托，就上述事项进行鉴定，并于××年××月××日作出终审鉴定报告，该鉴定报告已于××年××月××日送交双方当事人。
由于本案案情复杂（或者其他原因），仲裁庭未能在《仲裁规则》规定期限内结案，根据《仲裁规则》第××条的规定，仲裁庭向本委主任提出延期审理申请。本委主任经审查，批准本案审理期延长至<font color=#fc0303>{延期日期}</font>。
根据《仲裁法》第五十五条的规定，本案关于×××的事实已经清楚，仲裁庭决定就该部分先行裁决。
本案争议部分事实已经清楚，依照《仲裁法》第五十五条规定，本仲裁庭于××年××月××日以（××）×仲裁字第×××号裁决书对本案×××事项作出先行裁决（写明裁决主文）。

本案现已终结审理。
申请人称：
undefined
申请人提出如下仲裁请求：
undefined
被申请人答辩称：

$反请求详细$

当事人围绕仲裁请求依法提交了证据，本委组织当事人进行了证据交换和质证。对当事人无异议的证据，本委予以确认并在卷佐证。对有争议的证据和事实，本委认定如下： 

（写明仲裁委是否采信证据，事实认定的意见和理由）

根据申请人的陈述和被申请人的答辩，本案争议焦点归纳为：

一、……；二、……；三、……。

经仲裁庭审理查明，

（这部分内容为：仲裁庭对案件事实的认定，以事实的发生顺序为主线，以对事实的客观描述为主，写作上采用叙述的方式。）

本委认为，（这部分内容为：仲裁庭基于对事实的认定，根据合同的约定或运用法律和法理，阐明对仲裁请求或反请求的事项支持与否的意见。）

综上所述，根据《中华人民共和国×××法》第××条第××款的规定，仲裁庭裁决如下：

（申请人胜诉的）
一、被申请人向申请人支付人民币××,×××元；
二、被申请人……；
×、本案仲裁费人民币××,×××元，由被申请人承担
（由申请人承担××,×××元、被申请人承担××,×××元）；申请人预交的仲裁费本委不再退回，被申请人径付申请人××,×××元。

（申请人败诉的）
一、驳回申请人的仲裁请求；
二、本案仲裁费××,×××元，由申请人承担。

（申请人部分胜诉、部分败诉的）
一、被申请人向申请人支付人民币××,×××元；
二、驳回申请人的（第×、×、×项）仲裁请求。
×、本案仲裁费人民币××,×××元，由申请人承担××,×××元，被申请人承担××,×××元；申请人预交的仲裁费本委不再退回，被申请人径付申请人××,×××元。

（当事人提出仲裁请求和反请求的）
一、仲裁本请求中乙向甲……；
二、仲裁反请求中甲向乙……；
×、本案仲裁费人民币××,×××元，其中本请求仲裁×××费元，由甲承担××,×××元、乙承担××,×××元；反请求仲裁费×××元，由甲承担××,×××元、乙承担××,×××元；乙径付甲××,×××元，甲、乙预交的仲裁费本委不再退回。
被申请人××于本裁决作出之日起日××内履行上述裁决所定义务。本裁决为终局裁决，自作出之日起发生法律效力。


::: hljs-right

仲裁员: 5e4a7f042280ff1d7c7bce4c

2020年 20月 29日

仲裁秘书: {秘书姓名}

:::
   
               `

/* 模板处理思路
匹配到一块处理一块，处理成 Paragraph 实例数组，加到 doc 对象的 children 中
四个匹配都不通过了，说明结束了

Paragraph options:
indent: {firstLine: 360}, //行首缩进 …… 数字好大 ……
alignment: 'center', //居中
alignment: 'end', //右对齐

# base usage
let doc = new DocxGenerator()

doc.asyncCreateWordBlobFromText(text)
.then(blob => {})

doc.asyncCreateWordBlobFromTextAndDownload(text)

*/

type Key = 'left' | 'right' | 'center' | 'common'
type RegsObject = {
  [prop in Key]: RegExp
}
type OptionsObject = {
  [prop in Key]: any
}

export class DocxGenerator {
  private paragraphList: Paragraph[]
  private doc: Document
  private keys: Key[]
  private options: OptionsObject
  private reg: RegsObject

  constructor() {
    this.paragraphList = []
    this.doc = new Document()

    this.keys = ['left', 'right', 'center', 'common'] // 这个主要是给 options / reg 访问的时候，key 做个排序

    this.options = {
      left: {
        alignment: 'left',
      },
      center: {
        alignment: 'center',
      },
      right: {
        alignment: 'right',
      },
      common: {
        indent: { firstLine: 360 },
      }
    }

    this.reg = {
      left: /::: ?hljs-left\n((.*\n)*?):::/,
      center: /::: ?hljs-center\n((.*\n)*?):::/,
      right: /::: ?hljs-right\n((.*\n)*?):::/,
      common: /(^.*$\n?)/m, // 匹配不是以上格式（没有 ::: 开头）的
    }
  }

  asyncCreateWordBlobFromText(text: string) {
    this.resetDocAndParagraph()
    setTimeout(() => {
      let regName = this.getFirstMatchKey(text)
      while (text && regName) {
        text = this.handleAndRemoveMatched(text, regName)
        regName = this.getFirstMatchKey(text)
      }
      this.addParagraphToDoc()
      return Packer.toBlob(this.doc)
    })
  }

  asyncCreateWordBlobFromTextAndDownload(text: string, title: string) {
    this.resetDocAndParagraph()
    let regName = this.getFirstMatchKey(text)
    setTimeout(() => {
      while (text && regName) {
        text = this.handleAndRemoveMatched(text, regName)
        regName = this.getFirstMatchKey(text)
      }
      this.createdWordAndDownload(title)
    })
  }

  private createdWordAndDownload(title: string) {
    this.addParagraphToDoc()
    this.downloadWord(title)
  }

  private downloadWord(title: string) {
    Packer.toBlob(this.doc).then(blob => {
      saveAs(blob, title ? `${title}.docx` : 'example.docx')
    })
  }

  private addParagraphToDoc() {
    this.doc.addSection({
      children: this.paragraphList
    })
  }

  private handleAndRemoveMatched(text: string, regName: Key): string {
    return text.replace(this.reg[regName], (_, match) => {
      console.log(regName)
      console.log(match)
      this.createInstanceAndAddToParagraphList(match, this.options[regName])
      return ''
    })
  }

  // 合并下面两个，处理文本，把生成的实例加到 ParagraphList 中
  private createInstanceAndAddToParagraphList(matchedText: string, option: any) {
    this.mixParagraphInstance(this.createWordInstanceFromText(matchedText, option))
  }

  // 用匹配的文本和 对应的 option 生成各种 doc children 实例
  private createWordInstanceFromText(matchedText: string, option: any): Paragraph[] {
    return matchedText
      .split('\n')
      .filter(item => item)
      .map(item => {
        return new Paragraph({
          text: item,
          ...option,
        })
      })
  }

  // 把实例放到 doc 中
  private mixParagraphInstance(newList: Paragraph[]) {
    this.paragraphList.push(...newList)
  }

  // 获取第一个匹配的正则，返回 keyName，也可以用来判断是否有符合的正则
  private getFirstMatchKey(text: string): Key | '' {
    for (const key of this.keys) {
      if (this.reg[key].test(text) && this.reg[key].exec(text) && this.reg[key].exec(text)?.index === 0) {
        return key
      }
    }
    return '' // 全部匹配不通过，返回 ''
  }

  private resetDocAndParagraph() {
    this.paragraphList = []
    this.doc = new Document()
  }
}
