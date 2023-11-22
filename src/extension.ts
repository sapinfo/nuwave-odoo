// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "nuwave-odoo" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	let disposable = vscode.commands.registerCommand('nuwave-odoo.helloWorld', () => {
// 		// The code you place here will be executed every time your command is executed
// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('Hello World from nuwave_odoo!');
// 	});

// 	context.subscriptions.push(disposable);
// }

// // This method is called when your extension is deactivated
// export function deactivate() {}
// test

import * as vscode from "vscode";

import * as fs from "fs";
import * as path from "path";
import * as moment from "moment";

//https://velog.io/@93minki/VSCode-Extension-만들기
//https://www.odoo.com/documentation/16.0/contributing/development/coding_guidelines.html

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "createModule",
    async (uri) => {
      try {
        const fp = uri.fsPath;
        const moduleName = await vscode.window.showInputBox({
          placeHolder: "Enter new odoo module name",
          validateInput: (value: string) => {
            if (!value) {
              return "module Name Can't be Empty!";
            }
            return undefined;
          },
        });

        if (moduleName) {
          const folderPath =
            vscode.workspace.workspaceFolders?.[0].uri.fsPath || "";
          const modulePath = path.join(fp, moduleName);

          console.log(folderPath);
          console.log(modulePath);

          if (fs.existsSync(modulePath)) {
            fs.rmSync(modulePath, { recursive: true });
          }

          if (!fs.existsSync(modulePath)) {
            //if (1 === 1) {
            fs.mkdirSync(modulePath);

            //model data
            const medelSchemePath = path.join(folderPath, `data/model.json`);
            console.log(medelSchemePath);

            const modelScheme = fs.readFileSync(medelSchemePath, "utf-8");
            const modelSchemeJson = JSON.parse(modelScheme);
            console.log(modelSchemeJson.length);
            modelSchemeJson.forEach(function (model: any) {
              console.log(model.name);
            });

            //app icon file
            iconFile(modulePath);

            //main file
            rootIniFile(modulePath);

            manifestFile(moduleName, modulePath);

            //controller
            fs.mkdirSync(path.join(modulePath, "controllers"));
            controllerIniFile(moduleName, modulePath);

            controllerFile(moduleName, modulePath);

            //demo
            fs.mkdirSync(path.join(modulePath, "data"));
            demoFile(moduleName, modulePath, modelSchemeJson);
            sequenceFile(moduleName, modulePath, modelSchemeJson);

            //models
            fs.mkdirSync(path.join(modulePath, "models"));
            modelInitFile(moduleName, modulePath);

            modelFile(moduleName, modulePath, modelSchemeJson);

            //security
            fs.mkdirSync(path.join(modulePath, "security"));
            securityFile(moduleName, modulePath);

            //views
            fs.mkdirSync(path.join(modulePath, "views"));

            viewFile(moduleName, modulePath, modelSchemeJson);

            viewTemplateFile(moduleName, modulePath);

            //menus
            menuFile(moduleName, modulePath);

            //static
            fs.mkdirSync(path.join(modulePath, "static"));
            fs.mkdirSync(path.join(modulePath, "static", "img"));
            fs.mkdirSync(path.join(modulePath, "static", "lib"));
            fs.mkdirSync(path.join(modulePath, "static", "src"));
            fs.mkdirSync(path.join(modulePath, "static", "src", "js"));
            fs.mkdirSync(path.join(modulePath, "static", "src", "scss"));
            fs.mkdirSync(path.join(modulePath, "static", "src", "xml"));

            fs.mkdirSync(path.join(modulePath, "wizard"));
            fs.mkdirSync(path.join(modulePath, "report"));
            fs.mkdirSync(path.join(modulePath, "test"));

            //vscode.window.showInformationMessage(config);

            //fs.writeFileSync(rootIniPath, "mainTemplate(moduleName)");
            //fs.writeFileSync(storybookPath, "storybookTemplate(moduleName)");
            //fs.writeFileSync(styledPath, "styleTemplate(moduleName)");

            vscode.window.showInformationMessage(`model Created!`);
          } else {
            vscode.window.showInformationMessage(`model already Exist`);
          }
        }
        //vscode.window.showInformationMessage("Hello VsCode Extension!");
      } catch (error) {
        console.log(error);
      }
    }
  );

  context.subscriptions.push(disposable);
}

