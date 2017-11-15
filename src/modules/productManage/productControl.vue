<template>
<!-- 发布商品-新增页面 -->
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'1000px'" :backdrop="true">
            <div slot="content">
                <div class="row" style="background-color:#F0F0F0">
                    <form class="form-horizontal" name="addForm" role="form">
                        <br>
                        <div class="form-group">
                            <label for="title" class="col-md-3 control-label">
                                <span class="required">* </span>商品类目：   
                            </label>
                            <label for="title" class="col-sm-5 control-label">
                                <span style="float:left">{{par[0]}}&nbsp;&nbsp;>&nbsp;&nbsp;{{par[1]}}&nbsp;&nbsp;>&nbsp;&nbsp;{{par[2]}}</span>  
                            </label>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>商品类型：
                            </label>
                            <div class="controls col-md-4" style="margin-top:1%">
                                <input type="radio" name="leixing" v-model="request.spuCountryType" value="1" checked >国内&nbsp;&nbsp;&nbsp;&nbsp;
                                <input type="radio" name="leixing" v-model="request.spuCountryType" value="2" >跨境
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>商品名称：
                            </label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="request.spuName" placeholder="50字以内" maxLength="50">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                商品广告词：
                            </label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="request.spuAd" placeholder="50字以内" maxLength="50">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span> 有赞商品地址：
                            </label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="request.spuShareUrl" placeholder="100字以内" maxLength="100">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                商品简介：
                            </label>
                            <div class="controls col-md-7">
                                <textarea  v-model="request.spuPcSummary" placeholder="选填，微信分享给好友时会显示这里的文案" maxLength="10000" rows="3" cols="50"></textarea> 
                            </div>
                        </div> 
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>品牌：
                            </label>
                            <div class="col-md-3">
                                <select class="form-control" v-model="request.spuBrandId" :change="brandTypeChangeByBrand(request.spuBrandId)">
                                    <option value="-1">请选择</option>
                                    <option v-for="item in brandList" :value="item.pbdBrandId">{{item.pbdName}}</option>
                                 </select>
                                <!-- <m-select :data="brandList" :placeholder="'请选择内容'" :change-func="selectTagStatusFunc" :class="'fixedIcon'"></m-select> -->
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>品牌类型：
                            </label>
                            <div class="controls col-md-4" style="margin-top:1%">
                                <span v-for="item in brandTypeList">
                                    <input type="radio" name="brandType" v-model="request.pbdTagId" :value="item.id" disabled>{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;
                                </span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                商品关键词：
                            </label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="request.spuKeyword" placeholder="关键词之间用空格隔开" maxLength="50">
                            </div>
                        </div>
                        <div class="form-group" style="padding-top:10px;">
                            <label class="col-sm-3 control-label"><span class="required">* </span>展示类目：</label>
                            <div class="controls col-md-9" style="padding-top:8px;">
                                <item-list :list="tagsList" :remove="removeTagItem"></item-list>
                                <a class="btn-select-label" @click="showTagDialog">
                                    <i class="fa fa-plus" style="position:relative;"></i> 添加标签
                                </a>
                            </div>
                        </div>
                        <div class="form-group" style="padding-top:10px;">
                            <label class="col-sm-3 control-label">适用人群：</label>
                            <div class="controls col-md-9" style="padding-top:8px;">
                                <item-list :list="personList" :remove="removeperItem"></item-list>
                                <a class="btn-select-label" @click="showperDialog">
                                    <i class="fa fa-plus" style="position:relative;"></i> 添加标签
                                </a>
                            </div>
                        </div>
                        <div class="form-group" style="padding-top:10px;">
                            <label class="col-sm-3 control-label"><span class="required">* </span>内容标签：</label>
                            <div class="controls col-md-9" style="padding-top:8px;">
                                <item-list :list="neirongList" :remove="removeneiItem"></item-list>
                                <a class="btn-select-label" @click="showneiDialog">
                                    <i class="fa fa-plus" style="position:relative;"></i> 添加标签
                                </a>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                上榜理由：
                            </label>
                            <div class="col-md-4" style="background-color:white;width:600px" >
                                <div  style="display:inline-block;width:280px;margin-top:2.5%" v-for="(index,item) in shangbanglist">
                                    <input type="checkbox" name="shangbang" v-model="shangb" :value="item.keyValue" @click="shangbang($event)"/>{{item.keyValue}}
                                    <br v-if="(index+1) % 2 == 0">
                                </div>
                                <br><br>
                            </div> 
                            <div class="col-md-11" style="margin-left:7px;">
                                <span v-for="(index,i) in createshangbanglist">
                                    <span v-for="ii in 58">&nbsp;</span>
                                    <input type="text" style="display:inline-block;width:40%" v-model="i.pcrReason" @keyup="checkshangb(i)" maxLength="100">
                                    <span v-if="index == createshangbanglist.length-1"><a @click="createshangbang()"  >+添加理由</a>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    <a v-if="index > 0" @click="deleteshangbang(index)">-删除理由</a><br><br>
                                </span>
                                <span v-for="i in 58">&nbsp;</span>
                                <span style="color:red;margin-left:1px;">注：最多可选择3个理由</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">专家观点：</label>
                            <div class="controls col-md-8">
                                <textarea class="form-control input-sm" v-model="request.spuExpertOption" placeholder="100个字以内" maxLength="100">
                                </textarea> 
                            </div>
                        </div>

                        <hr style="height:1px;border:none;border-top:1px solid white;" /> 
                        <!-- 通用属性 -->
                        <div class="form-group" v-for="radios in radioList">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required" v-if="radios.pcaRequired == 1">* </span> {{radios.pcaName}}：
                            </label>
                            <div class="controls col-md-4" style="margin-top:1%">
                                <span v-for="radio in radios.pcaoList">
                                    <input type="radio" :name="radios.pcaName" v-model="radios.pcaCreator" :value="radio" >{{radio.pcaoName}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </span>
                            </div>
                        </div>
                        <div class="form-group" v-for="boxs in boxList">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required" v-if="boxs.pcaRequired == 1">* </span> {{boxs.pcaName}}：
                            </label>
                            <div class="controls col-md-4" style="margin-top:1%">
                                <span v-for="box in boxs.pcaoList">
                                    <input type="checkbox" :name="radios.pcaName" v-model="box.checked"  >{{box.pcaoName}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </span>
                            </div>
                        </div>
                        <div class="form-group" v-for="selects in selectList">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required" v-if="selects.pcaRequired == 1">* </span> {{selects.pcaName}}：
                            </label>
                            <div class="controls col-md-3" style="margin-top:1%">
                                <select class="form-control" v-model="selects.pcaCreator" >
                                    <option value="-1" >请选择</option>
                                    <option v-for="select in selects.pcaoList" :value="select">{{select.pcaoName}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group" v-for="inputs in inputList">
                            <label for="title" class="col-sm-3 control-label">
                               <span class="required" v-if="inputs.pcaRequired == 1">* </span>{{inputs.pcaName}}：
                            </label>
                            <div class="controls col-md-6" style="margin-top:1%">
                                <input type="text" class="form-control input-sm" v-model="inputs.pcaCreator"  maxLength="50">
                            </div>
                        </div>
                        <div class="form-group" v-for="text in textList">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required" v-if="text.pcaRequired == 1">* </span>{{text.pcaName}}：
                            </label>
                            <div class="controls col-md-8" style="margin-top:1%">
                                <textarea rows="3" cols="50" v-model="text.pcaCreator" placeholder="100字以内" maxLength="100"></textarea> 
                            </div>
                        </div>

                        <hr style="height:1px;border:none;border-top:1px solid white;" /><br>    
                        <!-- 销售属性 -->
                        <span style="color:#F00">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* </span><font style="color:#6699CC" size="3">销售属性总数最多4组，SKU组合不能超过600组。</font>
                        <!-- 按钮 -->
                        <div class="form-group">
                            <label for="title" class="col-sm-2 control-label" id="addsx">
                                <button type="button" class="btn yellow" @click="addProperty()">添加销售属性</button> 
                            </label>
                            <label for="title" class="col-sm-2 control-label">
                                <button type="button" class="btn purple" @click="reset()">重置销售属性</button> 
                            </label>
                            <label for="title" class="col-sm-2 control-label">                         
                                <button type="button" class="btn green" v-on:click="dkej()">生成SKU组合</button>
                            </label>
                        </div>
                        <!-- 所选类目带过来的销售属性及属性值 -->
                        <div v-for="(v,i) in sxlist"  style ="width: 100%; background-color:white;border:1px solid #F0F0F0;" > 
                            <div class="baseSx"> 
                                <span class="pca" style="margin-left:5%;display:-moz-inline-box;display:inline-block;width:75px;">{{i.pcaName}}：
                                    <input :value="i.pcaName" type="hidden" />
                                    <input :value="i.pcaId" type="hidden" />
                                    <input :value="i.pcaSortNo" type="hidden" />
                                    <input :value="i.pcraCatId" type="hidden" />
                                    <input :value="i.pcaMemo" type="hidden" />
                                    <input :value="i.pcaInputType" type="hidden" />
                                    <input :value="i.pcaSaleProp" type="hidden" />
                                    <input :value="i.pcaRequired" type="hidden" />
                                </span> 
                                <span v-for="(ind,s) in i.pcaoList" class="pcao">                      
                                    <input type="checkbox" class="input" :value="s.pcaoName" style="width:16px;height:16px;margin-right:3px"> {{s.pcaoName}}
                                    <input :value="s.pcaoId" type="hidden" />
                                    <input :value="s.pcaoName" type="hidden" />
                                    <input :value="s.pcaoSortNo" type="hidden" />
                                    <input :value="s.pcaoValue" type="hidden" />
                                    <!-- 6个换一行 -->
                                    <a v-if="(ind+1)%8 == 0"><br> <span style="margin-left:13.8%;color:white">{{i.pcaName}}</span></a>
                                </span>
                                <!-- 添加属性值 -->
                                <span class="addsxxx" >
                                    <input type="checkbox" class="input tianjia" value="1" style="width:16px;height:16px;margin-right:3px"> 
                                    <input type="text" style ="width: 5%; height:100%"  placeholder=""  @keyup="getcheck($event)" maxLength="20">
                                    <a class="" style="text-decoration:none" @click="addsxxx($event)">添加&nbsp;&nbsp;&nbsp;&nbsp;</a>  
                                </span>
                            </div>
                        </div>
                        <br>
                        <!-- <span style="color:#F00">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* </span><font style="color:#6699CC" size="3">销售属性总数最多4组，SKU组合不能超过600组。</font>
                        <div class="form-group" id="addsx">
                            <label for="title" class="col-sm-3 control-label">
                                <button type="button" class="btn yellow" @click="addProperty()">添加销售属性</button> 
                            </label>
                        </div> -->
                             
                        <hr style="height:1px;border:none;border-top:1px solid white;" /><br> 
                        <!-- 一个SKU的情况 -->
                        <div id="div1" class="box">
                            <span style="color:#F00">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* </span><font style="color:#6699CC" size="3">只有一个SKU的情况,可直接填写如下数据;如有多个SKU的情况,请先生成SKU组合!</font>
                            <div class="form-group" >
                                <label for="title" class="col-sm-3 control-label">
                                    <span class="required">* </span>丰盛榜售价：
                                </label>
                                <div class="controls col-md-2">
                                    <input type="number" class="form-control input-sm" v-model="sj" placeholder="" @keyup="checkfloat($event)" @change="checkfloat($event)" min="0" max="99999999" @blur="checkfloat($event)"/>
                                </div>
                                <label for="title" class="col-sm-2 control-label">原价：</label>
                                <div class="controls col-md-2">
                                    <input type="number" class="form-control input-sm" v-model="yj" placeholder="" @keyup="checkfloat($event)" @change="checkfloat($event)" min="0"max="99999999" @blur="checkfloat($event)"/>
                                </div>
                            </div>
                            <div class="form-group">  
                                <label for="title" class="col-sm-3 control-label">
                                    <span class="required">* </span>展示库存（件）：
                                </label>
                                <div class="controls col-md-2">
                                    <input type="number" class="form-control input-sm" v-model="kc" placeholder="" @keyup="check($event)" @change="check($event)" min="0" @blur="check($event)" max="2000000000"/>
                                </div>
                                <label for="title" class="col-sm-2 control-label">
                                    SKU编码：
                                </label>
                                <div class="controls col-md-2">
                                    <input type="text" class="form-control input-sm" v-model="skubm" placeholder="" maxlength="20">  
                                </div>
                                <!--   
                                <label for="title" class="col-sm-2 control-label">
                                    <span class="required">* </span>ERP库存（件）：
                                </label>
                                <div class="controls col-md-2">
                                    <input type="text" class="form-control input-sm" v-model="erpkc" placeholder="" @keyup="check($event)">
                                </div> 
                                -->
                            </div> 
                        </div>   
                        <!-- 添加销售属性及属性值 -->
                        <div id="base">
                            <div id="0" class="box2" style="display:none">
                                <a class="delete">×</a>   
                                <input type="text" class="col-md-2 input" placeholder="销售属性名称" maxlength="60"/>
                                <br><span>：</span><br>                           
                                <input type="text" class="col-md-2 input" v-for="i in 10 " :placeholder="placeholderName(i)" maxlength="20"/>
                            </div>
                        </div>
                        <!-- <div id="dkej" class="form-group"> 
                            <label for="title" class="col-sm-3 control-label">                         
                                <button type="button" class="btn green" v-on:click="dkej()">生成SKU组合</button>
                            </label>
                        </div> -->
                        <!-- 多个SKU情况,生成SKU组合 -->
                        <div>
                            <table id="pltab" border="1" cellspacing="0" cellpadding="0" style="display:none">  
                                <tr style="text-align: center">
                                    <td style="width:42.4%;border:1px solid white"><h5 style="color:#6699CC"><strong>批量输入数据</strong></h5></td>
                                    <td style="width:12%;border:1px solid white;line-height:30px">
                                        ￥<input class=" input2" type="number" @keyup="sput($event,'.put0')" @blur="sput($event,'.put0')" @change="sput($event,'.put0')" min="0"max="99999999"/>
                                    </td>
                                    <td style="width:11.6%;border:1px solid white">
                                        ￥<input class=" input2" type="number" @keyup="sput($event,'.put1')" @change="sput($event,'.put1')" @blur="sput($event,'.put1')"  min="0"max="99999999"/>
                                    </td>
                                    <td style="border:1px solid white">  
                                        <input class=" input2" type="number" @keyup="ssput($event,'.put2')" @change="ssput($event,'.put2')" min="0"max="2000000000" @blur="ssput($event,'.put2')"/>
                                    </td>
                                    <td style="border:1px solid white">  
                                        <!-- <input class=" input2" type="number"  @keyup="ssput($event,'.put3')" @change="ssput($event,'.put3')" min="0"max="2000000000" @blur="ssput($event,'.put3')"/> -->
                                    </td>
                                    <td style="border:1px solid white;width:24.3%"><!-- <input class=" input2" type="text"  maxLength="25" /> --></td>
                                </tr>
                            </table>
                            <table class="tab" id="table" style="display:none" border="1" cellspacing="0" cellpadding="0">  
                                <tr>
                                    <th>序号</th>
                                    <th>SKU组合</th>
                                    <th><span style="color:red">*</span>丰盛榜售价</th>
                                    <th>原价</th>
                                    <th><span style="color:red">*</span>展示库存（件）</th>
                                    <th>ERP实际库存</th>
                                    <th>SKU编码</th>
                                    <th>前端是否展示</th>
                                </tr>
                                <tbody id="itemList">
                                    <tr v-for="(index,group) in xssxList">
                                        <td>{{index+1}}<input class="input2" type="hidden" :value="index+1"/></td>
                                        <td style="width:40%;;line-height:30px"> <a class="dele" @click="close($event,index)" >×</a> {{ group }} <input class="input2" type="hidden" :value="group"/></td>
                                        <td>￥<input class="put0 input2" type="number"  @keyup="checkfloat($event)" @change="checkfloat($event)" min="0.01" max="99999999" @blur="checkfloat($event)"/></td>
                                        <td>￥<input class="put1 input2" type="number"  @keyup="checkfloat($event)" @change="checkfloat($event)" min="0.01" max="99999999" @blur="checkfloat($event)"/></td>
                                        <td>  <input class="put2 input2" type="number"  @keyup="check($event)" @change="check($event)" min="0" max="2000000000" @blur="check($event)"/></td>
                                        <td>  <!-- <input class="put3 input2" type="number"  @keyup="check($event)" @change="check($event)" min="0" max="2000000000" @blur="check($event)"/> --></td>
                                        <td style="width:17%"><input class="put4 input2" type="text" maxLength="20"/></td>
                                        <td style="width:6%;"><input type="checkbox" :checked="true"></input></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <br><hr style="height:1px;border:none;border-top:1px solid white;" /><br>
                        <!-- 图片上传 -->
                        <h4><strong>图片上传</strong></h4>
                        <div class="" style="padding-bottom:10px;">  
                            <div class="controls " style="text-align:center"> 
                                <span class="required"></span>说明：        
                                <span style="margin-left:1%">最多上传5张，单张大小小于5M，仅支持JPG、JPEG格式。</span>
                            </div>
                        </div>
                        <div style="text-align:center">
                            <table   width="100%" border="1" cellpadding="0" cellspacing="0" style="table-layout: fixed;">  
                                <tbody id="itemList">
                                    <tr >
                                        <!-- 图片一 -->
                                        <td  style="height:194px ; width: 25%">
                                            <div class="item-edit-box">
                                                <div class="buy-pic" style="bottom:0;" v-if="data.oneUrl==''">
                                                    <i class="fa glyphicon glyphicon-plus pick-img" @click="showSelectPicDialog( 1 )" style="margin-top: 20px; font-size:44px;"></i>
                                                </div>
                                                <item-move v-if="data.oneUrl!=''" :change-left="moveLeft.bind(this,1)" :change-right="moveRight.bind(this,1)" :remove-item="removeMoveItem.bind(this,1)" :class="'item-edit-block'" :hidden-up-down=false>
                                                    <div class="buy-pic" style="bottom:0;">
                                                        <img :src="data.oneUrl" style="height:194px; width:194px;">
                                                    </div>
                                                </item-move>
                                            </div>
                                        </td>
                                        <!-- 图片二 -->
                                        <td  style="height:194px ; width: 25%">
                                            <div class="item-edit-box">
                                                <div class="buy-pic" style="bottom:0;" v-if="data.twoUrl=='' && data.oneUrl!=''">
                                                    <i class="fa glyphicon glyphicon-plus pick-img" @click="showSelectPicDialog( 2 )" style="margin-top: 20px; font-size:44px;"></i>
                                                </div>
                                                <item-move v-if="data.twoUrl!=''" :change-left="moveLeft.bind(this,2)" :change-right="moveRight.bind(this,2)" :remove-item="removeMoveItem.bind(this,2)" :class="'item-edit-block'" :hidden-up-down=false>
                                                    <div class="buy-pic" style="bottom:0;">
                                                        <img :src="data.twoUrl" style="height:194px; width:194px;">
                                                    </div>
                                                </item-move>
                                            </div>
                                        </td>
                                        <!-- 图片三 -->
                                        <td  style="height:194px ; width: 25%">
                                            <div class="item-edit-box">
                                                <div class="buy-pic" style="bottom:0;" v-if="data.threeUrl=='' && data.twoUrl!=''">
                                                    <i class="fa glyphicon glyphicon-plus pick-img" @click="showSelectPicDialog( 3 )" style="margin-top: 20px; font-size:44px;"></i>
                                                </div>
                                                <item-move v-if="data.threeUrl!=''" :change-left="moveLeft.bind(this,3)" :change-right="moveRight.bind(this,3)" :remove-item="removeMoveItem.bind(this,3)" :class="'item-edit-block'" :hidden-up-down=false>
                                                    <div class="buy-pic" style="bottom:0;">
                                                        <img :src="data.threeUrl" style="height:194px; width:194px;">
                                                    </div>
                                                </item-move>
                                            </div>
                                        </td>
                                        <!-- 图片四 -->
                                        <td  style="height:194px ; width: 25%">
                                            <div class="item-edit-box">
                                                <div class="buy-pic" style="bottom:0;" v-if="data.fourUrl=='' && data.threeUrl!=''">
                                                    <i class="fa glyphicon glyphicon-plus pick-img" @click="showSelectPicDialog( 4 )" style="margin-top: 20px; font-size:44px;"></i>
                                                </div>
                                                <item-move v-if="data.fourUrl!=''" :change-left="moveLeft.bind(this,4)" :change-right="moveRight.bind(this,4)" :remove-item="removeMoveItem.bind(this,4)" :class="'item-edit-block'" :hidden-up-down=false>
                                                    <div class="buy-pic" style="bottom:0;">
                                                        <img :src="data.fourUrl" style="height:194px; width:194px;">
                                                    </div>
                                                </item-move>
                                            </div>
                                        </td>
                                        <!-- 图片五 -->
                                        <td  style="height:194px ; width: 25%">
                                            <div class="item-edit-box">
                                                <div class="buy-pic" style="bottom:0;" v-if="data.fiveUrl=='' && data.fourUrl!=''">
                                                    <i class="fa glyphicon glyphicon-plus pick-img" @click="showSelectPicDialog( 5 )" style="margin-top: 20px; font-size:44px;"></i>
                                                </div>
                                                <item-move v-if="data.fiveUrl!=''" :change-left="moveLeft.bind(this,5)" :change-right="moveRight.bind(this,5)" :remove-item="removeMoveItem.bind(this,5)" :class="'item-edit-block'" :hidden-up-down=false>
                                                    <div class="buy-pic" style="bottom:0;">
                                                        <img :src="data.fiveUrl" style="height:194px; width:194px;">
                                                    </div>
                                                </item-move>
                                            </div>
                                        </td>
                                        <!-- 
                                        <td  style="height:100px ; width: 25%">
                                            <i class="fa fa-image pick-img" @click="showSelectPicDialog( 1 )" v-if="data.oneUrl==''" style="margin-top: 20px;"></i>
                                            <img :src="data.oneUrl" class="cursor" @click="showSelectPicDialog(1 )" height="80" v-else style="pointer:corsor;margin-bottom:-10px;">
                                        </td>
                                        <td  style="height:100px ; width: 25%">
                                            <i class="fa fa-image pick-img" @click="showSelectPicDialog( 2 )" v-if="data.twoUrl==''" style="margin-top: 20px;"></i>
                                            <img :src="data.twoUrl" class="cursor" @click="showSelectPicDialog(2 )" height="80" v-else style="pointer:corsor;margin-bottom:-10px;">
                                        </td>
                                        <td  style="height:100px ; width: 25%">
                                            <i class="fa fa-image pick-img" @click="showSelectPicDialog( 3 )" v-if="data.threeUrl==''" style="margin-top: 20px;"></i>
                                            <img :src="data.threeUrl" class="cursor" @click="showSelectPicDialog(3 )" height="80" v-else style="pointer:corsor;margin-bottom:-10px;">
                                        </td>
                                        <td  style="height:100px ; width: 25%">
                                            <i class="fa fa-image pick-img" @click="showSelectPicDialog( 4 )" v-if="data.fourUrl==''" style="margin-top: 20px;"></i>
                                            <img :src="data.fourUrl" class="cursor" @click="showSelectPicDialog(4 )" height="80" v-else style="pointer:corsor;margin-bottom:-10px;">
                                        </td>
                                        <td  style="height:100px ; width: 25%">
                                            <i class="fa fa-image pick-img" @click="showSelectPicDialog( 5 )" v-if="data.fiveUrl==''" style="margin-top: 20px;"></i>
                                            <img :src="data.fiveUrl" class="cursor" @click="showSelectPicDialog(5 )" height="80" v-else style="pointer:corsor;margin-bottom:-10px;">
                                        </td> 
                                        -->
                                    </tr>
                                </tbody>
                            </table>        
                        </div>

                        <br><hr style="height:1px;border:none;border-top:1px solid white;" /><br>
                        <!-- 物流/其他设置 -->
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>运费设置：
                            </label>
                            <div class="controls col-md-5">
                                <div class="col-md-4" style="margin-top:2%">
                                <input type="radio" name="yunfei" v-model="yunfei" value="0" checked >统一邮费
                                </div>
                                <h4 class="col-md-1">￥</h4>
                                <div class="col-sm-5">
                                    <input type="number" class="form-control input-sm" v-model="request.spuFreight" placeholder="0.00" max="999" min="0"
                                        @keyup="check($event)" @change="check($event)"/></div>
                                <br><br><br>
                                <div class="col-md-4">
                                    <input type="radio" name="yunfei" v-model="yunfei" value="1">运费模板</div>
                                    <div class="col-md-6">
                                        <select class="form-control" v-model="request.spuCarriageId">
                                            <option value="-1">请选择</option>
                                            <option v-for="item in carriageList" :value="item.pcId">{{item.pcName}}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <!--  <div class="form-group">
                                <label for="title" class="col-sm-3 control-label">
                                    <span class="required">* </span>每人限购：
                                </label>
                                <div class="controls col-md-4">
                                    <input type="text" class="form-control input-sm" v-model="data.subtitle" placeholder="请输入良言文案">
                                </div>
                            </div> -->
                            <div class="form-group">
                                <label for="title" class="col-sm-3 control-label">参与消保类型：</label>
                                <div class="controls col-md-4" >
                                    <span  class="insu" v-for="(index,data) in insurancelist">
                                    <span v-if="index < 3">
                                    <input type="checkbox" :value="data.keyValue+','+data.dictionnaryId+','+data.sortNo+','+data.description" checked style="width:16px;height:16px;margin-right:3px">&nbsp;&nbsp;{{ data.keyValue }}<br></span>
                                    <span v-else  >
                                        <input type="checkbox" :value="data.keyValue+','+data.dictionnaryId+','+data.sortNo+','+data.description" style="width:16px;height:16px;margin-right:3px" @click="insurance($event)">&nbsp;&nbsp;{{ data.keyValue }}<br></span>
                                    </span>
                                    <div style="background-color:white;border: 1px solid black;width:340px"><br>
                                        <span v-for="(index,i) in createinsurancelist">&nbsp;&nbsp;&nbsp;&nbsp;类型
                                            <input type="text" style="display:inline-block" v-model="i.keyValue"    @keyup="checkinsurance(i,1)" maxLength="50"/>
                                            <br> &nbsp;&nbsp;&nbsp;&nbsp;描述
                                            <input type="text" style="display:inline-block" v-model="i.description" @keyup="checkinsurance(i,2)" maxLength="100"/>
                                            <span v-if="index == createinsurancelist.length-1"><a @click="createinsurance()">+添加</a>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                            <a v-if="index > 0" @click="deleteinsurance(index)">-删除</a>
                                            <br><br>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="title" class="col-sm-3 control-label">
                                    包装清单：<br><font color="#A8A8A8">200字以内</font>
                                </label>
                                <div class="controls col-md-7">
                                    <textarea rows="3" cols="50" v-model="request.spuPackingList" placeholder="200字以内" maxLength="200"></textarea> 
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="title" class="col-sm-3 control-label">开始时间：</label>
                                <div class="controls col-md-4 ">
                                    <span class="radios">
                                        <input type="radio" name="startTime" v-model="rad" value="1" checked>立刻                                                              
                                        <br>
                                        <input type="radio"  name="startTime"  v-model="rad" value="2">设定<br>  
                                    </span>
                                    <div class="col-md-8 time-box" id="selecttime" style="display:none">
                                        <input type="text" class="form-control inline-block datePicker" placeholder="选择开始时间" v-model="time" id="createStartTime0"/>
                                        <!-- <select  v-model="hour" style="width:90px; height:27px">
                                            <option value="-1">选择小时</option>
                                            <option v-for="item in 24" :value="item">{{item}}时</option>
                                        </select>&nbsp;&nbsp;
                                        <select v-model="minutes" style="width:90px; height:27px">
                                            <option value="-1">选择分钟</option>
                                            <option v-for="item in 60" :value="item">{{item}}分</option>
                                        </select> -->
                                    </div>  
                                </div>
                            </div>                                                      
                        </div>
                    </form>
                </div>
                <span slot="btnList">
                    <button type="button" class="btn blue" @click="addItem()">保存并下一步</button>
                    <button type="button" class="btn default" @click="hideDialog()" >取消</button>
                </span>
            </div>
        </m-alert>
        <!-- 提示框 -->
        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>
        <div class="loading" style="position:fixed;z-index:11111;" v-if="isLoading">
            <div class="page-spinner-bar">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
            </div>
        </div>
        <div style="position:fixed;z-index:111111;" v-show="picShowOption.show">
            <select-pic v-show="picShowOption.show" :options="picShowOption" :onselect="selectPicFunc" :oncancel="cancelSelect"></select-pic>
        </div>
        <div style="position:fixed;z-index:11111;" v-show="showComponent">
            <!-- <select-component-all v-show="showComponent" :options="componentShowOption" :onselect="selectComponentFunc" :oncancel="cancelSelectComponent"></select-component-all> -->
        </div>
        <!-- <loading :show="isLoading"></loading> -->
        <!-- 标签选择弹窗 -->
        <tag-tree v-if="showTagTreeSelect" :list="tagsList" :onselect="selectTagFunc" :oncancel="showTagDialog"   :type="0"></tag-tree>
        <tag-tree v-if="showperTreeSelect" :list="personList" :onselect="selectPerFunc" :oncancel="showperDialog" :type="3"></tag-tree>
        <tag-tree v-if="showneiTreeSelect" :list="neirongList" :onselect="selectNeiFunc" :oncancel="showneiDialog" :type="1"></tag-tree>
        <!-- 商品详情图片上传弹框 -->
        <template-control v-if="!destroyControlDialog" :id="expertEditId" :show="showAddDialog" v-bind:par="sele" :onhide="hideAddDialog" :getspu="spu" :closeparent="hideDialog"></template-control> 
    </div>
</template>

<script>
import client from '../../common/utils/client';
import itemMove from '../../components/page/itemMove';
import tagTree from '../common/tagTree';
import templateControl from './templateControl';
import { selectPic, mAlert, mSelect, mMultiSelect, itemList } from '../../components';
import { showSelectPic, getSelectPicList } from '../../vuex/actions/actions.resource';//上传图片插件

export default {
    components: { selectPic, tagTree, mAlert, mSelect, mMultiSelect, itemList, templateControl, itemMove },
    props: {
        cflag: false,
        par:{      
            type: Array,
            default: []
        },
        show: {
            type: Boolean,
            value: false
        },
        onhide: {
            type: Function,
            value: () => { }
        },
        id: {
            type: String,
            value: 0
        },
        closeparentpage: {
            type: Function,
            default: () => { }
        }
    },
    data() {
        return {
            request:{                    //请求参数封装对象:
                "spuOptionList":[],      //sku属性的选项列表
                "spuCountryType":1,      //国内外分类
                "spuCarriageId":-1,      //运费模板id
                "spuType": 1,            //商品类型
                "spuShareUrl":'',        //分享地址
                "spuPic": '',            //商品主图
                "spuAppSummary": "",     //商品详情
                "spuPcSummary":"",       //商品简介
                "spuName": "",           //商品名称
                "spuCatId": -1,          //商品类目ID
                "spuKeyword":"",         //关键词
                "spuAd":"",              //广告词
                "spuBrandId" : -1,       //品牌ID
                "pcrList":[],            //上榜理由
                "spuExpertOption":"",    //专家观点
                "spuFreight":"",         //运费
                "spuPackingList":"",     //包装清单
                "piList" : [],           //消保集合
                "spuPlanShelvesDate":"", //上架时间
                "resourceList": [],      //图片集合
                "tagList":[],            //标签集合
                "skuList":[],            //SKU集合
                "pbdTagId":"",           //品牌类型ID
            },
            createshangbanglist:[{"pcrReason": "",}],
            createinsurancelist:[{"keyValue":"","description":""}],
            yunfei:0,       //0:统一邮费  1:运费模板
            rad:1,         //上架状态 1:立刻  2:设定
            time :"",      //上架时间日期 
            insurancelist: [], //CheckBox消保类型集合 
            shangb :[],
            shangbanglist: [],
            radioList:[], //通用属性集合  单选
            boxList:[], //通用属性集合    多选
            selectList:[], //通用属性集合 选择
            inputList:[], //通用属性集合  单行文本
            textList:[], //通用属性集合   多行文本
            sxlist: [], // 销售属性集合
            carriageList:[],//运费模板
            img:"http://img1.fshtop.com/1502701860183.jpg",
            xssxList:[],
            idnum:0,
            destroyControlDialog: false, //注销良言操作弹框
            expertEditId: '',
            showAddDialog: false,
            brandList:[],
            isLoading: false,
            showDialog: false,
            showPage: false,
            showPainListSelect: true,
            painIdsSelect: [],
            painList: [],
            data: {
                "componentType": 16,
                "subtitle": "",
                "title": "",
                "authorName": "",
                "authorTitle": "",
                "authorType": 2,
                "oneUrl": "",
                "description": "",
                "halfFigure": "",
                "iconId": null,
                "twoUrl": "",
                "threeUrl": "",
                "fourUrl": "",
                "fiveUrl": "",
                "painIds": [],
                "painOptions": [],
            },
            spuCatId:"",
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '编辑基本信息',
            neirongList:[],
            personList:[],
            tagsList: [],             //选择的标签
            showTagTreeSelect: false, //显示标签选择弹窗
            showperTreeSelect: false,//
            showneiTreeSelect: false,
            addpdflag:false,
            zhi:[],
            yj:'',
            sj:'',
            kc:'',
            skubm:'',
            // erpkc:'',
            spu:{
                "msg":"",
                "id":0,
            },
            brandTypeList: [],// 品牌类型list
        }
    },
    vuex: {
        getters: {
            picShowOption: ({ resourceControl }) => resourceControl.picShowOption,
            selectPicList: ({ resourceControl }) => resourceControl.selectPicList,
        },
        actions: { showSelectPic, getSelectPicList }
    },
    methods: {
        // 渲染添加销售属性的placeholder显示
        placeholderName(i){
            return "属性值"+(i+1);
        },
        // 选择品牌后回调(选中对应的品牌类型)
        brandTypeChangeByBrand(brandId){
            // 初始化,将所有radio取消选中
            this.request.pbdTagId = "";
            if(brandId != -1){
                for(let i=0; i<this.brandList.length; i++){
                    // 获取选中品牌对应的品牌类型ID
                    if(brandId == this.brandList[i].pbdBrandId){
                        let brandTypeID = this.brandList[i].pbdTagId;// 品牌类型ID
                        // 将品牌类型ID赋值给radio标签的v-model,当v-model的值和value的值相等时,radio就会选中
                        this.request.pbdTagId = brandTypeID;
                        for(let j=0; j<this.brandTypeList.length; j++){
                            if(brandTypeID == this.brandTypeList[j].id){
                                this.brandTypeList[j].checkedValue = true;
                                break;
                            }
                        }
                        break;
                    }
                }
            }
        },
        // 图片左移
        moveLeft(index){
            if(this.request.resourceList.length > 1){
                for(let i=0; i<this.request.resourceList.length; i++){
                    if(index == (i+1)){
                        // 图片向左移动一位,即点中移动的图片和前一张图片交换位置,并需改变psrSortNo的值
                        let temp = {};
                        if(index != 1){
                            this.request.resourceList[i].psrSortNo -= 1;
                            temp = this.request.resourceList[i];
                            this.request.resourceList[i-1].psrSortNo += 1;
                            this.request.resourceList[i] = this.request.resourceList[i-1];
                            this.request.resourceList[i-1] = temp;

                            // 根据移动后的singleimgList改变img标签中的src
                            if(index == 2){
                                this.data.oneUrl=this.request.resourceList[i-1].psrResourceUrl;
                                this.data.twoUrl=this.request.resourceList[i].psrResourceUrl;
                            }else if(index == 3){
                                this.data.twoUrl=this.request.resourceList[i-1].psrResourceUrl;
                                this.data.threeUrl=this.request.resourceList[i].psrResourceUrl;
                            }else if(index == 4){
                                this.data.threeUrl=this.request.resourceList[i-1].psrResourceUrl;
                                this.data.fourUrl=this.request.resourceList[i].psrResourceUrl;
                            }else if(index == 5){
                                this.data.fourUrl=this.request.resourceList[i-1].psrResourceUrl;
                                this.data.fiveUrl=this.request.resourceList[i].psrResourceUrl;
                            }
                        }else{
                            // 如果点击的是第一张图片,则与最后一张交换
                            this.request.resourceList[this.request.resourceList.length-1].psrSortNo = 1;
                            temp = this.request.resourceList[this.request.resourceList.length-1];
                            this.request.resourceList[0].psrSortNo = this.request.resourceList.length+1;
                            this.request.resourceList[this.request.resourceList.length-1] = this.request.resourceList[0];
                            this.request.resourceList[0] = temp;

                            // 判断总图片数量,根据移动后的singleimgList改变img标签中的src
                            if(this.request.resourceList.length == 2){
                                this.data.oneUrl=this.request.resourceList[0].psrResourceUrl;
                                this.data.twoUrl=this.request.resourceList[this.request.resourceList.length-1].psrResourceUrl;
                            }else if(this.request.resourceList.length == 3){
                                this.data.oneUrl=this.request.resourceList[0].psrResourceUrl;
                                this.data.threeUrl=this.request.resourceList[this.request.resourceList.length-1].psrResourceUrl;
                            }else if(this.request.resourceList.length == 4){
                                this.data.oneUrl=this.request.resourceList[0].psrResourceUrl;
                                this.data.fourUrl=this.request.resourceList[this.request.resourceList.length-1].psrResourceUrl;
                            }else if(this.request.resourceList.length == 5){
                                this.data.oneUrl=this.request.resourceList[0].psrResourceUrl;
                                this.data.fiveUrl=this.request.resourceList[this.request.resourceList.length-1].psrResourceUrl;
                            }
                        }
                    }
                }
            }
        },
        // 图片右移
        moveRight(index){
            if(this.request.resourceList.length > 1){
                for(let i=0; i<this.request.resourceList.length; i++){
                    if(index == (i+1)){
                        // 图片向右移动一位,即点中移动的图片和后一张图片交换位置,并需改变psrSortNo的值
                        let temp = {};
                        if(index != this.request.resourceList.length){
                            this.request.resourceList[i].psrSortNo += 1;
                            temp = this.request.resourceList[i];
                            this.request.resourceList[i+1].psrSortNo -= 1;
                            this.request.resourceList[i] = this.request.resourceList[i+1];
                            this.request.resourceList[i+1] = temp;

                            // 根据移动后的singleimgList改变img标签中的src
                            if(index == 1){
                                this.data.oneUrl=this.request.resourceList[i].psrResourceUrl;
                                this.data.twoUrl=this.request.resourceList[i+1].psrResourceUrl;
                            }else if(index == 2){
                                this.data.twoUrl=this.request.resourceList[i].psrResourceUrl;
                                this.data.threeUrl=this.request.resourceList[i+1].psrResourceUrl;
                            }else if(index == 3){
                                this.data.threeUrl=this.request.resourceList[i].psrResourceUrl;
                                this.data.fourUrl=this.request.resourceList[i+1].psrResourceUrl;
                            }else if(index == 4){
                                this.data.fourUrl=this.request.resourceList[i].psrResourceUrl;
                                this.data.fiveUrl=this.request.resourceList[i+1].psrResourceUrl;
                            }
                        }else{
                            // 如果点击的是最后一张,则与第一张交换
                            this.request.resourceList[index-1].psrSortNo = 1;
                            temp = this.request.resourceList[index-1];
                            this.request.resourceList[0].psrSortNo = index;
                            this.request.resourceList[index-1] = this.request.resourceList[0];
                            this.request.resourceList[0] = temp;

                            // 根据移动后的singleimgList改变img标签中的src
                            if(index == 2){
                                this.data.oneUrl=this.request.resourceList[0].psrResourceUrl;
                                this.data.twoUrl=this.request.resourceList[i].psrResourceUrl;
                            }else if(index == 3){
                                this.data.oneUrl=this.request.resourceList[0].psrResourceUrl;
                                this.data.threeUrl=this.request.resourceList[i].psrResourceUrl;
                            }else if(index == 4){
                                this.data.oneUrl=this.request.resourceList[0].psrResourceUrl;
                                this.data.fourUrl=this.request.resourceList[i].psrResourceUrl;
                            }else if(index == 5){
                                this.data.oneUrl=this.request.resourceList[0].psrResourceUrl;
                                this.data.fiveUrl=this.request.resourceList[i].psrResourceUrl;
                            }
                        }
                    }
                }
            }
        },
        // 删除图片
        removeMoveItem(index){
            // 如果删除的是最后一张图片,则直接删除
            if(index == this.request.resourceList.length){
                this.request.resourceList.splice(index-1, 1);
                if(index == 1){
                    this.data.oneUrl="";
                }else if(index == 2){
                    this.data.twoUrl="";
                }else if(index == 3){
                    this.data.threeUrl="";
                }else if(index == 4){
                    this.data.fourUrl="";
                }else if(index == 5){
                    this.data.fiveUrl="";
                }
            }else{
                // 如果删除的不是最后一张图片,则删除后将之后的图片往前移动一位
                this.request.resourceList.splice(index-1, 1); 
                let m = index-1;// 删除的索引
                for(let j=m; j<this.request.resourceList.length; j++){
                    // 将此索引包括之后的元素的psrSortNo-1,并将psrResourceUrl赋值给对应的img标签
                    this.request.resourceList[j].psrSortNo -= 1;
                    if(this.request.resourceList[j].psrSortNo == 1){
                        this.data.oneUrl=this.request.resourceList[j].psrResourceUrl;
                        this.data.twoUrl="";
                    }else if(this.request.resourceList[j].psrSortNo == 2){
                        this.data.twoUrl=this.request.resourceList[j].psrResourceUrl;
                        this.data.threeUrl="";
                    }else if(this.request.resourceList[j].psrSortNo == 3){
                        this.data.threeUrl=this.request.resourceList[j].psrResourceUrl;
                        this.data.fourUrl="";
                    }else if(this.request.resourceList[j].psrSortNo == 4){
                        this.data.fourUrl=this.request.resourceList[j].psrResourceUrl;
                        this.data.fiveUrl="";
                    }
                }
            }
        },
        //填写消保类型校验
        checkinsurance(val,num){
            let count = 0;
            if(num ==1){
               if($.trim(val.description) == "" ){
                   this.createinsurancelist.forEach(data=>{
                   if($.trim(data.description) != "" || $.trim(data.keyValue) != ""){
                      count++
                      } 
                   })
                   if( $(".insu input:checked").length + count > 5 ){
                      val.keyValue = ""
                      this.showMsg("消保类型新增和库中勾选的总和不得超过5条!")
                   }
               }
            }else{
               if($.trim(val.keyValue) == "" ){
                   this.createinsurancelist.forEach(data=>{
                   if($.trim(data.description) != "" || $.trim(data.keyValue) != ""){
                      count++
                      } 
                   })
                   if( $(".insu input:checked").length + count > 5 ){
                      val.description = ""
                      this.showMsg("消保类型新增和库中勾选的总和不得超过5条!")
                   }
                }
            }
        },
        //填写上榜理由校验
        checkshangb(val){
            let count = 0;
            this.createshangbanglist.forEach(data=>{
                if($.trim(data.pcrReason)){
                    count++;
                } 
            });
            if(this.shangb.length + count > 3 ){
                val.pcrReason = "";
                this.showMsg("上榜理由新增和理由库中勾选的总和不得超过3条!");
            }
        },
        //勾选消保类型校验
        insurance(event){
            let el = event.currentTarget;
            if( this.createinsurancelist.length ==1  ){
                if( $.trim(this.createinsurancelist[0].keyValue) != "" || $.trim(this.createinsurancelist[0].description) != ""){
                    if( $(".insu input:checked").length + this.createinsurancelist.length > 5){
                        if($(el).is(':checked')){
                            $(el).removeAttr("checked");
                            this.showMsg("消保类型新增和库中勾选的总和不得超过5条!");
                            return;
                        }
                    }
                }
            }else if( this.createinsurancelist.length > 1  ){
                if( $(".insu input:checked").length + this.createinsurancelist.length > 5){
                    if($(el).is(':checked')){
                        $(el).removeAttr("checked");
                        this.showMsg("消保类型新增和库中勾选的总和不得超过5条!");
                        return;
                    }
                }
            }    
            if($(".insu input:checked").length > 5){
                if($(el).is(':checked')){
                    $(el).removeAttr("checked");
                    this.showMsg("消保类型新增和库中勾选的总和不得超过5条!");
                }
            }
        },
        //删除自定义上榜理由
        deleteshangbang(index){
            this.createshangbanglist.splice(index);
        },
        //添加上榜理由
        createshangbang(){
            if( this.shangb.length >= 3){
                this.showMsg("上榜理由新增和理由库中勾选的总和不得超过3条!");
                return;
            }
            if( this.shangb.length + this.createshangbanglist.length >= 3){
                this.showMsg("上榜理由新增和理由库中勾选的总和不得超过3条!");
                return;
            }
            this.createshangbanglist.push({"pcrReason": "",});
        },
        //删除自定义消保类型
        deleteinsurance(index){
            this.createinsurancelist.splice(index);
        },
        //添加消保类型
        createinsurance(){
            if(  $(".insu input:checked").length  >= 5){
                this.showMsg("消保类型新增和库中勾选的总和不得超过5条!");
                return;
            }
            if( $(".insu input:checked").length + this.createinsurancelist.length >= 5){
                this.showMsg("消保类型新增和库中勾选的总和不得超过5条!");
                return;
            }
            this.createinsurancelist.push({"keyValue":"","description":""});
        },
        //勾选上榜理由时校验
        shangbang(event){
            let el = event.currentTarget;
            if( this.createshangbanglist.length ==1  ){
                if( $.trim(this.createshangbanglist[0].pcrReason) != ""){
                    if( this.shangb.length + this.createshangbanglist.length >= 3){
                        if($(el).is(':checked')){
                            $(el).removeAttr("checked");
                            this.showMsg("上榜理由新增和理由库中勾选的总和不得超过3条!");
                            return;
                        }
                    }
                }
            }else if( this.createshangbanglist.length > 1  ){
                if( this.shangb.length + this.createshangbanglist.length >= 3){
                    if($(el).is(':checked')){
                        $(el).removeAttr("checked");
                        this.showMsg("上榜理由新增和理由库中勾选的总和不得超过3条!");
                        return;
                    }
                }
            }    
            if(this.shangb.length >= 3){
                if($(el).is(':checked')){
                    $(el).removeAttr("checked");
                    this.showMsg("上榜理由新增和理由库中勾选的总和不得超过3条!");
                }
            }
        },
        sput(event,clazz) {
            let el = event.currentTarget;
            var reg = /^[0-9]{1,8}([.]{1}[0-9]{1,2})?$/;
            let s = $(el).val()+"";
            let f = !reg.test(s);
            if ( f ) {
                this.showMsg("请输入数字");
                $(el).val("");
                return;
            }
            $(clazz).val($(el).val());
        },
        ssput(event,clazz) {
            let el = event.currentTarget;
            $(el).val(Math.abs($(el).val()));
            $(el).val(Math.round($(el).val()));
            var reg = /^\d{0,10}$/;
            let s = $(el).val()+"";
            let f = !reg.test(s);
            if ( f ) {
                this.showMsg("请输入整数");
                $(el).val("");
                return;
            }
            $(clazz).val($(el).val());
        },
        //输入内容 选中事件
        getcheck(event) {
            let el = event.currentTarget;
            if( $(el).val() != ""){
                 $(el).prev(":checkbox").prop("checked","true");
            }else{
                $(el).prev(":checkbox").removeAttr("checked");
            }
        },
        //小数校验
        checkfloat(event){
            let el = event.currentTarget;
            var reg = /^[0-9]{1,8}([.]{1}[0-9]{1,2})?$/;
            let s = $(el).val()+"";
            let f = !reg.test(s);
            if ( f ) {
                this.showMsg("请输入数字");
                $(el).val("");
            }
        },
        //整数校验
        check(event){
            let el = event.currentTarget;
            $(el).val(Math.abs($(el).val()));
            $(el).val(Math.round($(el).val()));
            var reg = /^-?\d{0,10}$/;
            let s = $(el).val()+"";
            let f = !reg.test(s);
            if ( f ) {
                this.showMsg("请输入整数");
                $(el).val("");
            }
        },
        //重置销售属性
        reset() {
            let arr =[];
            arr.push(this.par[3]);
            arr.push(this.par[4]);
            arr.push(this.par[5]);
            //
            client.postData(  GET_ATRR_LIST , {"parentIds" :arr ,"pcaAtrrType":2}  ).then(data => {
                if (data.code == 200) {
                    this.sxlist = data.data;
                    this.yj  = '';
                    this.sj  = '';
                    this.kc  = '';
                    this.skubm  = '';
                    // this.erpkc  = '';
                    this.xssxList = [];
                    $("#table").hide();
                    $("#pltab").hide();
                    $("#div1").show();
                    $("#pltab input:text").val("");
                    $("#base div[id!=\"0\"]").remove();
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.showMsg("销售属性获取失败,请重试");
            });
        },
        //增加属性选项
        addsxxx( event ) {
            let el = event.currentTarget;
            if( $( $(el).parent().children("input:text") ).length > 23 ){
                this.showMsg("添加属性不能超过24个");
                return;
            }
            let f =  $(el).parent();
            f.append("<input type='checkbox' class='input' value='1' style='width:16px;height:16px;margin-right:3px'> <input type='text' style ='width: 5%; height:100%''  placeholder=''  > &nbsp;&nbsp;&nbsp;&nbsp;");
            $(el).parent().children("input:text").on("keyup",this.getcheck); // 给追加的input输入框注册事件
        },
        // 显示选择图片
        showSelectPicDialog(type) {
            this.showSelectPic({ name: 'bannerPic', show: true, storeType: 4, single: true });
            if (type == 2) {
                this.selectPicType = 2;
            } else if (type == 3) {
                this.selectPicType = 3;
            }else if (type == 4) {
                this.selectPicType = 4;
            }else if (type == 5) {
                this.selectPicType = 5;
            }else if (type == 1) {
                this.selectPicType = 1;
            }
        },
        // 隐藏选择资源弹窗
        cancelSelect() {
            this.showSelectPic({ show: false });
        },
        // 选择组件回调
        selectComponentFunc(list) {
            if (list[0].componentType == 27 || list[0].componentType == 15 || list[0].componentType == 13) {
                this.contentSelect = list[0].subtitle;
            } else {
                this.contentSelect = list[0].title;
            }
            this.data.subComponentId = list[0].componentId;
            this.showComponent = false;
        },
        // 隐藏选择组件弹窗
        cancelSelectComponent() {
            this.showComponent = false;
        },
        showSelectPicDialog(type) {
            this.showSelectPic({ name: 'bannerPic', show: true, storeType: 4, single: true });
            if (type == 2) {
                this.selectPicType = 2;
            } else if (type == 3) {
                this.selectPicType = 3;
            }else if (type == 4) {
                this.selectPicType = 4;
            }else if (type == 5) {
                this.selectPicType = 5;
            }else if (type == 1) {
                this.selectPicType = 1;
            }
        },
        // 选择图片文件回调
        selectPicFunc(list) {
            if (this.selectPicType == 2) {
                this.request.resourceList[1] = {"psrBlock": 1, "psrResourceUrl":  list[0].url,"psrSortNo": 2, "psrType": 1,"psrResourceId":list[0].id };
                this.data.twoUrl = list[0].url;
            } else if (this.selectPicType == 3) {
                 this.request.resourceList[2] =  {"psrBlock": 1, "psrResourceUrl":  list[0].url,"psrSortNo": 3, "psrType": 1,"psrResourceId":list[0].id};
                this.data.threeUrl = list[0].url;
            }else if (this.selectPicType == 4) {
                 this.request.resourceList[3] = {"psrBlock": 1, "psrResourceUrl":  list[0].url,"psrSortNo": 4, "psrType": 1,"psrResourceId":list[0].id}; 
                this.data.fourUrl = list[0].url;
            }else if (this.selectPicType == 5) {
                 this.request.resourceList[4] =  {"psrBlock": 1, "psrResourceUrl":  list[0].url,"psrSortNo": 5, "psrType": 1,"psrResourceId":list[0].id}; 
                this.data.fiveUrl = list[0].url;
            }else {
                 this.request.resourceList[0] = {"psrBlock": 1, "psrResourceUrl":  list[0].url,"psrSortNo": 1, "psrType": 1,"psrResourceId":list[0].id}; 
                 this.data.oneUrl = list[0].url;
                 this.request.spuPic = list[0].url;
            }
            this.showSelectPic({ show: false });
        },
        multiCartesian (data){  
            var len = data.length;  
            if(len == 0){
                return [];  
            }else if(len == 1){
                return data[0];  
            }else{  
                var r = data[0];  
                for(var i=1; i<len; i++){  
                    r = this.Cartesian(r,data[i]);  
                }  
                return r;  
            }  
        },
        ft(a,b) {  
            if(!(a instanceof Array))  
                 a = [a];  
            var ret = Array.call(null,a);  
            ret.push(b);  
            return ret;  
        },
        Cartesian(a,b){
            var ret=[];  
            for(var i=0;i<a.length;i++){  
               for(var j=0;j<b.length;j++){  
                  ret.push(this.ft(a[i],b[j]));  
                }  
            }  
            return ret;  
        },
        // 生成SKU组合
        dkej() {
            $("#table").hide();
            $("#pltab").hide();
            this.xssxList = [];
            let flag = false;
            let fla = false;
            let msg = "";
            let msg3 = "";
            let a = new Array();
            // 销售属性的遍历
            $(".baseSx ").each(function(index,val){
                let arr = new Array();
                flag = false;
                $(val).children(".pcao").children(":checked").each(function(index,check){
                    arr.push( $(check).val() );
                    flag = true;
                });
                $(val).children(".addsxxx").children(":checked").each(function(index,check){
                    if( $.trim( $(check).next(":text").val() ) == ""){
                        msg = "添加属性值不能为空";
                        return;
                    }
                    arr.push( $(check).next(":text").val() )
                        flag = true;
                        msg = "";
                    })
                    if(flag){
                        a.push(arr);
                    }else{
                        /*if(!fla){
                            fla = true
                        }*/
                        if( $($(val).children("span[class='pca']").children("input:hidden")[7]).val() == 1){
                            msg3 += "属性:"+ $($(val).children("span[class='pca']").children("input:hidden")[0]).val()+"的属性值必须填 ! ";
                        }
                    }
                });
                if(msg != ""){
                    $("#table").hide();
                    $("#pltab").hide();
                    this.xssxList = [];
                    this.showMsg(msg);
                    return;
                }
                if(msg3 != ""){
                    $("#table").hide();
                    $("#pltab").hide();
                    this.xssxList = [];
                    this.showMsg(msg3);
                    return;
                }
                if(fla){
                    //this.showMsg("请先选择基本属性或移除")
                    //$("#table").hide()
                    // $("#pltab").hide()
                    //this.xssxList = []
                    //return
                }
                // 新添加的销售属性的校验
                let msg2 = "";
                $("#base div[id!=\"0\"]").each(function(index,v){
                    let name = '';
                    let arr = new Array();
                    flag = false;
                $(v).children("input").each(function(i,val){
                    if( i == 0 && $.trim( $(val).val() ) == ""){
                        msg2 = "属性名称不能为空!";
                        $("#table").hide();
                        $("#pltab").hide();
                        this.xssxList = [];
                        //this.showMsg("温馨提示",'属性名称不能为空');
                        return; 
                    }
                    //获取属性名
                    if(i == 0){
                        name = $(val).val();
                    }
                    //遍历属性值存进数组
                    if( i >= 1 && $.trim( $(val).val() ) != ""){
                        arr.push( $(val).val() );
                        flag = true;
                    }
                });
                if(flag){
                    for(let n=0 ; n<arr.length-1 ; n++){
                        for(let m =1+n; m<arr.length ; m++){
                            if(arr[n] == arr[m]){
                                msg2 = " 属性名:"+ name +"->属性值'"+arr[n]+"'已重复!";
                                return; 
                            }
                        }
                    }
                    a.push(arr);
                }else{
                    msg2 += "\n属性名:"+ name + "->属性值不能为空!";
                    $("#table").hide();
                    $("#pltab").hide();
                    this.xssxList = [];
                    //this.showMsg("温馨提示",'属性值不能为空!');
                    return;
                }     
            });
            if( msg2 != ''){
                this.showMsg(msg2);
                return;
            }
            // 组合数的判断,没超出范围就求笛卡尔积
            if(a.length > 0){
                let sum = 1;
                $(a).each(function(ind,va){
                    sum *= $(va).length;
                });
                if(sum > 600){
                    this.showMsg("SKU组合不能超过600种! 现在组合数"+sum+"种");
                    $("#table").style.display="none";
                    $("#pltab").style.display="none";
                    this.xssxList = [];
                    return; 
                }
                this.xssxList = this.multiCartesian(a); 
                $("#table").show();
                $("#pltab").show();
                $("#div1").hide();
            }else{
                this.showMsg("请先勾选销售属性");
                $("#table").style.display="none";
                $("#pltab").style.display="none";
                this.xssxList = [];
            }  
        },
        // 删除基本属性
        // closeProperty(event) { 
        //     let el = event.currentTarget;
        //     if( $(el).parent().hasClass("baseSx") ){
        //         $(el).parent().remove();
        //         this.xssxList = []; 
        //         $("#table").hide();
        //         $("#pltab").hide();
        //     }
        // },
        // 删除新增销售属性
        closexssx(event) {
            let el = event.currentTarget;
            $(el).parent().remove();  
            if(  $("#base div[id!=\"0\"]").length == 0 ){
                this.xssxList = []; 
                $("#table").hide();
                $("#pltab").hide();
                $("#div1").show();
            }
        },
        // 删除新添加的销售属性及属性值
        close(event,index) { 
            this.xssxList.splice(index, 1);
        },
        // 添加销售属性及属性值
        addProperty(){ 
            if( $("#base div[id!=\"0\"]").length + this.sxlist.length > 3 ) {
                this.showMsg("销售属性总数最多4组!");
                return;
            }
            var el = $("#0").clone(true,true).attr("id",++this.idnum).show();
            el.prependTo($("#base"));
            $("#div1").hide();    
            $(".box2 .delete").on("click",this.closexssx);        
        },
        // 保存并下一步
        addItem() {
            if(this.addpdflag){
                this.showMsg("点击过于频繁");
                return;
            }
            this.addpdflag = true;
            setTimeout(()=>{
                this.addpdflag = false;
            },5000);
            if( $.trim(this.request.spuName) == '' ){
                this.showMsg("请输入商品名称");
                return;
            }
            if( this.request.spuName.length >= 50 ){
                this.showMsg("商品名称不能超过50字");
                return;
            }
            if( this.request.spuAd.length >= 50 ){
                this.showMsg("商品广告词不能超过50字");
                return;
            }
            if( this.request.spuKeyword.length >= 50 ){
                this.showMsg("商品关键词不能超过50字");
                return;
            }
            if( $.trim(this.request.spuShareUrl) == '' ){
                this.showMsg("请输入有赞商品地址");
                return;
            }
            if( this.request.spuShareUrl.length >= 100 ){
                this.showMsg("有赞商品地址不能超过100字");
                return;
            }
            //品牌判空
            if(this.request.spuBrandId < 0 ){
                this.showMsg("请选择品牌");
                return;
            }
            this.request.tagList = [];
            //类目标签
            if( this.tagsList.length == 0){
                this.showMsg("请选择展示类目标签");
                return;
            }
            this.tagsList.forEach((per,index)=>{
                this.request.tagList.push( { "prpTagType": 100 ,"prpTagId": per.id ,"prpTagName": per.text ,"prpSort": per.sortNum } );
            });
            //人群标签
            /*
            if( this.personList.length == 0){
                this.showMsg("请选择人群标签")
                return
            }*/
            this.personList.forEach((per,index)=>{
                this.request.tagList.push( { "prpTagType": 300 ,"prpTagId": per.id ,"prpTagName": per.text ,"prpSort": per.sortNum } );
            });
            //内容标签
            if( this.neirongList.length == 0){
                this.showMsg("请选择内容标签");
                return;
            }
            this.neirongList.forEach((per,index)=>{
                this.request.tagList.push( { "prpTagType": 201 ,"prpTagId": per.id ,"prpTagName": per.text ,"prpSort": per.sortNum } );
            });
            // 品牌类型
            this.brandTypeList.forEach((per,index)=>{
                if(per.checkedValue){
                    this.request.tagList.push( { "prpTagType": 500 ,"prpTagId": per.id ,"prpTagName": per.text ,"prpSort": per.sortNum } );
                }
            });
            //上榜理由
            this.request.pcrList = [];
            if(this.shangb.length > 3 ){
                this.showMsg("最多选择3个上榜理由");
                return;
            }
            this.shangb.forEach((data,index)=>{
                let val = this.shangbanglist.find(item=>item.keyValue == data);
                if(val != null){
                    this.request.pcrList.push( {"pcrReason": val.keyValue,"pcrSortNo":val.sortNo,"pcrSpuId":val.dictionnaryId, }  );
                }
            });
            this.createshangbanglist.forEach(data=>{
                if( $.trim(data.pcrReason) ){
                    this.request.pcrList.push({"pcrReason": data.pcrReason,"pcrSortNo":-1,});
                }
            });
            if(this.request.pcrList.length > 3){
                this.showMsg("最多选择3个上榜理由");
                return;
            }
            // if( this.request.spuExpertOption.trim().length == 0){
            //     this.showMsg("请输入专家观点");
            //     return;
            // }
            if( this.request.spuExpertOption.length >= 100 ){
                this.showMsg("专家观点不能超过100字");
                return;
            }
            if( this. request.spuPackingList.length >= 200 ){
                this.showMsg("包装清单不能超过200字");
                return;
            }
            let sxmsg = "";
            this.radioList.forEach(i =>{
                if(i.pcaRequired == 1){
                    if(!i.pcaCreator){
                        sxmsg += "属性("+i.pcaName+")必须选择!    ";
                    }
                }
            });
            this.boxList.forEach(i =>{
                let f = false;
                if(i.pcaRequired == 1){
                    i.pcaoList.forEach(pcao=>{
                        if(pcao.checked){
                            f = true;
                        }
                    });
                    if(!f){
                        sxmsg += "属性("+i.pcaName+")必须选择!    ";
                    }
                }
            });
            this.selectList.forEach(i =>{
                if(i.pcaRequired == 1){
                    if(i.pcaCreator == -1){
                        sxmsg += "属性("+i.pcaName+")必须选择!    ";
                    }
                }
            });
            this.inputList.forEach(i =>{
                if(i.pcaRequired == 1){
                    if(!i.pcaCreator){
                        sxmsg += "属性("+i.pcaName+")必须填!    ";
                    }
                }
            });
            this.textList.forEach(i =>{
                if(i.pcaRequired == 1){
                    if(!i.pcaCreator){
                        sxmsg += "属性("+i.pcaName+")必须填!     ";
                    }
                }
            });
            if( sxmsg ){
                this.showMsg(sxmsg);
                return;
            }
            //通用属性值
            this.request.spuOptionList = [];
            let spuOptionList = [];     
            this.radioList.forEach(i =>{
                if(i.pcaCreator){
                    spuOptionList.push({
                        "ppaoAtrrId": i.pcaId,
                        "ppaoAtrrValue": i.pcaCreator.pcaoName,
                        "ppaoOptionId": i.pcaCreator.pcaoId,
                        "ppaoSortNo": i.pcaCreator.pcaoSortNo,
                        //"ppaoSpuId": 0,
                        "ppaoType": i.pcaInputType,
                    });
                }
            });
            this.boxList.forEach(i =>{
                i.pcaoList.forEach(pcao=>{
                    if(pcao.checked){
                        spuOptionList.push({
                            "ppaoAtrrId": i.pcaId,
                            "ppaoAtrrValue": pcao.pcaoName,
                            "ppaoOptionId": pcao.pcaoId,
                            "ppaoSortNo": pcao.pcaoSortNo,
                            //"ppaoSpuId": 0,
                            "ppaoType": i.pcaInputType,
                        });
                    }
                });
            });
            this.selectList.forEach(i =>{
                if(i.pcaCreator != -1){
                    spuOptionList.push({
                        "ppaoAtrrId": i.pcaId,
                        "ppaoAtrrValue": i.pcaCreator.pcaoName,
                        "ppaoOptionId": i.pcaCreator.pcaoId,
                        "ppaoSortNo": i.pcaCreator.pcaoSortNo,
                        //"ppaoSpuId": 0,
                        "ppaoType": i.pcaInputType,
                    });
                }
            });
            this.inputList.forEach(i =>{
                if(i.pcaCreator){
                    spuOptionList.push({
                        "ppaoAtrrId": i.pcaId,
                        "ppaoAtrrValue": i.pcaCreator,
                        //"ppaoOptionId": i.pcaCreator.pcaoId,
                        "ppaoSortNo": 0,
                        //"ppaoSpuId": 0,
                        "ppaoType": i.pcaInputType,
                    });
                }
            });
            this.textList.forEach(i =>{
                if(i.pcaCreator){
                    spuOptionList.push({
                        "ppaoAtrrId": i.pcaId,
                        "ppaoAtrrValue": i.pcaCreator,
                        //"ppaoOptionId": i.pcaCreator.pcaoId,
                        "ppaoSortNo": 0,
                        //"ppaoSpuId": 0,
                        "ppaoType": i.pcaInputType,
                    });
                }
            });
            this.request.spuOptionList = spuOptionList; 
            this.request.spuCatId = this.par[5];
            let item = $("#itemList>tr");
            let spuName  = this.request.spuName;
            let spulist = [];
            let bname = $("span[class='pca']");
            let base = $(".baseSx");
            let xsval =  $("#base div[id!=\"0\"]");
            let leimuid = this.request.spuCatId ;
            let msg = "";

            let yjg = this.yj;
            let sjg = this.sj;
            let kcs = this.kc;
            let skubm2 = this.skubm;
            // let erpkc2 = this.erpkc;
            // 一个SKU的情况
            if( $("#div1").is(":visible") &&  $("#table").is( ":hidden") ){ 
                let msg2 = "";
                let baseList = [];
                let attrList = [];
                let pcaoList = [];
                let skuname = '';
                //获取每列spu数据         
                $(base).each(function(d,zc){
                    let flag = true;
                    //匹配基本属性
                    if( $($(zc).children("span[class='pcao']").children("input:checked")).length +  $($($(".addsxxx")[d]).children("input:checked")).length > 1 ){
                        msg2 = "属性名称->"+ $($(bname[d]).children("input:hidden")[0]).val()+":不是单一的sku,请先生成SKU组合";
                        return;
                    }else if($($(zc).children("span[class='pcao']").children("input:checked")).length == 1 && $($($(".addsxxx")[d]).children("input:checked")).length == 0){
                        let list =  $(zc).children("span[class='pcao']").children("input:checked").siblings("input:hidden");
                        let basesx = { //基本属性对象
                            "psaoAtrrId": $($(bname[d]).children("input:hidden")[1]).val(), //基本属性ID
                            "psaoAtrrValue": $($(zc).children("span[class='pcao']").children("input:checked")).val(),  // 选项值  
                            "psaoOptionId": $(list[0]).val() ,          // 属性值ID
                            "psaoSortNo": $(list[2]).val(),            // 
                            "psaoType": 2              //  2 
                        };
                        baseList.push(basesx);
                        skuname += $($(zc).children("span[class='pcao']").children("input:checked")).val()+",";
                        //添加属性被选中,基本属性没有选中
                    }else if( $($($(".addsxxx")[d]).children("input:checked")).length == 1 && $($(zc).children("span[class='pcao']").children("input:checked")).length == 0){ 
                        //上面不匹配，确定为新增基础属性
                        if( $.trim($($($(".addsxxx")[d]).children("input:checked").next(":text")).val() ) == "" ){
                            msg2 = $($(bname[d]).children("input:hidden")[0]).val()+":添加属性值不能为空";
                            return false;
                        }
                        let newbase =  {
                            "pcaoAtrrId":  $($(bname[d]).children("input:hidden")[1]).val(),//需要属性id
                            "pcaoIcon": 0,
                            "pcaoName": $($($(".addsxxx")[d]).children("input:checked").next(":text")).val(),
                            "pcaoSortNo": 0,
                            "pcaoUseFlag": 1,
                            "pcaoValue": $($($(".addsxxx")[d]).children("input:checked").next(":text")).val(),
                            "skuOptionList": [
                                {
                                    "psaoAtrrId": $($(bname[d]).children("input:hidden")[1]).val(),//属性id
                                    "psaoAtrrValue": $($($(".addsxxx")[d]).children("input:checked").next(":text")).val(),
                                    "psaoSortNo": 0,
                                    "psaoType": 2
                                }
                            ]
                        };
                        pcaoList.push(newbase);
                        skuname += $($($(".addsxxx")[d]).children("input:checked").next(":text")).val()+",";
                        // 基本属性和添加属性没有选的时候.判断属性是否必须填
                    }/*else if( $($(zc).children("span[class='pcao']").children("input:checked")).length == 0 &&  $($($(".addsxxx")[d]).children("input:checked")).length == 0
                            && $($(bname[d]).children("input:hidden")[7]).val() == 1 ){
                        msg2 = "属性名(" +$($(bname[d]).children("input:hidden")[0]).val() +")的属性值必须填 ! "
                        return false
                    }*/
                });
                if( msg2 != '' ){
                    this.showMsg(msg2);
                    return;
                }
                if( this.sj == '' ){
                    this.showMsg('请输入丰盛榜售价');
                    return;
                }
                /* if( this.yj == '' ){
                    this.showMsg('请输入原价')
                    return
                }*/
                if( this.kc == '' ){
                    this.showMsg('请输入展示库存');
                    return;
                }
                /* if( this.erpkc == '' ){
                    this.showMsg('请输入ERP库存');
                    return;
                }*/
                // if( this.skubm == '' ){
                //     this.showMsg('请输入SKU编码');
                //     return;
                // }
                /*$(xsval).each(function(f,ze){
                    let count = 0
                    let pcaname = ""
                    let pcaval = ""
                    $(ze).children(":text").each(function(g,zf){
                        if( g == 0){
                            pcaname = $(zf).val()
                        }
                        if( count > 1) {
                            msg = "销售属性不唯一,不是单一的sku"
                            return 
                        }
                        if( $.trim( $(zf).val() ) != ""  ){
                            count++    
                        }
                    })

                    let map = {
                        "optionList": [  //销售属性选项  
                            {
                                "pcaoName": $(zf).val(),  //  选项值
                                "pcaoSortNo": g,       // 排序号
                                "pcaoValue": $(zf).val(), //  选项值
                                "skuOptionList": [    //sku属性选项
                                    {
                                        "psaoAtrrValue": $(zf).val(), // 选项值  
                                        "psaoSortNo": g,//排序号
                                        "psaoType": 2  // 2
                                    }
                                ]
                            }
                        ],
                        "pcaInputType": 4,    //  4
                        "pcaMemo": pcaname, // 备注
                        "pcaName": pcaname, // 销售属性名
                        "pcaRequired": 0,   // 0
                        "pcaSaleProp": 1,  // 1
                        "pcaSortNo": g,   // 排序号
                        "pcraCatId": leimuid,  //  类目ID 
                    }
                    skuname += pcaval+","
                    attrList.push(map)
                })*/
                skuname = skuname.substring(0,skuname.length-1);
                let sku_name = skuname == ""?spuName:skuname;
                let sin = {   
                    "pcaoList": pcaoList,
                    "skuOptionList":baseList,
                    "attrList": attrList,
                    "skuAtrr": skuname ,           //  拼接属性
                    "skuClassify": "i",            //  i
                    "skuCode": skubm2,             //  sku编码
                    "skuMarketSalePrice": yjg,     //  原价
                    //"skuName":  skuname+spuName , //  拼接属性spu名字
                    "skuName":  sku_name,          // 如果sku为空,直接用spuName
                    "skuNew": 1,   
                    "skuOverseas": 1,              //  1
                    "skuSalePrice": sjg,           //  售价   
                    "skuShowNum": kcs,             //  库存 $(el[4]).val()
                    "skuUnit": "",                 //  "" 
                    "skuUrl": "",                  //  ""
                    "skuWhId": "",                 //  ""
                    "sku_remark": skuname ,        //  拼接属性 
                    //"skuStockNum": erpkc2,  
                    "skuFrontIsshow": 0,           //前端是否展示,0-展示,1-不展示
                }
                spulist.push(sin);
            } else {
                // 多个SKU的情况
                //获取基本属性列表
                /*$(base).each(function(b,za){
                })
                //获取属性值
                $("span[class='pcao']").each(function(d,zc){
                    
                })
                //获取新增属性
                $(".addsxxx input:checked").each(function(e,zd){  
                    
                })
                //获取销售属性
                $("#base div[id!=\"0\"] :text").each(function(c,zb){
                })
    
                $(".addsxxx input:checked").each(function(r,y){  
                })*/
                if(this.xssxList.length == 0){
                    this.showMsg("请先生成SKU组合");
                    return;
                }
                let xssx = this.xssxList; 
                $(item).each(function(a, z){
                    let sin = {};
                    let baseList = [];
                    let attrList = [];
                    let pcaoList = [];
                    if( a < $(item).length -2){
                        //获取每列spu数据
                        let el =  $(z).children("td").children("input");
                        //取每一行的sku组合的值
                        let s = xssx[a]+"";
                        let zhi = s.split(",");
                        let  ii = 0;
                        $(base).each(function(d,zc){
                            let flag = true;
                            //匹配基本属性
                            if( $($(zc).children("span[class='pcao']").children("input:checked")).length > 0 || $($(zc).children("span[class='addsxxx']").children("input:checked")).length > 0 ){
                                $(zc).children("span[class='pcao']").children("input:checked").each(function(b,za){
                                    if( $(za).val()==zhi[ii] ){
                                        let list = $(za).siblings("input:hidden");
                                        let basesx = { //基本属性对象
                                            "psaoAtrrId": $($(bname[d]).children("input:hidden")[1]).val(), //基本属性ID
                                            "psaoAtrrValue": zhi[ii],           // 选项值  
                                            "psaoOptionId": $(list[0]).val() ,  // 属性值ID
                                            "psaoSortNo": $(list[2]).val(),     // 
                                            "psaoType": 2                       //  2 
                                        }
                                        baseList.push(basesx);
                                        ++ii;
                                        flag = false;
                                        return false;
                                    }
                                });
                                //上面不匹配，确定为新增基础属性
                                if( flag ) {
                                    let newbase =  {
                                        "pcaoAtrrId":  $($(bname[d]).children("input:hidden")[1]).val(),//需要属性id
                                        "pcaoIcon": 0,
                                        "pcaoName": zhi[ii],
                                        "pcaoSortNo": 0,
                                        "pcaoUseFlag": 1,
                                        "pcaoValue": zhi[ii],
                                        "skuOptionList": [
                                            {
                                            "psaoAtrrId": $($(bname[d]).children("input:hidden")[1]).val(),//属性id
                                            "psaoAtrrValue": zhi[ii],
                                            "psaoSortNo": 0,
                                            "psaoType": 2
                                            }
                                        ]
                                    }
                                    pcaoList.push(newbase);
                                    ++ii;
                                }
                            }
                        });
                        // 销售属性的匹配
                        let len = $(base).length;
                        $(xsval).each(function(f,ze){
                            let optionList = [];
                            $(ze).children(":text").each(function(g,zf){
                                if(g > 0 ){
                                    if($(zf).val() == zhi[f+ii] ){
                                        //匹配成功
                                        let map = {
                                            "optionList": [  //销售属性选项  
                                                {
                                                    "pcaoName": zhi[f+ii],  // 选项值
                                                    "pcaoSortNo": g,        // 排序号
                                                    "pcaoValue": zhi[f+ii], // 选项值
                                                    "skuOptionList": [      // sku属性选项
                                                        {
                                                            "psaoAtrrValue": zhi[f+ii], // 选项值  
                                                            "psaoSortNo": g, //排序号
                                                            "psaoType": 2    // 2
                                                        }
                                                    ]
                                                }
                                            ],
                                            "pcaInputType": 4,    //  4
                                            "pcaMemo": zhi[f+ii], // 备注
                                            "pcaName": $($(ze).children(":text")[0]).val(), // 销售属性名
                                            "pcaRequired": 0,   // 0
                                            "pcaSaleProp": 1,  // 1
                                            "pcaSortNo": g,   // 排序号
                                            "pcraCatId": leimuid,  //  类目ID 
                                            "pcaAtrrType":3,//1-通用属性; 2-销售属性; 3-私有属性
                                        };
                                        attrList.push(map);
                                        return false;
                                    }
                                }
                            });
                        });
                        if( $(el[2]).val() == ''){
                            msg += "第"+$(el[0]).val()+"行: 未填写丰盛榜售价_________________";
                            //return
                        }
                        /*if( $(el[3]).val() == ''){
                            msg += "第"+$(el[0]).val()+"行: 未填写原价____________"
                            //return
                        }*/
                        if( $(el[4]).val() == ''){
                            msg += "第"+$(el[0]).val()+"行: 未填写展示库存_________________";
                            //return
                        }
                        /* if( $(el[5]).val() == ''){
                            msg += "第"+$(el[0]).val()+"行: 未填写ERP实际库存___________"
                            //return
                        }        */
                        if( $(el[6]).val() == ''){
                            msg += "第"+$(el[0]).val()+"行: 未填写sku编码_________________";
                            //return
                        }
                        if(msg){
                            return;
                        }
                        let sku_name = $(el[1]).val() == ""?spuName:$(el[1]).val();
                        sin = {   
                            "pcaoList": pcaoList,
                            "skuOptionList":baseList,
                            "attrList": attrList,
                            "skuAtrr": $(el[1]).val() ,             //  拼接属性
                            "skuClassify": "i",                     //  i
                            "skuCode": $(el[5]).val(),              //  sku编码
                            "skuMarketSalePrice": $(el[3]).val(),   //  原价
                            //"skuName":  $(el[1]).val()+spuName  , //  拼接属性spu名字
                            "skuName":  sku_name,                   // 如果sku为空,直接用spuName
                            "skuNew": 1,   
                            "skuOverseas": 1,                     //  1
                            "skuSalePrice": $(el[2]).val(),       //  售价   
                            "skuStockNum": $(el[4]).val(),        //  库存 $(el[4]).val()
                            "skuUnit": "",                        //  "" 
                            "skuUrl": "",                         //  ""
                            "skuWhId": "",                        //  ""
                            "sku_remark": $(el[1]).val(),         //  拼接属性
                            "skuShowNum": $(el[4]).val(),         //  展示库存
                            "skuFrontIsshow": $(el[6])[0].checked?0:1, //前端是否展示
                        }
                        spulist.push(sin);
                    }      
                });
            }
            if( msg != ''){
                this.showMsg(msg);
                return;
            }
            //sku
            this.request.skuList = spulist;
            // if(this.request.skuList.length == 1 ){
            //     if(this.request.skuList[0].skuAtrr == ""){
            //         this.showMsg("请先勾选需要生成SKU的销售属性");
            //         return;
            //     }
            // }
            //商品图片判空
            for(let i = 0;i<this.request.resourceList.length;i++){
                if(this.request.resourceList[i]==null){
                    this.request.resourceList.splice(i,1);
                    i--;
                }
            }
            if(this.request.resourceList.length == 0 ){
                this.showMsg("商品图片至少上传一张");
                return;
            }
            //保消类型
            let arr = [];
            $(".insu input:checked").each(function(i , v){
                //let ar = {"piInsuranceId": '',"piInsurance":'',"piSort":'', }
                let ar = $(v).val().split(",");
                let av = {"piInsuranceId": ar[1],"piInsurance":ar[0],"piSort":ar[2],"piDesc":ar[3], };
                arr.push(av);
            });
            this.createinsurancelist.forEach(data=>{
                if($.trim(data.keyValue) && $.trim(data.description) ){
                    let av = {"piInsurance":data.keyValue,"piDesc":data.description, };
                    arr.push(av);
                }
            });
            if( arr.length > 5 ){
                this.showMsg("消保类型新增和库中勾选的总和不得超过5条!");
                return;
            }
            this.request.piList = arr; 
            /*if(arr.length == 0 ){
                this.showMsg("消保类型不能为空")
                return
            }*/
            //上架时间
            if( $(".radios input:checked").val() == 2 ){
                if( this.time == ""){
                    this.showMsg("请输入上架时间");
                    return;
                }
                if(new Date(this.time).getTime() - new Date().getTime() < -10000){
                    this.time = client.formateTimeNoSecond();
                }
                this.request.spuPlanShelvesDate = this.time;
            } else {
                this.request.spuPlanShelvesDate = "";
            } 
        
            //this.request.spuAppSummary = this.request.spuPcSummary
            if(this.yunfei == 0 && $.trim(this.request.spuFreight) == ''){
                this.showMsg("请设置统一邮费的价格");
                return;
            }
            if(this.yunfei ==1 && this.request.spuCarriageId ==-1){
                this.showMsg("请选择运费模板");
                return;
            }
            if(this.yunfei == 0){
                this.request.spuCarriageId = -1;
            }else{
                this.request.spuFreight = 0;
            }
            // 发送新增商品请求  
            client.postData( SPU_CREATE , this.request).then(data => {
                this.isLoading = false;
                if (data.code == 200) {
                    this.isLoading = false;
                    //this.showMsg("新增成功")
                    this.spu.id = data.spuId;
                    this.spu.msg = "新增成功";
                    this.expertEditId = '';
                    this.showAddDialog = true;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.isLoading = false;
                this.addpdflag = false;
                this.showMsg("新增失败,请重试"+data.message);
            });
        },
        hideAddDialog(control) {
            this.expertEditId = '';
            this.showAddDialog = false;
            if (control && control == 'create') {
                this.showMsg('保存成功');
            }
            if (control && control == 'update') {
                this.showMsg('更新成功');
            }
            if (control) {
                setTimeout(() => {
                    //移除组件
                    this.destroyControlDialog = true;
                }, 100);
                setTimeout(() => {
                    //重新加入
                    this.destroyControlDialog = false;
                }, 200);
                //this.getList();
            }
        },
        //获取运费模板
        getCarriageList() {
            //
            client.postData( PCT_PCLIST , {} ).then(data => {
                if (data.code == 200) {
                    this.carriageList = data.data;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.showMsg("获取运费模板失败,请刷新重试");
            });
        },
        //获取消保类型
        getxbList() { 
            //
            client.postData( SYSTEM_DICTIONARY , {
                "key": "",
                "keyValue": "",
                "page": {
                    "currentPage": 0,
                    "pageSize": 10,
                    "startIndex": 0,
                    "totalPage": 0,
                    "totalSize": 0
                },
                "parentCode": "product_insurance"
            }).then(data => {
                if (data.code == 200) {
                    this.insurancelist = data.data;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.showMsg("获取消保类型信息失败,请刷新重试"+data.message);
            });
        },
        //获取上榜 理由
        getshangbangList() { 
            //
            client.postData( SYSTEM_REASON , {} ).then(data => {
                if (data.code == 200) {
                    this.shangbanglist = data.data;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.showMsg("获取上榜理由信息失败,请刷新重试");
            });
        },
        // 获取品牌
        getbrandList() { 
            //
            client.postData( PBD_GET_LISTUSED , {} ).then(data => {
                if (data.code == 200) {
                    let list = data.data;
                    for (let i = 0; i < list.length; i++) {
                        list[i].name = list[i].pbdName;
                        list[i].id = list[i].pbdId;
                    }
                    this.brandList = list;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.showMsg("获取品牌信息失败,请刷新重试");
            });
        },
        // 品牌回调
        selectTagStatusFunc(item) {
            if (item == '') {
                this.searchOptions.existTag = '';
            } else {
                this.searchOptions.existTag = item.id === 0 ? false : true;
            }
            this.setOptions();
        },
        // 获取品牌类型
        getBrandTypeList() { 
            // 从CMS获取品牌类型数据,typeId=500
            client.postData(TAG_LIST_GET + '?typeId=500', {}).then(data => {
                this.isLoading = false;
                if (data.code == 200) {
                    this.brandTypeList = data.data.root.children;
                    this.brandTypeList.forEach(item=>{
                        item["checkedValue"] = false;
                    });
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.showMsg("获取品牌类型数据失败,请刷新重试");
            });
        },
        // 弹出选择标签弹窗
        showTagDialog() {
            this.tagsList = [];
            this.showTagTreeSelect = !this.showTagTreeSelect;
        },
        showperDialog() {
            this.personList = [];
            this.showperTreeSelect = !this.showperTreeSelect;
        },
        showneiDialog() {
            this.neirongList = [];
            this.showneiTreeSelect = !this.showneiTreeSelect;
        },
        // 移除某个标签
        removeTagItem(item) {
            let index = this.tagsList.findIndex(subitem => subitem.id == item.id);
            this.tagsList.splice(index, 1);
        },
        removeperItem(item) {
            let index = this.personList.findIndex(subitem => subitem.id == item.id);
            this.personList.splice(index, 1);
        },
        removeneiItem(item) {
            let index = this.neirongList.findIndex(subitem => subitem.id == item.id);
            this.neirongList.splice(index, 1);
        },
        //内容标签回调
        selectNeiFunc(list) {
            let flag = false; 
            this.neirongList = [];
            this.data.labelIds = [];
            if(flag){
                this.showMsg("请选择到最后一级标签。");
                this.data.labelIds = [];
                this.neirongList = list;
                return;
            }else{
                this.neirongList = list;
                this.showneiTreeSelect = !this.showneiTreeSelect;
            }
        },
        //人群标签回调
        selectPerFunc(list) {
            let flag = false; 
            this.personList = [];
            this.data.labelIds = [];
            if(flag){
                this.showMsg("请选择到最后一级标签。");
                this.data.labelIds = [];
                this.tagsList = list;
                return;
            }else{
                this.personList = list;
                this.showperTreeSelect = !this.showperTreeSelect;
            }
        },
        // 选择标签回调
        selectTagFunc(list) {
            let flag = false;
            this.tagsList = [];
            this.data.labelIds = [];
            list.forEach(item => {
                if( item.children != "" ){
                    flag = true;
                    return;
                }
                this.data.labelIds.push(item.id);
            });
            if(flag){
                alert("请选择到最后一级标签。");
                this.data.labelIds = [];
                this.tagsList = list;
                return;
            }else{
                this.tagsList = list;
                this.showTagTreeSelect = !this.showTagTreeSelect;
            }
        },
        hideDialog() {
            this.closeparentpage();
            this.par = [];
            this.showDialog = false;
            setTimeout(() => {
                this.showPage = false;
                this.onhide('cancel');
            }, 300)
        },
        selectPainFunc(list) {
            let arr = [];
            list.forEach(item => {
                arr.push(item.id);
            })
            this.painIdsSelect = arr;
            this.data.painIds = arr;
        },
        showMsg(msg, title) {
            if (title) {
                this.showAlertTitle = title;
            } else {
                this.showAlertTitle = '温馨提示';
            }
            this.showAlertMsg = msg;
            this.showAlert = true;
        },
        hideMsg() {
            this.showAlert = false;
        },
        clearInfo() {
            this.data = {
                "componentType": 16,
                "painIds": [],
                "subtitle": "",
                "title": ""
            }
            this.painIdsSelect = [];
            this.getPainList();
        },
        // 提交信息
        submitInfo() {
            let data = this.data;
            if (data.title.replace(/\s/g, '') == '' || data.title.length > 30) {
                this.showMsg('请输入良言标题(1~30字)');
                return;
            }
            if (data.subtitle.replace(/\s/g, '') == '' || data.subtitle.length > 70) {
                this.showMsg('请输入良言文案(1~70字)');
                return;
            }
            if (this.tagsList.length == 0) {
                this.showMsg('请选择标签');
                return;
            }
            data.labelIds = [];
            this.tagsList.forEach(item => {
                data.labelIds.push(item.id);
            });
            let url = COMPONENT_ADD;
            if (this.id != '') {
                url = COMPONENT_EDIT;
                data.componentId = this.id;
            }
            this.isLoading = true;
            //
            client.postData(url, data).then(response => {
                this.isLoading = false;
                if (response.code != 200) {
                    this.showMsg(response.msg);
                } else {
                    this.showPainListSelect = false;
                    if (this.id != '') {
                        this.onhide('update');
                    } else {
                        this.onhide('create');
                    }
                }
            }, response => {
                this.isLoading = false;
                this.showMsg('网络连接错误');
            });
        }
    },
    created() {
        this.getbrandList();
        this.getxbList();
        this.getshangbangList();
        this.getCarriageList();
        this.getBrandTypeList();// 获取品牌类型数据
    },
    watch: {
        rad(val){
            if(val == 1){
                $("#selecttime").hide();
            }else{
                $("#selecttime").show();
            }
        },
        time(val) {
            if( val ) {
                let reg = /^((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s((([0-1][0-9])|(2?[0-3]))\:([0-5]?[0-9])))?$/;
                if(!reg.test(val)){
                    this.showMsg('日期格式不合法');
                    this.time = "";
                    return;
                }
                /* val = val.replace(/-/g,"/")
                let end = new Date(val)
                if(end <= new Date()){
                    this.showMsg('上架时间不可以小于现在时间')
                    this.time = "" 
                    return
                }*/
            }
        },
        "request.spuFreight": {　　
          　handler(curVal,oldVal){　
                if(curVal > 0){
                    this.request.spuCarriageId = -1;
                    this.yunfei = 0;　
                }　　
            },　　　　　　　　　　
            deep:true　　　　　　　　
        },
        "request.spuCarriageId": {　　
            handler(curVal,oldVal){　
                if(curVal != -1){　
                    this.request.spuFreight = 0.00;　　　　　　　　　　　
                    this.yunfei = 1;　
                }　　　　　　　
            },　　　　　　　　　　
            deep:true　　　　　　　　
        },
        cflag() {
            let arr =[]
            arr.push(this.par[3]);
            arr.push(this.par[4]);
            arr.push(this.par[5]);
            // 获取通用属性
            client.postData(  GET_ATRR_LIST  , {"parentIds" :arr ,"pcaAtrrType":1} ).then(data => {
                if (data.code == 200) {
                    data.data.forEach(sx =>{
                        if(sx.pcaInputType==1){
                            sx.pcaCreator = "";
                            this.radioList.push(sx);
                        }else if(sx.pcaInputType==2){
                            sx.pcaoList.forEach(item=>{
                                item.checked = false;
                            });
                            this.boxList.push(sx);
                        }else if(sx.pcaInputType==3){
                            sx.pcaCreator = -1;
                            this.selectList.push(sx);
                        }else if(sx.pcaInputType==4){
                            sx.pcaCreator = "";
                            this.inputList.push(sx);
                        }else if(sx.pcaInputType==5){
                            sx.pcaCreator = "";
                            this.textList.push(sx);
                        }
                    });
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.showMsg("获取通用属性失败,请刷新重试");
            });
            // 获取销售属性
            client.postData( GET_ATRR_LIST  , {"parentIds" :arr ,"pcaAtrrType":2} ).then(data => {
                if (data.code == 200) {
                    this.sxlist = data.data;
                    if(this.sxlist.length >= 4){
                        $("#addsx").hide();
                    }   
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.showMsg("获取销售属性失败,请刷新重试");
            });
        },
        par(){
            //this.showMsg("watch"+this.par);
            this.request.spuCatId = this.par[5];
            this.spuCatId = this.par[3]+","+this.par[4]+","+this.par[5];
        },
        show() {
            this.showPage = this.show;
            this.showDialog = this.show;
        },
        id() {
            this.data = {
                "componentType": 16,
                "painIds": [],
                "subtitle": "",
                "title": ""
            }
            this.painList = [];
            this.painIdsSelect = [];
            if (this.id == '') {
                this.title = '编辑基本信息';
                this.getPainList();
                this.tagsList = [];
                setTimeout(() => {
                    this.typesList = client.global.componentTypes;
                }, 30);
                return;
            }
            this.title = '编辑基本信息';
            this.isLoading = true;
            this.painList = [];
            //
            client.postData(COMPONENT_GETWITHPAINS + '?componentId=' + this.id, {}).then(response => {
                this.isLoading = false;
                if (response.code == 200) {
                    let data = response.data;
                    if (data.painIds) {
                        data.painIds.forEach(item => {
                            this.painIdsSelect.push({ id: item, name: '' })
                        });
                        this.data.painIds = data.painIds;
                    }
                    data.tags.forEach(item => {
                        item.id = item.tagId;
                        item.text = item.tagName;
                    });
                    this.tagsList = data.tags;
                    this.getPainList();
                    this.data.title = data.title;
                    this.data.subtitle = data.subtitle;
                } else {
                    this.showMsg(response.msg);
                }
            }, data => {
                this.isLoading = false;
                this.showMsg('网络连接错误');
            });
        }
    },
    ready() {   
        this.typesList = client.global.componentTypes;
        this.showPainListSelect = true;
        // 渲染时间控件
        let dates = $("#createStartTime0");
        dates.datetimepicker({
            dateFormat: "yy-mm-dd",
            timeFormat: 'HH:mm',
            showMonthAfterYear: true,
            changeMonth: true, 
            changeYear: true,
            buttonImageOnly: true,
            stepHour: 1,
            stepMinute: 1,
            closeText: '确定',
            prevText: '&#x3c;上月',
            nextText: '下月&#x3e;',
            currentText: '今天',
            monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
            monthNamesShort: ['一','二','三','四','五','六','七','八','九','十','十一','十二'],
            dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
            dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
            dayNamesMin: ['日','一','二','三','四','五','六'],
            weekHeader: '周',
            showAnim:'highlight',
            isClear:true, //是否显示清空 
            isRTL: false,
            onSelect: function(selectedDate){
                //var option = this.id == "createStartTime2" ? "minDate" : "maxDate";
                //dates.not(this).datepicker("option", option, selectedDate );
            },
            onClose: function(data,inst){   
                dates.removeAttr("disabled");
            },
            beforeShow: function(){
                dates.attr("disabled","disabled");
                $(this).datepicker('option', 'minDate', new Date());
            },
        });
        dates.on("click",function(){
            $(this).attr("disabled","disabled");
        });
    },
    beforeDestroy() {
        this.showPainListSelect = false;
    }
};
</script>

<style lang="less" scoped>
    .box{
        //margin-left: 2%;
        //overflow-x: scroll;
        height: 130px;
        width: 100%;
        //display:inline-block;
        background-color:white;
        border:1px solid #000;
    }
    .box2{
        //margin-left: 2%;
        //overflow-x: scroll;
        height: 160px;
        width: 100%;
        //display:inline-block;
        background-color:white;
        border:1px solid #000;
    }
    .input{
        margin-left: 2%;
        margin-top: 1%;
    }
    .input2{
        margin-left: 2%;
        margin-top: 1%;
        height: 100%;
        width: 80%
    }
    .clo{
        //display: inline-block;
        //margin-top: 0px;
        // margin-right: 0px;
        width: 9px;
        height: 9px;
        //background-repeat: no-repeat !important;
        //text-indent: -10000px;
        outline: none;
        background-image: url("../../../assets/global/img/remove-icon-small.png") !important; }
    .tab{
        text-align: center;
        border-collapse: collapse;
    }
    table,table tr th, table tr td { text-align: center; border:1px solid   #A5A552; }
    .time-box{
        display:-webkit-box;
        display:-moz-box;
        div{-webkit-box-flex: 1.0;-moz-box-flex: 1.0}
        div:nth-child(2){line-height:34px;width:85px;margin:0 5px;text-align:center}
    }
    .delete{
        //font-family:"Microsoft Yahei",simSun,Arial;
        font-size:23px;
        /* position: relative;
        left: 65%;
        top: -10%;*/
        float: right;
        margin-right:5%;
        text-decoration:none
    }
    .delete:hover{
        color:red
    }
    .dele{
        //font-family:"Microsoft Yahei",simSun,Arial;
        font-size:18px;
        /* position: relative;
        <!-- left: 65%; -->
        top: -10%;*/
        float: right;
        margin-right:5%;
        text-decoration:none
    }
    .dele:hover{
        color:red
    }
    .delete2{
        //font-family:"Microsoft Yahei",simSun,Arial;
        font-size:23px;
        /* position: relative;
        left: 65%;
        top: -10%;*/
        //float: left;
        margin-left:3%;
        text-decoration:none
    }
    .delete2:hover{
        color:red
    }
</style>