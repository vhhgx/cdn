<template>
  <page-detail :title="`${pageTitle}合同`" class="page-detail-lier-class">
    <div class="page-detail-div">
      <!-- 添加左侧步骤条插槽 zhubin -->
      <slot name="left"></slot>
      <el-form
        v-if="activeSteps == 1"
        ref="detailForm"
        style="width: 89%"
        :model="detailForm"
        :rules="detailFormRules"
        inline
        label-width="200px"
        :label-suffix="formLabelSuffix"
      >
        <el-row type="flex" justify="start" style="flex-wrap:wrap">
          <el-col :span="12">
            <el-form-item label="合同名称" prop="orderTitle">
              <div v-if="pageType === 'updates'">
                <el-input
                  v-model="detailForm.orderTitle"
                  :class="
                    isObjEqual(
                      'orderTitle',
                      detailForm.orderTitle,
                      'isObjEqual-sty'
                    )
                  "
                ></el-input>
              </div>
              <div v-else>
                <el-input v-model="detailForm.orderTitle"></el-input>
              </div>
              <span class="form-item-text" v-if="pageType === 'check'">
                {{ detailForm.orderTitle }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="show_contract_no">
            <el-form-item label="合同编号" prop="orderNo">
              <el-input
                v-if="show_contract_no"
                v-model="detailForm.orderNo"
                @change="contractNoChange"
              ></el-input>
              <span class="form-item-text" v-if="pageType === 'check'">
                {{ detailForm.orderNo }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-else>
            <el-form-item label="合同编号" prop="orderNo">
              <span>
                {{ detailForm.orderNo }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="IS_SHOW_CONTRACT_CLASSIFY">
            <el-form-item label="合同分类" prop="contractClassify">
              <el-cascader
                v-model="detailForm.contractClassify"
                :options="contractClassifyOptions"
                :disabled="pageType === 'updated' || pageType === 'updates'"
                filterable
                :props="{
                  expandTrigger: 'hover',
                  emitPath: false,
                  children: 'childList',
                  label: 'codeName',
                  value: 'id'
                }"
                separator="/"
              >
              </el-cascader>
              <span class="form-item-text" v-if="pageType === 'check'">
                {{ detailForm.contractClassifyName }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="IS_SHOW_REL_CONTRACT">
            <el-form-item label="关联合同" prop="relContract">
              <span>
                {{ detailForm.relContractName }}
              </span>
              <el-button
                type="primary"
                @click="chooseContract"
                v-if="pageType !== 'check'"
                >选择</el-button
              >
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="detailForm.projectName"></el-input>
              <span class="form-item-text" v-if="pageType === 'check'">
                {{ detailForm.projectName }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="ENABLE_BUSINESS_SECTOR_WHETHER">
            <el-form-item
              label="业务板块"
              prop="businessSector"
              :rules="businessSectorRules"
            >
              <el-select
                v-model="detailForm.businessSector"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in businessSectorOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <span class="form-item-text" v-if="pageType === 'check'">
                {{ getValue(detailForm.businessSector) }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="OC_ORDER_IS_SHOW_PERFORMANCE_BOND === '1'">
            <el-form-item label="是否需要保函/保证金" prop="displayDeposit">
              <el-radio-group
                :disabled="detailForm.orderBondVO.performanceCreateWhether"
                v-model="detailForm.orderBondVO.performanceBondWhether"
              >
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <span class="form-item-text" v-if="pageType === 'check'">
              {{ detailForm.orderBondVO.performanceBondWhether ? '是' : '否' }}
            </span>
          </el-col>
          <!-- <el-col :span="12" v-if="ORDER_IS_SHOW_EXPORT_TEMPLATE === '1'">
            <el-form-item label="选择引用模板" prop="orderNote">
              <span class="form-item-text" v-if="this.pageType === 'check'">
                {{ getContractTemplate(detailForm.orderNote) }}
              </span>
              <el-select
                ref="orderNoteSelect"
                :value="detailForm.orderNote"
                filterable
                clearable
                placeholder="请选择合同模板"
                @change="changeOrderNote"
              >
                <el-option
                  v-for="item in contract_list"
                  :key="item.codeCode"
                  :label="item.codeName"
                  :value="item.codeCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <AddDynamicForm
            :extraViewVo="this.detailForm.extraViewVo"
            :moduleName="'1'"
            v-if="AddDynamicFormShow"
          ></AddDynamicForm>
        </el-row>
        <!-- <div style="padding-top:20px;border-top:1px solid #EBEEF5;"></div> -->
        <page-detail-section title="买卖双方信息">
          <el-row style="padding-top:30px;" type="flex" justify="center">
            <el-col :span="12">
              <div class="title title-mai">买方</div>
              <el-col :span="24">
                <el-form-item label="单位名称" prop="buyerOrder.compName">
                  <span>
                    {{ detailForm.buyerOrder.compName }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="联系人" prop="buyerOrder.contName">
                  <div v-if="this.pageType === 'updates'">
                    <el-input
                      v-model="detailForm.buyerOrder.contName"
                      :class="
                        isObjEqual(
                          'buyerOrder.contName',
                          detailForm.buyerOrder.contName,
                          'isObjEqual-sty'
                        )
                      "
                    ></el-input>
                  </div>
                  <div v-else>
                    <el-input
                      v-model="detailForm.buyerOrder.contName"
                    ></el-input>
                  </div>

                  <span class="form-item-text" v-if="this.pageType === 'check'">
                    {{ detailForm.buyerOrder.contName }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="电话" prop="buyerOrder.contPhone">
                  <div v-if="this.pageType === 'updates'">
                    <el-input
                      v-model="detailForm.buyerOrder.contPhone"
                      :class="
                        isObjEqual(
                          'buyerOrder.contPhone',
                          detailForm.buyerOrder.contPhone,
                          'isObjEqual-sty'
                        )
                      "
                    ></el-input>
                  </div>
                  <div v-else>
                    <el-input
                      v-model="detailForm.buyerOrder.contPhone"
                    ></el-input>
                  </div>
                  <span class="form-item-text" v-if="this.pageType === 'check'">
                    {{ detailForm.buyerOrder.contPhone }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="电子邮箱" prop="buyerOrder.contEmail">
                  <div v-if="this.pageType === 'updates'">
                    <el-input
                      v-model="detailForm.buyerOrder.contEmail"
                      :class="
                        isObjEqual(
                          'buyerOrder.contEmail',
                          detailForm.buyerOrder.contEmail,
                          'isObjEqual-sty'
                        )
                      "
                    ></el-input>
                  </div>
                  <div v-else>
                    <el-input
                      v-model="detailForm.buyerOrder.contEmail"
                    ></el-input>
                  </div>
                  <span class="form-item-text" v-if="this.pageType === 'check'">
                    {{ detailForm.buyerOrder.contEmail }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="开户银行" prop="buyerOrder.bankName">
                  <div v-if="this.pageType === 'updates'">
                    <el-input
                      v-model="detailForm.buyerOrder.bankName"
                      :class="
                        isObjEqual(
                          'buyerOrder.bankName',
                          detailForm.buyerOrder.bankName,
                          'isObjEqual-sty'
                        )
                      "
                    ></el-input>
                  </div>
                  <div v-else>
                    <el-input
                      v-model="detailForm.buyerOrder.bankName"
                    ></el-input>
                  </div>
                  <span class="form-item-text" v-if="this.pageType === 'check'">
                    {{ detailForm.buyerOrder.bankName }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="银行账号" prop="buyerOrder.bankCode">
                  <div v-if="this.pageType === 'updates'">
                    <el-input
                      v-model="detailForm.buyerOrder.bankCode"
                      :class="
                        isObjEqual(
                          'buyerOrder.bankCode',
                          detailForm.buyerOrder.bankCode,
                          'isObjEqual-sty'
                        )
                      "
                    ></el-input>
                  </div>
                  <div v-else>
                    <el-input
                      v-model="detailForm.buyerOrder.bankCode"
                    ></el-input>
                  </div>

                  <span class="form-item-text" v-if="this.pageType === 'check'">
                    {{ detailForm.buyerOrder.bankCode }}
                  </span>
                </el-form-item>
              </el-col>
              <!-- 单位地址 法定代表人或委托代理人 买卖双方署名信息 zhubin -->
              <el-col :span="24">
                <el-form-item label="单位地址" prop="buyerOrder.compAddress">
                  <div v-if="this.pageType === 'updates'">
                    <el-input
                      v-model="detailForm.buyerOrder.compAddress"
                      :class="
                        isObjEqual(
                          'buyerOrder.compAddress',
                          detailForm.buyerOrder.compAddress,
                          'isObjEqual-sty'
                        )
                      "
                    ></el-input>
                  </div>
                  <div v-else>
                    <el-input
                      v-model="detailForm.buyerOrder.compAddress"
                    ></el-input>
                  </div>
                  <span class="form-item-cont" v-if="this.pageType === 'check'">
                    {{ detailForm.buyerOrder.compAddress }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="法定代表人或委托代理人"
                  prop="buyerOrder.compLegal"
                  class="fading"
                >
                  <div v-if="this.pageType === 'updates'">
                    <el-input
                      maxlength="40"
                      show-word-limit
                      v-model="detailForm.buyerOrder.compLegal"
                      :class="
                        isObjEqual(
                          'buyerOrder.compLegal',
                          detailForm.buyerOrder.compLegal,
                          'isObjEqual-sty'
                        )
                      "
                    ></el-input>
                  </div>
                  <div v-else>
                    <el-input
                      v-model="detailForm.buyerOrder.compLegal"
                      maxlength="40"
                      show-word-limit
                    ></el-input>
                  </div>
                  <span class="form-item-text" v-if="this.pageType === 'check'">
                    {{ detailForm.buyerOrder.compLegal }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="统一社会信用代码"
                  prop="buyerOrder.creditCode"
                >
                  <div v-if="creadit">
                    <span style="display:block;">
                      {{ detailForm.buyerOrder.creditCode }}
                    </span>
                  </div>
                  <div v-else>
                    <el-input
                      v-model="detailForm.buyerOrder.creditCode"
                    ></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="12">
              <div class="title title-maifang">卖方</div>
              <el-col :span="24">
                <el-form-item label="单位名称" prop="sllerOrder.compName">
                  <span style="width:300px;">{{
                    detailForm.sllerOrder.compName
                  }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="联系人" prop="sllerOrder.contName">
                  <div v-if="this.pageType === 'updates'">
                    <el-input
                      v-model="detailForm.sllerOrder.contName"
                      :class="
                        isObjEqual(
                          'sellerOrder.contName',
                          detailForm.sllerOrder.contName,
                          'isObjEqual-sty'
                        )
                      "
                    ></el-input>
                  </div>
                  <div v-else>
                    <el-input
                      v-model="detailForm.sllerOrder.contName"
                    ></el-input>
                  </div>
                  <span class="form-item-text" v-if="this.pageType === 'check'">
                    {{ detailForm.sllerOrder.contName }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="电话" prop="sllerOrder.contPhone">
                  <div v-if="this.pageType === 'updates'">
                    <el-input
                      v-model="detailForm.sllerOrder.contPhone"
                      :class="
                        isObjEqual(
                          'sellerOrder.contPhone',
                          detailForm.sllerOrder.contPhone,
                          'isObjEqual-sty'
                        )
                      "
                    ></el-input>
                  </div>
                  <div v-else>
                    <el-input
                      v-model="detailForm.sllerOrder.contPhone"
                    ></el-input>
                  </div>
                  <span class="form-item-text" v-if="this.pageType === 'check'">
                    {{ detailForm.sllerOrder.contPhone }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="电子邮箱" prop="sllerOrder.contEmail">
                  <div v-if="this.pageType === 'updates'">
                    <el-input
                      v-model="detailForm.sllerOrder.contEmail"
                      :class="
                        isObjEqual(
                          'sellerOrder.contEmail',
                          detailForm.sllerOrder.contEmail,
                          'isObjEqual-sty'
                        )
                      "
                    ></el-input>
                  </div>
                  <div v-else>
                    <el-input
                      v-model="detailForm.sllerOrder.contEmail"
                    ></el-input>
                  </div>
                  <span class="form-item-text" v-if="this.pageType === 'check'">
                    {{ detailForm.sllerOrder.contEmail }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="开户银行" prop="sllerOrder.bankName">
                  <div v-if="this.pageType === 'updates'">
                    <el-input
                      v-model="detailForm.sllerOrder.bankName"
                      :class="
                        isObjEqual(
                          'sellerOrder.bankName',
                          detailForm.sllerOrder.bankName,
                          'isObjEqual-sty'
                        )
                      "
                    ></el-input>
                  </div>
                  <div v-else>
                    <el-input
                      v-model="detailForm.sllerOrder.bankName"
                    ></el-input>
                  </div>

                  <span class="form-item-text" v-if="this.pageType === 'check'">
                    {{ detailForm.sllerOrder.bankName }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="银行账号" prop="sllerOrder.bankCode">
                  <div v-if="this.pageType === 'updates'">
                    <el-input
                      v-model="detailForm.sllerOrder.bankCode"
                      :class="
                        isObjEqual(
                          'sellerOrder.bankCode',
                          detailForm.sllerOrder.bankCode,
                          'isObjEqual-sty'
                        )
                      "
                    ></el-input>
                  </div>
                  <div v-else>
                    <el-input
                      v-model="detailForm.sllerOrder.bankCode"
                    ></el-input>
                  </div>
                  <span class="form-item-text" v-if="this.pageType === 'check'">
                    {{ detailForm.sllerOrder.bankCode }}
                  </span>
                </el-form-item>
              </el-col>
              <!-- 单位地址 法定代表人或委托代理人 -->
              <el-col :span="24">
                <el-form-item label="单位地址" prop="sllerOrder.compAddress">
                  <div v-if="this.pageType === 'updates'">
                    <el-input
                      v-model="detailForm.sllerOrder.compAddress"
                      :class="
                        isObjEqual(
                          'sellerOrder.compAddress',
                          detailForm.sllerOrder.compAddress,
                          'isObjEqual-sty'
                        )
                      "
                    ></el-input>
                  </div>
                  <div v-else>
                    <el-input
                      v-model="detailForm.sllerOrder.compAddress"
                    ></el-input>
                  </div>
                  <span class="form-item-cont" v-if="this.pageType === 'check'">
                    {{ detailForm.sllerOrder.compAddress }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="法定代表人或委托代理人"
                  prop="sllerOrder.compLegal"
                  class="fading"
                >
                  <div v-if="this.pageType === 'updates'">
                    <el-input
                      maxlength="40"
                      show-word-limit
                      v-model="detailForm.sllerOrder.compLegal"
                      :class="
                        isObjEqual(
                          'sellerOrder.compLegal',
                          detailForm.sllerOrder.compLegal,
                          'isObjEqual-sty'
                        )
                      "
                    ></el-input>
                  </div>
                  <div v-else>
                    <el-input
                      v-model="detailForm.sllerOrder.compLegal"
                      maxlength="40"
                      show-word-limit
                    ></el-input>
                  </div>
                  <span class="form-item-text" v-if="this.pageType === 'check'">
                    {{ detailForm.sllerOrder.compLegal }}
                  </span>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
          <el-row
            style="padding-top:20px;border-top:1px solid #EBEEF5;flex-wrap:wrap;"
            type="flex"
            justify="start"
          >
            <el-col :span="12">
              <el-form-item label="预计签约日期" prop="signDate">
                <div v-if="this.pageType === 'updates'">
                  <el-date-picker
                    v-model="detailForm.signDate"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions[0]"
                    :class="
                      isObjEqual(
                        'signDate',
                        detailForm.signDate,
                        'isObjEqual-sty'
                      )
                    "
                  >
                  </el-date-picker>
                </div>
                <div v-else>
                  <el-date-picker
                    v-model="detailForm.signDate"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions[0]"
                  >
                  </el-date-picker>
                </div>
                <span class="form-item-text" v-if="this.pageType === 'check'">
                  {{ detailForm.signDate }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="签约地点" prop="signAddress">
                <div v-if="this.pageType === 'updates'">
                  <el-input
                    v-model="detailForm.signAddress"
                    :class="
                      isObjEqual(
                        'signAddress',
                        detailForm.signAddress,
                        'isObjEqual-sty'
                      )
                    "
                  ></el-input>
                </div>
                <div v-else>
                  <el-input v-model="detailForm.signAddress"></el-input>
                </div>
                <span class="form-item-text" v-if="this.pageType === 'check'">
                  {{ detailForm.signAddress }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <span slot="label" style="position:relative;left:-10px;">
                  <span style="color: #f56c6c;">*</span>
                  币种 :</span
                >
                <el-select
                  v-if="pageType === 'updated' && detailForm.orderFrom == 3"
                  v-model="value"
                  @change="changCurrency"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <span v-else>{{ name }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="汇率"
                prop="exchangeRate"
                class="numberinput"
              >
                <span v-if="pageType === 'check'">{{
                  detailForm.exchangeRate | numberFormat(4)
                }}</span>
                <el-input-number
                  v-else
                  :min="0"
                  :controls="false"
                  :precision="4"
                  v-model="detailForm.exchangeRate"
                  :placeholder="
                    `请输入100${name}兑换多少${standardCurrenyUnitName}`
                  "
                  class="input-number"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <AddDynamicForm
              :extraViewVo="this.detailForm.extraViewVo"
              :moduleName="'2'"
              v-if="AddDynamicFormShow"
            ></AddDynamicForm>
          </el-row>
        </page-detail-section>
        <!-- 合同条款----》物料清单  zhubin  -->
        <page-detail-section title="物料清单">
          <el-row>
            <!-- <el-collapse v-model="activeNames">
              <el-collapse-item
                name="1"
                style="padding-left:2%;padding-right:2%;"
              > -->
            <!-- <template slot="title">
                  <div>
                    <span class="title">{{
                      detailForm.orderTermsList[0]
                        ? '第一条 ' + detailForm.orderTermsList[0].termsName
                        : ''
                    }}</span>
                  </div>
                </template> -->
            <!--  合同编制页,如果存在物料是is_temporary=1,则显示[添加物料]按钮-->
            <div
              style="padding-top:10px; padding-bottom: 10px;"
              v-if="hasTemporaryMate"
            >
              <!--                物料分类表-->
              <div style="font-size:14px">物料分类</div>
              <ordermateList
                ref="mateListRef"
                :editable="true"
                :disable="true"
                :ordermateList="detailForm.mateList"
              ></ordermateList>
            </div>
            <!--              明细表格-->
            <div v-if="hasTemporaryMate" style="font-size:14px">
              物料明细——请于下表添加对应物料分类明细
            </div>
            <ordermateList
              ref="ordermateListRef"
              :ordermateList="detailForm.ordermateList"
              :IS_EMERGENCY_RESULT_INPUT="IS_EMERGENCY_RESULT_INPUT"
              v-if="orderMateListShow"
              @watchList="watchList"
            ></ordermateList>
            <div
              v-if="pageType == 'update' || pageType == 'updated'"
              style="margin-top:20px;display: flex;align-items: center;"
            >
              <add-material-tree
                :starShow="false"
                :editable="true"
                :compCode="detailForm.compCode + ''"
                :isaddmater="!!detailForm.compCode"
                :classCodeList="classCodeList"
                @funSelectedData="getselectedData"
                :flag="1"
                v-if="
                  detailForm.orderFrom == 3 || detailForm.mateList.length > 0
                "
              ></add-material-tree>
              <batch-into-dialog
                v-if="OC_ORDER_MATE_IS_EDIT == 1"
                :thisApi="`contractMateApi`"
                @exportContractMate="exportContractMate"
                @importContractMate="importContractMate"
                @funSelectedData="getSelectedMateData"
              ></batch-into-dialog>
            </div>
            <div
              style="float: right;margin-top: 10px"
              v-if="
                this.pageType == 'updated' && this.detailForm.orderFrom == 3
              "
            >
              <div
                style="display:inline-block;"
                v-if="MATE_EXTRA_VERSION === '1' && !detailForm.extraWhether"
              >
                附加费 {{ `(${standardCurrenyName})` }}:<span
                  class="page-detail-lier-money"
                  >{{ $toFixed.amountGrouping(mateTotalPrice.$e) }}</span
                >
              </div>
              <div
                style="display:inline-block;"
                v-if="MATE_EXTRA_VERSION === '2'"
              >
                附加费（计入总金额） {{ `(${standardCurrenyName})` }}:<span
                  class="page-detail-lier-money"
                  >{{ $toFixed.amountGrouping(mateTotalPrice.$c) }}</span
                >
              </div>
              <div
                style="display:inline-block;"
                v-if="MATE_EXTRA_VERSION === '2'"
              >
                其他费用（不计入总金额）
                {{ `(${standardCurrenyName})` }}:<span
                  class="page-detail-lier-money"
                  >{{ $toFixed.amountGrouping(mateTotalPrice.$d) }}</span
                >
              </div>
              <!-- 不含税总金额一直显示 -->
              <div style="display:inline-block">
                不含税总金额
                {{ `(${standardCurrenyName})` }}:<span
                  class="page-detail-lier-money"
                  >{{ $toFixed.amountGrouping(mateTotalPrice.$b) }}</span
                >
              </div>
              <div style="display:inline-block">
                总金额 {{ `(${standardCurrenyName})` }}:<span
                  class="page-detail-lier-money"
                >
                  {{
                    isFirst === 1
                      ? $toFixed.amountGrouping(detailForm.orderAmount)
                      : $toFixed.amountGrouping(mateTotalPrice.$a)
                  }}
                </span>
              </div>
              <div class="fontSize12">
                ( {{ standardCurrenyUnit }}:<span
                  class="page-detail-lier-money2"
                >
                  {{ $toFixed.amountGrouping(getStandardOrderAmount) }}</span
                >)
              </div>
            </div>
            <div style="float: right;margin-top: 10px" v-else>
              <div
                v-if="MATE_EXTRA_VERSION === '1' && !detailForm.extraWhether"
                style="display:inline-block;"
              >
                附加费 {{ `(${standardCurrenyName})` }}:<span
                  class="page-detail-lier-money"
                  >{{ $toFixed.amountGrouping(mateTotalPrice.$e) }}</span
                >
              </div>
              <div
                style="display:inline-block;"
                v-if="MATE_EXTRA_VERSION === '2'"
              >
                附加费（计入总金额） {{ `(${standardCurrenyName})` }}:<span
                  class="page-detail-lier-money"
                  >{{ $toFixed.amountGrouping(mateTotalPrice.$c) }}</span
                >
              </div>
              <div
                style="display:inline-block;"
                v-if="MATE_EXTRA_VERSION === '2'"
              >
                其他费用（不计入总金额）
                {{ `(${standardCurrenyName})` }}:<span
                  class="page-detail-lier-money"
                  >{{ $toFixed.amountGrouping(mateTotalPrice.$d) }}</span
                >
              </div>
              <!-- 不含税总金额一直显示 -->
              <div style="display:inline-block">
                不含税总金额
                {{ `(${standardCurrenyName})` }}:<span
                  class="page-detail-lier-money"
                  >{{
                    isFirst === 1
                      ? $toFixed.amountGrouping(detailForm.orderNotaxAmount) ||
                        $toFixed.amountGrouping(mateTotalPrice.$b)
                      : $toFixed.amountGrouping(mateTotalPrice.$b)
                  }}</span
                >
              </div>
              <div style="display:inline-block">
                总金额 {{ `(${standardCurrenyName})` }}:<span
                  class="page-detail-lier-money"
                >
                  {{
                    isFirst === 1
                      ? $toFixed.amountGrouping(detailForm.orderAmount)
                      : $toFixed.amountGrouping(mateTotalPrice.$a)
                  }}</span
                >
              </div>
              <div class="fontSize12">
                ( {{ standardCurrenyUnit }}:<span
                  class="page-detail-lier-money2"
                >
                  {{ $toFixed.amountGrouping(getStandardOrderAmount) }}</span
                >)
              </div>
            </div>
            <div v-if="materielDescription.length > 0">
              <div style="margin-top: 60px">附：附加费明细</div>
              <wrapper-table
                :setPagination="setPagination"
                :data="materielDescription"
                :baseNum="setPagination().pageSize"
              >
                <template v-slot="{ data }">
                  <control-table
                    :data="data"
                    :column="mateColumn"
                  ></control-table>
                </template>
              </wrapper-table>
            </div>
            <!-- </el-collapse-item> -->
            <!-- <div v-if="this.pageType !== 'check'" class="sliceList">
                <el-collapse-item
                  v-for="(items, i) in detailForm.orderTermsList"
                  :key="i"
                  accordion="false"
                  style="padding-left:2%;padding-right:2%;"
                >
                  <div
                    v-if="i != 0"
                    slot="title"
                    @click.stop
                    style="position: relative;"
                  >
                    <span style="font-size: 16px;font-weight: bold"
                      >第{{ numberChinese(i + 1) }}条
                      <span
                        v-if="!items.input"
                        @click.stop="
                          () => {
                            items['modelContract'] != undefined
                              ? items['modelContract']
                                ? items['lockWhether']
                                  ? null
                                  : onInputFocus(`orderTermsInput_${i}`, '1')
                                : onInputFocus(`orderTermsInput_${i}`, '1')
                              : items['lockWhether']
                              ? null
                              : onInputFocus(`orderTermsInput_${i}`, '1')
                          }
                        "
                        >{{ items.termsName }}</span
                      ></span
                    >
                    <el-input
                      v-model="items.termsName"
                      :ref="`orderTermsInput_${i}`"
                      v-show="items.input"
                      :data-index="i"
                      type="text"
                      style="margin-left: 20px"
                      @click.native="doSomething($event, items.termsName)"
                      @blur="items.input = !items.termsName"
                      @keyup.enter.native="items.input = !items.termsName"
                    ></el-input>
                    <el-button
                      v-if="!items.termsOrder"
                      type="text"
                      @click="onDelete(i)"
                      style="margin-left:30px;"
                      >删除</el-button
                    >
                  </div>
                  <div style="margin: 0 20px" v-if="i != 0">
                    <div
                      v-for="(o, j) in items.orderTermsDetailList"
                      :key="j"
                      style="display: flex;padding: 5px 0;"
                    >
                      <div
                        style="flex: 1"
                        @click="
                          () => {
                            items['modelContract'] != undefined
                              ? items['modelContract']
                                ? o['lockWhether']
                                  ? null
                                  : onInputFocus(
                                      `orderTermsDetailInput_${i}_${j}`
                                    )
                                : onInputFocus(
                                    `orderTermsDetailInput_${i}_${j}`
                                  )
                              : o['lockWhether']
                              ? null
                              : onInputFocus(`orderTermsDetailInput_${i}_${j}`)
                          }
                        "
                      >
                        <span style="white-space: pre-wrap;" v-if="!o.input">{{
                          o.termsContent
                        }}</span>
                        <el-input
                          maxlength="2000"
                          show-word-limit
                          :ref="`orderTermsDetailInput_${i}_${j}`"
                          v-model="o.termsContent"
                          :data-index="`${i}_${j}`"
                          type="textarea"
                          v-show="o.input"
                          @click.native.stop
                          @blur="onEditTermsContent(o, j, items)"
                          style="width: 100%;"
                        ></el-input>
                      </div>
                    </div>
                    <el-input
                      maxlength="2000"
                      show-word-limit
                      v-model="items.curText"
                      type="textarea"
                      :disabled="
                        items['modelContract'] != undefined
                          ? items['modelContract']
                            ? items['lockWhether']
                              ? true
                              : false
                            : false
                          : items['lockWhether']
                          ? true
                          : false
                      "
                      @blur="onEnterSearch(items, i)"
                      style="width: 100%;margin-top: 10px "
                    ></el-input>
                  </div>
                </el-collapse-item>
              </div> -->
            <!-- <div v-else class="sliceList">
                <el-collapse-item
                  v-for="(items, i) in detailForm.orderTermsList"
                  :key="i"
                  accordion="false"
                  style="padding-left:2%;padding-right:2%;"
                >
                  <div v-if="i != 0" slot="title" style=" position: relative;">
                    <span style="font-size: 16px;font-weight: bold;"
                      >第{{ numberChinese(i + 1) }}条
                      <span>{{ items.termsName }}</span></span
                    >
                  </div>
                  <div v-if="i != 0" style="margin: 0 20px">
                    <div
                      v-for="(o, j) in items.orderTermsDetailList"
                      :key="j"
                      style="display: flex;padding: 5px 0;"
                    >
                      <div style="flex: 1">
                        <span style="white-space: pre-wrap;" v-if="!o.input">{{
                          o.termsContent
                        }}</span>
                      </div>
                    </div>
                  </div>
                </el-collapse-item>
              </div> -->
            <!-- <el-col
                :span="24"
                style="padding-top: 10px;padding-left:2%;"
                v-if="this.pageType !== 'check'"
              >
                <el-button type="primary" @click="addlastitems">
                  添加条款
                </el-button>
                <div style="display:inline-block;margin-left:20px;">
                  <add-clause @funSelectedData="getselectedDataed"></add-clause>
                </div>
              </el-col> -->
            <!-- </el-collapse> -->
          </el-row>
        </page-detail-section>

        <!-- <page-detail-section title="买卖双方署名信息">
          <el-row style="padding-top:30px;" type="flex" justify="center">
            <el-col :span="11">
              <div class="title">买方</div>
              <el-col :span="24">
                <el-form-item label="单位名称" prop="buyerOrder.compName">
                  <span>
                    {{ detailForm.buyerOrder.compName }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="单位地址" prop="buyerOrder.compAddress">
                  <div v-if="this.pageType === 'updates'">
                    <el-input
                      v-model="detailForm.buyerOrder.compAddress"
                      :class="
                        isObjEqual(
                          'buyerOrder.compAddress',
                          detailForm.buyerOrder.compAddress,
                          'isObjEqual-sty'
                        )
                      "
                    ></el-input>
                  </div>
                  <div v-else>
                    <el-input
                      v-model="detailForm.buyerOrder.compAddress"
                    ></el-input>
                  </div>
                  <span class="form-item-cont" v-if="this.pageType === 'check'">
                    {{ detailForm.buyerOrder.compAddress }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="法定代表人或委托代理人"
                  prop="buyerOrder.compLegal"
                  class="fading"
                >
                  <div v-if="this.pageType === 'updates'">
                    <el-input
                      maxlength="40"
                      show-word-limit
                      v-model="detailForm.buyerOrder.compLegal"
                      :class="
                        isObjEqual(
                          'buyerOrder.compLegal',
                          detailForm.buyerOrder.compLegal,
                          'isObjEqual-sty'
                        )
                      "
                    ></el-input>
                  </div>
                  <div v-else>
                    <el-input
                      v-model="detailForm.buyerOrder.compLegal"
                      maxlength="40"
                      show-word-limit
                    ></el-input>
                  </div>
                  <span class="form-item-text" v-if="this.pageType === 'check'">
                    {{ detailForm.buyerOrder.compLegal }}
                  </span>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="11">
              <div class="title">卖方</div>
              <el-col :span="24">
                <el-form-item label="单位名称" prop="sllerOrder.compName">
                  <span>
                    {{ detailForm.sllerOrder.compName }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="单位地址" prop="sllerOrder.compAddress">
                  <div v-if="this.pageType === 'updates'">
                    <el-input
                      v-model="detailForm.sllerOrder.compAddress"
                      :class="
                        isObjEqual(
                          'sellerOrder.compAddress',
                          detailForm.sllerOrder.compAddress,
                          'isObjEqual-sty'
                        )
                      "
                    ></el-input>
                  </div>
                  <div v-else>
                    <el-input
                      v-model="detailForm.sllerOrder.compAddress"
                    ></el-input>
                  </div>
                  <span class="form-item-cont" v-if="this.pageType === 'check'">
                    {{ detailForm.sllerOrder.compAddress }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="法定代表人或委托代理人"
                  prop="sllerOrder.compLegal"
                  class="fading"
                >
                  <div v-if="this.pageType === 'updates'">
                    <el-input
                      maxlength="40"
                      show-word-limit
                      v-model="detailForm.sllerOrder.compLegal"
                      :class="
                        isObjEqual(
                          'sellerOrder.compLegal',
                          detailForm.sllerOrder.compLegal,
                          'isObjEqual-sty'
                        )
                      "
                    ></el-input>
                  </div>
                  <div v-else>
                    <el-input
                      v-model="detailForm.sllerOrder.compLegal"
                      maxlength="40"
                      show-word-limit
                    ></el-input>
                  </div>
                  <span class="form-item-text" v-if="this.pageType === 'check'">
                    {{ detailForm.sllerOrder.compLegal }}
                  </span>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
        </page-detail-section> -->

        <page-detail-section title="合同附件">
          <el-row style="padding-top:30px;">
            <el-col :span="24">
              <el-form-item label="说明">
                <el-input
                  style="width:500px"
                  type="textarea"
                  maxlength="2000"
                  show-word-limit
                  v-model="detailForm.orderRemark"
                ></el-input>
                <span class="form-item-text" v-if="this.pageType === 'check'">
                  {{ detailForm.orderRemark }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="margin-left: 80px;">
              <ContractAttachment
                :isRemark="false"
                :isNotice="false"
                :data="detailForm.contractAttachmentList"
                ref="ContractAttachment"
              ></ContractAttachment>
            </el-col>
            <el-col
              :span="12"
              style="padding-top:30px;"
              v-if="ORDER_IS_SHOW_SUPPLIER_CONFIRM == 1"
            >
              <el-form-item label="发送供应商确认">
                <span class="form-item-text" v-if="this.pageType === 'check'">
                  {{ suppConfirm == true ? '是' : '否' }}
                </span>
                <el-radio-group v-model="suppConfirm">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              style="padding-top:30px;"
              v-if="this.pageType == 'update' && xuqiuType != 0"
            >
              <el-form-item label="短信通知">
                <span class="form-item-text" v-if="this.pageType === 'check'">
                  {{ noticeWheather === 1 ? '是' : '否' }}
                </span>
                <el-radio-group v-model="noticeWheather">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              style="padding-top:30px;"
              v-if="this.pageType !== 'update' && xuqiuType != 0"
            >
              <el-form-item label="短信通知">
                <span class="form-item-text" v-if="this.pageType === 'check'">
                  {{ noticeWheathers === true ? '是' : '否' }}
                </span>
                <el-radio-group v-model="noticeWheathers">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12" style="padding-left:4%;" v-if="biaoshi == 1">
              <el-form-item label="是否存为模板">
                <span class="form-item-text" v-if="this.pageType === 'check'">
                  {{ templateWhether === true ? '是' : '否' }}
                </span>
                <el-radio-group v-model="templateWhether">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col> -->
            <!-- <el-col
              :span="12"
              style="padding-left:1%"
              v-if="ORDER_IS_SHOW_EXPORT_TEMPLATE === '1'"
            >
              <el-form-item label="选择引用模板" prop="orderNote">
                <span class="form-item-text" v-if="this.pageType === 'check'">
                  {{ getContractTemplate(detailForm.orderNote) }}
                </span>
                <el-select
                  v-model="detailForm.orderNote"
                  filterable
                  clearable
                  placeholder="请选择合同模板"
                  @change="changeOrderNote"
                >
                  <el-option
                    v-for="item in contract_list"
                    :key="item.codeCode"
                    :label="item.codeName"
                    :value="item.codeCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
          </el-row>
        </page-detail-section>
        <!-- 无价值物料     -->
        <WorthlessMaterials
          ref="worthlessMate"
          v-if="isShowWorthlessMate == '1'"
          :pageType="pageType"
          :editable="true"
          :worthlessMateList="detailForm.worthlessMateList"
          :orderCode="orderCode"
        />
        <!-- 其他费用 -->
        <otherFee
          ref="otherFee"
          :orderCostVOList="detailForm.orderCostVOList"
        ></otherFee>
        <!-- 保证金信息 -->
        <page-detail-section
          title="保证金信息"
          v-if="detailForm.orderBondVO.performanceBondWhether"
        >
          <el-row type="flex" justify="start" style="flex-wrap:wrap">
            <el-col :span="12">
              <el-form-item label="缴费方式" prop="orderBondVO.paymentType">
                <el-select
                  :disabled="detailForm.orderBondVO.performanceCreateWhether"
                  v-model="detailForm.orderBondVO.paymentType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in paymentTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <span class="form-item-text" v-if="this.pageType === 'check'">
                  {{ getValue2(detailForm.orderBondVO.paymentType) }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="缴费金额"
                prop="orderBondVO.performanceBondMoney"
              >
                <el-input
                  v-digits-limit:amount
                  :disabled="detailForm.orderBondVO.performanceCreateWhether"
                  v-model="detailForm.orderBondVO.performanceBondMoney"
                ></el-input>
                <span class="form-item-text" v-if="this.pageType === 'check'">
                  {{ standardCurrenyName }}
                  {{
                    $toFixed.amountGrouping(
                      detailForm.orderBondVO.performanceBondMoney
                    )
                  }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开户银行" prop="orderBondVO.receiptBankName">
                <el-input
                  :disabled="detailForm.orderBondVO.performanceCreateWhether"
                  v-model="detailForm.orderBondVO.receiptBankName"
                ></el-input>
                <span class="form-item-text" v-if="this.pageType === 'check'">
                  {{ detailForm.orderBondVO.receiptBankName }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="账户名称"
                prop="orderBondVO.receiptAccountName"
              >
                <el-input
                  :disabled="detailForm.orderBondVO.performanceCreateWhether"
                  v-model="detailForm.orderBondVO.receiptAccountName"
                ></el-input>
                <span class="form-item-text" v-if="this.pageType === 'check'">
                  {{ detailForm.orderBondVO.receiptAccountName }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行账号" prop="orderBondVO.receiptBankCode">
                <el-input
                  :disabled="detailForm.orderBondVO.performanceCreateWhether"
                  v-model="detailForm.orderBondVO.receiptBankCode"
                ></el-input>
                <span class="form-item-text" v-if="this.pageType === 'check'">
                  {{ detailForm.orderBondVO.receiptBankCode }}
                </span>
              </el-form-item>
            </el-col>
          </el-row>
        </page-detail-section>
        <!-- 保证金信息 end -->
        <!-- 反馈结论 -->
        <page-detail-section
          title="反馈结论"
          v-if="
            aduit != 1 && confirmRecordListVO && confirmRecordListVO.length > 0
          "
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="反馈结论">
                <span>{{
                  confirmResu == 1
                    ? '同意'
                    : confirmResu == 2
                    ? '不同意'
                    : confirmResu == 3
                    ? '同意'
                    : '不同意'
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="反馈意见">
                <div style="width:800px; word-wrap:break-word">
                  {{ confirmRemark }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="历史反馈记录">
                <el-link
                  :underline="false"
                  type="primary"
                  v-if="confirmRecordListVO && confirmRecordListVO.length < 2"
                  >暂无历史反馈记录
                </el-link>
                <el-link
                  v-else
                  :underline="false"
                  type="primary"
                  @click="onOpenFeedBackDiolag"
                  >查看反馈记录</el-link
                >
              </el-form-item>
            </el-col>
          </el-row>
          <FeedBackList
            ref="feedbackList"
            :feedBackList="confirmRecordListVO"
          ></FeedBackList>
        </page-detail-section>
        <page-detail-section
          title="付款计划及方式"
          v-if="isShowCostListFlag == '1'"
        >
          <cost-list
            ref="costListRef"
            :pageType="pageType"
            :mateTotalPrice="
              isFirst > 1 ? mateTotalPrice.$a : detailForm.orderAmount
            "
            :settlementCategoryList="settlementCategoryList"
            :orderSettlementListVOList="detailForm.orderSettlementListVOList"
          ></cost-list>
        </page-detail-section>
        <page-detail-section title="经办人信息">
          <el-row style="padding-top:20px;">
            <el-col :span="12">
              <el-form-item label="姓名" prop="contName">
                <el-input v-model="detailForm.contName"></el-input>
                <span class="form-item-text" v-if="this.pageType === 'check'">
                  {{ detailForm.contName }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机" prop="contMobile">
                <el-input v-model="detailForm.contMobile"></el-input>
                <span class="form-item-text" v-if="this.pageType === 'check'">
                  {{ detailForm.contMobile }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电话" prop="contPhone">
                <el-input v-model="detailForm.contPhone"></el-input>
                <span class="form-item-text" v-if="this.pageType === 'check'">
                  {{ detailForm.contPhone }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱">
                <el-input v-model="detailForm.contEmail"></el-input>
                <span class="form-item-text" v-if="this.pageType === 'check'">
                  {{ detailForm.contEmail }}
                </span>
              </el-form-item>
            </el-col>
          </el-row>
        </page-detail-section>
        <slot name="aduitHistory"></slot>
      </el-form>
      <slot v-else name="editor"></slot>
    </div>

    <template v-slot:page-detail-footer>
      <div>
        <div v-if="pageAduit == 1">
          <slot name="aduitBtn"></slot>
        </div>
        <div v-else>
          <template v-if="pageType == 'check'">
            <el-button
              v-if="NEED_OL_EDIT == 1 && activeSteps == 2"
              type="primary"
              @click="onLoad()"
              plain
              >下载</el-button
            >
            <el-button @click="onClose">关闭</el-button>
          </template>
          <template v-else>
            <slot
              v-if="aduit != 1 && NEED_OL_EDIT == '1' && activeSteps == 2"
              name="preBut"
            ></slot>
            <el-button
              type="primary"
              @click="toNext"
              v-if="NEED_OL_EDIT == '1' && activeSteps == 1"
              >下一步</el-button
            >
            <el-button
              type="primary"
              v-if="NEED_OL_EDIT !== '1'"
              @click="onSubmit"
              >提交</el-button
            >
            <el-button
              type="primary"
              plain
              v-if="NEED_OL_EDIT == '1' && activeSteps == 2"
              @click="onSave(1)"
              >提交</el-button
            >
            <el-button type="primary" @click="onSave(0)" plain>保存</el-button>
            <el-button @click="onCancel">取消</el-button>
          </template>
        </div>
      </div>
    </template>
    <total-extras-dialog
      :mateDescribe="mateDescribe"
      :taxWhether="true"
      :totalExtras="totalExtras"
      :visible.sync="dialogVisible"
      :read="false"
      :data="mateExtraList"
      :unit="standardCurrenyName"
      :taxRateArray="taxRateArray"
      @onConfirmClick="extraConfirm"
    ></total-extras-dialog>
    <total-extras-dialog-vesion
      :mateDescribe="mateDescribe"
      :taxWhether="true"
      :totalExtras="totalExtras"
      :visible.sync="dialogVisibleVERSION"
      :read="false"
      :data="mateExtraList"
      :unit="standardCurrenyName"
      :taxRateArray="taxRateArray"
      :mateAmount="mateAmount"
      @onConfirmClick="extraConfirm"
      @watchList="watchList"
    ></total-extras-dialog-vesion>
    <ChooseContract
      ref="ChooseContract"
      @onSelected="onSelected"
    ></ChooseContract>
  </page-detail>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import qs from 'query-string'
import list from '@/mixins/list'
import contract from '@/mixins/contract'
import currency from '@/mixins/currency'
import filters from '@/utils/filters'
import { rules } from '@utils/rules'
import { elButton } from '@/views/bidding/Vnode'
import { numberChinese } from '@/utils/common'
import { get } from 'shvl'
import ordermateList from './ordermateList'
import cloneDeep from 'lodash/cloneDeep'
import otherFee from './otherFee'
import CostList from '@/views/contract/components/CostList'
import WorthlessMaterials from '../../components/WorthlessMaterials'
import FeedBackList from '../../components/FeedBackList'

export default {
  name: 'OrderAgreementDetail',
  components: {
    ordermateList,
    otherFee,
    CostList,
    WorthlessMaterials,
    FeedBackList
  },
  props: {
    // 来源审批页
    pageAduit: {
      type: String,
      default: '0'
    },
    // 左侧步骤判断 zhubin
    activeSteps: {
      type: Number,
      default: 1
    },
    NEED_OL_EDIT: {
      type: String,
      default: '1'
    },
    orderTitle: {
      type: String,
      default: ''
    }
  },
  directives: {},
  filters: {},
  mixins: [list, contract, currency],
  data() {
    const vm = this
    return {
      intermediateOrderNote: '',
      oldOrderNote: '',
      confirmResu: 1,
      confirmRemark: '',
      confirmRecordListVO: [],
      orderNoteChange: false,
      btnText: '',
      orderCodeEvent: '',
      statusCodeEvent: '',
      isFirst: 1,
      noSubTotal1: 0,
      tem_ordermateList: [],
      successStatus: '',
      resultCode: '',
      resultCodes: [],
      orderComp: '',
      suppCode: '',
      selectLimitList: [], //容差初始值数组
      OC_ORDER_IS_SHOW_PERFORMANCE_BOND: '1', //是否显示 是否需要保函/保证金
      paymentTypeOptions: [], //缴费方式下拉选项
      performanceBondTypeOptions: [], //缴费方式下拉选项
      MC_MATERIELS_TEMPORARY: '0', // 按分类采购是否生成临时物资
      // ORDER_IS_SHOW_EXPORT_TEMPLATE: '1',
      // ORDER_EXPORT_TEMPLATE_REQUIRED_WHETHER: '1',
      OC_ORDER_MATE_IS_EDIT: '0',
      MATE_EXTRA_VERSION: '1', //1 显示旧版本附加费弹窗  2  显示新版本附加费弹窗
      dialogVisibleVERSION: false,
      mateAmount: 0, //物料数量
      businessSectorRules: [],
      ENABLE_BUSINESS_SECTOR_WHETHER: false, //是否显示业务板块
      businessSectorOptions: [], //业务板块
      contractClassifyOptions: [],
      // show_worthless_flag: false, //是否显示无价值物料列表
      IS_SHOW_CONTRACT_CLASSIFY: false, //是否显示合同分类字段
      IS_SHOW_REL_CONTRACT: false, //是否显示关联合同
      isShowProjectName: false,
      show_contract_no: false,
      pickerOptions: [
        {
          disabledDate: time => {
            const date = this.detailForm.bidOpenTime
            return (
              time.getTime() > new Date(date).getTime() ||
              time.getTime() < new Date().getTime() - 86400000
            )
          }
        },
        {
          disabledDate: time => {
            return time.getTime() < new Date().getTime() - 86400000
          }
        }
      ],
      extraConfirm: () => {},
      taxRateArray: [],
      dialogVisible: false,
      mateExtraList: [],
      totalExtras: 0,
      mateDescribe: '',
      list: [],
      pageSize: 5,
      materielDesCurPage: 1,
      mateCurPage: 1,
      // 供应商总条数
      compTotal: 0,
      // 供应商每页显示数量
      compPageSize: 5,
      order: '',
      cont: '',
      // radio: 0,
      // radios: 0,
      noticeWheather: 0,
      noticeWheathers: false,
      suppConfirm: false,
      templateWhether: false,
      value: '',
      createValue: '',
      thisStyle: '',
      spanStyle: '',
      activeNames: ['1'],
      options: [],
      createOptions: [
        {
          value: '选项1',
          label: '当前用户的服务单位1'
        },
        {
          value: '选项2',
          label: '当前用户的服务单位2'
        },
        {
          value: '选项3',
          label: '当前用户的服务单位3'
        }
      ],
      // 默认表格配置
      tableConfig: {
        isPagination: true,
        columns: [],
        data: [],
        total: 0
      },
      mateColumn: [
        {
          label: '序号',
          type: 'index',
          width: '50px',
          align: 'center'
        },
        {
          prop: 'mateDescribe',
          label: '物料描述',
          align: 'left',
          'show-overflow-tooltip': true,
          render(scoped, h) {
            if (!scoped.row.requCode) {
              return scoped.row.mateDescribe
            } else {
              return elButton.miniText(h, scoped.row.mateDescribe, {
                on: {
                  click: function() {
                    vm.$router.push({
                      name: 'RequestDetail',
                      query: {
                        pageType: 'check',
                        isCopy: 0,
                        isPass: 1,
                        id: scoped.row.requCode
                      }
                    })
                  }
                }
              })
            }
          }
        },
        {
          prop: 'extraName',
          label: '附加费类型',
          align: 'center'
        },
        {
          prop: 'extraTotalPrice',
          label: '金额（元）',
          align: 'right',
          headerRender: function(scoped, h) {
            return h('span', {}, [`金额 (${vm.standardCurrenyName})`])
          },
          render({ row }) {
            return vm.$toFixed.amountGrouping(row.extraTotalPrice)
          }
        },
        {
          prop: 'taxRate',
          label: '税率',
          align: 'center',
          render({ row }, h) {
            const text = vm.taxRateArray.reduce(
              (s, o) => (o.codeCode == row.taxRate ? o.codeName : s),
              ''
            )
            return h('div', { style: 'text-align: center;' }, text)
          }
        },
        {
          prop: 'calcWhether',
          label: '是否计入合同',
          align: 'center',
          render({ row }) {
            if (row.calcWhether == 0) {
              return '否'
            } else {
              return '是'
            }
          }
        }
      ],
      standardCurrenyUnit: '', //本位币单位
      standardCurrenyUnitName: '',
      standardCurrenyName: '',
      detailForm: {
        orderRemark: '',
        orderNote: '', //合同文本
        contractAttachmentList: [],
        exchangeRate: 0, //汇率
        standardCurrenyCode: '', //本位币code
        standardOrderAmount: '', //本位币订单总金额
        relContractName: '',
        contractClassify: '', //合同分类
        projectName: '', //项目名称
        relContract: '', //关联合同
        autoGenWhether: false,
        signDate: filters.formatDateStr(new Date(), 'yyyy-MM-dd'),
        signAddress: '',
        number: '',
        compCode: '',
        contName: '',
        contMobile: '',
        contPhone: '',
        contEmail: '',
        buyerComp: '',
        buyerName: '',
        orderNo: '',
        sellerComp: '',
        sellerName: '',
        sllerOrder: {
          subjectType: 2,
          compCode: '',
          compName: '',
          compAddress: '',
          creditCode: '',
          compLegal: '',
          compPhone: '',
          contName: '',
          contMobile: '',
          contPhone: '',
          contEmail: '',
          bankName: '',
          bankCode: ''
        },
        buyerOrder: {
          subjectType: 1,
          compCode: '',
          compName: '',
          compAddress: '',
          creditCode: '',
          compLegal: '',
          compPhone: '',
          contName: '',
          contMobile: '',
          contPhone: '',
          contEmail: '',
          bankName: '',
          bankCode: ''
        },
        orderNotaxAmount: '',
        ordermateList: [], // 物料
        orderTermsList: [], // 引用条款
        extraViewVo: [],
        orderSettlementListVOList: [], // 付款计划及方式
        worthlessMateList: [], // 无价值物料
        orderBondVO: {
          orderCode: '',
          paymentType: '', //保函/保证金缴费方式(base.pf_nvcode#bidPaymentType)
          performanceBondMoney: '', //保函/保证金金额
          performanceBondType: '', // 保证金类型(base.pf_nvcode#performanceBondType)(3:保证金;4保函)
          performanceBondWhether: false, //是否需要保证金/保函(1true是;0false否)
          receiptAccountName: '', //收费账户名称(买方)
          receiptBankCode: '', //收费银行账号(买方)
          receiptBankName: '' //收费开户行名称(买方)
        },
        mateList: []
      },
      remarkAttachment: {
        remark: '',
        fileList: '',
        noticeWhether: 0
      },
      detailFormRules: {
        'orderBondVO.paymentType': [
          {
            required: true,
            message: '至少选择一项',
            trigger: 'change'
          }
        ],
        'orderBondVO.performanceBondMoney': [
          rules.isEmpty.start('金额不能为空'),
          rules.zeroNumber
        ],
        'orderBondVO.receiptBankName': rules.isEmpty.start('开户银行不能为空'),
        'orderBondVO.receiptAccountName': rules.isEmpty.start(
          '账户名称不能为空'
        ),
        'orderBondVO.receiptBankCode': [
          rules.isEmpty.start('银行账号不能为空'),
          rules.zeroNumber
        ],
        'orderBondVO.performanceBondType': [
          {
            required: true,
            message: '至少选择一项',
            trigger: 'change'
          }
        ],
        'buyerOrder.compName': rules.isEmpty.start('单位名称不能为空'),
        orderNo: rules.isEmpty.start(),
        orderTitle: rules.isEmpty.start({ message: '合同名称不能为空' }),
        contractClassify: {
          required: true,
          message: '至少选择一项',
          trigger: 'change'
        },
        orderNote: {
          required: true,
          message: '请选择引用模板',
          trigger: 'change'
        },
        exchangeRate: rules.isEmpty.start('汇率不能为空'),
        'buyerOrder.contName': rules.isEmpty.start('联系人不能为空'),
        'buyerOrder.contPhone': [
          rules.isEmpty.start('电话不能为空'),
          rules.phoneOrMobile
        ],
        'buyerOrder.contMobile': [
          { required: true, message: '电话不能为空', trigger: 'blur' },
          { min: 1, max: 20, message: '最大长度为20个字符', trigger: 'blur' }
        ],
        'buyerOrder.contEmail': [
          rules.email.start({
            required: false
          })
        ],
        'buyerOrder.bankName': rules.isEmpty.start('开户银行不能为空'),
        'buyerOrder.bankCode': [
          rules.isEmpty.start('银行账号不能为空'),
          rules.buyerBankCode
        ],
        'sllerOrder.compName': rules.isEmpty.start('单位名称不能为空'),
        'sllerOrder.contName': rules.isEmpty.start('联系人不能为空'),
        'sllerOrder.contPhone': [
          rules.isEmpty.start('电话不能为空'),
          rules.sellerOrderContPhone
        ],
        'sllerOrder.contMobile': [
          rules.isEmpty.start('电话不能为空'),
          rules.mobile
        ],
        'sllerOrder.contEmail': [
          rules.email.start({
            required: false
          })
        ],
        'sllerOrder.bankName': rules.isEmpty.start('开户银行不能为空'),
        'sllerOrder.bankCode': [
          rules.isEmpty.start('银行账号不能为空'),
          rules.buyerBankCode
        ],
        'buyerOrder.creditCode': rules.isEmpty.start(
          '统一社会信用代码不能为空'
        ),
        'buyerOrder.buyerName': rules.isEmpty.start('单位名称不能为空'),
        'sllerOrder.sellerName': rules.isEmpty.start('单位名称不能为空'),
        signDate: rules.isEmpty.start({ message: '签约日期不能为空' }),
        signAddress: rules.isEmpty.start({ message: '签约地址不能为空' }),
        'buyerOrder.compLegal': rules.isEmpty.start(
          '法定代表人或委托人不能为空'
        ),
        'sllerOrder.compLegal': rules.isEmpty.start(
          '法定代表人或委托人不能为空'
        ),
        'buyerOrder.compAddress': rules.isEmpty.start('单位地址不能为空'),
        'sllerOrder.compAddress': rules.isEmpty.start('单位地址不能为空'),
        contName: rules.isEmpty.start('姓名不能为空'),
        contMobile: [rules.isEmpty.start('手机不能为空'), rules.mobile],
        contPhone: [
          rules.phone.start({
            required: false
          })
        ]
      },
      orderCode: this.$route.query.orderCode,
      orderValue: this.$route.query,
      oldData: {},
      newData: {},
      name: '',
      creadit: '',
      biaoshi: '',
      xuqiuType: '',
      ORDER_IS_SHOW_SUPPLIER_CONFIRM: '',
      IS_EMERGENCY_RESULT_INPUT: '',
      orderMateListShow: false,
      dataMate: [],
      AddDynamicFormShow: false,
      settlementCategoryList: [], // 结算类别
      isShowCostListFlag: '0', // 付款计划及方式是否显示 0：不显示 1： 显示
      isShowWorthlessMate: '1', // 无价值物料是否显示 1显示 0 不显示
      hasTemporaryMate: false, // 存在临时物料 true：存在 false 不存在 ,如果存在物料是is_temporary=1,则显示[添加物料]按钮
      classCodeList: []
    }
  },
  computed: {
    aduit() {
      return this.$route.query.aduit
    },
    pageType() {
      return this.$route.query.pageType
    },
    pageTitle() {
      if (this.aduit == 1 && this.$route.query.isCode == 1) {
        return '审批'
      }
      if (this.pageType === 'update') {
        return '编制'
      } else if (this.pageType === 'updated') {
        return '修改'
      } else if (this.pageType === 'updates') {
        return '确认'
      } else {
        return '查看'
      }
    },
    mateTotalPrice() {
      // 单价是否含税不含税
      // const taxWhether = this.detailForm.taxWhether
      const taxWhether = true
      // $a: 总金额 $b 不含税总金额；$c 附加费计入总金额 $d 附加费不计入总金额 $e附加费总金额
      const initialValue = { $a: 0, $b: 0, $c: 0, $d: 0, $e: 0 }
      const getTaxRateNumber = taxRate => {
        if (Number(taxRate) === 50) {
          return 0.005
        } else {
          return Number(taxRate) / 100
        }
      }
      let temArr = this.detailForm.ordermateList.filter(
        item => item.mateType && item.mateType != 3
      )
      return temArr.reduce((accumulator, currentMate) => {
        //计入总金额
        let extraList = currentMate.orderMateExtraVOList || []
        let jiruZongJinE = extraList.reduce((a, b) => {
          if (Number(b.calcWhether) === 1) {
            let t = taxWhether
              ? Number(b.extraTotalPrice)
              : Number(b.extraTotalPrice * (getTaxRateNumber(b.taxRate) + 1))
            a += t
          }
          return a
        }, 0)
        accumulator.$c += jiruZongJinE
        console.log(accumulator.$c)
        //不计入总金额
        let bujiZongJinE = extraList.reduce((a, b) => {
          if (Number(b.calcWhether) === 0) {
            let t = taxWhether
              ? Number(b.extraTotalPrice)
              : Number(b.extraTotalPrice * (getTaxRateNumber(b.taxRate) + 1))
            a += t
          }
          return a
        }, 0)
        accumulator.$d += bujiZongJinE
        //含税总金额
        let hanshuiZongJinE =
          Number(currentMate.mateAmount) * Number(currentMate.matePrice) +
          Number(jiruZongJinE)
        let taxRate = currentMate.taxRate
          ? getTaxRateNumber(currentMate.taxRate)
          : 0
        accumulator.$a += hanshuiZongJinE
        //不含税总金额
        let jiruZongJinENotTax = extraList.reduce((a, b) => {
          if (Number(b.calcWhether) === 1) {
            let t =
              Number(b.extraTotalPrice) / (getTaxRateNumber(b.taxRate) + 1)
            a += t
          }
          return a
        }, 0)
        let buhanshuiZongJinE = 0
        buhanshuiZongJinE =
          (Number(currentMate.mateAmount) * Number(currentMate.matePrice)) /
            (1 + taxRate) +
          Number(jiruZongJinENotTax)
        accumulator.$b += buhanshuiZongJinE
        //附加费总和
        let fujiaFei = extraList.reduce((a, b) => {
          let t = taxWhether
            ? Number(b.extraTotalPrice)
            : Number(b.extraTotalPrice * (getTaxRateNumber(b.taxRate) + 1))
          a += t
          return a
        }, 0)
        accumulator.$e += fujiaFei
        return accumulator
      }, initialValue)
    },
    // 物料费用分页
    ordermateList() {
      return this.pagingCalculation(
        this.detailForm.ordermateList,
        this.mateCurPage,
        this.pageSize
      )
    },
    // 物料 > 附加费详情
    materielDescription() {
      const list = []
      this.detailForm.ordermateList.forEach(o => {
        if (o.orderMateExtraVOList) {
          list.push(
            ...o.orderMateExtraVOList.map(v => ({
              mateDescribe: o.mateDescribe,
              ...v
            }))
          )
        }
      })
      return list
    },
    // 附加费列是否展示
    mateColumns() {
      let arr = this.mateColumnsData
      if (this.detailForm.extraWhether) {
        return arr
          ? arr.filter(
              o => !(o.prop === 'totalExtras' || o.prop === 'totalSum')
            )
          : arr.filter(o => o.prop !== 'totalExtras')
      } else {
        return arr
      }
    },
    // 附加费列是否展示
    mateColumnsed() {
      let arr = this.mateColumnsedData
      if (this.detailForm.extraWhether) {
        return arr
          ? arr.filter(
              o => !(o.prop === 'totalExtras' || o.prop === 'totalSum')
            )
          : arr.filter(o => o.prop !== 'totalExtras')
      } else {
        return arr
      }
    },
    getStandardOrderAmount() {
      return (
        Number(
          this.isFirst > 1
            ? this.mateTotalPrice.$a
            : this.detailForm.orderAmount
        ) *
        (Number(this.detailForm.exchangeRate || 0) / 100)
      )
    },
    // 获取用户信息
    ...mapState(['userIdentityInfo'])
  },
  watch: {
    intermediateOrderNote: {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          console.log(newVal, oldVal)
          this.orderNoteChange = true
          this.oldOrderNote = oldVal
        }
      }
    },
    'detailForm.standardCurrenyCode': {
      handler(val) {
        if (this.pageType == 'update') {
          // console.log('监听币种')
          if (val && this.value && val == this.value) {
            this.detailForm.exchangeRate = 100.0
          }
          if (val && this.value && val != this.value) {
            this.selectSameDayExchangeRate()
          }
        }
      }
    },
    detailForm: {
      handler: function(val) {
        this.creadit = !!val.buyerOrder.creditCode
      }
      // immediate: true
    },
    'detailForm.buyerComp': {
      handler(val) {
        if (val && this.show_contract_no) {
          if (this.pageType === 'update') {
            this.generateNumber()
          }
        }
      }
    },
    'detailForm.contractClassify': {
      handler(val) {
        if (val && this.show_contract_no) {
          this.generateNumber()
        }
      }
    }
  },
  created() {
    this.isShowCostList()
    this.getRunParametersByList()
    const val = this.orderValue
    this.dictionary()
    if (this.pageType === 'update') {
      this.getinfofororder(val)
    } else if (this.pageType === 'updated') {
      this.getOrderList(val, 'update')
    } else if (this.pageType === 'check') {
      this.getOrderList(val, 'view')
    } else {
      this.getConfirmRefuse(val)
    }
    let obj4 = {
      classCode: 'valueAddedTaxRate'
    }
    this.$api.common
      .dictionary(obj4)
      .then(resp => {
        if (resp) {
          this.taxRateArray = resp
        }
      })
      .catch(() => console.error('附加费税率获取失败了！'))
    this.getUserRunParameter()
    this.getContractList()
    this.enableBusinessSector()
    this.getMateExtraVersion()
    this.getOrrderMateIsEdit()
    this.isDisplayDeposit()
    // this.isShowExportTemplate()
    // this.isExportTemReqWhether()
    this.getStandardCurrenyName()
  },
  methods: {
    onOpenFeedBackDiolag() {
      this.$refs.feedbackList.dialogVisible = true
    },
    // 下一步 zhubin
    toNext() {
      // 保存
      this.btnText = '下一步'
      this.onSave(0)
    },
    setPagination() {
      return {
        pageSize: 5,
        pageSizes: [5, 10, 20]
      }
    },
    // 本位币单位获取
    async getStandardCurrenyName() {
      let data = await this.$api.purchaceInquiryResult.getCompList()
      data.forEach(item => {
        item.disabled = false
      })
      this.standardCurrenyUnit = this.moneyTextJS(data[0].standardCurrenyCode)
      this.options.map(item => {
        if (item.value == this.value) {
          this.standardCurrenyNameName = item.label
        }
        if (item.value == data[0].standardCurrenyCode) {
          this.standardCurrenyUnitName = item.label
        }
      })
    },
    // 选择引用模板 带出条款
    // changeOrderNote(e) {
    //   this.intermediateOrderNote = e
    //   if (this.detailForm.orderNote) {
    //     this.$confirm('合同模板被修改，请问是否重新生成合同文本?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     })
    //       .then(() => {
    //         this.detailForm.orderNote = this.intermediateOrderNote
    //         this.$refs.orderNoteSelect.blur()
    //         if (this.NEED_OL_EDIT == 1 && this.activeSteps == 1) {
    //           this.toNext()
    //         }
    //       })
    //       .catch(() => {
    //         this.$refs.orderNoteSelect.blur()
    //       })
    //   } else {
    //     this.detailForm.orderNote = this.intermediateOrderNote
    //   }
    // if (this.detailForm.orderTermsList.length > 0) {
    //   this.detailForm.orderTermsList = this.detailForm.orderTermsList.slice(
    //     0,
    //     1
    //   )
    // }
    // let tem_obj = this.contract_list.find(item => item.codeCode == val)
    // if (tem_obj.tem_id) {
    //   console.log(tem_obj.tem_id)
    //   let query = {
    //     id: tem_obj.tem_id
    //   }
    //   this.$nextTick(async () => {
    //     let data = await this.$api.orderAgreement.getTemplateItem(query)
    //     data['templateTermsVOList'] &&
    //       data['templateTermsVOList'].forEach(item => {
    //         item['modelContract'] = false
    //       })
    //     this.getselectedDataed(data)
    //   })
    // }
    // },
    //合同导出物料模板
    async exportContractMate() {
      let orderMateExcelDTO = {
        mateType: 2, //物资类型(1物资分类;2物资明细;3赠送物资;4无价值物资)
        orderType: 1, //	物资类型(1采购订单;2流转销售订单;3流转调拨订单;4框架协议;5框架协议子订单)
        orderComp: this.orderComp,
        suppCode: this.suppCode
      }
      if (this.pageType == 'update') {
        orderMateExcelDTO.resultCodes = this.resultCodes
      }
      if (this.pageType == 'updated') {
        orderMateExcelDTO.orderCode = this.orderCode
      }
      const data = await this.$api.orderAgreement.exportMate(orderMateExcelDTO)
      let fileName = '物料模板' + '.xlsx'
      let blob = new Blob([data], {
        type: 'application/vnd.ms-excel;charset=utf-8'
      })
      // 浏览器兼容性能力检测
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, fileName)
      } else {
        let requestUrl = URL.createObjectURL(blob)
        let downlondTag = document.createElement('a')
        document.body.appendChild(downlondTag)
        downlondTag.href = requestUrl
        downlondTag.download = fileName
        downlondTag.click()
        downlondTag.remove()
      }
    },
    // 合同导入物料模板
    async importContractMate(param) {
      let form = new FormData()
      form.append('file', param.file)
      const data = await this.$api.orderAgreement.importMate(
        2,
        1,
        '',
        this.orderComp,
        this.suppCode,
        form
      )
      if (data.status == 1) {
        this.successStatus = data.status
        this.tem_ordermateList = data.orderMateVOS
        this.$message.success('导入成功')
      } else {
        this.$message.warning(data.errorMessage)
      }
    },
    getSelectedMateData() {
      if (this.successStatus == 1) {
        this.detailForm.ordermateList = this.tem_ordermateList
        for (let item of this.detailForm.ordermateList) {
          this.$set(item, 'dateArray', [
            item.startDeliveryDate || '',
            item.deliveryDate
          ])
          this.$set(item, 'unit', item.unitName || item.unit || item.unitArr[0])
          // 金额计算结果
          const $totalPrice =
            item.mateType == '3' ? 0 : item.mateAmount * (item.matePrice || 0)
          item.totalPrice = $totalPrice
          // 附加费
          item.totalExtras = 0 //先清除附加费
          for (let it of item.orderMateExtraVOList) {
            if (it.calcWhether) {
              if (it.calcWhether == 1) {
                item.totalExtras += it.extraTotalPrice
              }
            } else {
              it.calcWhether = 0
            }
          }
          // 小计计算结果
          item.totalSum = $totalPrice + Number(item.totalExtras)
        }
        let num = 0
        this.detailForm.ordermateList.map(item => {
          let k = item.orderMateExtraVOList.reduce(function(a, b) {
            let n = 0
            if (b.calcWhether == 0) {
              let t = Number(b.extraTotalPrice)
              n += t
            }
            return isNaN(n) ? a : a + n
          }, 0)
          num += k
        })
        this.noSubTotal1 = num
        //导入成功后，含税总金额和不含税总金额触发计算
        this.watchList()
      }
    },
    getValue2(val) {
      let arr = this.paymentTypeOptions.filter(item => {
        return item.value === val
      })
      if (arr && arr.length > 0) {
        return arr[0].label
      }
    },
    //是否显示保证金
    async isDisplayDeposit() {
      const code = await this.$api.executePlanning.buyerShow([
        'OC_ORDER_IS_SHOW_PERFORMANCE_BOND'
      ])
      this.OC_ORDER_IS_SHOW_PERFORMANCE_BOND =
        code.OC_ORDER_IS_SHOW_PERFORMANCE_BOND
      let params = { classCode: 'bidPaymentType' }
      let datas = await this.$api.common.dictionary(params)
      this.paymentTypeOptions = this.selectItem(datas)
      let params2 = { classCode: 'performanceBondType' }
      let datas2 = await this.$api.common.dictionary(params2)
      this.performanceBondTypeOptions = this.selectItem(datas2)
    },
    // async isShowExportTemplate() {
    //   const code = await this.$api.executePlanning.buyerShow([
    //     'ORDER_IS_SHOW_EXPORT_TEMPLATE'
    //   ])
    //   this.ORDER_IS_SHOW_EXPORT_TEMPLATE = code.ORDER_IS_SHOW_EXPORT_TEMPLATE
    // },
    // async isExportTemReqWhether() {
    //   const code = await this.$api.executePlanning.buyerShow([
    //     'ORDER_EXPORT_TEMPLATE_REQUIRED_WHETHER'
    //   ])
    //   this.ORDER_EXPORT_TEMPLATE_REQUIRED_WHETHER =
    //     code.ORDER_EXPORT_TEMPLATE_REQUIRED_WHETHER
    //   if (this.ORDER_EXPORT_TEMPLATE_REQUIRED_WHETHER === '1') {
    //     this.detailFormRules.orderNote.required = true
    //   } else {
    //     this.detailFormRules.orderNote.required = false
    //   }
    // },
    //编制是否可编辑
    async getOrrderMateIsEdit() {
      const code = await this.$api.executePlanning.buyerShow([
        'OC_ORDER_MATE_IS_EDIT',
        'MC_MATERIELS_TEMPORARY'
      ])
      this.OC_ORDER_MATE_IS_EDIT = code.OC_ORDER_MATE_IS_EDIT
      this.MC_MATERIELS_TEMPORARY = code.MC_MATERIELS_TEMPORARY
    },
    //显示新旧附加费弹窗
    async getMateExtraVersion() {
      const code = await this.$api.executePlanning.buyerShow([
        'MATE_EXTRA_VERSION'
      ])
      this.MATE_EXTRA_VERSION = code.MATE_EXTRA_VERSION
    },
    //是否启用业务板块
    async enableBusinessSector() {
      const code = await this.$api.executePlanning.buyerShow([
        'ENABLE_BUSINESS_SECTOR_WHETHER'
      ])
      if (code.ENABLE_BUSINESS_SECTOR_WHETHER === '1') {
        this.ENABLE_BUSINESS_SECTOR_WHETHER = true
      } else {
        return false
      }
      let params = { classCode: 'businessSector' }
      let datas = await this.$api.common.dictionary(params)
      this.businessSectorOptions = this.selectItem(datas)
    },
    //获取附件配置
    async getFileConfigs(billType) {
      let data = await this.$api.orderAgreement.getFileConfigs(billType)
      if (data) {
        this.detailForm.contractAttachmentList = data
      }
    },
    /**
     *  获取系统参数：付款计划及方式是否显示
     */
    async isShowCostList() {
      const res = await this.$api.executePlanning.buyerShow([
        'OC_ORDER_IS_SETTLEMENT',
        'IS_SHOW_WORTHLESSORDERMATE'
      ])
      this.isShowCostListFlag = res['OC_ORDER_IS_SETTLEMENT']
      this.isShowWorthlessMate = res['IS_SHOW_WORTHLESSORDERMATE'] // 无价值物料
    },
    // 币种切换
    changCurrency(val) {
      if (val == this.detailForm.standardCurrenyCode) {
        this.detailForm.exchangeRate = 100.0
      } else {
        this.detailForm.standardCurrenyCode && this.selectSameDayExchangeRate()
      }
      this.standardCurrenyName = this.moneyTextJS(val)
      this.options.map(item => {
        if (item.value == val) {
          this.name = item.label
        }
      })
    },
    //获取汇率
    async selectSameDayExchangeRate() {
      let params = {
        standardCurrenyCode: this.value,
        foreignCurrenyCode: this.detailForm.standardCurrenyCode
      }
      let data = await this.$api.orderAgreement.getSameDayExchangeRate(
        qs.stringify(params)
      )
      if (data) {
        this.detailForm.exchangeRate = data
      } else {
        this.detailForm.exchangeRate = 0
      }
    },
    getValue(val) {
      let arr = this.businessSectorOptions.filter(item => {
        return item.value === val
      })
      if (arr && arr.length > 0) {
        return arr[0].label
      }
    },
    onSelected(orderCode, orderTitle) {
      this.detailForm.relContract = orderCode
      this.detailForm.relContractName = orderTitle
    },
    chooseContract() {
      this.$refs.ChooseContract.openDialog()
    },
    async isShowRelContract() {
      const code = await this.$api.executePlanning.buyerShow([
        'IS_SHOW_REL_CONTRACT'
      ])
      if (code.IS_SHOW_REL_CONTRACT === '1') {
        this.IS_SHOW_REL_CONTRACT = true
      } else {
        return
      }
    },
    async getContractOptions() {
      const code = await this.$api.executePlanning.buyerShow([
        'IS_SHOW_CONTRACT_CLASSIFY'
      ])
      if (code.IS_SHOW_CONTRACT_CLASSIFY === '1') {
        this.IS_SHOW_CONTRACT_CLASSIFY = true
      } else {
        return
      }
      let params = { classCode: 'contractClassify', paramFlag: 3 }
      let datas = await this.$api.common.getDemandTree(params)
      this.contractClassifyOptions = datas
    },
    async generateNumber() {
      if (this.detailForm.buyerComp && this.detailForm.contractClassify) {
        let params = {
          compCode: this.detailForm.buyerComp,
          numberType: this.detailForm.contractClassify,
          businessType: 1
        }
        let data = await this.$api.orderAgreement.generateNumber(params)
        this.detailForm.orderNo = data
        this.detailForm.autoGenWhether = true
      }
    },
    contractNoChange() {
      this.detailForm.autoGenWhether = false
    },
    setRules(item) {
      let rules = []
      //是否必填
      if (item.mandatoryWhether) {
        if (item.valueType === 'input') {
          rules.push({ required: true, message: ' ', trigger: 'blur' })
        } else if (
          item.valueType === 'enum-radio' ||
          item.valueType === 'dict-kv'
        ) {
          rules.push({
            required: true,
            message: '至少选择一项',
            trigger: 'change'
          })
        }
      }
      //是否效验
      if (item.checkWhether) {
        //效验类型不是null
        if (item.checkType) {
          if (item.checkType === 'length') {
            rules.push({
              max: item.checkExpression,
              message: ' ',
              trigger: 'blur'
            })
          } else if (item.checkType === 'regular') {
            const checkExpression = (rule, value, callback) => {
              if (value) {
                let reg = new RegExp(item.checkExpression)
                if (reg.test(value)) {
                  callback()
                } else {
                  callback(new Error(' '))
                }
              }
              callback()
            }
            rules.push({
              validator: checkExpression,
              trigger: 'blur'
            })
          }
        }
      }
      return rules
    },
    async getAllDictKv() {
      if (this.detailForm.extraViewVo) {
        let extraViewVo = this.detailForm.extraViewVo
        for (let i = 0; i < extraViewVo.length; i++) {
          if (extraViewVo[i].valueType === 'dict-kv') {
            let valueExtra = extraViewVo[i].valueExtra
            let params = { classCode: valueExtra }
            console.log(params)
            let datas = await this.$api.common.dictionary(params)
            if (datas) {
              this.detailForm.extraViewVo[
                i
              ].configExtraEnumVoList = this.selectItem(datas)
            }
          }
        }
      }
    },
    async getRunParametersByList() {
      let paraCodeList = [
        'IS_SHOW_CONTRACT_SENDSMS',
        'IS_EMERGENCY_RESULT_INPUT',
        'ORDER_IS_SHOW_SUPPLIER_CONFIRM'
      ]
      let data = await this.$api.request.getRunParametersByList(paraCodeList)
      this.xuqiuType = data.IS_SHOW_CONTRACT_SENDSMS
      this.IS_EMERGENCY_RESULT_INPUT = data.IS_EMERGENCY_RESULT_INPUT
      this.ORDER_IS_SHOW_SUPPLIER_CONFIRM = data.ORDER_IS_SHOW_SUPPLIER_CONFIRM
    },
    async getUserRunParameter() {
      let obj5 = `paraCode=OC_ORDER_TEMPLATE_ENABLE`
      let data = await this.$api.orderAgreement.getUserRunParameter(obj5)
      this.biaoshi = data
    },
    numberChinese,
    // 分页计算
    pagingCalculation(list, pageNum, pageSize) {
      pageNum = pageNum || 20
      pageSize = pageSize || 5
      const start = pageSize * (pageNum - 1)
      const end = start + pageSize
      return list.slice(start, end)
    },
    // 初始化固化条款数据
    async getInitializeValue() {
      let params = {
        type: 0
      }
      return await this.$api.orderAgreement.getInitializeValue(params)
    },
    //初始化物资列表单条数据容差数值
    SetSelectLimitList(mateItem, selectLimitList) {
      for (let unit of selectLimitList) {
        if (mateItem.unitName == unit.unitNameName) {
          let lowerLimit = unit.lowerLimit ? -unit.lowerLimit : unit.lowerLimit
          this.$set(mateItem, 'lowerLimit', lowerLimit)
          this.$set(mateItem, 'upperLimit', unit.upperLimit)
        } else {
          this.$set(mateItem, 'lowerLimit', '')
          this.$set(mateItem, 'upperLimit', '')
        }
      }
    },
    //添加物料单个数据获取容差数值
    getLimit(unitName, selectLimitList) {
      for (let unit of selectLimitList) {
        if (unitName == unit.unitNameName) {
          let lowerLimit = unit.lowerLimit ? -unit.lowerLimit : unit.lowerLimit
          return {
            lowerLimit: lowerLimit,
            upperLimit: unit.upperLimit
          }
        }
      }
    },
    watchList() {
      this.isFirst++
    },
    // 编制合同初始化
    async getinfofororder(val) {
      this.resultCode = val.resultCode
      let contractList = this.$store.state.contract.contractList
      let queryForOrderVO = null
      if (contractList.length >= 1) {
        queryForOrderVO = contractList
      } else {
        queryForOrderVO = [
          {
            resultCode: val.resultCode,
            resultMateId: val.resultMateId,
            splitIds: val.splitIds
          }
        ]
      }
      const p1 = this.$api.orderAgreement.getinfofororder(queryForOrderVO)
      // 获取结算类别字典值
      const p2 = this.$api.common.getDictionary({
        classCode: 'settlementCategory'
      })
      const p3 = this.getCustConfigExtra()
      Promise.all([p1, p2, p3]).then(async res => {
        const data = res[0]
        const list = res[1]
        const dataMate = res[2]
        this.dataMate = dataMate
        this.settlementCategoryList = list
        const resp = await this.getInitializeValue()
        const code = await this.$api.executePlanning.buyerShow([
          'IS_SWITCH_GENERATE_CONTRACT_NO'
        ])
        if (code.IS_SWITCH_GENERATE_CONTRACT_NO === '1') {
          this.show_contract_no = true
        }
        if (data && resp) {
          console.log('data', data)
          data.ordermateList.map(item => {
            item.isMerge =
              item.resultPurMergeMateVOList &&
              item.resultPurMergeMateVOList.length > 1
                ? true
                : false
          })
          let ordermateList =
            data.ordermateList.filter(item => item.mateType != '1') || [] // 物料
          data.orderTermsList = data.orderTermsList || [] // 引用条款
          data.orderTermsList.push(...resp.pfTermsVOS)
          let mateList = data.ordermateList.filter(item => item.mateType == '1') // 物料分类
          console.log('mateList', mateList)
          this.value = data.currencyCode || '4'
          this.standardCurrenyName = this.moneyTextJS(this.value)
          this.dictionary()
          this.orderComp = data.buyerOrder.compCode
          this.suppCode = data.sllerOrder.compCode
          this.resultCodes = data.resultCodes
          /**
           * 合同编制页,如果存在物料是is_temporary=1,则显示[添加物料]按钮
             默认初始化is_temporary=0的数据 到 正式物料表
             物料弹窗数据 根据 is_temporary=1的class_code查询显示
             提交验证 分类表 和正式物料表的数量之和相等
           */
          this.hasTemporaryMate =
            data.ordermateList.filter(item => item.isTemporary == 1).length != 0
              ? true
              : false
          /**
           * 在回显分类时，添加classCodeList入参（如：010102,010104）；
           * 在搜索物料明细时，添加classCodeList入参
           *
           */
          this.classCodeList = data.ordermateList.map(item => {
            if (item.mateType === 1) {
              return item.classCode
            }
          })

          /**
           * 对初始数据操作，子组件-无价值物料列表里交货日期区间显示时后端没有对应的数组值，前端转换生成
           * @type {[]|*|(T&{dateArray: [string|[{trigger: string, message: string, required: boolean}]|*, *|string]})[]}
           */
          const worthlessMateList =
            data.worthlessMateList &&
            data.worthlessMateList.map(item => {
              return {
                ...item,
                dateArray: [
                  item.startDeliveryDate ? item.startDeliveryDate : '',
                  item.deliveryDate ? item.deliveryDate : ''
                ]
              }
            })

          this.detailForm = {
            ...this.detailForm,
            ...data,
            worthlessMateList,
            ordermateList,
            mateList
          }
          let _ordermateList = this.detailForm.ordermateList
          let _mateList = this.detailForm.mateList
          _ordermateList.length > 0 &&
            _ordermateList.forEach(item => {
              this.$set(item, 'lowerLimit', '')
              this.$set(item, 'upperLimit', '')
            })
          _mateList.length > 0 &&
            _mateList.forEach(item => {
              this.$set(item, 'lowerLimit', '')
              this.$set(item, 'upperLimit', '')
            })
          const code = await this.$api.executePlanning.buyerShow([
            'IS_SHOW_TOLERANCE'
          ])
          if (code.IS_SHOW_TOLERANCE && code.IS_SHOW_TOLERANCE == 1) {
            // this.selectLimitList = await this.$api.orderAgreement.selectLimitByUnit()
            let xhr = null
            xhr = new XMLHttpRequest()
            try {
              xhr.open(
                'get',
                '/api-coordination/shipmentlimit/selectLimitList',
                true
              )
              xhr.setRequestHeader(
                'Content-Type',
                'application/x-www-form-urlencoded'
              )
              xhr.send()
              xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                  if (xhr.status == 200) {
                    this.selectLimitList = [
                      ...JSON.parse(xhr.responseText).data
                    ]
                    if (_ordermateList) {
                      _ordermateList.forEach(item => {
                        if (this.selectLimitList.length > 0) {
                          this.SetSelectLimitList(item, this.selectLimitList)
                          console.log(this.selectLimitList)
                        }
                      })
                    }
                    if (_mateList) {
                      _mateList.forEach(item => {
                        if (this.selectLimitList.length > 0) {
                          this.SetSelectLimitList(item, this.selectLimitList)
                        }
                      })
                    }
                  } else {
                    return
                  }
                }
              }
            } catch (e) {
              console.log(e)
            }
          }
          if (_ordermateList) {
            _ordermateList.forEach(item => {
              this.$set(item, 'extraViewVo', cloneDeep(dataMate))
              // this.$set(item, 'startDeliveryDate', '')
              this.$set(item, 'dateArray', [
                item.startDeliveryDate || '',
                item.deliveryDate
              ])
              // if (this.selectLimitList.length > 0) {
              //   this.SetSelectLimitList(item, this.selectLimitList)
              // } else {
              //   this.$set(item, 'lowerLimit', '')
              //   this.$set(item, 'upperLimit', '')
              // }
            })
          }
          if (_mateList) {
            _mateList.forEach(item => {
              this.$set(item, 'extraViewVo', cloneDeep(dataMate))
              // this.$set(item, 'startDeliveryDate', '')
              this.$set(item, 'dateArray', [
                item.startDeliveryDate || '',
                item.deliveryDate
              ])
              // if (this.selectLimitList.length > 0) {
              //   this.SetSelectLimitList(item, this.selectLimitList)
              // } else {
              //   this.$set(item, 'lowerLimit', '')
              //   this.$set(item, 'upperLimit', '')
              // }
            })
          }

          this.detailForm.ordermateList = _ordermateList
          this.detailForm.mateList = _mateList

          this.detailForm.sllerOrder.contPhone = data.sllerOrder.contMobile
            ? data.sllerOrder.contMobile
            : data.sllerOrder.contPhone
          if (!this.show_contract_no) {
            this.detailForm.orderNo = data.orderNo
          } else {
            this.detailForm.orderNo = ''
          }
          if (this.detailForm.buyerOrder.internalCode === '1010') {
            this.businessSectorRules = [
              {
                required: true,
                message: '至少选择一项',
                trigger: 'change'
              }
            ]
          } else {
            this.businessSectorRules = []
          }
          this.detailForm.buyerOrder.contPhone = this.detailForm.buyerOrder
            .contPhone
            ? this.detailForm.buyerOrder.contPhone
            : this.detailForm.buyerOrder.contMobile
        }
        this.getContractOptions()
        this.isShowRelContract()
        if (!data) {
          this.onCancel()
        }
      })
    },
    getCustConfigExtra() {
      return new Promise(async resolve => {
        let params = {
          businessType: 'contract',
          orderType: 1,
          pageType: 'add',
          viewScope: 1
        }
        //表单
        let data = await this.$api.orderAgreement.getCustConfigExtra(params)
        if (data) {
          this.detailForm.extraViewVo = data || []
          let extraViewVo = this.detailForm.extraViewVo
          for (let i = 0; i < extraViewVo.length; i++) {
            if (extraViewVo[i].valueType === 'dict-kv') {
              let valueExtra = extraViewVo[i].valueExtra
              let params = { classCode: valueExtra }
              let datas = await this.$api.common.dictionary(params)
              if (datas) {
                this.detailForm.extraViewVo[
                  i
                ].configExtraEnumVoList = this.selectItem(datas)
              }
            }
          }
          this.AddDynamicFormShow = true
        }
        //物料列表
        let paramsMate = {
          businessType: 'contract_mate',
          orderType: 2,
          pageType: 'add',
          viewScope: 1
        }
        let dataMate = await this.$api.orderAgreement.getCustConfigExtra(
          paramsMate
        )

        if (dataMate && dataMate.length > 0) {
          this.dataMate = dataMate
          let SelectAllDictKv = {}
          for (let i = 0; i < this.dataMate.length; i++) {
            if (this.dataMate[i].valueType === 'dict-kv') {
              let fieldCode = this.dataMate[i].fieldCode
              let params = { classCode: fieldCode }
              let datas = await this.$api.common.dictionary(params)
              if (datas) {
                SelectAllDictKv[i] = this.selectItem(datas)
              }
            }
          }
          this.dataMate.forEach((kitem, kindex) => {
            if (kitem.valueType === 'dict-kv') {
              kitem.configExtraEnumVoList = SelectAllDictKv[kindex]
            }
            console.log(kitem.fieldName)
            console.log(kitem.configExtraEnumVoList)
          })
          resolve(this.dataMate)
          this.orderMateListShow = true
        } else {
          resolve([])
          this.orderMateListShow = true
        }
      })
    },
    // 修改合同初始化
    async getOrderList(val, pageType) {
      let params = `${val.orderCode}`
      const p1 = this.$api.orderAgreement.getOrderList(params, {
        pageType: pageType
      })
      // 获取结算类别字典值
      const p2 = this.$api.common.getDictionary({
        classCode: 'settlementCategory'
      })
      const p3 = this.getCustConfigExtra()
      Promise.all([p1, p2, p3]).then(res => {
        const data = res[0]
        const list = res[1]
        const dataMate = res[2]
        this.dataMate = dataMate
        this.settlementCategoryList = list
        if (data) {
          // 审批数据 zhubin
          if (this.pageAduit == '1') {
            this.$emit('aduitEvent', data)
          }
          this.hasTemporaryMate =
            data.ordermateList.filter(item => item.isTemporary == 1).length != 0
              ? true
              : false
          console.log(' this.hasTemporaryMate', this.hasTemporaryMate)
          this.classCodeList = data.ordermateList.map(item => {
            if (item.mateType === 1) {
              return item.classCode
            }
          })
          data.orderTermsList = data.orderTermsList || [] // 引用条款
          data.sllerOrder = data.sellerOrder || {}
          this.value = data.currencyCode || '4' //币种
          this.standardCurrenyName = this.moneyTextJS(this.value) //币种单位
          this.dictionary()
          let ordermateList =
            data.ordermateList.filter(item => item.mateType != '1') || [] // 物料明细
          let mateList = data.ordermateList.filter(item => item.mateType == '1') // 物料分类
          for (let item of ordermateList) {
            this.$set(item, 'dateArray', [
              item.startDeliveryDate || '',
              item.deliveryDate
            ])
          }
          for (let item of mateList) {
            this.$set(item, 'dateArray', [
              item.startDeliveryDate || '',
              item.deliveryDate
            ])
          }
          const worthlessMateList =
            data.worthlessMateList &&
            data.worthlessMateList.map(item => {
              return {
                ...item,
                dateArray: [
                  item.startDeliveryDate ? item.startDeliveryDate : '',
                  item.deliveryDate ? item.deliveryDate : ''
                ]
              }
            })
          this.detailForm = {
            ...data,
            worthlessMateList,
            ordermateList,
            mateList
          }

          if (this.detailForm.buyerOrder.internalCode === '1010') {
            this.businessSectorRules = [
              {
                required: true,
                message: '至少选择一项',
                trigger: 'change'
              }
            ]
          } else {
            this.businessSectorRules = []
          }
        }
        this.suppConfirm = data.suppConfirm
        this.templateWhether = data.templateWhether
        this.noticeWheathers = data.noticeWheather
        this.confirmResu = data.confirmResu
        this.confirmRemark = data.confirmRemark
        this.confirmRecordListVO = data.confirmRecordListVO || []
        this.remarkAttachment = {
          remark: '',
          fileVOList: data.dFileList || [],
          noticeWhether: data.noticeWheather ? true : false
        }
        this.getAllDictKv()
        this.AddDynamicFormShow = true
        this.orderMateListShow = true
        this.getContractOptions()
        this.isShowRelContract()
        if (!data) {
          this.onCancel()
        }
        this.detailForm.orderBondVO.performanceBondWhether =
          data.orderBondVO.performanceBondWhether
      })
    },
    // 确认合同初始化
    async getConfirmRefuse(val) {
      let params = `${val.orderCode}`
      const p1 = this.$api.orderAgreement.getConfirmRefuse(params)
      // 获取结算类别字典值
      const p2 = this.$api.common.getDictionary({
        classCode: 'settlementCategory'
      })
      const p3 = this.getCustConfigExtra()
      Promise.all([p1, p2, p3]).then(res => {
        const data = res[0]
        const list = res[1]
        const dataMate = res[2]
        this.dataMate = dataMate
        this.settlementCategoryList = list
        this.newData = data.newData
        this.oldData = data.oldData
        if (data) {
          data.newData.ordermateList = data.newData.ordermateList || [] // 物料
          data.newData.orderTermsList = data.newData.orderTermsList || [] // 引用条款
          this.orderTermsList = data.newData.orderTermsList || [] // 引用条款
          data.newData.sllerOrder = data.newData.sellerOrder //|| {}
          const worthlessMateList =
            data.newData.worthlessMateList &&
            data.newData.worthlessMateList.map(item => {
              return {
                ...item,
                dateArray: [
                  item.startDeliveryDate ? item.startDeliveryDate : '',
                  item.deliveryDate ? item.deliveryDate : ''
                ]
              }
            })
          this.hasTemporaryMate =
            data.newData.ordermateList.filter(item => item.isTemporary == 1)
              .length != 0
              ? true
              : false
          this.classCodeList = data.newData.ordermateList.map(item => {
            if (item.mateType === 1) {
              return item.classCode
            }
          })
          let ordermateList = data.newData.ordermateList.filter(
            item => item.mateType != '1'
          ) // 物料明细
          let mateList = data.newData.ordermateList.filter(
            item => item.mateType == '1'
          ) // 物料分类
          for (let item of ordermateList) {
            this.$set(item, 'dateArray', [
              item.startDeliveryDate || '',
              item.deliveryDate
            ])
          }
          for (let item of mateList) {
            this.$set(item, 'dateArray', [
              item.startDeliveryDate || '',
              item.deliveryDate
            ])
          }
          this.detailForm = {
            ...data.newData,
            worthlessMateList,
            ordermateList,
            mateList
          }
          console.log(this.detailForm)
          this.value = data.newData.currencyCode || '4' //币种
          this.standardCurrenyName = this.moneyTextJS(this.value) //币种单位
          this.dictionary()
          this.detailForm.standardCurrenyCode = data.newData.standardCurrenyCode
          this.suppConfirm = data.newData.suppConfirm
          this.confirmResu = data.newData.confirmResu
          this.confirmRemark = data.newData.confirmRemark
          this.confirmRecordListVO = data.newData.confirmRecordListVO || []
          this.templateWhether = data.newData.templateWhether
          this.noticeWheathers = data.newData.noticeWheather
          this.remarkAttachment.fileVOList =
            data.newData.dFileList || this.remarkAttachment.fileList
        }
        this.remarkAttachment = {
          remark: '',
          fileVOList: data.dFileList || [],
          noticeWhether: data.noticeWheather ? true : false
        }
        this.getContractOptions()
        this.isShowRelContract()
        this.AddDynamicFormShow = true
        this.orderMateListShow = true
        this.detailForm.orderBondVO.performanceBondWhether =
          data.newData.orderBondVO.performanceBondWhether
      })
    },
    isObjEqual(key, value, str) {
      const oldValue = get(this.oldData, key)
      return value == oldValue ? '' : str || 'color:red!important'
    },
    //下拉框选中方法
    selectItem(data) {
      let selectAll = []
      data.forEach(item => {
        let selectObj = {
          label: item.codeName,
          value: item.codeCode
        }
        selectAll.push(selectObj)
      })
      return selectAll
    },
    // 币种
    async dictionary() {
      let params = { classCode: 'currency' }
      let datas = await this.$api.common.dictionary(params)
      this.options = this.selectItem(datas)
      this.options.map(item => {
        if (item.value == this.value) {
          this.name = item.label
        }
      })
    },
    /**
     * 提交时校验两个表的数量是否满足条件
     */
    validMateAmount(table1, table2) {
      //table1 明细表
      //table2 分类表
      let key1 = []
      let key2 = []
      key1 = table1.map(item => {
        return item.classCode
      })
      key2 = table2.map(item => {
        return item.classCode
      })
      for (let i = 0; i < key2.length; i++) {
        if (!key1.includes(key2[i])) {
          this.$message.warning('请添加对应分类明细')
          return false
        }
      }
      console.log(key1, key2)
      //明细表物资数量总和应小于等于分类表对应的分类数量；
      let table1ary = table1
        .filter(item => key2.includes(item.classCode))
        .map(item => {
          return {
            classCode: item.classCode,
            total: item.mateAmount
          }
        })
      console.log(table1ary)
      let obj = {}
      for (let i = 0; i < table1ary.length; i++) {
        let total = table2
          .filter(item => item.classCode == table1ary[i].classCode)
          .map(item => Number(item.mateAmount))
          .reduce((total, item) => total + item, 0)
        obj[table1ary[i].classCode] = total
      }
      for (let attr in obj) {
        let total = table1ary.reduce((accumulator, currentItem) => {
          if (currentItem.classCode === attr) {
            return accumulator + Number(currentItem.total)
          } else {
            return accumulator + 0
          }
        }, 0)
        if (total > obj[attr]) {
          this.$message.warning('分类表 和正式物料表的数量之和不相等')
          return false
        }
      }
      return true
    },
    onSubmit() {
      const worthlessMate =
        this.isShowWorthlessMate == '1' && this.pageType != 'check'
          ? this.$refs.worthlessMate.validateForm()
          : true
      const costForm =
        this.isShowCostListFlag == '1' && this.pageType != 'check'
          ? this.$refs.costListRef.validateForm()
          : true
      const otherFee = this.$refs.otherFee.confirmOtherFree()
      const detailForm = new Promise(resolve => {
        return this.$refs.detailForm.validate(valid => {
          if (valid) {
            resolve()
          }
        })
      })
      const mateListRef = this.$refs.mateListRef
      const ordermateListRef = this.$refs.ordermateListRef
      const result = [
        otherFee,
        detailForm,
        costForm,
        worthlessMate,
        mateListRef && mateListRef.validator(),
        ordermateListRef && ordermateListRef.validator()
      ]
      Promise.all(result.filter(Boolean))
        .then(() => {
          const inquisitor = []
          const send = () => {
            if (this.detailForm.mateList.length > 0) {
              let flag = this.validMateAmount(
                this.detailForm.ordermateList,
                this.detailForm.mateList
              )
              if (!flag) {
                return false
              }
            }

            this.getNewExamInfo('OC_ORDER_PURCHASE').then(resExamInfoRes => {
              // 是否需要审核: 1 是需要，0 不是需要， 2 没有对应关系，弹框提示
              if (resExamInfoRes.examWhether === 1) {
                // 是否需要外部审批
                if (resExamInfoRes.externalWhether === 1) {
                  // 获取工作流
                  this.onSend(1)
                  return
                } else {
                  // 获取工作流
                  this.getFlowDict('OC_ORDER_PURCHASE').then(flowDict => {
                    this.detailForm.flowDict = flowDict
                    this.onSend(1)
                  })
                  return
                }
              }
              // 没有工作流直接掉接口保存
              if (resExamInfoRes.examWhether === 0) {
                this.onSend(1)
                return
              }
              this.$message.error('无审批配置流程。')
            })
          }
          if (!mateListRef && !ordermateListRef) {
            send()
            return
          }
          if (mateListRef) {
            inquisitor.push(mateListRef.validatorAll())
          }
          if (ordermateListRef) {
            inquisitor.push(ordermateListRef.validatorAll())
          }
          Promise.all(inquisitor)
            .then(() => {
              send()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.scrollIntoViewInvalidField()
        })
    },
    onSave(e) {
      if (this.activeSteps == 2) {
        // 文本编辑保存  zhubin
        this.$emit('editorSave', e)
        return
      }
      this.$refs.detailForm.validate(valid => {
        if (valid) {
          if (this.btnText == '下一步') {
            // 付款计划及方式list
            this.detailForm.orderSettlementListVOList =
              this.isShowCostListFlag == '1'
                ? this.$refs.costListRef.submitForm()
                : []
            // 校验
            const worthlessMate =
              this.isShowWorthlessMate == '1' && this.pageType != 'check'
                ? this.$refs.worthlessMate.validateForm()
                : true
            const costForm =
              this.isShowCostListFlag == '1' && this.pageType != 'check'
                ? this.$refs.costListRef.validateForm()
                : true
            const otherFee = this.$refs.otherFee.confirmOtherFree()
            const detailForm = new Promise(resolve => {
              return this.$refs.detailForm.validate(valid => {
                if (valid) {
                  resolve()
                }
              })
            })
            const mateListRef = this.$refs.mateListRef
            const ordermateListRef = this.$refs.ordermateListRef
            const result = [
              otherFee,
              detailForm,
              costForm,
              worthlessMate,
              mateListRef && mateListRef.validator(),
              ordermateListRef && ordermateListRef.validator()
            ]
            Promise.all(result.filter(Boolean))
              .then(() => {
                const inquisitor = []
                const send = () => {
                  if (this.detailForm.mateList.length > 0) {
                    let flag = this.validMateAmount(
                      this.detailForm.ordermateList,
                      this.detailForm.mateList
                    )
                    if (!flag) {
                      return false
                    }
                  }
                  this.onSend(0)
                }
                if (!mateListRef && !ordermateListRef) {
                  send()
                  return
                }
                if (mateListRef) {
                  inquisitor.push(mateListRef.validatorAll())
                }
                if (ordermateListRef) {
                  inquisitor.push(ordermateListRef.validatorAll())
                }
                Promise.all(inquisitor)
                  .then(() => {
                    send()
                  })
                  .catch(err => {
                    console.log(err)
                  })
              })
              .catch(() => {
                this.scrollIntoViewInvalidField()
              })
          } else {
            this.onSend(0)
          }
        } else {
          this.scrollIntoViewInvalidField()
        }
      })
    },
    onClose() {
      this.$closeCurrentPage()
    },
    onCancel() {
      this.$router.push({ name: 'OrderAgreementManage' }).catch(() => {})
    },
    // 编辑合同提交保存
    async addOrderAgreements(params) {
      let data = null
      if (this.orderCodeEvent) {
        params.orderCode = this.orderCodeEvent
        params.statusCode = this.statusCodeEvent
        data = await this.$api.orderAgreement.editOrderAgreements(params)
      } else {
        data = await this.$api.orderAgreement.addOrderAgreements(params)
      }
      if (data) {
        this.orderCodeEvent = data.orderCode
        this.statusCodeEvent = data.statusCode
        if (this.btnText == '下一步') {
          this.$emit('activeEvent', {
            active: 2,
            orderCode: data.orderCode,
            orderTitle: this.detailForm.orderTitle,
            isReplace: this.pageType == 'check' ? true : false
          })
          return
        }
        this.onCancel()
      }
    },
    // 修改合同提交保存
    async addOrderAgreement(params) {
      let data = await this.$api.orderAgreement.addOrderAgreement(params)
      if (data) {
        this.orderCodeEvent = data.orderCode
        this.statusCodeEvent = data.statusCode
        if (this.btnText == '下一步') {
          this.$emit('activeEvent', {
            active: 2,
            orderCode: data.orderCode,
            orderTitle: this.detailForm.orderTitle,
            isReplace: this.pageType == 'check' ? true : false
          })
          return
        }
        this.onCancel()
      }
    },
    onSend(flag) {
      if (this.detailForm.ordermateList.length == 0) {
        this.$message.warning('请添加物料')
        return
      }
      if (this.pageType === 'update') {
        let flagvalidate = this.$refs.ContractAttachment.validateForm()
        let ContractAttachment = null
        console.log(flagvalidate)
        if (flagvalidate) {
          ContractAttachment = this.$refs.ContractAttachment.getData()
          this.detailForm.contractAttachmentList = ContractAttachment
        } else {
          return false
        }
        // 付款计划及方式list
        let orderSettlementListVOList =
          this.isShowCostListFlag == '1'
            ? this.$refs.costListRef.submitForm()
            : []
        console.log(orderSettlementListVOList)
        // 无价值物料
        let worthlessMateList =
          this.isShowWorthlessMate == '1'
            ? this.$refs.worthlessMate.submitData()
            : []
        let ordermateList = this.detailForm.ordermateList.concat(
          this.detailForm.mateList
        )
        console.log(ordermateList)
        let params = {
          ...this.detailForm,
          buyerName: this.detailForm.buyerOrder.compName,
          sellerOrder: this.detailForm.sllerOrder,
          orderNo: this.detailForm.orderNo,
          orderType: 1,
          flag: flag,
          noticeWheather: this.noticeWheather,
          currencyCode: this.value,
          suppConfirm: this.suppConfirm,
          templateWhether: this.templateWhether,
          contractAttachmentList: ContractAttachment,
          extraAmount: this.mateTotalPrice.$c,
          orderAmount:
            this.isFirst > 1
              ? this.mateTotalPrice.$a
              : this.detailForm.orderAmount,
          orderNotaxAmount: this.mateTotalPrice.$b,
          busiCode: this.detailForm.associatedMode,
          modeCode: this.detailForm.codeMode,
          planCode: this.detailForm.planCode,
          signWay: this.detailForm.signWay,
          orderFrom: 1,
          standardOrderAmount: this.getStandardOrderAmount,
          orderSettlementListVOList,
          worthlessMateList,
          ordermateList
        }
        let orderCostVOList = this.$refs.otherFee.getData()
        params.orderCostVOList = orderCostVOList
        params.orderBondVO.performanceBondWhether = this.detailForm.orderBondVO.performanceBondWhether
        this.detailForm.orderPreviewObj = params // 用于预览  zhubin
        if (this.pageType === 'check') {
          this.btnText == '下一步'
          this.$emit('activeEvent', {
            active: 2,
            orderCode: this.detailForm.orderCode,
            orderTitle: this.detailForm.orderTitle,
            isReplace: this.pageType == 'check' ? true : false
          })
          return
        }
        this.addOrderAgreements(params)
      } else {
        let flagvalidate = this.$refs.ContractAttachment.validateForm()
        let ContractAttachment = null
        if (flagvalidate) {
          ContractAttachment = this.$refs.ContractAttachment.getData()
          this.detailForm.contractAttachmentList = ContractAttachment
        } else {
          return false
        }
        // 付款计划及方式list
        let orderSettlementListVOList =
          this.isShowCostListFlag == '1'
            ? this.$refs.costListRef.submitForm()
            : []
        // 无价值物料
        let worthlessMateList =
          this.isShowWorthlessMate == '1'
            ? this.$refs.worthlessMate.submitData()
            : []
        let ordermateList = this.detailForm.ordermateList.concat(
          this.detailForm.mateList
        )
        console.log(ordermateList)
        let params = {
          ...this.detailForm,
          buyerName: this.detailForm.buyerOrder.compName,
          sellerOrder: this.detailForm.sllerOrder,
          orderNo: this.detailForm.orderNo,
          orderType: 1,
          flag: flag,
          noticeWheather: this.noticeWheathers,
          currencyCode: this.value,
          suppConfirm: this.suppConfirm,
          templateWhether: this.templateWhether,
          contractAttachmentList: ContractAttachment,
          dFileList: this.remarkAttachment.fileVOList,
          extraAmount: this.mateTotalPrice.$c,
          orderAmount:
            this.isFirst > 1
              ? this.mateTotalPrice.$a
              : this.detailForm.orderAmount,
          orderNotaxAmount: this.mateTotalPrice.$b,
          busiCode: this.detailForm.associatedMode,
          modeCode: this.detailForm.codeMode,
          planCode: this.detailForm.planCode,
          signWay: this.detailForm.signWay,
          standardOrderAmount: this.getStandardOrderAmount,
          orderSettlementListVOList,
          worthlessMateList,
          ordermateList
        }
        let orderCostVOList = this.$refs.otherFee.getData()
        params.orderCostVOList = orderCostVOList
        params.orderBondVO.performanceBondWhether = this.detailForm.orderBondVO.performanceBondWhether
        this.detailForm.orderPreviewObj = params // 用于预览  zhubin
        if (this.pageType === 'check') {
          this.btnText == '下一步'
          this.$emit('activeEvent', {
            active: 2,
            orderCode: this.detailForm.orderCode,
            orderTitle: this.detailForm.orderTitle,
            isReplace: this.pageType == 'check' ? true : false
          })
          return
        }
        this.addOrderAgreement(params)
      }
    },
    onEnterSearch(e) {
      if (e.curText !== '' && e.curText != undefined) {
        e.orderTermsDetailList = e.orderTermsDetailList || []
        e.orderTermsDetailList.push({
          termsContent: e.orderTermsDetailList.length + 1 + '、' + e.curText,
          input: false,
          lockWhether: false
        })
        e.curText = ''
      }
    },
    onInputFocus(refName, isParentTile = '0') {
      this.$nextTick(() => {
        let indexAry = refName.split('_')
        const el = this.$refs[refName]
        if (isParentTile == '1') {
          this.$set(this.detailForm.orderTermsList[indexAry[1]], 'input', true)
        } else {
          this.$set(
            this.detailForm.orderTermsList[indexAry[1]]['orderTermsDetailList'][
              indexAry[2]
            ],
            'input',
            true
          )
          this.$forceUpdate()
        }
        if (el instanceof Array) {
          const input = el.reduce(
            (a, b) =>
              b.$attrs['data-index'] ==
              (isParentTile == '1'
                ? indexAry[1]
                : `${indexAry[1]}_${indexAry[2]}`)
                ? b
                : a,
            {}
          )
          this.$nextTick(() => {
            if (input.focus) {
              input.focus()
              return
            }
          })
        } else {
          console.error(`this.$refs.${refName}不是一个数组或者为${el}`)
        }
      })
    },
    // 添加条款
    addlastitems() {
      const data = this.detailForm.orderTermsList
      data.push({
        termsOrder: '',
        termsName: '',
        input: true,
        delete: '删除',
        orderTermsDetailList: [],
        curText: '',
        termsDetailVOList: [],
        lockWhether: false
      })
      this.$nextTick(() => {
        this.onInputFocus(`orderTermsInput_${data.length - 1}`, '1')
      })
    },
    onDelete(i) {
      this.detailForm.orderTermsList.splice(i, 1)
    },
    doSomething(e) {
      e.stopPropagation()
      e = e || e.currentTarget
    },
    // 引用条款返回值
    getselectedDataed(data) {
      let idAry = this.detailForm.orderTermsList
        .filter(item => item['id'])
        .map(item => item['id'])
      if (data instanceof Array == true) {
        data = data.filter(item => {
          return idAry.indexOf(item['id']) < 0
        })
        for (let it of data) {
          if (it.termsVOList.length > 0) {
            it.termsVOList.forEach((co, i) => {
              co.termsContent = i + 1 + '、' + co.termsContent
            })
          }
        }
        if (data.length) {
          this.actived = data[0].active
          if (data[0].active === 1) {
            const selectedData = data.map(item => {
              return Object.assign({}, item, {
                termsOrder: item.termsOrder || '',
                termsName: item.termsName || '',
                orderTermsDetailList: item.termsVOList || [],
                input: false,
                delete: '删除'
              })
            })
            this.detailForm.orderTermsList.push(...selectedData)
          }
        }
      } else {
        const selectedData = data.templateTermsVOList.map(item => {
          return Object.assign({}, item, {
            termsName: item.termsName || '',
            orderTermsDetailList: item.termsDetailVOList || [],
            input: false,
            delete: '删除'
          })
        })
        this.detailForm.orderTermsList = []
        this.detailForm.orderTermsList.push(...selectedData)
        this.$set(
          this.detailForm,
          'modelContract',
          selectedData['0']['modelContract']
        ) // 是否格式合同
      }
    },
    // 添加物资返回值
    getselectedData(data) {
      console.log(data)
      const selectedData = data.map(item => {
        let unitName = item.unitName || item.unit || item.unitArr[0] || ''
        let Limit = this.getLimit(unitName, this.selectLimitList)
        let lowerLimit = (Limit && Limit.lowerLimit) || ''
        let upperLimit = (Limit && Limit.upperLimit) || ''
        if (item.unitArr) {
          return Object.assign({}, item, {
            matePrice: item.matePrice || item.planPrice,
            mateDescribe:
              item.materielDescription ||
              item.mateDescribe ||
              item.classificationName,
            unit: item.unitName || item.unit || item.unitArr[0],
            unitName: item.unitName || item.unit || item.unitArr[0],
            classCode: item.classCode || item.classificationCode,
            classificationType: item.classificationType || 1,
            mateCode: item.mateCode || item.materielCode,
            totalExtras: 0,
            totalPrice: 0,
            taxRate: 13,
            totalSum: 0,
            mateBrand: '',
            deliveryDate: '',
            deliveryAddress: '',
            mateAmount: '',
            mateType: item.mateType || 2,
            orderMateExtraVOList: [],
            extraViewVo: cloneDeep(this.dataMate),
            lowerLimit,
            upperLimit,
            startDeliveryDate: '',
            dateArray: ['', ''],
            isDelete: true
          })
        } else {
          return Object.assign({}, item, {
            matePrice: item.matePrice || item.planPrice,
            mateDescribe:
              item.materielDescription ||
              item.mateDescribe ||
              item.classificationName,
            unit: item.unitName || item.unit || '',
            unitName: item.unitName || item.unit || '',
            classCode: item.classCode || item.classificationCode,
            classificationType: item.classificationType || 1,
            mateCode: item.mateCode || item.materielCode,
            totalExtras: 0,
            totalPrice: 0,
            taxRate: 13,
            totalSum: 0,
            mateBrand: '',
            deliveryDate: '',
            deliveryAddress: '',
            mateAmount: '',
            mateType: item.mateType || 2,
            orderMateExtraVOList: [],
            extraViewVo: cloneDeep(this.dataMate),
            lowerLimit,
            upperLimit,
            startDeliveryDate: '',
            dateArray: ['', ''],
            isDelete: true
          })
        }
      })
      console.log(selectedData)
      selectedData.forEach(item => {
        let itemObj = this.detailForm.mateList.filter(
          ite => ite.classCode == item.classCode
        )[0]
        item.matePrice = itemObj ? itemObj.matePrice : null
        item.mateBrand = itemObj ? itemObj.mateBrand : null
        item.taxRate = itemObj ? itemObj.taxRate : null
        console.log('itemObj', itemObj)
      })
      console.log(selectedData)
      let _d = JSON.parse(JSON.stringify(selectedData))
      this.detailForm.ordermateList.push(..._d)
      this.mateCurPage = 1
    },
    // 下载
    async onLoad() {
      let params = {
        ...this.detailForm.orderPreviewObj,
        previewType: 'order'
      }
      let data = await this.$api.orderAgreement.preview(2, params)
      this.loadVariablePDF(this.detailForm.orderTitle, data)
    },
    // 预览
    ...mapActions(['setPreviewData']),
    onPreview(pageType, isCopy) {
      let params = {
        ...this.detailForm,
        orderAmount:
          this.isFirst > 1
            ? this.mateTotalPrice.$a
            : this.detailForm.orderAmount
      }
      sessionStorage.setItem('userUpdate', JSON.stringify(params))
      let query = {
        pageType: pageType,
        isCopy: isCopy,
        code: '合同'
      }
      let previewData = this.getPreviewData()
      console.log(previewData)
      //放到合同vuex给到给到预览页面
      this.setPreviewData(previewData)
      this.$openNewPage('OrderAgreementPreviewDetail', query)
    },
    /**
     * obj: 当前行数据
     * objIndex: 当前行数据下标
     * parentObj: 当前行父级数据
     */
    onEditTermsContent(obj, objIndex, parentObj) {
      if (!obj['termsContent']) {
        parentObj['orderTermsDetailList'].splice(objIndex, 1)
        // 清空当前行数据时，list中所有数据重置显示的序号
        parentObj['orderTermsDetailList'].forEach((item, index) => {
          item['termsContent'] =
            index +
            1 +
            '、' +
            item['termsContent'].substring(
              item['termsContent'].indexOf('、') + 1
            )
        })
        // 清空当前行时 替换当前行数据下标，下面使用
        objIndex = parentObj['orderTermsDetailList'].length - 1
      }
      obj['termsContent'] =
        Number(objIndex) +
        1 +
        '、' +
        obj['termsContent'].substring(obj['termsContent'].indexOf('、') + 1)
      obj.input = false
      this.$forceUpdate()
    }
  },
  provide() {
    return {
      instance: this
    }
  }
}
</script>

<style lang="less">
.page-detail-lier-class2 {
  .input-number {
    width: 270px;
  }
}
.page-detail-lier-class {
  .page-detail-div {
    display: flex;
    justify-content: space-between;
  }
  .input-number {
    width: 270px;
  }
  .fontSize12 {
    display: inline-block;
    font-size: 12px;
  }
  .page-detail-lier-money {
    color: red;
    margin: 0 15px;
    font-size: 20px;
  }
  .page-detail-lier-money2 {
    color: red;
    margin: 0 5px;
    font-size: 12px;
  }
  .title-mai {
    width: 48px;
    height: 28px;
    text-align: center;
    line-height: 28px;
    background: #edf2fc;
    border-radius: 0px 0px 3px 3px;
  }
  .title-maifang {
    width: 48px;
    height: 28px;
    text-align: center;
    line-height: 28px;
    background: #fef3eb;
    border-radius: 0px 0px 3px 3px;
  }
  .title {
    font-size: 16px;
    font-weight: bold;
  }
  .title-user {
    padding-top: 30px;
    padding-left: 5%;
  }
  .el-collapse-item__header {
    font-size: 16px;
  }
  .form-item-cont {
    // width: 300px;
    display: block;
  }
  .el-collapse {
    border-top: none;
  }
  .isObjEqual-sty .el-input__inner {
    color: red !important;
  }
  .wrap-content {
    display: flex;
    flex-wrap: wrap;
    .wrap-content-item {
      width: 50%;
    }
  }
}
.btn-icon-lock {
  position: absolute;
  z-index: 1;
  top: 0;
  padding: 0;
  border: none;
}
.numberinput {
  .el-input__inner {
    text-align: left;
  }
}
</style>
<style scoped>
.sliceList .el-collapse-item:nth-child(1) {
  display: none;
}
</style>