function viewFile(
  moduleName: string,
  modulePath: string,
  modelSchemeJson: any
) {
  const viewsIniViewsPath = path.join(
    modulePath,
    "views",
    `${moduleName}_views.xml`
  );
  const capital = capitalizeFirstLetter(moduleName);

  var content = `
<odoo>
  <data>
    <!-- 칼럼에 상태값이 따라 보이고/안보이고 필수/옵션 지정하려면  invisible="state in ['confirmed']"
          required="state in ['draft']" -->
    <!- 트리뷰에서 합계 보여주기 sum="Total" 이거 추가해라-->

    <!-- ${moduleName} form view -->
    <record id="${moduleName}_view_form" model="ir.ui.view">
      <field name="name">${moduleName}.view.form</field>
      <field name="model">${moduleName}.${moduleName}</field>
      <field name="arch" type="xml">
        <form string="">
          <!--sheet는
          div full width 와 같다.-->
          <header>
            <!--확정버튼-->
            <button name="action_confirm" type="object" string="Confirm"
              invisible="state not in ['draft']"
              class="oe_highlight" />

            <!--취소버튼-->
            <button name="action_cancel" type="object" string="Cancel"
            invisible="state not in ['confirmed']"
            class="oe_highlight" />

            <!--상태바-->
            <field name="state" widget="statusbar"
              statusbar_visible="draft,open, confirmed, canceled" />          

            <div class="oe_button_box" name="botton_box">
              <!--화면열기 버튼-->
              <button name="open_sales_order" type="object"
                class="oe_stat_button" icon="fa-archive">
                <field name="sales_order_count" string="Sales order" widget="statinfo" />
              </button>

              <!--액션 버튼-->
              <button name="%(rma_sales_order_action)d" type="action"
                class="oe_stat_button" icon="fa-archive">
                <field name="sales_order_count" string="Sales order by action" widget="statinfo" />
              </button>

              <!--아카이브 버튼-->
              <button name="toggle_active" type="object" string="Restore" icon="fa-archive"
              class="oe_stat_button">
              <field name="active" widget="boolean_button" />
            </button>              

            </div>
          </header>          
          <sheet>
            <div>
                <h1>
                  <field name="${moduleName}_number" readonly="1" />
                </h1>
            </div>

            <!--group도
            div full width 와 같은데 하나의 sheet 속에 두개 그룹으로 나눌경우 아래와 같이 해주면 좌/우 양쪽으로 정렬이 잘된다.-->
            <group>
              <group>
                <!-- Add your fields here -->
                <!-- <field name="name" /> -->
              </group>
              <group>`;

  modelSchemeJson.forEach(function (model: any) {
    content =
      content +
      `
                        <field name="${model.name}" />`;
  });

  content =
    content +
    `</group>
            </group>

          </sheet>
          <sheet>
            <group>
              <!-- Add your fields here -->
              <!-- <field name="note" /> -->

            </group>

            <!-- one2many 필드 정의하기 -->
            <notebook>
              <page string="Lines">
                <field name="rma_line_ids">
                  <tree> <!--editable="bottom"-->
                    <field name="product_id" />
                    <field name="qty" />
                    <field name="rma_id" invisible="1" />
                  </tree>
                  <form>
                    <group>
                      <field name="product_id" />
                    </group>
                    <group>
                      <field name="qty" />
                      <field name="rma_id" invisible="1" />
                    </group>
                  </form>
                </field>
              </page>
              <page string="Etc">

              </page>

            </notebook>            

          </sheet>
          <div class="oe_chatter">
            <field name="message_follower_ids" widget="mail_followers" />
            <field name="activity_ids" widget="mail_activity" />
            <field name="message_ids" widget="mail_thread" />
          </div>
        </form>
      </field>
    </record>

    <!-- ${moduleName}.${moduleName} tree view -->
    <record id="${moduleName}.${moduleName}_view_tree" model="ir.ui.view">
    <field name="name">${moduleName}.${moduleName}.view.tree</field>
    <field name="model">${moduleName}.${moduleName}</field>
    <field name="arch" type="xml">
        <!-- ${moduleName}_number 칼럼추가할것 -->
        <tree>`;

  modelSchemeJson.forEach(function (model: any) {
    content =
      content +
      `
            <field name="${model.name}" />`;
  });

  content =
    content +
    `          
        </tree>
      </field>
    </record>

    <!-- ${moduleName} search view -->
    <record id="rma_view_search" model="ir.ui.view">
      <field name="name">${moduleName}.view.search</field>
      <field name="model">${moduleName}.${moduleName}</field>
      <field name="arch" type="xml">
        <search string="Search Description">
        <!-- 기본검색를 추가해라 -->
        <!-- domain이라는거는 where 조건을 풀어쓰는것이다. 칼럼,조건,값 이런식으로 , 껄쇠괄호안에 둥근괄호로 묶는다. -->
          <field name="name"
            filter_domain="['|', ('name', 'ilike', self), ('${moduleName}_number','ilike',self)]" />
          <field name="${moduleName}_number" filter_domain="[('${moduleName}_number','ilike',self)]" />
          <field name="name" filter_domain="[('name','ilike',self)]" />
          <!-- <seperator /> -->
          <!-- 기본필터를 추가해라 -->
          <!-- <filter string="Test data" name="Test" domain="[('name','ilike','test')]" /> -->
          <!-- <filter string="Total > 10" name="Total" domain="[('total','>=',10)]" /> -->
          <!-- <filter string="Mail" name="male" domain="[('gender','=','male')]" /> -->
          <!-- <filter string="Female" name="female" domain="[('gender','=','female')]" /> -->
          <!-- 기본그룹핑을 추가해라 -->
          <!-- <group expand="0" string="Group by ">
            <filter string="Gender" name="gender" context="{'group_by': 'gender'}"
            />
          </group> -->


        </search>
      </field>
    </record>


    
    <!-- ${moduleName} action window -->
    <record id="${moduleName}_action" model="ir.actions.act_window">
     <field name="name">${capital}</field>
     <field name="type">ir.actions.act_window</field>
     <field name="res_model">${moduleName}.${moduleName}</field>
     <field name="view_mode">tree,form</field>
     <!-- <field name="view_type">form</field> -->
     <!-- <field name="domain">[]</field> -->
     <!-- 이 프로그램시작시 디폴트 필터를 주려면 search_default_에 filter명을 추가해서 아래처럼 1로 세팅해라.  -->
     <!-- <field name="context">{"search_default_male":1}</field> -->
     <!-- <field name="target">{current}</field> -->
     <field name="help" type="html">
     <p class="oe_view_nocontent_create">
         <!-- Add Text Here -->
     </p><p>
         <!-- More details about what a user can do with this object will be OK --> 
     
     </p>
 </field>     
      
    </record>
     
    <!-- This Menu Item must have a parent and an action -->
    <menuitem id="${moduleName}_menu_act" name="${capital}" parent="${moduleName}_menu_categ1" action="${moduleName}_action" sequence="10"/>


  </data>
</odoo>


  `;

  fs.writeFileSync(viewsIniViewsPath, content);
}

function viewTemplateFile(moduleName: string, modulePath: string) {
  const viewsTemplatePath = path.join(
    modulePath,
    "views",
    `${moduleName}_templates.xml`
  );
  var content = `
<odoo>
  <data>
    <template id="listing">
      <ul>
        <li t-foreach="objects" t-as="object">
          <a t-attf-href="#{ root }/objects/#{ object.id }">
            <t t-esc="object.display_name" />
          </a>
        </li>
      </ul>
    </template>
    <template id="object">
      <h1><t t-esc="object.display_name" /></h1>
      <dl>
        <t t-foreach="object._fields" t-as="field">
          <dt><t t-esc="field" /></dt>
          <dd><t t-esc="object[field]" /></dd>
        </t>
      </dl>
    </template>
  </data>
</odoo>

  `;
  fs.writeFileSync(viewsTemplatePath, content);
}

function menuFile(moduleName: string, modulePath: string) {
  const menuPath = path.join(modulePath, "views", `${moduleName}_menus.xml`);
  const capital = capitalizeFirstLetter(moduleName);
  var content = `
<odoo>
  <data>
    
    <!-- This Menu Item will appear in the Upper bar, that's why It needs NO parent or action -->
    <menuitem id="${moduleName}_menu_root" name="${capital}" sequence="0" web_icon="${moduleName},static/description/icon.png"/>

    <!-- This Menu Item Must have a parent -->
    <menuitem id="${moduleName}_menu_categ1" name="${capital}_menu1" parent="${moduleName}_menu_root" sequence="10"/>

    <!-- This Menu Item Must have a parent -->
    <menuitem id="${moduleName}menu_categ2" name="${capital}_menu2" parent="${moduleName}_menu_root" sequence="20"/>

    
  </data>
</odoo>



  `;

  fs.writeFileSync(menuPath, content);
}

function securityFile(moduleName: string, modulePath: string) {
  const securityPath = path.join(modulePath, "security", "ir.model.access.csv");
  var content = `id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink
access_${moduleName}_${moduleName},${moduleName}.${moduleName},model_${moduleName}_${moduleName},base.group_user,1,1,1,1
${moduleName}.access_${moduleName}_line,access_${moduleName}_line,${moduleName}.model_${moduleName}_line,base.group_user,1,1,1,1
${moduleName}.access_${moduleName}_${moduleName}_user,access_${moduleName}_${moduleName}_user,${moduleName}.model_${moduleName}_${moduleName},${moduleName}.group_${moduleName}_user,1,1,1,1
${moduleName}.access_${moduleName}_line_user,access_${moduleName}_line_user,${moduleName}.model_${moduleName}_line,${moduleName}.group_${moduleName}_user,1,1,1,1
${moduleName}.access_${moduleName}_${moduleName}_admin,access_${moduleName}_${moduleName}_admin,${moduleName}.model_${moduleName}_${moduleName},${moduleName}.group_${moduleName}_manager,1,1,1,1
${moduleName}.access_${moduleName}_line_admin,access_${moduleName}_line_admin,${moduleName}.model_${moduleName}_line,${moduleName}.group_${moduleName}_manager,1,1,1,1



`;

  fs.writeFileSync(securityPath, content);

  //Groups

  const securityGroupPath = path.join(
    modulePath,
    "security",
    `${moduleName}_groups.xml`
  );

  content = "";
  fs.writeFileSync(securityGroupPath, content);

  //Record rules
  const securityRecordRulePath = path.join(
    modulePath,
    "security",
    `${moduleName}_security.xml`
  );
  const capital = capitalizeFirstLetter(moduleName);

  content = `<?xml version='1.0' encoding='utf-8'?>
<odoo>
    <!-- Category 정의  -->
    <record id="model_category_${moduleName}" model="ir.module.category">
        <field name="name">${capital} management</field>
        <field name="description">Category for ${capital}</field>
        <field name="sequence">1</field>
    </record>


    <!-- 일반유저 그룹 -->
    <!-- Setting > User > ${capital}  mangent 에서 유저로 지정해라.  -->
    <!-- category_id 를 지정하지 않으면 글로벌레벨에서 만들어진다.  -->
    <record id="group_${moduleName}_user" model="res.groups">
        <field name="name">${capital} user</field>
        <field name="category_id" ref="model_category_${moduleName}"></field>
    </record>

    <!-- 매니저 그룹  -->
    <!-- Setting > User > ${capital}  mangent 에서 매니저로 지정해라.  -->
    <record id="group_${moduleName}_manager" model="res.groups">
        <field name="name">${capital} Manager</field>
        <field name="category_id" ref="model_category_${moduleName}"></field>
        <!-- implied 의미 , 정의된 그룹을 상속한다는 의미  -->
        <field name="implied_ids" eval="[(4, ref('group_${moduleName}_user'))]"></field>
    </record>

    <!-- 일반유저 룰  -->
    <record id="${moduleName}_user_record_rule" model="ir.rule">
        <field name="name">See only my data</field>
        <field name="model_id" ref="model_${moduleName}_${moduleName}"></field>
        <field name="domain_force">[('gender','=','male')]</field>
        <!-- <field name="domain_force">[('create_uid','=','user.id')]</field> -->
        <field name="groups" eval="[(4, ref('group_${moduleName}_user'))]"></field>
    </record>

    <!-- 매니저 룰  -->
    <record id="${moduleName}_manager_record_rule" model="ir.rule">
        <field name="name">See all data</field>
        <field name="model_id" ref="model_${moduleName}_${moduleName}"></field>
        <field name="domain_force">[]</field>
        <field name="groups" eval="[(4, ref('group_${moduleName}_manager'))]"></field>
    </record>

</odoo>
  `;
  fs.writeFileSync(securityRecordRulePath, content);
}

function modelFile(
  moduleName: string,
  modulePath: string,
  modelSchemeJson: any
) {
  const modelInimodulePath = path.join(
    modulePath,
    "models",
    `${moduleName}_models.py`
  );

  const capital = capitalizeFirstLetter(moduleName);

  var content = `
# -*- coding: utf-8 -*-

from odoo import _, api, fields, models
from odoo.exceptions import ValidationError

class ${capital}(models.Model):
    _name = '${moduleName}.${moduleName}'
    _inherit = ['mail.thread', 'mail.activity.mixin'] #채터섹션을 위해 mail 관련 종속추가
    _description = 'This is a ${moduleName}.${moduleName}.' 
    _order = 'id desc' # 리스트 뷰에서 데이터 순서, 최신순으로 정렬
    #
    #
    rec_name = 'name' # 다른곳에서 참조시 콤보박스에 보여질 값, 이름만 또는 코드+이름 이런식으로, field명을 써라. 

    # 번호채번필드는 ${moduleName}_number 는 default=lambda self:_("New") 값을 반드시 주기바란다.
    #
    # 필드 옵션들: tracking=True,required=True,copy=True,index=False,default=lambda self:_("New"), related="partner_id.email"
    #
    # 번호채번필드는 ${moduleName}_number = fields.Char("${capital} number", default=lambda self: _("New"))
    #
    # compute 필드는 compute="set_age_group", store=True, readonly=True 이런식으로 함수명을 추가하고 함수를 구현해준다.
    # 
    # track_visibility="always" track_visibility="onchange" 이거 Tracking 하고 똑같은거 같은데..

    `;

  modelSchemeJson.forEach(function (model: any) {
    var value = "";
    const moment = require("moment");

    let now = moment().format("L");

    if (model.type === "char") {
      value = "Char";
    } else if (model.type === "int") {
      value = "Integer";
    } else if (model.type === "numeric") {
      value = "Float";
    } else if (model.type === "date") {
      value = "Datetime";
    } else if (model.type === "text") {
      value = "Text";
    } else if (model.type === "selection") {
      value = "Selection";
    } else {
      value = "Char";
    }

    if (model.type === "selection") {
      content =
        content +
        `
    ${
      model.name
    }=fields.${value}([('db_value1','string1'), ('db_value2','string2')], default='db_value1',  string='${capitalizeFirstLetter(
          model.name
        )}', tracking=True)`;
    } else {
      content =
        content +
        `
    ${model.name}=fields.${value}("${capitalizeFirstLetter(
          model.name
        )}", tracking=True)`;
    }
  });

  content =
    content +
    `
    #
    # 디폴트값지정하기, 함수를 뒤에선언하면 못찾는다고 에러난다.
    #
    def _get_default_note(self):
      return 'write note here.'
    note = fields.Text('Note', default=_get_default_note)
    #
    #
    # Many2one에 연결된 속성정보 자동으로 가져오기
    # 아래는 연결된 파트너의 이멜을 자동으로 가져온다.
    # 그리고 필드를 뷰에 추가해준다.
    #
    partner_id = fields.Many2one(
      "res.partner", string="Customer", required=True)
    email = fields.Char("Email", related="partner_id.email")

    #계산된 필드 , 판매오더 갯수 가져오기
    #
    def get_sales_order_count(self):
        for record in self:
            count = record.env["sale.order"].search_count(
                [('partner_id', '=', record.id)])
            record.sales_order_count = count

    sales_order_count = fields.Integer(
        "Sales order connt", compute=get_sales_order_count)    

    #제약사항 걸기
    #
    @api.constrains('age')
    def check_age(self):
        for rec in self:
            if rec.age <= 5:
                raise ValidationError("The age must be greater then 18")

  
    #종속 걸기
    #
    @api.depends('age')
    def set_age_group(self):
        for record in self:
            if record.age:
                if record.age < 18:
                    record.age_group = "minor"
                else:
                    record.age_group = "adult"

    #생성자 오버라이드
    #
    @api.model
    def create(self, values):
        #for value in values:
        # 시퀀스 생성 로직
        if values.get("${moduleName}_number", ("New")) == _("New"):
        values["${moduleName}_number"] = self.env["ir.sequence"].next_by_code(
                "${moduleName}.sequence") or _("New")
        #
        return super(${capital}, self).create(values)  

    #판매오더 화면 열기, 뷰의 버튼하고 연결됨.
    #
    def open_sales_order(self):
        return {
            'name': _("Sales order"),
            'domain': [('partner_id', '=', self.id)],
            'res_model': 'sale.order',
            'view_id': False,
            'view_mode': 'tree,form',
            'type': 'ir.actions.act_window'

        }    

    # 상태관리
    # 뷰에서 상태처리를 위한 버튼을 object type 으로 만들어라
    #
    state = fields.Selection(string='Status', selection=[(
      'draft', 'Draft'), ('open', 'Open'), ('confirmed', 'Confirmed'), ('canceled', 'Canceled'),], index=True, readonly=True, default="draft")

    def action_confirm(self):
        for rec in self:
            rec.state = "confirmed"

    def action_cancel(self):
        for rec in self:
            rec.state = "canceled"
    #
    #
    # one2many 필드 정의 하기, 부모자식간.
    #
    rma_line_ids = fields.One2many(
      comodel_name='rma.line', inverse_name='rma_id', string='Lines')

    #아카이브 정의하기
    #
    active = fields.Boolean("Active", default=True)


# 자식 모델 정의하기
#      
class RmaLines(models.Model):
  _name = 'rma.line'
  _description = 'Rma Lines'

  #부모키를 many2one으로 정의해주어야한다
  #
  rma_id = fields.Many2one(comodel_name='rma.rma', string='Rma #')

  #제품가져오기 many2one 임.
  #
  product_id = fields.Many2one(
      comodel_name='product.product', string='Product')
  qty = fields.Integer(string='Quantity')

`;

  fs.writeFileSync(modelInimodulePath, content);
}

function modelInitFile(moduleName: string, modulePath: string) {
  const modelIniPath = path.join(modulePath, "models", "__init__.py");
  var content = `
# -*- coding: utf-8 -*-
# import할 파이썬 파일들을 밑에 나열해라.
# 이름명 규칙은 모듈명_models


from . import ${moduleName}_models

`;
  fs.writeFileSync(modelIniPath, content);
}

function demoFile(
  moduleName: string,
  modulePath: string,
  modelSchemeJson: any
) {
  const demoPath = path.join(modulePath, "data", `${moduleName}_demo.xml`);
  var arrs = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  var content = `
<odoo>
  <data> `;

  arrs.forEach(function (arr: any) {
    //console.log(model.name);

    content =
      content +
      `
    <record id="${arr}" model="${moduleName}.${moduleName}">`;

    modelSchemeJson.forEach(function (model: any) {
      var value = "";

      const moment = require("moment");

      let now = moment().format("YYYY-MM-DD HH:mm");

      if (model.type === "char") {
        value = "text";
      } else if (model.type === "int") {
        value = "10";
      } else if (model.type === "numeric") {
        value = "5.0";
      } else if (model.type === "date") {
        value = now;
      } else {
        value = "text";
      }

      content =
        content +
        `
        <field name="${model.name}">${value}</field>`;
    });

    content =
      content +
      `    
    </record>
  
`;
  });

  content =
    content +
    `    
  </data>
</odoo>

`;

  fs.writeFileSync(demoPath, content);
}

function sequenceFile(
  moduleName: string,
  modulePath: string,
  modelSchemeJson: any
) {
  const sequencePath = path.join(modulePath, "data", `sequence.xml`);
  const capital = capitalizeFirstLetter(moduleName);

  var content = `<?xml version='1.0' encoding='utf-8'?>
<odoo>
    <data noupdate="1">
        <!-- Sequences for lead mining requests -->
        <record id="${moduleName}_sequence" model="ir.sequence">
            <field name="name">${capital} Sequence</field>
            <field name="code">${moduleName}.sequence</field>
            <!-- 원하는 prefix로 바꿔 -->
            <field name="prefix">RMA</field>
            <field name="padding">5</field>
            <field name="company_id" eval="False" />
        </record>
    </data>
</odoo>
`;

  fs.writeFileSync(sequencePath, content);
}

function capitalizeFirstLetter(data: string) {
  data = data.replaceAll("_", " ");
  return data.charAt(0).toUpperCase() + data.slice(1);
}

function controllerFile(moduleName: string, modulePath: string) {
  const capital = capitalizeFirstLetter(moduleName);

  const ctrlIniCtrlPath = path.join(
    modulePath,
    "controllers",
    `${moduleName}.py`
  );
  var content = `
# -*- coding: utf-8 -*-

from odoo import http


class ${capital}(http.Controller):
    @http.route('/${moduleName}/${moduleName}', auth='public')
    def index(self, **kw):
        return "Hello, world"

    @http.route('/${moduleName}/${moduleName}/objects', auth='public')
    def list(self, **kw):
        return http.request.render('${moduleName}.listing', {
            'root': '/${moduleName}/${moduleName}',
            'objects': http.request.env['${moduleName}.${moduleName}'].search([]),
        })

    @http.route('/${moduleName}/${moduleName}/objects/<model("${moduleName}.${moduleName}"):obj>', auth='public')
    def object(self, obj, **kw):
        return http.request.render('${moduleName}.object', {
            'object': obj
        })

  

`;

  fs.writeFileSync(ctrlIniCtrlPath, content);
}

function controllerIniFile(moduleName: string, modulePath: string) {
  const ctrlIniPath = path.join(modulePath, "controllers", "__init__.py");
  var content = `
# -*- coding: utf-8 -*-

from . import ${moduleName}

`;

  fs.writeFileSync(ctrlIniPath, content);
}

function manifestFile(moduleName: string, modulePath: string) {
  const mainfestPath = path.join(modulePath, "__manifest__.py");
  const capital = capitalizeFirstLetter(moduleName);

  var content = `
# -*- coding: utf-8 -*-

# https://www.odoo.com/documentation/17.0/developer/reference/backend/module.html

{
    'name': "${capital}",

    'summary': "Short (1 phrase/line) summary of the module's purpose",

    'description': """
Long description of module's purpose
    """,

    'author': "My Company",
    'website': "https://www.yourcompany.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Uncategorized',
    'version': '0.1',
    'sequence': 1,
    'license': 'LGPL-3',
    'application': True,
    'installable': True,
    'auto_install': False,

    # any module necessary for this one to work correctly
    # chatter 를 위해 mail 종속추가.
    'depends': [
      'base',
      'mail', # 이멜 기능추가
      'sale'  # 판매모듈 추가

    ],

    # always loaded
    'data': [
        'security/ir.model.access.csv',
        "data/sequence.xml",
        'views/${moduleName}_menus.xml',  # Backend views

        'views/${moduleName}_views.xml',  # Backend views
        'views/${moduleName}_templates.xml', # Portal Templates
    ],
    # only loaded in demonstration mode
    #'data': [
    #    'data/${moduleName}_demo.xml',
    #],
}    
`;
  fs.writeFileSync(mainfestPath, content);
}

function rootIniFile(modulePath: string) {
  const rootIniPath = path.join(modulePath, "__init__.py");

  var content = `
# -*- coding: utf-8 -*-
# import할 폴더명을 밑에 나열해라. 그럼 그 폴더에 있는 파이썬파일들이 임포트 될거다.
# 여기서는 models 폴더하고 controllers 를 일단 기본으로 포함해라.
#
from . import controllers
from . import models
`;
  fs.writeFileSync(rootIniPath, content);
}

function iconFile(modulePath: string) {
  fs.mkdirSync(path.join(modulePath, "static"));
  fs.mkdirSync(path.join(modulePath, "static", "description"));

  const rootIniPath = path.join(
    modulePath,
    "static",
    "description",
    "readme.txt"
  );

  var content = `
icon.png 파일을 여기 폴더에 복사하시지요.
flaticon.com에 엄청나게 무료인걸들이 많이 있소이다. 512*512 사이즈로 하시고.
`;
  fs.writeFileSync(rootIniPath, content);
}

// This method is called when your extension is deactivated
export function deactivate() {}
