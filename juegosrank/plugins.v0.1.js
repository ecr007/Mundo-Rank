!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){a.extend(a.fn,{validate:function(b){if(!this.length)return void(b&&b.debug&&window.console&&console.warn("Nothing selected, can't validate, returning nothing."));var c=a.data(this[0],"validator");return c?c:(this.attr("novalidate","novalidate"),c=new a.validator(b,this[0]),a.data(this[0],"validator",c),c.settings.onsubmit&&(this.on("click.validate",":submit",function(b){c.settings.submitHandler&&(c.submitButton=b.target),a(this).hasClass("cancel")&&(c.cancelSubmit=!0),void 0!==a(this).attr("formnovalidate")&&(c.cancelSubmit=!0)}),this.on("submit.validate",function(b){function d(){var d,e;return c.settings.submitHandler?(c.submitButton&&(d=a("<input type='hidden'/>").attr("name",c.submitButton.name).val(a(c.submitButton).val()).appendTo(c.currentForm)),e=c.settings.submitHandler.call(c,c.currentForm,b),c.submitButton&&d.remove(),void 0!==e?e:!1):!0}return c.settings.debug&&b.preventDefault(),c.cancelSubmit?(c.cancelSubmit=!1,d()):c.form()?c.pendingRequest?(c.formSubmitted=!0,!1):d():(c.focusInvalid(),!1)})),c)},valid:function(){var b,c,d;return a(this[0]).is("form")?b=this.validate().form():(d=[],b=!0,c=a(this[0].form).validate(),this.each(function(){b=c.element(this)&&b,b||(d=d.concat(c.errorList))}),c.errorList=d),b},rules:function(b,c){if(this.length){var d,e,f,g,h,i,j=this[0];if(b)switch(d=a.data(j.form,"validator").settings,e=d.rules,f=a.validator.staticRules(j),b){case"add":a.extend(f,a.validator.normalizeRule(c)),delete f.messages,e[j.name]=f,c.messages&&(d.messages[j.name]=a.extend(d.messages[j.name],c.messages));break;case"remove":return c?(i={},a.each(c.split(/\s/),function(b,c){i[c]=f[c],delete f[c],"required"===c&&a(j).removeAttr("aria-required")}),i):(delete e[j.name],f)}return g=a.validator.normalizeRules(a.extend({},a.validator.classRules(j),a.validator.attributeRules(j),a.validator.dataRules(j),a.validator.staticRules(j)),j),g.required&&(h=g.required,delete g.required,g=a.extend({required:h},g),a(j).attr("aria-required","true")),g.remote&&(h=g.remote,delete g.remote,g=a.extend(g,{remote:h})),g}}}),a.extend(a.expr[":"],{blank:function(b){return!a.trim(""+a(b).val())},filled:function(b){var c=a(b).val();return null!==c&&!!a.trim(""+c)},unchecked:function(b){return!a(b).prop("checked")}}),a.validator=function(b,c){this.settings=a.extend(!0,{},a.validator.defaults,b),this.currentForm=c,this.init()},a.validator.format=function(b,c){return 1===arguments.length?function(){var c=a.makeArray(arguments);return c.unshift(b),a.validator.format.apply(this,c)}:void 0===c?b:(arguments.length>2&&c.constructor!==Array&&(c=a.makeArray(arguments).slice(1)),c.constructor!==Array&&(c=[c]),a.each(c,function(a,c){b=b.replace(new RegExp("\\{"+a+"\\}","g"),function(){return c})}),b)},a.extend(a.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",pendingClass:"pending",validClass:"valid",errorElement:"label",focusCleanup:!1,focusInvalid:!0,errorContainer:a([]),errorLabelContainer:a([]),onsubmit:!0,ignore:":hidden",ignoreTitle:!1,onfocusin:function(a){this.lastActive=a,this.settings.focusCleanup&&(this.settings.unhighlight&&this.settings.unhighlight.call(this,a,this.settings.errorClass,this.settings.validClass),this.hideThese(this.errorsFor(a)))},onfocusout:function(a){this.checkable(a)||!(a.name in this.submitted)&&this.optional(a)||this.element(a)},onkeyup:function(b,c){var d=[16,17,18,20,35,36,37,38,39,40,45,144,225];9===c.which&&""===this.elementValue(b)||-1!==a.inArray(c.keyCode,d)||(b.name in this.submitted||b.name in this.invalid)&&this.element(b)},onclick:function(a){a.name in this.submitted?this.element(a):a.parentNode.name in this.submitted&&this.element(a.parentNode)},highlight:function(b,c,d){"radio"===b.type?this.findByName(b.name).addClass(c).removeClass(d):a(b).addClass(c).removeClass(d)},unhighlight:function(b,c,d){"radio"===b.type?this.findByName(b.name).removeClass(c).addClass(d):a(b).removeClass(c).addClass(d)}},setDefaults:function(b){a.extend(a.validator.defaults,b)},messages:{required:"This field is required.",remote:"Please fix this field.",email:"Please enter a valid email address.",url:"Please enter a valid URL.",date:"Please enter a valid date.",dateISO:"Please enter a valid date ( ISO ).",number:"Please enter a valid number.",digits:"Please enter only digits.",equalTo:"Please enter the same value again.",maxlength:a.validator.format("Please enter no more than {0} characters."),minlength:a.validator.format("Please enter at least {0} characters."),rangelength:a.validator.format("Please enter a value between {0} and {1} characters long."),range:a.validator.format("Please enter a value between {0} and {1}."),max:a.validator.format("Please enter a value less than or equal to {0}."),min:a.validator.format("Please enter a value greater than or equal to {0}."),step:a.validator.format("Please enter a multiple of {0}.")},autoCreateRanges:!1,prototype:{init:function(){function b(b){var c=a.data(this.form,"validator"),d="on"+b.type.replace(/^validate/,""),e=c.settings;e[d]&&!a(this).is(e.ignore)&&e[d].call(c,this,b)}this.labelContainer=a(this.settings.errorLabelContainer),this.errorContext=this.labelContainer.length&&this.labelContainer||a(this.currentForm),this.containers=a(this.settings.errorContainer).add(this.settings.errorLabelContainer),this.submitted={},this.valueCache={},this.pendingRequest=0,this.pending={},this.invalid={},this.reset();var c,d=this.groups={};a.each(this.settings.groups,function(b,c){"string"==typeof c&&(c=c.split(/\s/)),a.each(c,function(a,c){d[c]=b})}),c=this.settings.rules,a.each(c,function(b,d){c[b]=a.validator.normalizeRule(d)}),a(this.currentForm).on("focusin.validate focusout.validate keyup.validate",":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], [type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox'], [contenteditable]",b).on("click.validate","select, option, [type='radio'], [type='checkbox']",b),this.settings.invalidHandler&&a(this.currentForm).on("invalid-form.validate",this.settings.invalidHandler),a(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required","true")},form:function(){return this.checkForm(),a.extend(this.submitted,this.errorMap),this.invalid=a.extend({},this.errorMap),this.valid()||a(this.currentForm).triggerHandler("invalid-form",[this]),this.showErrors(),this.valid()},checkForm:function(){this.prepareForm();for(var a=0,b=this.currentElements=this.elements();b[a];a++)this.check(b[a]);return this.valid()},element:function(b){var c,d,e=this.clean(b),f=this.validationTargetFor(e),g=this,h=!0;return void 0===f?delete this.invalid[e.name]:(this.prepareElement(f),this.currentElements=a(f),d=this.groups[f.name],d&&a.each(this.groups,function(a,b){b===d&&a!==f.name&&(e=g.validationTargetFor(g.clean(g.findByName(a))),e&&e.name in g.invalid&&(g.currentElements.push(e),h=h&&g.check(e)))}),c=this.check(f)!==!1,h=h&&c,c?this.invalid[f.name]=!1:this.invalid[f.name]=!0,this.numberOfInvalids()||(this.toHide=this.toHide.add(this.containers)),this.showErrors(),a(b).attr("aria-invalid",!c)),h},showErrors:function(b){if(b){var c=this;a.extend(this.errorMap,b),this.errorList=a.map(this.errorMap,function(a,b){return{message:a,element:c.findByName(b)[0]}}),this.successList=a.grep(this.successList,function(a){return!(a.name in b)})}this.settings.showErrors?this.settings.showErrors.call(this,this.errorMap,this.errorList):this.defaultShowErrors()},resetForm:function(){a.fn.resetForm&&a(this.currentForm).resetForm(),this.invalid={},this.submitted={},this.prepareForm(),this.hideErrors();var b=this.elements().removeData("previousValue").removeAttr("aria-invalid");this.resetElements(b)},resetElements:function(a){var b;if(this.settings.unhighlight)for(b=0;a[b];b++)this.settings.unhighlight.call(this,a[b],this.settings.errorClass,""),this.findByName(a[b].name).removeClass(this.settings.validClass);else a.removeClass(this.settings.errorClass).removeClass(this.settings.validClass)},numberOfInvalids:function(){return this.objectLength(this.invalid)},objectLength:function(a){var b,c=0;for(b in a)a[b]&&c++;return c},hideErrors:function(){this.hideThese(this.toHide)},hideThese:function(a){a.not(this.containers).text(""),this.addWrapper(a).hide()},valid:function(){return 0===this.size()},size:function(){return this.errorList.length},focusInvalid:function(){if(this.settings.focusInvalid)try{a(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").focus().trigger("focusin")}catch(b){}},findLastActive:function(){var b=this.lastActive;return b&&1===a.grep(this.errorList,function(a){return a.element.name===b.name}).length&&b},elements:function(){var b=this,c={};return a(this.currentForm).find("input, select, textarea, [contenteditable]").not(":submit, :reset, :image, :disabled").not(this.settings.ignore).filter(function(){var d=this.name||a(this).attr("name");return!d&&b.settings.debug&&window.console&&console.error("%o has no name assigned",this),this.hasAttribute("contenteditable")&&(this.form=a(this).closest("form")[0]),d in c||!b.objectLength(a(this).rules())?!1:(c[d]=!0,!0)})},clean:function(b){return a(b)[0]},errors:function(){var b=this.settings.errorClass.split(" ").join(".");return a(this.settings.errorElement+"."+b,this.errorContext)},resetInternals:function(){this.successList=[],this.errorList=[],this.errorMap={},this.toShow=a([]),this.toHide=a([])},reset:function(){this.resetInternals(),this.currentElements=a([])},prepareForm:function(){this.reset(),this.toHide=this.errors().add(this.containers)},prepareElement:function(a){this.reset(),this.toHide=this.errorsFor(a)},elementValue:function(b){var c,d,e=a(b),f=b.type;return"radio"===f||"checkbox"===f?this.findByName(b.name).filter(":checked").val():"number"===f&&"undefined"!=typeof b.validity?b.validity.badInput?"NaN":e.val():(c=b.hasAttribute("contenteditable")?e.text():e.val(),"file"===f?"C:\\fakepath\\"===c.substr(0,12)?c.substr(12):(d=c.lastIndexOf("/"),d>=0?c.substr(d+1):(d=c.lastIndexOf("\\"),d>=0?c.substr(d+1):c)):"string"==typeof c?c.replace(/\r/g,""):c)},check:function(b){b=this.validationTargetFor(this.clean(b));var c,d,e,f=a(b).rules(),g=a.map(f,function(a,b){return b}).length,h=!1,i=this.elementValue(b);if("function"==typeof f.normalizer){if(i=f.normalizer.call(b,i),"string"!=typeof i)throw new TypeError("The normalizer should return a string value.");delete f.normalizer}for(d in f){e={method:d,parameters:f[d]};try{if(c=a.validator.methods[d].call(this,i,b,e.parameters),"dependency-mismatch"===c&&1===g){h=!0;continue}if(h=!1,"pending"===c)return void(this.toHide=this.toHide.not(this.errorsFor(b)));if(!c)return this.formatAndAdd(b,e),!1}catch(j){throw this.settings.debug&&window.console&&console.log("Exception occurred when checking element "+b.id+", check the '"+e.method+"' method.",j),j instanceof TypeError&&(j.message+=".  Exception occurred when checking element "+b.id+", check the '"+e.method+"' method."),j}}if(!h)return this.objectLength(f)&&this.successList.push(b),!0},customDataMessage:function(b,c){return a(b).data("msg"+c.charAt(0).toUpperCase()+c.substring(1).toLowerCase())||a(b).data("msg")},customMessage:function(a,b){var c=this.settings.messages[a];return c&&(c.constructor===String?c:c[b])},findDefined:function(){for(var a=0;a<arguments.length;a++)if(void 0!==arguments[a])return arguments[a]},defaultMessage:function(b,c){var d=this.findDefined(this.customMessage(b.name,c.method),this.customDataMessage(b,c.method),!this.settings.ignoreTitle&&b.title||void 0,a.validator.messages[c.method],"<strong>Warning: No message defined for "+b.name+"</strong>"),e=/\$?\{(\d+)\}/g;return"function"==typeof d?d=d.call(this,c.parameters,b):e.test(d)&&(d=a.validator.format(d.replace(e,"{$1}"),c.parameters)),d},formatAndAdd:function(a,b){var c=this.defaultMessage(a,b);this.errorList.push({message:c,element:a,method:b.method}),this.errorMap[a.name]=c,this.submitted[a.name]=c},addWrapper:function(a){return this.settings.wrapper&&(a=a.add(a.parent(this.settings.wrapper))),a},defaultShowErrors:function(){var a,b,c;for(a=0;this.errorList[a];a++)c=this.errorList[a],this.settings.highlight&&this.settings.highlight.call(this,c.element,this.settings.errorClass,this.settings.validClass),this.showLabel(c.element,c.message);if(this.errorList.length&&(this.toShow=this.toShow.add(this.containers)),this.settings.success)for(a=0;this.successList[a];a++)this.showLabel(this.successList[a]);if(this.settings.unhighlight)for(a=0,b=this.validElements();b[a];a++)this.settings.unhighlight.call(this,b[a],this.settings.errorClass,this.settings.validClass);this.toHide=this.toHide.not(this.toShow),this.hideErrors(),this.addWrapper(this.toShow).show()},validElements:function(){return this.currentElements.not(this.invalidElements())},invalidElements:function(){return a(this.errorList).map(function(){return this.element})},showLabel:function(b,c){var d,e,f,g,h=this.errorsFor(b),i=this.idOrName(b),j=a(b).attr("aria-describedby");h.length?(h.removeClass(this.settings.validClass).addClass(this.settings.errorClass),h.html(c)):(h=a("<"+this.settings.errorElement+">").attr("id",i+"-error").addClass(this.settings.errorClass).html(c||""),d=h,this.settings.wrapper&&(d=h.hide().show().wrap("<"+this.settings.wrapper+"/>").parent()),this.labelContainer.length?this.labelContainer.append(d):this.settings.errorPlacement?this.settings.errorPlacement(d,a(b)):d.insertAfter(b),h.is("label")?h.attr("for",i):0===h.parents("label[for='"+this.escapeCssMeta(i)+"']").length&&(f=h.attr("id"),j?j.match(new RegExp("\\b"+this.escapeCssMeta(f)+"\\b"))||(j+=" "+f):j=f,a(b).attr("aria-describedby",j),e=this.groups[b.name],e&&(g=this,a.each(g.groups,function(b,c){c===e&&a("[name='"+g.escapeCssMeta(b)+"']",g.currentForm).attr("aria-describedby",h.attr("id"))})))),!c&&this.settings.success&&(h.text(""),"string"==typeof this.settings.success?h.addClass(this.settings.success):this.settings.success(h,b)),this.toShow=this.toShow.add(h)},errorsFor:function(b){var c=this.escapeCssMeta(this.idOrName(b)),d=a(b).attr("aria-describedby"),e="label[for='"+c+"'], label[for='"+c+"'] *";return d&&(e=e+", #"+this.escapeCssMeta(d).replace(/\s+/g,", #")),this.errors().filter(e)},escapeCssMeta:function(a){return a.replace(/([\\!"#$%&'()*+,./:;<=>?@\[\]^`{|}~])/g,"\\$1")},idOrName:function(a){return this.groups[a.name]||(this.checkable(a)?a.name:a.id||a.name)},validationTargetFor:function(b){return this.checkable(b)&&(b=this.findByName(b.name)),a(b).not(this.settings.ignore)[0]},checkable:function(a){return/radio|checkbox/i.test(a.type)},findByName:function(b){return a(this.currentForm).find("[name='"+this.escapeCssMeta(b)+"']")},getLength:function(b,c){switch(c.nodeName.toLowerCase()){case"select":return a("option:selected",c).length;case"input":if(this.checkable(c))return this.findByName(c.name).filter(":checked").length}return b.length},depend:function(a,b){return this.dependTypes[typeof a]?this.dependTypes[typeof a](a,b):!0},dependTypes:{"boolean":function(a){return a},string:function(b,c){return!!a(b,c.form).length},"function":function(a,b){return a(b)}},optional:function(b){var c=this.elementValue(b);return!a.validator.methods.required.call(this,c,b)&&"dependency-mismatch"},startRequest:function(b){this.pending[b.name]||(this.pendingRequest++,a(b).addClass(this.settings.pendingClass),this.pending[b.name]=!0)},stopRequest:function(b,c){this.pendingRequest--,this.pendingRequest<0&&(this.pendingRequest=0),delete this.pending[b.name],a(b).removeClass(this.settings.pendingClass),c&&0===this.pendingRequest&&this.formSubmitted&&this.form()?(a(this.currentForm).submit(),this.formSubmitted=!1):!c&&0===this.pendingRequest&&this.formSubmitted&&(a(this.currentForm).triggerHandler("invalid-form",[this]),this.formSubmitted=!1)},previousValue:function(b,c){return a.data(b,"previousValue")||a.data(b,"previousValue",{old:null,valid:!0,message:this.defaultMessage(b,{method:c})})},destroy:function(){this.resetForm(),a(this.currentForm).off(".validate").removeData("validator").find(".validate-equalTo-blur").off(".validate-equalTo").removeClass("validate-equalTo-blur")}},classRuleSettings:{required:{required:!0},email:{email:!0},url:{url:!0},date:{date:!0},dateISO:{dateISO:!0},number:{number:!0},digits:{digits:!0},creditcard:{creditcard:!0}},addClassRules:function(b,c){b.constructor===String?this.classRuleSettings[b]=c:a.extend(this.classRuleSettings,b)},classRules:function(b){var c={},d=a(b).attr("class");return d&&a.each(d.split(" "),function(){this in a.validator.classRuleSettings&&a.extend(c,a.validator.classRuleSettings[this])}),c},normalizeAttributeRule:function(a,b,c,d){/min|max|step/.test(c)&&(null===b||/number|range|text/.test(b))&&(d=Number(d),isNaN(d)&&(d=void 0)),d||0===d?a[c]=d:b===c&&"range"!==b&&(a[c]=!0)},attributeRules:function(b){var c,d,e={},f=a(b),g=b.getAttribute("type");for(c in a.validator.methods)"required"===c?(d=b.getAttribute(c),""===d&&(d=!0),d=!!d):d=f.attr(c),this.normalizeAttributeRule(e,g,c,d);return e.maxlength&&/-1|2147483647|524288/.test(e.maxlength)&&delete e.maxlength,e},dataRules:function(b){var c,d,e={},f=a(b),g=b.getAttribute("type");for(c in a.validator.methods)d=f.data("rule"+c.charAt(0).toUpperCase()+c.substring(1).toLowerCase()),this.normalizeAttributeRule(e,g,c,d);return e},staticRules:function(b){var c={},d=a.data(b.form,"validator");return d.settings.rules&&(c=a.validator.normalizeRule(d.settings.rules[b.name])||{}),c},normalizeRules:function(b,c){return a.each(b,function(d,e){if(e===!1)return void delete b[d];if(e.param||e.depends){var f=!0;switch(typeof e.depends){case"string":f=!!a(e.depends,c.form).length;break;case"function":f=e.depends.call(c,c)}f?b[d]=void 0!==e.param?e.param:!0:(a.data(c.form,"validator").resetElements(a(c)),delete b[d])}}),a.each(b,function(d,e){b[d]=a.isFunction(e)&&"normalizer"!==d?e(c):e}),a.each(["minlength","maxlength"],function(){b[this]&&(b[this]=Number(b[this]))}),a.each(["rangelength","range"],function(){var c;b[this]&&(a.isArray(b[this])?b[this]=[Number(b[this][0]),Number(b[this][1])]:"string"==typeof b[this]&&(c=b[this].replace(/[\[\]]/g,"").split(/[\s,]+/),b[this]=[Number(c[0]),Number(c[1])]))}),a.validator.autoCreateRanges&&(null!=b.min&&null!=b.max&&(b.range=[b.min,b.max],delete b.min,delete b.max),null!=b.minlength&&null!=b.maxlength&&(b.rangelength=[b.minlength,b.maxlength],delete b.minlength,delete b.maxlength)),b},normalizeRule:function(b){if("string"==typeof b){var c={};a.each(b.split(/\s/),function(){c[this]=!0}),b=c}return b},addMethod:function(b,c,d){a.validator.methods[b]=c,a.validator.messages[b]=void 0!==d?d:a.validator.messages[b],c.length<3&&a.validator.addClassRules(b,a.validator.normalizeRule(b))},methods:{required:function(b,c,d){if(!this.depend(d,c))return"dependency-mismatch";if("select"===c.nodeName.toLowerCase()){var e=a(c).val();return e&&e.length>0}return this.checkable(c)?this.getLength(b,c)>0:b.length>0},email:function(a,b){return this.optional(b)||/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(a)},url:function(a,b){return this.optional(b)||/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(a)},date:function(a,b){return this.optional(b)||!/Invalid|NaN/.test(new Date(a).toString())},dateISO:function(a,b){return this.optional(b)||/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(a)},number:function(a,b){return this.optional(b)||/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(a)},digits:function(a,b){return this.optional(b)||/^\d+$/.test(a)},minlength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||e>=d},maxlength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||d>=e},rangelength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||e>=d[0]&&e<=d[1]},min:function(a,b,c){return this.optional(b)||a>=c},max:function(a,b,c){return this.optional(b)||c>=a},range:function(a,b,c){return this.optional(b)||a>=c[0]&&a<=c[1]},step:function(b,c,d){var e=a(c).attr("type"),f="Step attribute on input type "+e+" is not supported.",g=["text","number","range"],h=new RegExp("\\b"+e+"\\b"),i=e&&!h.test(g.join());if(i)throw new Error(f);return this.optional(c)||b%d===0},equalTo:function(b,c,d){var e=a(d);return this.settings.onfocusout&&e.not(".validate-equalTo-blur").length&&e.addClass("validate-equalTo-blur").on("blur.validate-equalTo",function(){a(c).valid()}),b===e.val()},remote:function(b,c,d,e){if(this.optional(c))return"dependency-mismatch";e="string"==typeof e&&e||"remote";var f,g,h,i=this.previousValue(c,e);return this.settings.messages[c.name]||(this.settings.messages[c.name]={}),i.originalMessage=i.originalMessage||this.settings.messages[c.name][e],this.settings.messages[c.name][e]=i.message,d="string"==typeof d&&{url:d}||d,h=a.param(a.extend({data:b},d.data)),i.old===h?i.valid:(i.old=h,f=this,this.startRequest(c),g={},g[c.name]=b,a.ajax(a.extend(!0,{mode:"abort",port:"validate"+c.name,dataType:"json",data:g,context:f.currentForm,success:function(a){var d,g,h,j=a===!0||"true"===a;f.settings.messages[c.name][e]=i.originalMessage,j?(h=f.formSubmitted,f.resetInternals(),f.toHide=f.errorsFor(c),f.formSubmitted=h,f.successList.push(c),f.invalid[c.name]=!1,f.showErrors()):(d={},g=a||f.defaultMessage(c,{method:e,parameters:b}),d[c.name]=i.message=g,f.invalid[c.name]=!0,f.showErrors(d)),i.valid=j,f.stopRequest(c,j)}},d)),"pending")}}});var b,c={};a.ajaxPrefilter?a.ajaxPrefilter(function(a,b,d){var e=a.port;"abort"===a.mode&&(c[e]&&c[e].abort(),c[e]=d)}):(b=a.ajax,a.ajax=function(d){var e=("mode"in d?d:a.ajaxSettings).mode,f=("port"in d?d:a.ajaxSettings).port;return"abort"===e?(c[f]&&c[f].abort(),c[f]=b.apply(this,arguments),c[f]):b.apply(this,arguments)})});function validarCif(cif){var suma;var ultima;var unumero;var uletra=new Array("J","A","B","C","D","E","F","G","H","I");var par=0;var non=0;var letras="ABCDEFGHKLMNPQS";var inicio_letras="ABCDEFGHIJKLMNOPQRSTUVW";let=cif.charAt(0);cif=cif.toUpperCase();var regular=/^[ABCDEFGHJKLMNPQRSUVW]\d\d\d\d\d\d\d[0-9,A-J]$/g;if(!regular.exec(cif)){return false;}
ultima=cif.substr(8,1);for(zz=2;zz<8;zz+=2){par=par+parseInt(cif.charAt(zz));}
for(zz=1;zz<9;zz+=2){nn=2*parseInt(cif.charAt(zz));if(nn>9)nn=1+(nn-10);non=non+nn;}
parcial=par+non;control=(10-(parcial%10));if(control==10){control=0;}
if((ultima==control)||(ultima==uletra[control])){return true;}else{return false;}}
$.validator.addMethod("validCif",function(value,element){if(value==''){return false;}
if(validarCif(value)){return true;}else{return false;}},"El cif no es valido");$.validator.addMethod("nifES",function(value){"use strict";value=value.toUpperCase();if(!value.match("((^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$|^[T]{1}[A-Z0-9]{8}$)|^[0-9]{8}[A-Z]{1}$)")){return false;}
if(/^[0-9]{8}[A-Z]{1}$/.test(value)){return("TRWAGMYFPDXBNJZSQVHLCKE".charAt(value.substring(8,0)%23)===value.charAt(8));}
if(/^[KLM]{1}/.test(value)){return(value[8]===String.fromCharCode(64));}
return false;},"Please specify a valid NIF number.");$.validator.addMethod("nieES",function(value){"use strict";value=value.toUpperCase();if(!value.match("((^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$|^[T]{1}[A-Z0-9]{8}$)|^[0-9]{8}[A-Z]{1}$)")){return false;}
if(/^[T]{1}/.test(value)){return(value[8]===/^[T]{1}[A-Z0-9]{8}$/.test(value));}
if(/^[XYZ]{1}/.test(value)){return(value[8]==="TRWAGMYFPDXBNJZSQVHLCKE".charAt(value.replace("X","0").replace("Y","1").replace("Z","2").substring(0,8)%23));}
return false;},"Please specify a valid NIE number.");$.validator.addMethod("validarCorreo",function(value,element){if(value==''){return true;}
var temp1;temp1=true;var ind=value.indexOf('@');var str2=value.substr(ind+1);var str3=str2.substr(0,str2.indexOf('.'));if(str3.lastIndexOf('-')==(str3.length-1)||(str3.indexOf('-')!=str3.lastIndexOf('-'))){return false;}
var str1=value.substr(0,ind);if((str1.lastIndexOf('_')==(str1.length-1))||(str1.lastIndexOf('.')==(str1.length-1))||(str1.lastIndexOf('-')==(str1.length-1))){return false;}
str=/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;temp1=str.test(value);return temp1;},"");$.validator.addMethod("bic",function(value,element){return this.optional(element)||/^([A-Z]{6}[A-Z2-9][A-NP-Z1-2])(X{3}|[A-WY-Z0-9][A-Z0-9]{2})?$/.test(value);},"Please specify a valid BIC code");$.validator.addMethod("iban",function(value,element){if(this.optional(element)){return true;}
var iban=value.replace(/ /g,"").toUpperCase(),ibancheckdigits="",leadingZeroes=true,cRest="",cOperator="",countrycode,ibancheck,charAt,cChar,bbanpattern,bbancountrypatterns,ibanregexp,i,p;if(!(/^([a-zA-Z0-9]{4} ){2,8}[a-zA-Z0-9]{1,4}|[a-zA-Z0-9]{12,34}$/.test(iban))){return false;}
countrycode=iban.substring(0,2);bbancountrypatterns={"AL":"\\d{8}[\\dA-Z]{16}","AD":"\\d{8}[\\dA-Z]{12}","AT":"\\d{16}","AZ":"[\\dA-Z]{4}\\d{20}","BE":"\\d{12}","BH":"[A-Z]{4}[\\dA-Z]{14}","BA":"\\d{16}","BR":"\\d{23}[A-Z][\\dA-Z]","BG":"[A-Z]{4}\\d{6}[\\dA-Z]{8}","CR":"\\d{17}","HR":"\\d{17}","CY":"\\d{8}[\\dA-Z]{16}","CZ":"\\d{20}","DK":"\\d{14}","DO":"[A-Z]{4}\\d{20}","EE":"\\d{16}","FO":"\\d{14}","FI":"\\d{14}","FR":"\\d{10}[\\dA-Z]{11}\\d{2}","GE":"[\\dA-Z]{2}\\d{16}","DE":"\\d{18}","GI":"[A-Z]{4}[\\dA-Z]{15}","GR":"\\d{7}[\\dA-Z]{16}","GL":"\\d{14}","GT":"[\\dA-Z]{4}[\\dA-Z]{20}","HU":"\\d{24}","IS":"\\d{22}","IE":"[\\dA-Z]{4}\\d{14}","IL":"\\d{19}","IT":"[A-Z]\\d{10}[\\dA-Z]{12}","KZ":"\\d{3}[\\dA-Z]{13}","KW":"[A-Z]{4}[\\dA-Z]{22}","LV":"[A-Z]{4}[\\dA-Z]{13}","LB":"\\d{4}[\\dA-Z]{20}","LI":"\\d{5}[\\dA-Z]{12}","LT":"\\d{16}","LU":"\\d{3}[\\dA-Z]{13}","MK":"\\d{3}[\\dA-Z]{10}\\d{2}","MT":"[A-Z]{4}\\d{5}[\\dA-Z]{18}","MR":"\\d{23}","MU":"[A-Z]{4}\\d{19}[A-Z]{3}","MC":"\\d{10}[\\dA-Z]{11}\\d{2}","MD":"[\\dA-Z]{2}\\d{18}","ME":"\\d{18}","NL":"[A-Z]{4}\\d{10}","NO":"\\d{11}","PK":"[\\dA-Z]{4}\\d{16}","PS":"[\\dA-Z]{4}\\d{21}","PL":"\\d{24}","PT":"\\d{21}","RO":"[A-Z]{4}[\\dA-Z]{16}","SM":"[A-Z]\\d{10}[\\dA-Z]{12}","SA":"\\d{2}[\\dA-Z]{18}","RS":"\\d{18}","SK":"\\d{20}","SI":"\\d{15}","ES":"\\d{20}","SE":"\\d{20}","CH":"\\d{5}[\\dA-Z]{12}","TN":"\\d{20}","TR":"\\d{5}[\\dA-Z]{17}","AE":"\\d{3}\\d{16}","GB":"[A-Z]{4}\\d{14}","VG":"[\\dA-Z]{4}\\d{16}"};bbanpattern=bbancountrypatterns[countrycode];if(typeof bbanpattern!=="undefined"){ibanregexp=new RegExp("^[A-Z]{2}\\d{2}"+bbanpattern+"$","");if(!(ibanregexp.test(iban))){return false;}}
ibancheck=iban.substring(4,iban.length)+iban.substring(0,4);for(i=0;i<ibancheck.length;i++){charAt=ibancheck.charAt(i);if(charAt!=="0"){leadingZeroes=false;}
if(!leadingZeroes){ibancheckdigits+="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(charAt);}}
for(p=0;p<ibancheckdigits.length;p++){cChar=ibancheckdigits.charAt(p);cOperator=""+cRest+""+cChar;cRest=cOperator%97;}
return cRest===1;},"Please specify a valid IBAN");(function(window,document){var modalClass='.sweet-alert',overlayClass='.sweet-overlay',alertTypes=['error','warning','info','success'],defaultParams={title:'',text:'',type:null,allowOutsideClick:false,showCancelButton:false,showConfirmButton:true,closeOnConfirm:true,closeOnCancel:true,confirmButtonText:'OK',confirmButtonClass:'btn-primary',cancelButtonText:'Cancel',cancelButtonClass:'btn-default',containerClass:'',titleClass:'',textClass:'',imageUrl:null,imageSize:null,timer:null};var getModal=function(){return document.querySelector(modalClass);},getOverlay=function(){return document.querySelector(overlayClass);},hasClass=function(elem,className){return new RegExp(' '+className+' ').test(' '+elem.className+' ');},addClass=function(elem,className){if(className&&!hasClass(elem,className)){elem.className+=' '+className;}},removeClass=function(elem,className){var newClass=' '+elem.className.replace(/[\t\r\n]/g,' ')+' ';if(hasClass(elem,className)){while(newClass.indexOf(' '+className+' ')>=0){newClass=newClass.replace(' '+className+' ',' ');}
elem.className=newClass.replace(/^\s+|\s+$/g,'');}},escapeHtml=function(str){var div=document.createElement('div');div.appendChild(document.createTextNode(str));return div.innerHTML;},_show=function(elem){elem.style.opacity='';elem.style.display='block';},show=function(elems){if(elems&&!elems.length){return _show(elems);}
for(var i=0;i<elems.length;++i){_show(elems[i]);}},_hide=function(elem){elem.style.opacity='';elem.style.display='none';},hide=function(elems){if(elems&&!elems.length){return _hide(elems);}
for(var i=0;i<elems.length;++i){_hide(elems[i]);}},isDescendant=function(parent,child){var node=child.parentNode;while(node!==null){if(node===parent){return true;}
node=node.parentNode;}
return false;},getTopMargin=function(elem){elem.style.left='-9999px';elem.style.display='block';var height=elem.clientHeight;var padding=parseInt(getComputedStyle(elem).getPropertyValue('padding'),10);elem.style.left='';elem.style.display='none';return('-'+parseInt(height/2+padding)+'px');},fadeIn=function(elem,interval){if(+elem.style.opacity<1){interval=interval||16;elem.style.opacity=0;elem.style.display='block';var last=+new Date();var tick=function(){elem.style.opacity=+elem.style.opacity+(new Date()-last)/100;last=+new Date();if(+elem.style.opacity<1){setTimeout(tick,interval);}};tick();}},fadeOut=function(elem,interval){interval=interval||16;elem.style.opacity=1;var last=+new Date();var tick=function(){elem.style.opacity=+elem.style.opacity-(new Date()-last)/100;last=+new Date();if(+elem.style.opacity>0){setTimeout(tick,interval);}else{elem.style.display='none';}};tick();},fireClick=function(node){if(MouseEvent){var mevt=new MouseEvent('click',{view:window,bubbles:false,cancelable:true});node.dispatchEvent(mevt);}else if(document.createEvent){var evt=document.createEvent('MouseEvents');evt.initEvent('click',false,false);node.dispatchEvent(evt);}else if(document.createEventObject){node.fireEvent('onclick');}else if(typeof node.onclick==='function'){node.onclick();}},stopEventPropagation=function(e){if(typeof e.stopPropagation==='function'){e.stopPropagation();e.preventDefault();}else if(window.event&&window.event.hasOwnProperty('cancelBubble')){window.event.cancelBubble=true;}};var previousActiveElement,previousDocumentClick,previousWindowKeyDown,lastFocusedButton;window.sweetAlertInitialize=function(){var sweetHTML='<div class="sweet-overlay" tabIndex="-1"></div><div class="sweet-alert" tabIndex="-1"><div class="icon error"><span class="x-mark"><span class="line left"></span><span class="line right"></span></span></div><div class="icon warning"> <span class="body"></span> <span class="dot"></span> </div> <div class="icon info"></div> <div class="icon success"> <span class="line tip"></span> <span class="line long"></span> <div class="placeholder"></div> <div class="fix"></div> </div> <div class="icon custom"></div> <h2>Title</h2><p class="lead text-muted">Text</p><p><button class="cancel btn btn-lg" tabIndex="2">Cancel</button> <button class="confirm btn btn-lg" tabIndex="1">OK</button></p></div>',sweetWrap=document.createElement('div');sweetWrap.innerHTML=sweetHTML;document.body.appendChild(sweetWrap);}
window.sweetAlert=window.swal=function(){if(arguments[0]===undefined){window.console.error('sweetAlert expects at least 1 attribute!');return false;}
var params=extend({},defaultParams);switch(typeof arguments[0]){case'string':params.title=arguments[0];params.text=arguments[1]||'';params.type=arguments[2]||'';params.confirmButtonClass=params.type?'btn-'+params.type:defaultParams.confirmButtonClass;break;case'object':if(arguments[0].title===undefined){window.console.error('Missing "title" argument!');return false;}
params.title=arguments[0].title;params.text=arguments[0].text||defaultParams.text;params.type=arguments[0].type||defaultParams.type;params.allowOutsideClick=arguments[0].allowOutsideClick||defaultParams.allowOutsideClick;params.showCancelButton=arguments[0].showCancelButton!==undefined?arguments[0].showCancelButton:defaultParams.showCancelButton;params.showConfirmButton=arguments[0].showConfirmButton!==undefined?arguments[0].showConfirmButton:defaultParams.showConfirmButton;params.closeOnConfirm=arguments[0].closeOnConfirm!==undefined?arguments[0].closeOnConfirm:defaultParams.closeOnConfirm;params.closeOnCancel=arguments[0].closeOnCancel!==undefined?arguments[0].closeOnCancel:defaultParams.closeOnCancel;params.timer=arguments[0].timer||defaultParams.timer;params.confirmButtonText=(defaultParams.showCancelButton)?'Confirm':defaultParams.confirmButtonText;params.confirmButtonText=arguments[0].confirmButtonText||defaultParams.confirmButtonText;params.confirmButtonClass=arguments[0].confirmButtonClass||(arguments[0].type?'btn-'+arguments[0].type:null)||defaultParams.confirmButtonClass;params.cancelButtonText=arguments[0].cancelButtonText||defaultParams.cancelButtonText;params.cancelButtonClass=arguments[0].cancelButtonClass||defaultParams.cancelButtonClass;params.containerClass=arguments[0].containerClass||defaultParams.containerClass;params.titleClass=arguments[0].titleClass||defaultParams.titleClass;params.textClass=arguments[0].textClass||defaultParams.textClass;params.imageUrl=arguments[0].imageUrl||defaultParams.imageUrl;params.imageSize=arguments[0].imageSize||defaultParams.imageSize;params.doneFunction=arguments[1]||null;break;default:window.console.error('Unexpected type of argument! Expected "string" or "object", got '+typeof arguments[0]);return false;}
setParameters(params);fixVerticalPosition();openModal();var modal=getModal();var onButtonEvent=function(e){var target=e.target||e.srcElement,targetedConfirm=(target.className.indexOf('confirm')>-1),modalIsVisible=hasClass(modal,'visible'),doneFunctionExists=(params.doneFunction&&modal.getAttribute('data-has-done-function')==='true');switch(e.type){case("click"):if(targetedConfirm&&doneFunctionExists&&modalIsVisible){params.doneFunction(true);if(params.closeOnConfirm){closeModal();}}else if(doneFunctionExists&&modalIsVisible){var functionAsStr=String(params.doneFunction).replace(/\s/g,'');var functionHandlesCancel=functionAsStr.substring(0,9)==="function("&&functionAsStr.substring(9,10)!==")";if(functionHandlesCancel){params.doneFunction(false);}
if(params.closeOnCancel){closeModal();}}else{closeModal();}
break;}};var $buttons=modal.querySelectorAll('button');for(var i=0;i<$buttons.length;i++){$buttons[i].onclick=onButtonEvent;}
previousDocumentClick=document.onclick;document.onclick=function(e){var target=e.target||e.srcElement;var clickedOnModal=(modal===target),clickedOnModalChild=isDescendant(modal,e.target),modalIsVisible=hasClass(modal,'visible'),outsideClickIsAllowed=modal.getAttribute('data-allow-ouside-click')==='true';if(!clickedOnModal&&!clickedOnModalChild&&modalIsVisible&&outsideClickIsAllowed){closeModal();}};var $okButton=modal.querySelector('button.confirm'),$cancelButton=modal.querySelector('button.cancel'),$modalButtons=modal.querySelectorAll('button:not([type=hidden])');function handleKeyDown(e){var keyCode=e.keyCode||e.which;if([9,13,32,27].indexOf(keyCode)===-1){return;}
var $targetElement=e.target||e.srcElement;var btnIndex=-1;for(var i=0;i<$modalButtons.length;i++){if($targetElement===$modalButtons[i]){btnIndex=i;break;}}
if(keyCode===9){if(btnIndex===-1){$targetElement=$okButton;}else{if(btnIndex===$modalButtons.length-1){$targetElement=$modalButtons[0];}else{$targetElement=$modalButtons[btnIndex+1];}}
stopEventPropagation(e);$targetElement.focus();}else{if(keyCode===13||keyCode===32){if(btnIndex===-1){$targetElement=$okButton;}else{$targetElement=undefined;}}else if(keyCode===27&&!($cancelButton.hidden||$cancelButton.style.display==='none')){$targetElement=$cancelButton;}else{$targetElement=undefined;}
if($targetElement!==undefined){fireClick($targetElement,e);}}}
previousWindowKeyDown=window.onkeydown;window.onkeydown=handleKeyDown;function handleOnBlur(e){var $targetElement=e.target||e.srcElement,$focusElement=e.relatedTarget,modalIsVisible=hasClass(modal,'visible');if(modalIsVisible){var btnIndex=-1;if($focusElement!==null){for(var i=0;i<$modalButtons.length;i++){if($focusElement===$modalButtons[i]){btnIndex=i;break;}}
if(btnIndex===-1){$targetElement.focus();}}else{lastFocusedButton=$targetElement;}}}
$okButton.onblur=handleOnBlur;$cancelButton.onblur=handleOnBlur;window.onfocus=function(){window.setTimeout(function(){if(lastFocusedButton!==undefined){lastFocusedButton.focus();lastFocusedButton=undefined;}},0);};};window.swal.setDefaults=function(userParams){if(!userParams){throw new Error('userParams is required');}
if(typeof userParams!=='object'){throw new Error('userParams has to be a object');}
extend(defaultParams,userParams);};window.swal.close=function(){closeModal();}
function setParameters(params){var modal=getModal();var $title=modal.querySelector('h2'),$text=modal.querySelector('p'),$cancelBtn=modal.querySelector('button.cancel'),$confirmBtn=modal.querySelector('button.confirm');$title.innerHTML=escapeHtml(params.title).split("\n").join("<br>");$text.innerHTML=escapeHtml(params.text||'').split("\n").join("<br>");if(params.text){show($text);}
hide(modal.querySelectorAll('.icon'));if(params.type){var validType=false;for(var i=0;i<alertTypes.length;i++){if(params.type===alertTypes[i]){validType=true;break;}}
if(!validType){window.console.error('Unknown alert type: '+params.type);return false;}
var $icon=modal.querySelector('.icon.'+params.type);show($icon);switch(params.type){case"success":addClass($icon,'animate');addClass($icon.querySelector('.tip'),'animateSuccessTip');addClass($icon.querySelector('.long'),'animateSuccessLong');break;case"error":addClass($icon,'animateErrorIcon');addClass($icon.querySelector('.x-mark'),'animateXMark');break;case"warning":addClass($icon,'pulseWarning');addClass($icon.querySelector('.body'),'pulseWarningIns');addClass($icon.querySelector('.dot'),'pulseWarningIns');break;}}
if(params.imageUrl){var $customIcon=modal.querySelector('.icon.custom');$customIcon.style.backgroundImage='url('+params.imageUrl+')';show($customIcon);var _imgWidth=80,_imgHeight=80;if(params.imageSize){var imgWidth=params.imageSize.split('x')[0];var imgHeight=params.imageSize.split('x')[1];if(!imgWidth||!imgHeight){window.console.error("Parameter imageSize expects value with format WIDTHxHEIGHT, got "+params.imageSize);}else{_imgWidth=imgWidth;_imgHeight=imgHeight;$customIcon.css({'width':imgWidth+'px','height':imgHeight+'px'});}}
$customIcon.setAttribute('style',$customIcon.getAttribute('style')+'width:'+_imgWidth+'px; height:'+_imgHeight+'px');}
modal.setAttribute('data-has-cancel-button',params.showCancelButton);if(params.showCancelButton){$cancelBtn.style.display='inline-block';}else{hide($cancelBtn);}
modal.setAttribute('data-has-confirm-button',params.showConfirmButton);if(params.showConfirmButton){$confirmBtn.style.display='inline-block';}else{hide($confirmBtn);}
if(params.cancelButtonText){$cancelBtn.innerHTML=escapeHtml(params.cancelButtonText);}
if(params.confirmButtonText){$confirmBtn.innerHTML=escapeHtml(params.confirmButtonText);}
$confirmBtn.className='confirm btn btn-lg';addClass(modal,params.containerClass);addClass($confirmBtn,params.confirmButtonClass);addClass($cancelBtn,params.cancelButtonClass);addClass($title,params.titleClass);addClass($text,params.textClass);modal.setAttribute('data-allow-ouside-click',params.allowOutsideClick);var hasDoneFunction=(params.doneFunction)?true:false;modal.setAttribute('data-has-done-function',hasDoneFunction);modal.setAttribute('data-timer',params.timer);}
function colorLuminance(hex,lum){hex=String(hex).replace(/[^0-9a-f]/gi,'');if(hex.length<6){hex=hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];}
lum=lum||0;var rgb="#",c,i;for(i=0;i<3;i++){c=parseInt(hex.substr(i*2,2),16);c=Math.round(Math.min(Math.max(0,c+(c*lum)),255)).toString(16);rgb+=("00"+c).substr(c.length);}
return rgb;}
function extend(a,b){for(var key in b){if(b.hasOwnProperty(key)){a[key]=b[key];}}
return a;}
function hexToRgb(hex){var result=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);return result?parseInt(result[1],16)+', '+parseInt(result[2],16)+', '+parseInt(result[3],16):null;}
function setFocusStyle($button,bgColor){var rgbColor=hexToRgb(bgColor);$button.style.boxShadow='0 0 2px rgba('+rgbColor+', 0.8), inset 0 0 0 1px rgba(0, 0, 0, 0.05)';}
function openModal(){var modal=getModal();fadeIn(getOverlay(),10);show(modal);addClass(modal,'showSweetAlert');removeClass(modal,'hideSweetAlert');previousActiveElement=document.activeElement;var $okButton=modal.querySelector('button.confirm');$okButton.focus();setTimeout(function(){addClass(modal,'visible');},500);var timer=modal.getAttribute('data-timer');if(timer!=="null"&&timer!==""){setTimeout(function(){closeModal();},timer);}}
function closeModal(){var modal=getModal();fadeOut(getOverlay(),5);fadeOut(modal,5);removeClass(modal,'showSweetAlert');addClass(modal,'hideSweetAlert');removeClass(modal,'visible');var $successIcon=modal.querySelector('.icon.success');removeClass($successIcon,'animate');removeClass($successIcon.querySelector('.tip'),'animateSuccessTip');removeClass($successIcon.querySelector('.long'),'animateSuccessLong');var $errorIcon=modal.querySelector('.icon.error');removeClass($errorIcon,'animateErrorIcon');removeClass($errorIcon.querySelector('.x-mark'),'animateXMark');var $warningIcon=modal.querySelector('.icon.warning');removeClass($warningIcon,'pulseWarning');removeClass($warningIcon.querySelector('.body'),'pulseWarningIns');removeClass($warningIcon.querySelector('.dot'),'pulseWarningIns');window.onkeydown=previousWindowKeyDown;document.onclick=previousDocumentClick;if(previousActiveElement){previousActiveElement.focus();}
lastFocusedButton=undefined;}
function fixVerticalPosition(){var modal=getModal();modal.style.marginTop=getTopMargin(getModal());}
(function(){if(document.readyState==="complete"||document.readyState==="interactive"&&document.body){sweetAlertInitialize();}else{if(document.addEventListener){document.addEventListener('DOMContentLoaded',function handler(){document.removeEventListener('DOMContentLoaded',handler,false);sweetAlertInitialize();},false);}else if(document.attachEvent){document.attachEvent('onreadystatechange',function handler(){if(document.readyState==='complete'){document.detachEvent('onreadystatechange',handler);sweetAlertInitialize();}});}}})();})(window,document);jQuery.easing['jswing']=jQuery.easing['swing'];jQuery.extend(jQuery.easing,{def:'easeOutQuad',swing:function(x,t,b,c,d){return jQuery.easing[jQuery.easing.def](x,t,b,c,d);},easeInQuad:function(x,t,b,c,d){return c*(t/=d)*t+b;},easeOutQuad:function(x,t,b,c,d){return-c*(t/=d)*(t-2)+b;},easeInOutQuad:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t+b;return-c/2*((--t)*(t-2)-1)+b;},easeInCubic:function(x,t,b,c,d){return c*(t/=d)*t*t+b;},easeOutCubic:function(x,t,b,c,d){return c*((t=t/d-1)*t*t+1)+b;},easeInOutCubic:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t+b;return c/2*((t-=2)*t*t+2)+b;},easeInQuart:function(x,t,b,c,d){return c*(t/=d)*t*t*t+b;},easeOutQuart:function(x,t,b,c,d){return-c*((t=t/d-1)*t*t*t-1)+b;},easeInOutQuart:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t+b;return-c/2*((t-=2)*t*t*t-2)+b;},easeInQuint:function(x,t,b,c,d){return c*(t/=d)*t*t*t*t+b;},easeOutQuint:function(x,t,b,c,d){return c*((t=t/d-1)*t*t*t*t+1)+b;},easeInOutQuint:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t*t+b;return c/2*((t-=2)*t*t*t*t+2)+b;},easeInSine:function(x,t,b,c,d){return-c*Math.cos(t/d*(Math.PI/2))+c+b;},easeOutSine:function(x,t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b;},easeInOutSine:function(x,t,b,c,d){return-c/2*(Math.cos(Math.PI*t/d)-1)+b;},easeInExpo:function(x,t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b;},easeOutExpo:function(x,t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b;},easeInOutExpo:function(x,t,b,c,d){if(t==0)return b;if(t==d)return b+c;if((t/=d/2)<1)return c/2*Math.pow(2,10*(t-1))+b;return c/2*(-Math.pow(2,-10*--t)+2)+b;},easeInCirc:function(x,t,b,c,d){return-c*(Math.sqrt(1-(t/=d)*t)-1)+b;},easeOutCirc:function(x,t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b;},easeInOutCirc:function(x,t,b,c,d){if((t/=d/2)<1)return-c/2*(Math.sqrt(1-t*t)-1)+b;return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b;},easeInElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4;}
else var s=p/(2*Math.PI)*Math.asin(c/a);return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;},easeOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4;}
else var s=p/(2*Math.PI)*Math.asin(c/a);return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b;},easeInOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);if(a<Math.abs(c)){a=c;var s=p/4;}
else var s=p/(2*Math.PI)*Math.asin(c/a);if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b;},easeInBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b;},easeOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;},easeInOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;},easeInBounce:function(x,t,b,c,d){return c-jQuery.easing.easeOutBounce(x,d-t,0,c,d)+b;},easeOutBounce:function(x,t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b;}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b;}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b;}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b;}},easeInOutBounce:function(x,t,b,c,d){if(t<d/2)return jQuery.easing.easeInBounce(x,t*2,0,c,d)*.5+b;return jQuery.easing.easeOutBounce(x,t*2-d,0,c,d)*.5+c*.5+b;}});!function(a,b,c,d){var e=a(b);a.fn.lazyload=function(f){function g(){var b=0;i.each(function(){var c=a(this);if(!j.skip_invisible||c.is(":visible"))if(a.abovethetop(this,j)||a.leftofbegin(this,j));else if(a.belowthefold(this,j)||a.rightoffold(this,j)){if(++b>j.failure_limit)return!1}else c.trigger("appear"),b=0})}var h,i=this,j={threshold:0,failure_limit:0,event:"scroll",effect:"show",container:b,data_attribute:"original",skip_invisible:!1,appear:null,load:null,placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"};return f&&(d!==f.failurelimit&&(f.failure_limit=f.failurelimit,delete f.failurelimit),d!==f.effectspeed&&(f.effect_speed=f.effectspeed,delete f.effectspeed),a.extend(j,f)),h=j.container===d||j.container===b?e:a(j.container),0===j.event.indexOf("scroll")&&h.bind(j.event,function(){return g()}),this.each(function(){var b=this,c=a(b);b.loaded=!1,(c.attr("src")===d||c.attr("src")===!1)&&c.is("img")&&c.attr("src",j.placeholder),c.one("appear",function(){if(!this.loaded){if(j.appear){var d=i.length;j.appear.call(b,d,j)}a("<img />").bind("load",function(){var d=c.attr("data-"+j.data_attribute);c.hide(),c.is("img")?c.attr("src",d):c.css("background-image","url('"+d+"')"),c[j.effect](j.effect_speed),b.loaded=!0;var e=a.grep(i,function(a){return!a.loaded});if(i=a(e),j.load){var f=i.length;j.load.call(b,f,j)}}).attr("src",c.attr("data-"+j.data_attribute))}}),0!==j.event.indexOf("scroll")&&c.bind(j.event,function(){b.loaded||c.trigger("appear")})}),e.bind("resize",function(){g()}),/(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion)&&e.bind("pageshow",function(b){b.originalEvent&&b.originalEvent.persisted&&i.each(function(){a(this).trigger("appear")})}),a(c).ready(function(){g()}),this},a.belowthefold=function(c,f){var g;return g=f.container===d||f.container===b?(b.innerHeight?b.innerHeight:e.height())+e.scrollTop():a(f.container).offset().top+a(f.container).height(),g<=a(c).offset().top-f.threshold},a.rightoffold=function(c,f){var g;return g=f.container===d||f.container===b?e.width()+e.scrollLeft():a(f.container).offset().left+a(f.container).width(),g<=a(c).offset().left-f.threshold},a.abovethetop=function(c,f){var g;return g=f.container===d||f.container===b?e.scrollTop():a(f.container).offset().top,g>=a(c).offset().top+f.threshold+a(c).height()},a.leftofbegin=function(c,f){var g;return g=f.container===d||f.container===b?e.scrollLeft():a(f.container).offset().left,g>=a(c).offset().left+f.threshold+a(c).width()},a.inviewport=function(b,c){return!(a.rightoffold(b,c)||a.leftofbegin(b,c)||a.belowthefold(b,c)||a.abovethetop(b,c))},a.extend(a.expr[":"],{"below-the-fold":function(b){return a.belowthefold(b,{threshold:0})},"above-the-top":function(b){return!a.belowthefold(b,{threshold:0})},"right-of-screen":function(b){return a.rightoffold(b,{threshold:0})},"left-of-screen":function(b){return!a.rightoffold(b,{threshold:0})},"in-viewport":function(b){return a.inviewport(b,{threshold:0})},"above-the-fold":function(b){return!a.belowthefold(b,{threshold:0})},"right-of-fold":function(b){return a.rightoffold(b,{threshold:0})},"left-of-fold":function(b){return!a.rightoffold(b,{threshold:0})}})}(jQuery,window,document);!function(a,b){"use strict";function c(a){a=a||{};for(var b=1;b<arguments.length;b++){var c=arguments[b];if(c)for(var d in c)c.hasOwnProperty(d)&&("object"==typeof c[d]?deepExtend(a[d],c[d]):a[d]=c[d])}return a}function d(d,g){function h(){if(y){r=b.createElement("canvas"),r.className="pg-canvas",r.style.display="block",d.insertBefore(r,d.firstChild),s=r.getContext("2d"),i();for(var c=Math.round(r.width*r.height/g.density),e=0;c>e;e++){var f=new n;f.setStackPos(e),z.push(f)}a.addEventListener("resize",function(){k()},!1),b.addEventListener("mousemove",function(a){A=a.pageX,B=a.pageY},!1),D&&!C&&a.addEventListener("deviceorientation",function(){F=Math.min(Math.max(-event.beta,-30),30),E=Math.min(Math.max(-event.gamma,-30),30)},!0),j(),q("onInit")}}function i(){r.width=d.offsetWidth,r.height=d.offsetHeight,s.fillStyle=g.dotColor,s.strokeStyle=g.lineColor,s.lineWidth=g.lineWidth}function j(){if(y){u=a.innerWidth,v=a.innerHeight,s.clearRect(0,0,r.width,r.height);for(var b=0;b<z.length;b++)z[b].updatePosition();for(var b=0;b<z.length;b++)z[b].draw();G||(t=requestAnimationFrame(j))}}function k(){i();for(var a=d.offsetWidth,b=d.offsetHeight,c=z.length-1;c>=0;c--)(z[c].position.x>a||z[c].position.y>b)&&z.splice(c,1);var e=Math.round(r.width*r.height/g.density);if(e>z.length)for(;e>z.length;){var f=new n;z.push(f)}else e<z.length&&z.splice(e);for(c=z.length-1;c>=0;c--)z[c].setStackPos(c)}function l(){G=!0}function m(){G=!1,j()}function n(){switch(this.stackPos,this.active=!0,this.layer=Math.ceil(3*Math.random()),this.parallaxOffsetX=0,this.parallaxOffsetY=0,this.position={x:Math.ceil(Math.random()*r.width),y:Math.ceil(Math.random()*r.height)},this.speed={},g.directionX){case"left":this.speed.x=+(-g.maxSpeedX+Math.random()*g.maxSpeedX-g.minSpeedX).toFixed(2);break;case"right":this.speed.x=+(Math.random()*g.maxSpeedX+g.minSpeedX).toFixed(2);break;default:this.speed.x=+(-g.maxSpeedX/2+Math.random()*g.maxSpeedX).toFixed(2),this.speed.x+=this.speed.x>0?g.minSpeedX:-g.minSpeedX}switch(g.directionY){case"up":this.speed.y=+(-g.maxSpeedY+Math.random()*g.maxSpeedY-g.minSpeedY).toFixed(2);break;case"down":this.speed.y=+(Math.random()*g.maxSpeedY+g.minSpeedY).toFixed(2);break;default:this.speed.y=+(-g.maxSpeedY/2+Math.random()*g.maxSpeedY).toFixed(2),this.speed.x+=this.speed.y>0?g.minSpeedY:-g.minSpeedY}}function o(a,b){return b?void(g[a]=b):g[a]}function p(){console.log("destroy"),r.parentNode.removeChild(r),q("onDestroy"),f&&f(d).removeData("plugin_"+e)}function q(a){void 0!==g[a]&&g[a].call(d)}var r,s,t,u,v,w,x,y=!!b.createElement("canvas").getContext,z=[],A=0,B=0,C=!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i),D=!!a.DeviceOrientationEvent,E=0,F=0,G=!1;return g=c({},a[e].defaults,g),n.prototype.draw=function(){s.beginPath(),s.arc(this.position.x+this.parallaxOffsetX,this.position.y+this.parallaxOffsetY,g.particleRadius/2,0,2*Math.PI,!0),s.closePath(),s.fill(),s.beginPath();for(var a=z.length-1;a>this.stackPos;a--){var b=z[a],c=this.position.x-b.position.x,d=this.position.y-b.position.y,e=Math.sqrt(c*c+d*d).toFixed(2);e<g.proximity&&(s.moveTo(this.position.x+this.parallaxOffsetX,this.position.y+this.parallaxOffsetY),g.curvedLines?s.quadraticCurveTo(Math.max(b.position.x,b.position.x),Math.min(b.position.y,b.position.y),b.position.x+b.parallaxOffsetX,b.position.y+b.parallaxOffsetY):s.lineTo(b.position.x+b.parallaxOffsetX,b.position.y+b.parallaxOffsetY))}s.stroke(),s.closePath()},n.prototype.updatePosition=function(){if(g.parallax){if(D&&!C){var a=(u-0)/60;w=(E- -30)*a+0;var b=(v-0)/60;x=(F- -30)*b+0}else w=A,x=B;this.parallaxTargX=(w-u/2)/(g.parallaxMultiplier*this.layer),this.parallaxOffsetX+=(this.parallaxTargX-this.parallaxOffsetX)/10,this.parallaxTargY=(x-v/2)/(g.parallaxMultiplier*this.layer),this.parallaxOffsetY+=(this.parallaxTargY-this.parallaxOffsetY)/10}var c=d.offsetWidth,e=d.offsetHeight;switch(g.directionX){case"left":this.position.x+this.speed.x+this.parallaxOffsetX<0&&(this.position.x=c-this.parallaxOffsetX);break;case"right":this.position.x+this.speed.x+this.parallaxOffsetX>c&&(this.position.x=0-this.parallaxOffsetX);break;default:(this.position.x+this.speed.x+this.parallaxOffsetX>c||this.position.x+this.speed.x+this.parallaxOffsetX<0)&&(this.speed.x=-this.speed.x)}switch(g.directionY){case"up":this.position.y+this.speed.y+this.parallaxOffsetY<0&&(this.position.y=e-this.parallaxOffsetY);break;case"down":this.position.y+this.speed.y+this.parallaxOffsetY>e&&(this.position.y=0-this.parallaxOffsetY);break;default:(this.position.y+this.speed.y+this.parallaxOffsetY>e||this.position.y+this.speed.y+this.parallaxOffsetY<0)&&(this.speed.y=-this.speed.y)}this.position.x+=this.speed.x,this.position.y+=this.speed.y},n.prototype.setStackPos=function(a){this.stackPos=a},h(),{option:o,destroy:p,start:m,pause:l}}var e="particleground",f=a.jQuery;a[e]=function(a,b){return new d(a,b)},a[e].defaults={minSpeedX:.1,maxSpeedX:.7,minSpeedY:.1,maxSpeedY:.7,directionX:"center",directionY:"center",density:1e4,dotColor:"#666666",lineColor:"#666666",particleRadius:7,lineWidth:1,curvedLines:!1,proximity:100,parallax:!0,parallaxMultiplier:5,onInit:function(){},onDestroy:function(){}},f&&(f.fn[e]=function(a){if("string"==typeof arguments[0]){var b,c=arguments[0],g=Array.prototype.slice.call(arguments,1);return this.each(function(){f.data(this,"plugin_"+e)&&"function"==typeof f.data(this,"plugin_"+e)[c]&&(b=f.data(this,"plugin_"+e)[c].apply(this,g))}),void 0!==b?b:this}return"object"!=typeof a&&a?void 0:this.each(function(){f.data(this,"plugin_"+e)||f.data(this,"plugin_"+e,new d(this,a))})})}(window,document),function(){for(var a=0,b=["ms","moz","webkit","o"],c=0;c<b.length&&!window.requestAnimationFrame;++c)window.requestAnimationFrame=window[b[c]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[b[c]+"CancelAnimationFrame"]||window[b[c]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(b){var c=(new Date).getTime(),d=Math.max(0,16-(c-a)),e=window.setTimeout(function(){b(c+d)},d);return a=c+d,e}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)})}();!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var r;r="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,r.Trianglify=e()}}(function(){var e;return function r(e,n,t){function f(a,i){if(!n[a]){if(!e[a]){var c="function"==typeof require&&require;if(!i&&c)return c(a,!0);if(o)return o(a,!0);var u=new Error("Cannot find module '"+a+"'");throw u.code="MODULE_NOT_FOUND",u}var d=n[a]={exports:{}};e[a][0].call(d.exports,function(r){var n=e[a][1][r];return f(n?n:r)},d,d.exports,r,e,n,t)}return n[a].exports}for(var o="function"==typeof require&&require,a=0;a<t.length;a++)f(t[a]);return f}({"./lib/trianglify.js":[function(e,r){function n(e){function r(e,r,n){return(e-r[0])*(n[1]-n[0])/(r[1]-r[0])+n[0]}function n(n,t){for(var f=[],o=-y;n+y>o;o+=e.cell_size)for(var a=-v;t+v>a;a+=e.cell_size){var i=o+e.cell_size/2+r(rand(),[0,1],[-w,w]),c=a+e.cell_size/2+r(rand(),[0,1],[-w,w]);f.push([i,c].map(Math.floor))}return f}function a(e){return{x:(e[0][0]+e[1][0]+e[2][0])/3,y:(e[0][1]+e[1][1]+e[2][1])/3}}function u(){if(e.palette instanceof Array)return e.palette[Math.floor(rand()*e.palette.length)];var r=Object.keys(e.palette);return e.palette[r[Math.floor(rand()*r.length)]]}function d(e,r){var n={};for(var t in e)n[t]=e[t];for(t in r){if(!e.hasOwnProperty(t))throw new Error(t+" is not a configuration option for Trianglify. Check your spelling?");n[t]=r[t]}return n}if(e=d(c,e),rand=f(e.seed),"random"===e.x_colors&&(e.x_colors=u()),"random"===e.y_colors&&(e.y_colors=u()),"match_x"===e.y_colors&&(e.y_colors=e.x_colors),!(e.width>0&&e.height>0))throw new Error("Width and height must be numbers greater than 0");if(e.cell_size<2)throw new Error("Cell size must be greater than 2.");var s;if(e.color_function)s=function(r,n){return o(e.color_function(r,n))};else{var l=o.scale(e.x_colors).mode(e.color_space),b=o.scale(e.y_colors).mode(e.color_space);s=function(r,n){return o.interpolate(l(r),b(n),.5,e.color_space)}}for(var h=e.width,g=e.height,p=Math.floor((h+4*e.cell_size)/e.cell_size),m=Math.floor((g+4*e.cell_size)/e.cell_size),y=(p*e.cell_size-h)/2,v=(m*e.cell_size-g)/2,w=e.cell_size*e.variance/2,x=function(e){return r(e,[-y,h+y],[0,1])},_=function(e){return r(e,[-v,g+v],[0,1])},k=n(h,g),j=t.triangulate(k),M=[],q=function(e){return k[e]},C=0;C<j.length;C+=3){var N=[j[C],j[C+1],j[C+2]].map(q),U=a(N),A=s(x(U.x),_(U.y)).hex();M.push([A,N])}return i(M,e)}var t=e("delaunay-fast"),f=e("seedrandom"),o=e("chroma-js"),a=e("./colorbrewer"),i=e("./pattern"),c={width:600,height:400,cell_size:75,variance:.75,seed:null,x_colors:"random",y_colors:"match_x",palette:a,color_space:"lab",color_function:null,stroke_width:1.51};n.colorbrewer=a,n.defaults=c,r.exports=n},{"./colorbrewer":"/Users/qrohlf/Code/trianglify/lib/colorbrewer.js","./pattern":"/Users/qrohlf/Code/trianglify/lib/pattern.js","chroma-js":"/Users/qrohlf/Code/trianglify/node_modules/chroma-js/chroma.js","delaunay-fast":"/Users/qrohlf/Code/trianglify/node_modules/delaunay-fast/delaunay.js",seedrandom:"/Users/qrohlf/Code/trianglify/node_modules/seedrandom/index.js"}],"/Users/qrohlf/Code/trianglify/lib/colorbrewer.js":[function(e,r){r.exports={YlGn:["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#006837","#004529"],YlGnBu:["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"],GnBu:["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081"],BuGn:["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"],PuBuGn:["#fff7fb","#ece2f0","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016c59","#014636"],PuBu:["#fff7fb","#ece7f2","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#045a8d","#023858"],BuPu:["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"],RdPu:["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177","#49006a"],PuRd:["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#980043","#67001f"],OrRd:["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"],YlOrRd:["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"],YlOrBr:["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#993404","#662506"],Purples:["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d"],Blues:["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"],Greens:["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"],Oranges:["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#a63603","#7f2704"],Reds:["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"],Greys:["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525","#000000"],PuOr:["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6","#f7f7f7","#d8daeb","#b2abd2","#8073ac","#542788","#2d004b"],BrBG:["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"],PRGn:["#40004b","#762a83","#9970ab","#c2a5cf","#e7d4e8","#f7f7f7","#d9f0d3","#a6dba0","#5aae61","#1b7837","#00441b"],PiYG:["#8e0152","#c51b7d","#de77ae","#f1b6da","#fde0ef","#f7f7f7","#e6f5d0","#b8e186","#7fbc41","#4d9221","#276419"],RdBu:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"],RdGy:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#ffffff","#e0e0e0","#bababa","#878787","#4d4d4d","#1a1a1a"],RdYlBu:["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"],Spectral:["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"],RdYlGn:["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"]}},{}],"/Users/qrohlf/Code/trianglify/lib/pattern.js":[function(e,r){(function(n){function t(r,t){function o(){var e=f.createElementNS("http://www.w3.org/2000/svg","svg");return e.setAttribute("width",t.width),e.setAttribute("height",t.height),r.forEach(function(r){var n=f.createElementNS("http://www.w3.org/2000/svg","path");n.setAttribute("d","M"+r[1].join("L")+"Z"),n.setAttribute("fill",r[0]),n.setAttribute("stroke",r[0]),n.setAttribute("stroke-width",t.stroke_width),e.appendChild(n)}),e}function a(o){if("undefined"!=typeof n)try{e("canvas")}catch(a){throw Error("The optional node-canvas dependency is needed for Trianglify to render using canvas in node.")}return o||(o=f.createElement("canvas")),o.setAttribute("width",t.width),o.setAttribute("height",t.height),ctx=o.getContext("2d"),ctx.canvas.width=t.width,ctx.canvas.height=t.height,r.forEach(function(e){ctx.fillStyle=ctx.strokeStyle=e[0],ctx.lineWidth=t.stroke_width,ctx.beginPath(),ctx.moveTo.apply(ctx,e[1][0]),ctx.lineTo.apply(ctx,e[1][1]),ctx.lineTo.apply(ctx,e[1][2]),ctx.fill(),ctx.stroke()}),o}function i(){return a().toDataURL("image/png")}return{polys:r,opts:t,svg:o,canvas:a,png:i}}var f="undefined"!=typeof document?document:e("jsdom").jsdom("<html/>");r.exports=t}).call(this,e("_process"))},{_process:"/Users/qrohlf/Code/trianglify/node_modules/browserify/node_modules/process/browser.js",canvas:"/Users/qrohlf/Code/trianglify/node_modules/browserify/node_modules/browser-resolve/empty.js",jsdom:"/Users/qrohlf/Code/trianglify/node_modules/browserify/node_modules/browser-resolve/empty.js"}],"/Users/qrohlf/Code/trianglify/node_modules/browserify/node_modules/browser-resolve/empty.js":[function(){},{}],"/Users/qrohlf/Code/trianglify/node_modules/browserify/node_modules/process/browser.js":[function(e,r){function n(){if(!a){a=!0;for(var e,r=o.length;r;){e=o,o=[];for(var n=-1;++n<r;)e[n]();r=o.length}a=!1}}function t(){}var f=r.exports={},o=[],a=!1;f.nextTick=function(e){o.push(e),a||setTimeout(n,0)},f.title="browser",f.browser=!0,f.env={},f.argv=[],f.version="",f.versions={},f.on=t,f.addListener=t,f.once=t,f.off=t,f.removeListener=t,f.removeAllListeners=t,f.emit=t,f.binding=function(){throw new Error("process.binding is not supported")},f.cwd=function(){return"/"},f.chdir=function(){throw new Error("process.chdir is not supported")},f.umask=function(){return 0}},{}],"/Users/qrohlf/Code/trianglify/node_modules/chroma-js/chroma.js":[function(r,n,t){(function(){var r,f,o,a,i,c,u,d,s,l,b,h,g,p,m,y,v,w,x,_,k,j,M,q,C,N,U,A,P,z,G,E,B,I,R,S,O,T,Y;l=function(e,n,t,f){return new r(e,n,t,f)},"undefined"!=typeof n&&null!==n&&null!=n.exports&&(n.exports=l),"function"==typeof e&&e.amd?e([],function(){return l}):(I="undefined"!=typeof t&&null!==t?t:this,I.chroma=l),l.color=function(e,n,t,f){return new r(e,n,t,f)},l.hsl=function(e,n,t,f){return new r(e,n,t,f,"hsl")},l.hsv=function(e,n,t,f){return new r(e,n,t,f,"hsv")},l.rgb=function(e,n,t,f){return new r(e,n,t,f,"rgb")},l.hex=function(e){return new r(e)},l.css=function(e){return new r(e)},l.lab=function(e,n,t){return new r(e,n,t,"lab")},l.lch=function(e,n,t){return new r(e,n,t,"lch")},l.hsi=function(e,n,t){return new r(e,n,t,"hsi")},l.gl=function(e,n,t,f){return new r(255*e,255*n,255*t,f,"gl")},l.interpolate=function(e,n,t,f){return null==e||null==n?"#000":("string"===R(e)&&(e=new r(e)),"string"===R(n)&&(n=new r(n)),e.interpolate(t,n,f))},l.mix=l.interpolate,l.contrast=function(e,n){var t,f;return"string"===R(e)&&(e=new r(e)),"string"===R(n)&&(n=new r(n)),t=e.luminance(),f=n.luminance(),t>f?(t+.05)/(f+.05):(f+.05)/(t+.05)},l.luminance=function(e){return l(e).luminance()},l._Color=r,r=function(){function e(){var e,r,n,t,f,o,a,i,c,u,d,s,l,h,g,p;for(f=this,n=[],u=0,d=arguments.length;d>u;u++)r=arguments[u],null!=r&&n.push(r);if(0===n.length)s=[255,0,255,1,"rgb"],a=s[0],i=s[1],c=s[2],e=s[3],t=s[4];else if("array"===R(n[0])){if(3===n[0].length)l=n[0],a=l[0],i=l[1],c=l[2],e=1;else{if(4!==n[0].length)throw"unknown input argument";h=n[0],a=h[0],i=h[1],c=h[2],e=h[3]}t=null!=(g=n[1])?g:"rgb"}else"string"===R(n[0])?(a=n[0],t="hex"):"object"===R(n[0])?(p=n[0]._rgb,a=p[0],i=p[1],c=p[2],e=p[3],t="rgb"):n.length>=3&&(a=n[0],i=n[1],c=n[2]);3===n.length?(t="rgb",e=1):4===n.length?"string"===R(n[3])?(t=n[3],e=1):"number"===R(n[3])&&(t="rgb",e=n[3]):5===n.length&&(e=n[3],t=n[4]),null==e&&(e=1),"rgb"===t?f._rgb=[a,i,c,e]:"gl"===t?f._rgb=[255*a,255*i,255*c,e]:"hsl"===t?(f._rgb=v(a,i,c),f._rgb[3]=e):"hsv"===t?(f._rgb=w(a,i,c),f._rgb[3]=e):"hex"===t?f._rgb=m(a):"lab"===t?(f._rgb=_(a,i,c),f._rgb[3]=e):"lch"===t?(f._rgb=M(a,i,c),f._rgb[3]=e):"hsi"===t&&(f._rgb=y(a,i,c),f._rgb[3]=e),o=b(f._rgb)}return e.prototype.rgb=function(){return this._rgb.slice(0,3)},e.prototype.rgba=function(){return this._rgb},e.prototype.hex=function(){return U(this._rgb)},e.prototype.toString=function(){return this.name()},e.prototype.hsl=function(){return P(this._rgb)},e.prototype.hsv=function(){return z(this._rgb)},e.prototype.lab=function(){return G(this._rgb)},e.prototype.lch=function(){return E(this._rgb)},e.prototype.hsi=function(){return A(this._rgb)},e.prototype.gl=function(){return[this._rgb[0]/255,this._rgb[1]/255,this._rgb[2]/255,this._rgb[3]]},e.prototype.luminance=function(r,n){var t,f,o,a;return null==n&&(n="rgb"),arguments.length?(0===r&&(this._rgb=[0,0,0,this._rgb[3]]),1===r&&(this._rgb=[255,255,255,this._rgb[3]]),t=C(this._rgb),f=1e-7,o=20,a=function(e,t){var i,c;return c=e.interpolate(.5,t,n),i=c.luminance(),Math.abs(r-i)<f||!o--?c:i>r?a(e,c):a(c,t)},this._rgb=(t>r?a(new e("black"),this):a(this,new e("white"))).rgba(),this):C(this._rgb)},e.prototype.name=function(){var e,r;e=this.hex();for(r in l.colors)if(e===l.colors[r])return r;return e},e.prototype.alpha=function(e){return arguments.length?(this._rgb[3]=e,this):this._rgb[3]},e.prototype.css=function(e){var r,n,t,f;return null==e&&(e="rgb"),n=this,t=n._rgb,3===e.length&&t[3]<1&&(e+="a"),"rgb"===e?e+"("+t.slice(0,3).map(Math.round).join(",")+")":"rgba"===e?e+"("+t.slice(0,3).map(Math.round).join(",")+","+t[3]+")":"hsl"===e||"hsla"===e?(r=n.hsl(),f=function(e){return Math.round(100*e)/100},r[0]=f(r[0]),r[1]=f(100*r[1])+"%",r[2]=f(100*r[2])+"%",4===e.length&&(r[3]=t[3]),e+"("+r.join(",")+")"):void 0},e.prototype.interpolate=function(r,n,t){var f,o,a,i,c,u,d,s,l,b,h,g,p,m;if(s=this,null==t&&(t="rgb"),"string"===R(n)&&(n=new e(n)),"hsl"===t||"hsv"===t||"lch"===t||"hsi"===t)"hsl"===t?(p=s.hsl(),m=n.hsl()):"hsv"===t?(p=s.hsv(),m=n.hsv()):"hsi"===t?(p=s.hsi(),m=n.hsi()):"lch"===t&&(p=s.lch(),m=n.lch()),"h"===t.substr(0,1)?(a=p[0],h=p[1],u=p[2],i=m[0],g=m[1],d=m[2]):(u=p[0],h=p[1],a=p[2],d=m[0],g=m[1],i=m[2]),isNaN(a)||isNaN(i)?isNaN(a)?isNaN(i)?o=Number.NaN:(o=i,1!==u&&0!==u||"hsv"===t||(b=g)):(o=a,1!==d&&0!==d||"hsv"===t||(b=h)):(f=i>a&&i-a>180?i-(a+360):a>i&&a-i>180?i+360-a:i-a,o=a+r*f),null==b&&(b=h+r*(g-h)),c=u+r*(d-u),l="h"===t.substr(0,1)?new e(o,b,c,t):new e(c,b,o,t);else if("rgb"===t)p=s._rgb,m=n._rgb,l=new e(p[0]+r*(m[0]-p[0]),p[1]+r*(m[1]-p[1]),p[2]+r*(m[2]-p[2]),t);else{if("lab"!==t)throw"color mode "+t+" is not supported";p=s.lab(),m=n.lab(),l=new e(p[0]+r*(m[0]-p[0]),p[1]+r*(m[1]-p[1]),p[2]+r*(m[2]-p[2]),t)}return l.alpha(s.alpha()+r*(n.alpha()-s.alpha())),l},e.prototype.premultiply=function(){var e,r;return r=this.rgb(),e=this.alpha(),l(r[0]*e,r[1]*e,r[2]*e,e)},e.prototype.darken=function(e){var r,n;return null==e&&(e=20),n=this,r=n.lch(),r[0]-=e,l.lch(r).alpha(n.alpha())},e.prototype.darker=function(e){return this.darken(e)},e.prototype.brighten=function(e){return null==e&&(e=20),this.darken(-e)},e.prototype.brighter=function(e){return this.brighten(e)},e.prototype.saturate=function(e){var r,n;return null==e&&(e=20),n=this,r=n.lch(),r[1]+=e,l.lch(r).alpha(n.alpha())},e.prototype.desaturate=function(e){return null==e&&(e=20),this.saturate(-e)},e}(),b=function(e){var r;for(r in e)3>r?(e[r]<0&&(e[r]=0),e[r]>255&&(e[r]=255)):3===r&&(e[r]<0&&(e[r]=0),e[r]>1&&(e[r]=1));return e},p=function(e){var r,n,t,f,o,a,i,c;if(e=e.toLowerCase(),null!=l.colors&&l.colors[e])return m(l.colors[e]);if(t=e.match(/rgb\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*\)/)){for(f=t.slice(1,4),n=o=0;2>=o;n=++o)f[n]=+f[n];f[3]=1}else if(t=e.match(/rgba\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*,\s*([01]|[01]?\.\d+)\)/))for(f=t.slice(1,5),n=a=0;3>=a;n=++a)f[n]=+f[n];else if(t=e.match(/rgb\(\s*(\-?\d+(?:\.\d+)?)%,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*\)/)){for(f=t.slice(1,4),n=i=0;2>=i;n=++i)f[n]=Math.round(2.55*f[n]);f[3]=1}else if(t=e.match(/rgba\(\s*(\-?\d+(?:\.\d+)?)%,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)/)){for(f=t.slice(1,5),n=c=0;2>=c;n=++c)f[n]=Math.round(2.55*f[n]);f[3]=+f[3]}else(t=e.match(/hsl\(\s*(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*\)/))?(r=t.slice(1,4),r[1]*=.01,r[2]*=.01,f=v(r),f[3]=1):(t=e.match(/hsla\(\s*(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)/))&&(r=t.slice(1,4),r[1]*=.01,r[2]*=.01,f=v(r),f[3]=+t[4]);return f},m=function(e){var r,n,t,f,o,a;if(e.match(/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/))return(4===e.length||7===e.length)&&(e=e.substr(1)),3===e.length&&(e=e.split(""),e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),a=parseInt(e,16),f=a>>16,t=a>>8&255,n=255&a,[f,t,n,1];if(e.match(/^#?([A-Fa-f0-9]{8})$/))return 9===e.length&&(e=e.substr(1)),a=parseInt(e,16),f=a>>24&255,t=a>>16&255,n=a>>8&255,r=255&a,[f,t,n,r];if(o=p(e))return o;throw"unknown color: "+e},y=function(e,r,n){var t,f,i,c;return c=S(arguments),e=c[0],r=c[1],n=c[2],e/=360,1/3>e?(t=(1-r)/3,i=(1+r*g(a*e)/g(o-a*e))/3,f=1-(t+i)):2/3>e?(e-=1/3,i=(1-r)/3,f=(1+r*g(a*e)/g(o-a*e))/3,t=1-(i+f)):(e-=2/3,f=(1-r)/3,t=(1+r*g(a*e)/g(o-a*e))/3,i=1-(f+t)),i=q(n*i*3),f=q(n*f*3),t=q(n*t*3),[255*i,255*f,255*t]},v=function(){var e,r,n,t,f,o,a,i,c,u,d,s,l,b;if(l=S(arguments),t=l[0],i=l[1],o=l[2],0===i)a=n=e=255*o;else{for(d=[0,0,0],r=[0,0,0],u=.5>o?o*(1+i):o+i-o*i,c=2*o-u,t/=360,d[0]=t+1/3,d[1]=t,d[2]=t-1/3,f=s=0;2>=s;f=++s)d[f]<0&&(d[f]+=1),d[f]>1&&(d[f]-=1),r[f]=6*d[f]<1?c+6*(u-c)*d[f]:2*d[f]<1?u:3*d[f]<2?c+(u-c)*(2/3-d[f])*6:c;b=[Math.round(255*r[0]),Math.round(255*r[1]),Math.round(255*r[2])],a=b[0],n=b[1],e=b[2]}return[a,n,e]},w=function(){var e,r,n,t,f,o,a,i,c,u,d,s,l,b,h,g,p,m;if(s=S(arguments),t=s[0],c=s[1],d=s[2],d*=255,0===c)i=n=e=d;else switch(360===t&&(t=0),t>360&&(t-=360),0>t&&(t+=360),t/=60,f=Math.floor(t),r=t-f,o=d*(1-c),a=d*(1-c*r),u=d*(1-c*(1-r)),f){case 0:l=[d,u,o],i=l[0],n=l[1],e=l[2];break;case 1:b=[a,d,o],i=b[0],n=b[1],e=b[2];break;case 2:h=[o,d,u],i=h[0],n=h[1],e=h[2];break;case 3:g=[o,a,d],i=g[0],n=g[1],e=g[2];break;case 4:p=[u,o,d],i=p[0],n=p[1],e=p[2];break;case 5:m=[d,o,a],i=m[0],n=m[1],e=m[2]}return i=Math.round(i),n=Math.round(n),e=Math.round(e),[i,n,e]},f=18,i=.95047,c=1,u=1.08883,x=function(){var e,r,n,t,f,o;return o=S(arguments),f=o[0],e=o[1],r=o[2],n=Math.sqrt(e*e+r*r),t=Math.atan2(r,e)/Math.PI*180,[f,n,t]},_=function(e,r,n){var t,f,o,a,d,s,l;return void 0!==e&&3===e.length&&(s=e,e=s[0],r=s[1],n=s[2]),void 0!==e&&3===e.length&&(l=e,e=l[0],r=l[1],n=l[2]),a=(e+16)/116,o=a+r/500,d=a-n/200,o=k(o)*i,a=k(a)*c,d=k(d)*u,f=T(3.2404542*o-1.5371385*a-.4985314*d),t=T(-.969266*o+1.8760108*a+.041556*d),n=T(.0556434*o-.2040259*a+1.0572252*d),[q(f,0,255),q(t,0,255),q(n,0,255),1]},k=function(e){return e>.206893034?e*e*e:(e-4/29)/7.787037},T=function(e){return Math.round(255*(.00304>=e?12.92*e:1.055*Math.pow(e,1/2.4)-.055))},j=function(){var e,r,n,t;return t=S(arguments),n=t[0],e=t[1],r=t[2],r=r*Math.PI/180,[n,Math.cos(r)*e,Math.sin(r)*e]},M=function(e,r,n){var t,f,o,a,i,c,u;return c=j(e,r,n),t=c[0],f=c[1],o=c[2],u=_(t,f,o),i=u[0],a=u[1],o=u[2],[q(i,0,255),q(a,0,255),q(o,0,255)]},C=function(e,r,n){var t;return t=S(arguments),e=t[0],r=t[1],n=t[2],e=N(e),r=N(r),n=N(n),.2126*e+.7152*r+.0722*n},N=function(e){return e/=255,.03928>=e?e/12.92:Math.pow((e+.055)/1.055,2.4)},U=function(){var e,r,n,t,f,o;return o=S(arguments),n=o[0],r=o[1],e=o[2],f=n<<16|r<<8|e,t="000000"+f.toString(16),"#"+t.substr(t.length-6)},A=function(){var e,r,n,t,f,o,a,i,c;return c=S(arguments),a=c[0],n=c[1],r=c[2],e=2*Math.PI,a/=255,n/=255,r/=255,o=Math.min(a,n,r),f=(a+n+r)/3,i=1-o/f,0===i?t=0:(t=(a-n+(a-r))/2,t/=Math.sqrt((a-n)*(a-n)+(a-r)*(n-r)),t=Math.acos(t),r>n&&(t=e-t),t/=e),[360*t,i,f]},P=function(e,r,n){var t,f,o,a,i,c;return void 0!==e&&e.length>=3&&(c=e,e=c[0],r=c[1],n=c[2]),e/=255,r/=255,n/=255,a=Math.min(e,r,n),o=Math.max(e,r,n),f=(o+a)/2,o===a?(i=0,t=Number.NaN):i=.5>f?(o-a)/(o+a):(o-a)/(2-o-a),e===o?t=(r-n)/(o-a):r===o?t=2+(n-e)/(o-a):n===o&&(t=4+(e-r)/(o-a)),t*=60,0>t&&(t+=360),[t,i,f]},z=function(){var e,r,n,t,f,o,a,i,c,u;return u=S(arguments),a=u[0],n=u[1],e=u[2],o=Math.min(a,n,e),f=Math.max(a,n,e),r=f-o,c=f/255,0===f?(t=Number.NaN,i=0):(i=r/f,a===f&&(t=(n-e)/r),n===f&&(t=2+(e-a)/r),e===f&&(t=4+(a-n)/r),t*=60,0>t&&(t+=360)),[t,i,c]},G=function(){var e,r,n,t,f,o,a;return a=S(arguments),n=a[0],r=a[1],e=a[2],n=B(n),r=B(r),e=B(e),t=O((.4124564*n+.3575761*r+.1804375*e)/i),f=O((.2126729*n+.7151522*r+.072175*e)/c),o=O((.0193339*n+.119192*r+.9503041*e)/u),[116*f-16,500*(t-f),200*(f-o)]},B=function(e){return(e/=255)<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4)},O=function(e){return e>.008856?Math.pow(e,1/3):7.787037*e+4/29},E=function(){var e,r,n,t,f,o,a;return o=S(arguments),f=o[0],n=o[1],r=o[2],a=G(f,n,r),t=a[0],e=a[1],r=a[2],x(t,e,r)},l.scale=function(e,r){var n,t,f,o,a,i,c,u,d,s,b,h,g,p,m,y,v,w,x,_,k;return y="rgb",v=l("#ccc"),k=0,g=!1,h=[0,1],s=[],x=!1,_=[],m=0,p=1,b=!1,w=0,d={},i=function(e,r){var n,t,f,o,i,c,u;if(null==e&&(e=["#ddd","#222"]),null!=e&&"string"===R(e)&&null!=(null!=(i=l.brewer)?i[e]:void 0)&&(e=l.brewer[e]),"array"===R(e)){for(e=e.slice(0),n=f=0,c=e.length-1;c>=0?c>=f:f>=c;n=c>=0?++f:--f)t=e[n],"string"===R(t)&&(e[n]=l(t));if(null!=r)_=r;else for(_=[],n=o=0,u=e.length-1;u>=0?u>=o:o>=u;n=u>=0?++o:--o)_.push(n/(e.length-1))}return a(),s=e},c=function(e){return null==e&&(e=[]),h=e,m=e[0],p=e[e.length-1],a(),w=2===e.length?0:e.length-1},f=function(e){var r,n;if(null!=h){for(n=h.length-1,r=0;n>r&&e>=h[r];)r++;return r-1}return 0},u=function(e){return e},n=function(e){var r,n,t,o,a;return a=e,h.length>2&&(o=h.length-1,r=f(e),t=h[0]+(h[1]-h[0])*(0+.5*k),n=h[o-1]+(h[o]-h[o-1])*(1-.5*k),a=m+(h[r]+.5*(h[r+1]-h[r])-t)/(n-t)*(p-m)),a},o=function(e,r){var n,t,o,a,i,c,b,g,x;if(null==r&&(r=!1),isNaN(e))return v;if(r?b=e:h.length>2?(n=f(e),b=n/(w-1)):(b=o=m!==p?(e-m)/(p-m):0,b=o=(e-m)/(p-m),b=Math.min(1,Math.max(0,b))),r||(b=u(b)),i=Math.floor(1e4*b),d[i])t=d[i];else{if("array"===R(s))for(a=g=0,x=_.length-1;x>=0?x>=g:g>=x;a=x>=0?++g:--g){if(c=_[a],c>=b){t=s[a];break}if(b>=c&&a===_.length-1){t=s[a];break}if(b>c&&b<_[a+1]){b=(b-c)/(_[a+1]-c),t=l.interpolate(s[a],s[a+1],b,y);break}}else"function"===R(s)&&(t=s(b));d[i]=t}return t},a=function(){return d={}},i(e,r),t=function(e){var r;return r=o(e),x&&r[x]?r[x]():r},t.domain=function(e,r,n,f){var o;return null==n&&(n="e"),arguments.length?(null!=r&&(o=l.analyze(e,f),e=0===r?[o.min,o.max]:l.limits(o,n,r)),c(e),t):h},t.mode=function(e){return arguments.length?(y=e,a(),t):y},t.range=function(e,r){return i(e,r),t},t.out=function(e){return x=e,t},t.spread=function(e){return arguments.length?(k=e,t):k},t.correctLightness=function(e){return arguments.length?(b=e,a(),u=b?function(e){var r,n,t,f,a,i,c,u,d;for(r=o(0,!0).lab()[0],n=o(1,!0).lab()[0],c=r>n,t=o(e,!0).lab()[0],a=r+(n-r)*e,f=t-a,u=0,d=1,i=20;Math.abs(f)>.01&&i-->0;)!function(){return c&&(f*=-1),0>f?(u=e,e+=.5*(d-e)):(d=e,e+=.5*(u-e)),t=o(e,!0).lab()[0],f=t-a}();return e}:function(e){return e},t):b},t.colors=function(r){var n,f,o,a,i,c;if(null==r&&(r="hex"),e=[],f=[],h.length>2)for(n=o=1,c=h.length;c>=1?c>o:o>c;n=c>=1?++o:--o)f.push(.5*(h[n-1]+h[n]));else f=h;for(a=0,i=f.length;i>a;a++)n=f[a],e.push(t(n)[r]());return e},t},null==(Y=l.scales)&&(l.scales={}),l.scales.cool=function(){return l.scale([l.hsl(180,1,.9),l.hsl(250,.7,.4)])},l.scales.hot=function(){return l.scale(["#000","#f00","#ff0","#fff"],[0,.25,.75,1]).mode("rgb")},l.analyze=function(e,r,n){var t,f,o,a,i,c,u;if(o={min:Number.MAX_VALUE,max:-1*Number.MAX_VALUE,sum:0,values:[],count:0},null==n&&(n=function(){return!0}),t=function(e){null==e||isNaN(e)||(o.values.push(e),o.sum+=e,e<o.min&&(o.min=e),e>o.max&&(o.max=e),o.count+=1)},i=function(e,f){return n(e,f)?null!=r&&"function"===R(r)?t(r(e)):null!=r&&"string"===R(r)||"number"===R(r)?t(e[r]):t(e):void 0},"array"===R(e))for(c=0,u=e.length;u>c;c++)a=e[c],i(a);else for(f in e)a=e[f],i(a,f);return o.domain=[o.min,o.max],o.limits=function(e,r){return l.limits(o,e,r)},o},l.limits=function(e,r,n){var t,f,o,a,i,c,u,d,s,b,h,g,p,m,y,v,w,x,_,k,j,M,q,C,N,U,A,P,z,G,E,B,I,S,O,T,Y,L,F,D,V,X,W,$,Z,H,J,K,Q,er,rr,nr,tr,fr,or,ar;if(null==r&&(r="equal"),null==n&&(n=7),"array"===R(e)&&(e=l.analyze(e)),p=e.min,h=e.max,q=e.sum,U=e.values.sort(function(e,r){return e-r}),b=[],"c"===r.substr(0,1)&&(b.push(p),b.push(h)),"e"===r.substr(0,1)){for(b.push(p),u=A=1,Y=n-1;Y>=1?Y>=A:A>=Y;u=Y>=1?++A:--A)b.push(p+u/n*(h-p));b.push(h)}else if("l"===r.substr(0,1)){if(0>=p)throw"Logarithmic scales are only possible for values > 0";for(m=Math.LOG10E*Math.log(p),g=Math.LOG10E*Math.log(h),b.push(p),u=P=1,$=n-1;$>=1?$>=P:P>=$;u=$>=1?++P:--P)b.push(Math.pow(10,m+u/n*(g-m)));b.push(h)}else if("q"===r.substr(0,1)){for(b.push(p),u=z=1,Z=n-1;Z>=1?Z>=z:z>=Z;u=Z>=1?++z:--z)_=U.length*u/n,k=Math.floor(_),k===_?b.push(U[k]):(j=_-k,b.push(U[k]*j+U[k+1]*(1-j)));b.push(h)}else if("k"===r.substr(0,1)){for(v=U.length,t=new Array(v),i=new Array(n),M=!0,w=0,o=null,o=[],o.push(p),u=G=1,H=n-1;H>=1?H>=G:G>=H;u=H>=1?++G:--G)o.push(p+u/n*(h-p));for(o.push(h);M;){for(d=E=0,J=n-1;J>=0?J>=E:E>=J;d=J>=0?++E:--E)i[d]=0;for(u=B=0,K=v-1;K>=0?K>=B:B>=K;u=K>=0?++B:--B){for(N=U[u],y=Number.MAX_VALUE,d=I=0,Q=n-1;Q>=0?Q>=I:I>=Q;d=Q>=0?++I:--I)c=Math.abs(o[d]-N),y>c&&(y=c,f=d);i[f]++,t[u]=f}for(x=new Array(n),d=S=0,er=n-1;er>=0?er>=S:S>=er;d=er>=0?++S:--S)x[d]=null;for(u=O=0,rr=v-1;rr>=0?rr>=O:O>=rr;u=rr>=0?++O:--O)a=t[u],null===x[a]?x[a]=U[u]:x[a]+=U[u];for(d=T=0,L=n-1;L>=0?L>=T:T>=L;d=L>=0?++T:--T)x[d]*=1/i[d];for(M=!1,d=nr=0,F=n-1;F>=0?F>=nr:nr>=F;d=F>=0?++nr:--nr)if(x[d]!==o[u]){M=!0;break}o=x,w++,w>200&&(M=!1)}for(s={},d=tr=0,D=n-1;D>=0?D>=tr:tr>=D;d=D>=0?++tr:--tr)s[d]=[];for(u=fr=0,V=v-1;V>=0?V>=fr:fr>=V;u=V>=0?++fr:--fr)a=t[u],s[a].push(U[u]);for(C=[],d=or=0,X=n-1;X>=0?X>=or:or>=X;d=X>=0?++or:--or)C.push(s[d][0]),C.push(s[d][s[d].length-1]);for(C=C.sort(function(e,r){return e-r}),b.push(C[0]),u=ar=1,W=C.length-1;W>=ar;u=ar+=2)isNaN(C[u])||b.push(C[u])}return b},l.brewer=s={OrRd:["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"],PuBu:["#fff7fb","#ece7f2","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#045a8d","#023858"],BuPu:["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"],Oranges:["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#a63603","#7f2704"],BuGn:["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"],YlOrBr:["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#993404","#662506"],YlGn:["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#006837","#004529"],Reds:["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"],RdPu:["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177","#49006a"],Greens:["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"],YlGnBu:["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"],Purples:["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d"],GnBu:["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081"],Greys:["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525","#000000"],YlOrRd:["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"],PuRd:["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#980043","#67001f"],Blues:["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"],PuBuGn:["#fff7fb","#ece2f0","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016c59","#014636"],Spectral:["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"],RdYlGn:["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"],RdBu:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"],PiYG:["#8e0152","#c51b7d","#de77ae","#f1b6da","#fde0ef","#f7f7f7","#e6f5d0","#b8e186","#7fbc41","#4d9221","#276419"],PRGn:["#40004b","#762a83","#9970ab","#c2a5cf","#e7d4e8","#f7f7f7","#d9f0d3","#a6dba0","#5aae61","#1b7837","#00441b"],RdYlBu:["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"],BrBG:["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"],RdGy:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#ffffff","#e0e0e0","#bababa","#878787","#4d4d4d","#1a1a1a"],PuOr:["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6","#f7f7f7","#d8daeb","#b2abd2","#8073ac","#542788","#2d004b"],Set2:["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494","#b3b3b3"],Accent:["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17","#666666"],Set1:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"],Set3:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"],Dark2:["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"],Paired:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"],Pastel2:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae","#f1e2cc","#cccccc"],Pastel1:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec","#f2f2f2"]},l.colors=h={indigo:"#4b0082",gold:"#ffd700",hotpink:"#ff69b4",firebrick:"#b22222",indianred:"#cd5c5c",yellow:"#ffff00",mistyrose:"#ffe4e1",darkolivegreen:"#556b2f",olive:"#808000",darkseagreen:"#8fbc8f",pink:"#ffc0cb",tomato:"#ff6347",lightcoral:"#f08080",orangered:"#ff4500",navajowhite:"#ffdead",lime:"#00ff00",palegreen:"#98fb98",darkslategrey:"#2f4f4f",greenyellow:"#adff2f",burlywood:"#deb887",seashell:"#fff5ee",mediumspringgreen:"#00fa9a",fuchsia:"#ff00ff",papayawhip:"#ffefd5",blanchedalmond:"#ffebcd",chartreuse:"#7fff00",dimgray:"#696969",black:"#000000",peachpuff:"#ffdab9",springgreen:"#00ff7f",aquamarine:"#7fffd4",white:"#ffffff",orange:"#ffa500",lightsalmon:"#ffa07a",darkslategray:"#2f4f4f",brown:"#a52a2a",ivory:"#fffff0",dodgerblue:"#1e90ff",peru:"#cd853f",lawngreen:"#7cfc00",chocolate:"#d2691e",crimson:"#dc143c",forestgreen:"#228b22",darkgrey:"#a9a9a9",lightseagreen:"#20b2aa",cyan:"#00ffff",mintcream:"#f5fffa",silver:"#c0c0c0",antiquewhite:"#faebd7",mediumorchid:"#ba55d3",skyblue:"#87ceeb",gray:"#808080",darkturquoise:"#00ced1",goldenrod:"#daa520",darkgreen:"#006400",floralwhite:"#fffaf0",darkviolet:"#9400d3",darkgray:"#a9a9a9",moccasin:"#ffe4b5",saddlebrown:"#8b4513",grey:"#808080",darkslateblue:"#483d8b",lightskyblue:"#87cefa",lightpink:"#ffb6c1",mediumvioletred:"#c71585",slategrey:"#708090",red:"#ff0000",deeppink:"#ff1493",limegreen:"#32cd32",darkmagenta:"#8b008b",palegoldenrod:"#eee8aa",plum:"#dda0dd",turquoise:"#40e0d0",lightgrey:"#d3d3d3",lightgoldenrodyellow:"#fafad2",darkgoldenrod:"#b8860b",lavender:"#e6e6fa",maroon:"#800000",yellowgreen:"#9acd32",sandybrown:"#f4a460",thistle:"#d8bfd8",violet:"#ee82ee",navy:"#000080",magenta:"#ff00ff",dimgrey:"#696969",tan:"#d2b48c",rosybrown:"#bc8f8f",olivedrab:"#6b8e23",blue:"#0000ff",lightblue:"#add8e6",ghostwhite:"#f8f8ff",honeydew:"#f0fff0",cornflowerblue:"#6495ed",slateblue:"#6a5acd",linen:"#faf0e6",darkblue:"#00008b",powderblue:"#b0e0e6",seagreen:"#2e8b57",darkkhaki:"#bdb76b",snow:"#fffafa",sienna:"#a0522d",mediumblue:"#0000cd",royalblue:"#4169e1",lightcyan:"#e0ffff",green:"#008000",mediumpurple:"#9370db",midnightblue:"#191970",cornsilk:"#fff8dc",paleturquoise:"#afeeee",bisque:"#ffe4c4",slategray:"#708090",darkcyan:"#008b8b",khaki:"#f0e68c",wheat:"#f5deb3",teal:"#008080",darkorchid:"#9932cc",deepskyblue:"#00bfff",salmon:"#fa8072",darkred:"#8b0000",steelblue:"#4682b4",palevioletred:"#db7093",lightslategray:"#778899",aliceblue:"#f0f8ff",lightslategrey:"#778899",lightgreen:"#90ee90",orchid:"#da70d6",gainsboro:"#dcdcdc",mediumseagreen:"#3cb371",lightgray:"#d3d3d3",mediumturquoise:"#48d1cc",lemonchiffon:"#fffacd",cadetblue:"#5f9ea0",lightyellow:"#ffffe0",lavenderblush:"#fff0f5",coral:"#ff7f50",purple:"#800080",aqua:"#00ffff",whitesmoke:"#f5f5f5",mediumslateblue:"#7b68ee",darkorange:"#ff8c00",mediumaquamarine:"#66cdaa",darksalmon:"#e9967a",beige:"#f5f5dc",blueviolet:"#8a2be2",azure:"#f0ffff",lightsteelblue:"#b0c4de",oldlace:"#fdf5e6"},R=function(){var e,r,n,t,f;for(e={},f="Boolean Number String Function Array Date RegExp Undefined Null".split(" "),n=0,t=f.length;t>n;n++)r=f[n],e["[object "+r+"]"]=r.toLowerCase();return function(r){var n;return n=Object.prototype.toString.call(r),e[n]||"object"}}(),q=function(e,r,n){return null==r&&(r=0),null==n&&(n=1),r>e&&(e=r),e>n&&(e=n),e},S=function(e){return e.length>=3?e:e[0]},a=2*Math.PI,o=Math.PI/3,g=Math.cos,d=function(e){var r,n,t,f,o,a,i,c,u,s,b;return e=function(){var r,n,t;for(t=[],r=0,n=e.length;n>r;r++)f=e[r],t.push(l(f));return t}(),2===e.length?(u=function(){var r,n,t;for(t=[],r=0,n=e.length;n>r;r++)f=e[r],t.push(f.lab());return t}(),o=u[0],a=u[1],r=function(e){var r,n;return n=function(){var n,t;for(t=[],r=n=0;2>=n;r=++n)t.push(o[r]+e*(a[r]-o[r]));return t}(),l.lab.apply(l,n)}):3===e.length?(s=function(){var r,n,t;for(t=[],r=0,n=e.length;n>r;r++)f=e[r],t.push(f.lab());return t}(),o=s[0],a=s[1],i=s[2],r=function(e){var r,n;return n=function(){var n,t;for(t=[],r=n=0;2>=n;r=++n)t.push((1-e)*(1-e)*o[r]+2*(1-e)*e*a[r]+e*e*i[r]);return t}(),l.lab.apply(l,n)}):4===e.length?(b=function(){var r,n,t;for(t=[],r=0,n=e.length;n>r;r++)f=e[r],t.push(f.lab());return t}(),o=b[0],a=b[1],i=b[2],c=b[3],r=function(e){var r,n;return n=function(){var n,t;for(t=[],r=n=0;2>=n;r=++n)t.push((1-e)*(1-e)*(1-e)*o[r]+3*(1-e)*(1-e)*e*a[r]+3*(1-e)*e*e*i[r]+e*e*e*c[r]);return t}(),l.lab.apply(l,n)}):5===e.length&&(n=d(e.slice(0,3)),t=d(e.slice(2,5)),r=function(e){return.5>e?n(2*e):t(2*(e-.5))}),r},l.interpolate.bezier=d}).call(this)},{}],"/Users/qrohlf/Code/trianglify/node_modules/delaunay-fast/delaunay.js":[function(e,r){var n;!function(){"use strict";function e(e){var r,n,t,f,o,a,i=Number.POSITIVE_INFINITY,c=Number.POSITIVE_INFINITY,u=Number.NEGATIVE_INFINITY,d=Number.NEGATIVE_INFINITY;for(r=e.length;r--;)e[r][0]<i&&(i=e[r][0]),e[r][0]>u&&(u=e[r][0]),e[r][1]<c&&(c=e[r][1]),e[r][1]>d&&(d=e[r][1]);return n=u-i,t=d-c,f=Math.max(n,t),o=i+.5*n,a=c+.5*t,[[o-20*f,a-f],[o,a+20*f],[o+20*f,a-f]]}function t(e,r,n,t){var f,a,i,c,u,d,s,l,b,h,g=e[r][0],p=e[r][1],m=e[n][0],y=e[n][1],v=e[t][0],w=e[t][1],x=Math.abs(p-y),_=Math.abs(y-w);if(o>x&&o>_)throw new Error("Eek! Coincident points!");return o>x?(c=-((v-m)/(w-y)),d=(m+v)/2,l=(y+w)/2,f=(m+g)/2,a=c*(f-d)+l):o>_?(i=-((m-g)/(y-p)),u=(g+m)/2,s=(p+y)/2,f=(v+m)/2,a=i*(f-u)+s):(i=-((m-g)/(y-p)),c=-((v-m)/(w-y)),u=(g+m)/2,d=(m+v)/2,s=(p+y)/2,l=(y+w)/2,f=(i*u-c*d+l-s)/(i-c),a=x>_?i*(f-u)+s:c*(f-d)+l),b=m-f,h=y-a,{i:r,j:n,k:t,x:f,y:a,r:b*b+h*h}}function f(e){var r,n,t,f,o,a;for(n=e.length;n;)for(f=e[--n],t=e[--n],r=n;r;)if(a=e[--r],o=e[--r],t===o&&f===a||t===a&&f===o){e.splice(n,2),e.splice(r,2);break}}var o=1/1048576;n={triangulate:function(r,n){var a,i,c,u,d,s,l,b,h,g,p,m,y=r.length;if(3>y)return[];if(r=r.slice(0),n)for(a=y;a--;)r[a]=r[a][n];for(c=new Array(y),a=y;a--;)c[a]=a;for(c.sort(function(e,n){return r[n][0]-r[e][0]}),u=e(r),r.push(u[0],u[1],u[2]),d=[t(r,y+0,y+1,y+2)],s=[],l=[],a=c.length;a--;l.length=0){for(m=c[a],i=d.length;i--;)b=r[m][0]-d[i].x,b>0&&b*b>d[i].r?(s.push(d[i]),d.splice(i,1)):(h=r[m][1]-d[i].y,b*b+h*h-d[i].r>o||(l.push(d[i].i,d[i].j,d[i].j,d[i].k,d[i].k,d[i].i),d.splice(i,1)));for(f(l),i=l.length;i;)p=l[--i],g=l[--i],d.push(t(r,g,p,m))}for(a=d.length;a--;)s.push(d[a]);for(d.length=0,a=s.length;a--;)s[a].i<y&&s[a].j<y&&s[a].k<y&&d.push(s[a].i,s[a].j,s[a].k);return d},contains:function(e,r){if(r[0]<e[0][0]&&r[0]<e[1][0]&&r[0]<e[2][0]||r[0]>e[0][0]&&r[0]>e[1][0]&&r[0]>e[2][0]||r[1]<e[0][1]&&r[1]<e[1][1]&&r[1]<e[2][1]||r[1]>e[0][1]&&r[1]>e[1][1]&&r[1]>e[2][1])return null;var n=e[1][0]-e[0][0],t=e[2][0]-e[0][0],f=e[1][1]-e[0][1],o=e[2][1]-e[0][1],a=n*o-t*f;if(0===a)return null;var i=(o*(r[0]-e[0][0])-t*(r[1]-e[0][1]))/a,c=(n*(r[1]-e[0][1])-f*(r[0]-e[0][0]))/a;return 0>i||0>c||i+c>1?null:[i,c]}},"undefined"!=typeof r&&(r.exports=n)}()},{}],"/Users/qrohlf/Code/trianglify/node_modules/seedrandom/index.js":[function(e,r){var n=e("./lib/alea"),t=e("./lib/xor128"),f=e("./lib/xorwow"),o=e("./lib/xorshift7"),a=e("./lib/xor4096"),i=e("./lib/tychei"),c=e("./seedrandom");c.alea=n,c.xor128=t,c.xorwow=f,c.xorshift7=o,c.xor4096=a,c.tychei=i,r.exports=c},{"./lib/alea":"/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/alea.js","./lib/tychei":"/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/tychei.js","./lib/xor128":"/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/xor128.js","./lib/xor4096":"/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/xor4096.js","./lib/xorshift7":"/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/xorshift7.js","./lib/xorwow":"/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/xorwow.js","./seedrandom":"/Users/qrohlf/Code/trianglify/node_modules/seedrandom/seedrandom.js"}],"/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/alea.js":[function(r,n){!function(e,r,n){function t(e){var r=this,n=a();r.next=function(){var e=2091639*r.s0+2.3283064365386963e-10*r.c;return r.s0=r.s1,r.s1=r.s2,r.s2=e-(r.c=0|e)},r.c=1,r.s0=n(" "),r.s1=n(" "),r.s2=n(" "),r.s0-=n(e),r.s0<0&&(r.s0+=1),r.s1-=n(e),r.s1<0&&(r.s1+=1),r.s2-=n(e),r.s2<0&&(r.s2+=1),n=null}function f(e,r){return r.c=e.c,r.s0=e.s0,r.s1=e.s1,r.s2=e.s2,r}function o(e,r){var n=new t(e),o=r&&r.state,a=n.next;return a.int32=function(){return 4294967296*n.next()|0},a.double=function(){return a()+1.1102230246251565e-16*(2097152*a()|0)},a.quick=a,o&&("object"==typeof o&&f(o,n),a.state=function(){return f(n,{})}),a}function a(){var e=4022871197,r=function(r){r=r.toString();for(var n=0;n<r.length;n++){e+=r.charCodeAt(n);var t=.02519603282416938*e;e=t>>>0,t-=e,t*=e,e=t>>>0,t-=e,e+=4294967296*t}return 2.3283064365386963e-10*(e>>>0)};return r}r&&r.exports?r.exports=o:n&&n.amd?n(function(){return o}):this.alea=o}(this,"object"==typeof n&&n,"function"==typeof e&&e)},{}],"/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/tychei.js":[function(r,n){!function(e,r,n){function t(e){var r=this,n="";r.next=function(){var e=r.b,n=r.c,t=r.d,f=r.a;return e=e<<25^e>>>7^n,n=n-t|0,t=t<<24^t>>>8^f,f=f-e|0,r.b=e=e<<20^e>>>12^n,r.c=n=n-t|0,r.d=t<<16^n>>>16^f,r.a=f-e|0},r.a=0,r.b=0,r.c=-1640531527,r.d=1367130551,e===Math.floor(e)?(r.a=e/4294967296|0,r.b=0|e):n+=e;for(var t=0;t<n.length+20;t++)r.b^=0|n.charCodeAt(t),r.next()}function f(e,r){return r.a=e.a,r.b=e.b,r.c=e.c,r.d=e.d,r}function o(e,r){var n=new t(e),o=r&&r.state,a=function(){return(n.next()>>>0)/4294967296};return a.double=function(){do var e=n.next()>>>11,r=(n.next()>>>0)/4294967296,t=(e+r)/(1<<21);while(0===t);return t},a.int32=n.next,a.quick=a,o&&("object"==typeof o&&f(o,n),a.state=function(){return f(n,{})}),a}r&&r.exports?r.exports=o:n&&n.amd?n(function(){return o}):this.tychei=o}(this,"object"==typeof n&&n,"function"==typeof e&&e)},{}],"/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/xor128.js":[function(r,n){!function(e,r,n){function t(e){var r=this,n="";r.x=0,r.y=0,r.z=0,r.w=0,r.next=function(){var e=r.x^r.x<<11;return r.x=r.y,r.y=r.z,r.z=r.w,r.w^=r.w>>>19^e^e>>>8},e===(0|e)?r.x=e:n+=e;for(var t=0;t<n.length+64;t++)r.x^=0|n.charCodeAt(t),r.next()}function f(e,r){return r.x=e.x,r.y=e.y,r.z=e.z,r.w=e.w,r}function o(e,r){var n=new t(e),o=r&&r.state,a=function(){return(n.next()>>>0)/4294967296};return a.double=function(){do var e=n.next()>>>11,r=(n.next()>>>0)/4294967296,t=(e+r)/(1<<21);while(0===t);return t},a.int32=n.next,a.quick=a,o&&("object"==typeof o&&f(o,n),a.state=function(){return f(n,{})}),a}r&&r.exports?r.exports=o:n&&n.amd?n(function(){return o}):this.xor128=o}(this,"object"==typeof n&&n,"function"==typeof e&&e)},{}],"/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/xor4096.js":[function(r,n){!function(e,r,n){function t(e){function r(e,r){var n,t,f,o,a,i=[],c=128;for(r===(0|r)?(t=r,r=null):(r+="\x00",t=0,c=Math.max(c,r.length)),f=0,o=-32;c>o;++o)r&&(t^=r.charCodeAt((o+32)%r.length)),0===o&&(a=t),t^=t<<10,t^=t>>>15,t^=t<<4,t^=t>>>13,o>=0&&(a=a+1640531527|0,n=i[127&o]^=t+a,f=0==n?f+1:0);for(f>=128&&(i[127&(r&&r.length||0)]=-1),f=127,o=512;o>0;--o)t=i[f+34&127],n=i[f=f+1&127],t^=t<<13,n^=n<<17,t^=t>>>15,n^=n>>>12,i[f]=t^n;e.w=a,e.X=i,e.i=f}var n=this;n.next=function(){var e,r,t=n.w,f=n.X,o=n.i;return n.w=t=t+1640531527|0,r=f[o+34&127],e=f[o=o+1&127],r^=r<<13,e^=e<<17,r^=r>>>15,e^=e>>>12,r=f[o]=r^e,n.i=o,r+(t^t>>>16)|0},r(n,e)}function f(e,r){return r.i=e.i,r.w=e.w,r.X=e.X.slice(),r}function o(e,r){null==e&&(e=+new Date);var n=new t(e),o=r&&r.state,a=function(){return(n.next()>>>0)/4294967296};return a.double=function(){do var e=n.next()>>>11,r=(n.next()>>>0)/4294967296,t=(e+r)/(1<<21);while(0===t);return t},a.int32=n.next,a.quick=a,o&&(o.X&&f(o,n),a.state=function(){return f(n,{})}),a}r&&r.exports?r.exports=o:n&&n.amd?n(function(){return o}):this.xor4096=o}(this,"object"==typeof n&&n,"function"==typeof e&&e)},{}],"/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/xorshift7.js":[function(r,n){!function(e,r,n){function t(e){function r(e,r){var n,t,f=[];if(r===(0|r))t=f[0]=r;else for(r=""+r,n=0;n<r.length;++n)f[7&n]=f[7&n]<<15^r.charCodeAt(n)+f[n+1&7]<<13;for(;f.length<8;)f.push(0);for(n=0;8>n&&0===f[n];++n);for(t=8==n?f[7]=-1:f[n],e.x=f,e.i=0,n=256;n>0;--n)e.next()}var n=this;n.next=function(){var e,r,t=n.x,f=n.i;return e=t[f],e^=e>>>7,r=e^e<<24,e=t[f+1&7],r^=e^e>>>10,e=t[f+3&7],r^=e^e>>>3,e=t[f+4&7],r^=e^e<<7,e=t[f+7&7],e^=e<<13,r^=e^e<<9,t[f]=r,n.i=f+1&7,r},r(n,e)}function f(e,r){return r.x=e.x.slice(),r.i=e.i,r}function o(e,r){null==e&&(e=+new Date);var n=new t(e),o=r&&r.state,a=function(){return(n.next()>>>0)/4294967296};return a.double=function(){do var e=n.next()>>>11,r=(n.next()>>>0)/4294967296,t=(e+r)/(1<<21);while(0===t);return t},a.int32=n.next,a.quick=a,o&&(o.x&&f(o,n),a.state=function(){return f(n,{})}),a}r&&r.exports?r.exports=o:n&&n.amd?n(function(){return o}):this.xorshift7=o}(this,"object"==typeof n&&n,"function"==typeof e&&e)},{}],"/Users/qrohlf/Code/trianglify/node_modules/seedrandom/lib/xorwow.js":[function(r,n){!function(e,r,n){function t(e){var r=this,n="";r.next=function(){var e=r.x^r.x>>>2;return r.x=r.y,r.y=r.z,r.z=r.w,r.w=r.v,(r.d=r.d+362437|0)+(r.v=r.v^r.v<<4^(e^e<<1))|0},r.x=0,r.y=0,r.z=0,r.w=0,r.v=0,e===(0|e)?r.x=e:n+=e;for(var t=0;t<n.length+64;t++)r.x^=0|n.charCodeAt(t),t==n.length&&(r.d=r.x<<10^r.x>>>4),r.next()}function f(e,r){return r.x=e.x,r.y=e.y,r.z=e.z,r.w=e.w,r.v=e.v,r.d=e.d,r}function o(e,r){var n=new t(e),o=r&&r.state,a=function(){return(n.next()>>>0)/4294967296};return a.double=function(){do var e=n.next()>>>11,r=(n.next()>>>0)/4294967296,t=(e+r)/(1<<21);while(0===t);return t},a.int32=n.next,a.quick=a,o&&("object"==typeof o&&f(o,n),a.state=function(){return f(n,{})}),a}r&&r.exports?r.exports=o:n&&n.amd?n(function(){return o}):this.xorwow=o}(this,"object"==typeof n&&n,"function"==typeof e&&e)},{}],"/Users/qrohlf/Code/trianglify/node_modules/seedrandom/seedrandom.js":[function(r,n){!function(t,f){function o(e,r,n){var o=[];r=1==r?{entropy:!0}:r||{};var l=u(c(r.entropy?[e,s(t)]:null==e?d():e,3),o),b=new a(o),p=function(){for(var e=b.g(g),r=y,n=0;v>e;)e=(e+n)*h,r*=h,n=b.g(1);for(;e>=w;)e/=2,r/=2,n>>>=1;return(e+n)/r};return p.int32=function(){return 0|b.g(4)},p.quick=function(){return b.g(4)/4294967296},p.double=p,u(s(b.S),t),(r.pass||n||function(e,r,n,t){return t&&(t.S&&i(t,b),e.state=function(){return i(b,{})}),n?(f[m]=e,r):e})(p,l,"global"in r?r.global:this==f,r.state)}function a(e){var r,n=e.length,t=this,f=0,o=t.i=t.j=0,a=t.S=[];for(n||(e=[n++]);h>f;)a[f]=f++;for(f=0;h>f;f++)a[f]=a[o=x&o+e[f%n]+(r=a[f])],a[o]=r;(t.g=function(e){for(var r,n=0,f=t.i,o=t.j,a=t.S;e--;)r=a[f=x&f+1],n=n*h+a[x&(a[f]=a[o=x&o+r])+(a[o]=r)];return t.i=f,t.j=o,n})(h)}function i(e,r){return r.i=e.i,r.j=e.j,r.S=e.S.slice(),r}function c(e,r){var n,t=[],f=typeof e;if(r&&"object"==f)for(n in e)try{t.push(c(e[n],r-1))}catch(o){}return t.length?t:"string"==f?e:e+"\x00"}function u(e,r){for(var n,t=e+"",f=0;f<t.length;)r[x&f]=x&(n^=19*r[x&f])+t.charCodeAt(f++);return s(r)}function d(){try{if(l)return s(l.randomBytes(h));var e=new Uint8Array(h);return(b.crypto||b.msCrypto).getRandomValues(e),s(e)}catch(r){var n=b.navigator,f=n&&n.plugins;return[+new Date,b,f,b.screen,s(t)]}}function s(e){return String.fromCharCode.apply(0,e)}var l,b=this,h=256,g=6,p=52,m="random",y=f.pow(h,g),v=f.pow(2,p),w=2*v,x=h-1;if(f["seed"+m]=o,u(f.random(),t),"object"==typeof n&&n.exports){n.exports=o;try{l=r("crypto")}catch(_){}}else"function"==typeof e&&e.amd&&e(function(){return o})}([],Math)},{crypto:!1}]},{},["./lib/trianglify.js"])("./lib/trianglify.js")});var formatNumber={separador:",",sepDecimal:'.',formatear:function(num){num+='';var splitStr=num.split('.');var splitLeft=splitStr[0];var splitRight=splitStr.length>1?this.sepDecimal+splitStr[1]:'';var regx=/(\d+)(\d{3})/;while(regx.test(splitLeft)){splitLeft=splitLeft.replace(regx,'$1'+this.separador+'$2');}
return this.simbol+splitLeft+splitRight;},new:function(num,simbol){this.simbol=simbol||'';return this.formatear(num);}};(function(d){var k=d.scrollTo=function(a,i,e){d(window).scrollTo(a,i,e)};k.defaults={axis:'xy',duration:parseFloat(d.fn.jquery)>=1.3?0:1};k.window=function(a){return d(window)._scrollable()};d.fn._scrollable=function(){return this.map(function(){var a=this,i=!a.nodeName||d.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!i)return a;var e=(a.contentWindow||a).document||a.ownerDocument||a;return d.browser.safari||e.compatMode=='BackCompat'?e.body:e.documentElement})};d.fn.scrollTo=function(n,j,b){if(typeof j=='object'){b=j;j=0}if(typeof b=='function')b={onAfter:b};if(n=='max')n=9e9;b=d.extend({},k.defaults,b);j=j||b.speed||b.duration;b.queue=b.queue&&b.axis.length>1;if(b.queue)j/=2;b.offset=p(b.offset);b.over=p(b.over);return this._scrollable().each(function(){var q=this,r=d(q),f=n,s,g={},u=r.is('html,body');switch(typeof f){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)){f=p(f);break}f=d(f,this);case'object':if(f.is||f.style)s=(f=d(f)).offset()}d.each(b.axis.split(''),function(a,i){var e=i=='x'?'Left':'Top',h=e.toLowerCase(),c='scroll'+e,l=q[c],m=k.max(q,i);if(s){g[c]=s[h]+(u?0:l-r.offset()[h]);if(b.margin){g[c]-=parseInt(f.css('margin'+e))||0;g[c]-=parseInt(f.css('border'+e+'Width'))||0}g[c]+=b.offset[h]||0;if(b.over[h])g[c]+=f[i=='x'?'width':'height']()*b.over[h]}else{var o=f[h];g[c]=o.slice&&o.slice(-1)=='%'?parseFloat(o)/100*m:o}if(/^\d+$/.test(g[c]))g[c]=g[c]<=0?0:Math.min(g[c],m);if(!a&&b.queue){if(l!=g[c])t(b.onAfterFirst);delete g[c]}});t(b.onAfter);function t(a){r.animate(g,j,b.easing,a&&function(){a.call(this,n,b)})}}).end()};k.max=function(a,i){var e=i=='x'?'Width':'Height',h='scroll'+e;if(!d(a).is('html,body'))return a[h]-d(a)[e.toLowerCase()]();var c='client'+e,l=a.ownerDocument.documentElement,m=a.ownerDocument.body;return Math.max(l[h],m[h])-Math.min(l[c],m[c])};function p(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);;(function($,window,document,undefined){var OnePageNav=function(elem,options){this.elem=elem;this.$elem=$(elem);this.options=options;this.metadata=this.$elem.data('plugin-options');this.$win=$(window);this.sections={};this.didScroll=false;this.$doc=$(document);this.docHeight=this.$doc.height();};OnePageNav.prototype={defaults:{navItems:'a',currentClass:'current',changeHash:false,easing:'swing',filter:'',scrollSpeed:750,scrollThreshold:0.5,begin:false,end:false,scrollChange:false},init:function(){this.config=$.extend({},this.defaults,this.options,this.metadata);this.$nav=this.$elem.find(this.config.navItems);if(this.config.filter!==''){this.$nav=this.$nav.filter(this.config.filter);}
this.$nav.on('click.onePageNav',$.proxy(this.handleClick,this));this.getPositions();this.bindInterval();this.$win.on('resize.onePageNav',$.proxy(this.getPositions,this));return this;},adjustNav:function(self,$parent){self.$elem.find('.'+self.config.currentClass).removeClass(self.config.currentClass);$parent.addClass(self.config.currentClass);},bindInterval:function(){var self=this;var docHeight;self.$win.on('scroll.onePageNav',function(){self.didScroll=true;});self.t=setInterval(function(){docHeight=self.$doc.height();if(self.didScroll){self.didScroll=false;self.scrollChange();}
if(docHeight!==self.docHeight){self.docHeight=docHeight;self.getPositions();}},250);},getHash:function($link){return $link.attr('href').split('#')[1];},getPositions:function(){var self=this;var linkHref;var topPos;var $target;self.$nav.each(function(){linkHref=self.getHash($(this));$target=$('#'+linkHref);if($target.length){topPos=$target.offset().top-62;self.sections[linkHref]=Math.round(topPos);}});},getSection:function(windowPos){var returnValue=null;var windowHeight=Math.round(this.$win.height()*this.config.scrollThreshold);for(var section in this.sections){if((this.sections[section]-windowHeight)<windowPos){returnValue=section;}}
return returnValue;},handleClick:function(e){var self=this;var $link=$(e.currentTarget);var $parent=$link.parent();var newLoc='#'+self.getHash($link);if(!$parent.hasClass(self.config.currentClass)){if(self.config.begin){self.config.begin();}
self.adjustNav(self,$parent);self.unbindInterval();self.scrollTo(newLoc,function(){if(self.config.changeHash){window.location.hash=newLoc;}
self.bindInterval();if(self.config.end){self.config.end();}});}
e.preventDefault();},scrollChange:function(){var windowTop=this.$win.scrollTop();var position=this.getSection(windowTop);var $parent;if(position!==null){$parent=this.$elem.find('a[href$="#'+position+'"]').parent();if(!$parent.hasClass(this.config.currentClass)){this.adjustNav(this,$parent);if(this.config.scrollChange){this.config.scrollChange($parent);}}}},scrollTo:function(target,callback){var offset=$(target).offset().top;offset=offset-58;$('html, body').animate({scrollTop:offset},this.config.scrollSpeed,this.config.easing,callback);},unbindInterval:function(){clearInterval(this.t);this.$win.unbind('scroll.onePageNav');}};OnePageNav.defaults=OnePageNav.prototype.defaults;$.fn.onePageNav=function(options){return this.each(function(){new OnePageNav(this,options).init();});};})(jQuery,window,document);!function(a,b,c,d){"use strict";function e(b,c,d){var f,g=this,h="cbp";if(a.data(b,"cubeportfolio"))throw new Error("cubeportfolio is already initialized. Destroy it before initialize again!");a.data(b,"cubeportfolio",g),g.options=a.extend({},a.fn.cubeportfolio.options,c),g.isAnimating=!0,g.defaultFilter=g.options.defaultFilter,g.registeredEvents=[],g.queue=[],g.addedWrapp=!1,a.isFunction(d)&&g.registerEvent("initFinish",d,!0),g.obj=b,g.$obj=a(b),f=g.$obj.children(),g.options.caption&&("expand"===g.options.caption||e.Private.modernBrowser||(g.options.caption="minimal"),h+=" cbp-caption-active cbp-caption-"+g.options.caption),g.$obj.addClass(h),(0===f.length||f.first().hasClass("cbp-item"))&&(g.wrapInner(g.obj,"cbp-wrapper"),g.addedWrapp=!0),g.$ul=g.$obj.children().addClass("cbp-wrapper"),g.wrapInner(g.obj,"cbp-wrapper-outer"),g.wrapper=g.$obj.children(".cbp-wrapper-outer"),g.blocks=g.$ul.children(".cbp-item"),g.blocksOn=g.blocks,g.wrapInner(g.blocks,"cbp-item-wrapper"),g.plugins=a.map(e.Plugins,function(a){return a(g)}),g.loadImages(g.$obj,g.display)}a.extend(e.prototype,{storeData:function(b,c){var d=this;c=c||0,b.each(function(b,e){var f=a(e),g=f.width(),h=f.height();f.data("cbp",{index:c+b,wrapper:f.children(".cbp-item-wrapper"),widthInitial:g,heightInitial:h,width:g,height:h,widthAndGap:g+d.options.gapVertical,heightAndGap:h+d.options.gapHorizontal,left:null,leftNew:null,top:null,topNew:null,pack:!1})})},wrapInner:function(a,b){var e,f,g;if(b=b||"",!(a.length&&a.length<1))for(a.length===d&&(a=[a]),f=a.length-1;f>=0;f--){for(e=a[f],g=c.createElement("div"),g.setAttribute("class",b);e.childNodes.length;)g.appendChild(e.childNodes[0]);e.appendChild(g)}},loadImages:function(b,c){var d=this;requestAnimationFrame(function(){var e=b.find("img").map(function(a,b){return d.checkSrc(b.src)}),f=e.length;return 0===f?void c.call(d):void a.each(e,function(b,e){a("<img>").on("load.cbp error.cbp",function(){f--,0===f&&c.call(d)}).attr("src",e)})})},checkSrc:function(a){if(""===a)return null;var b=new Image;return b.src=a,b.complete&&b.naturalWidth!==d&&0!==b.naturalWidth?null:a},display:function(){var a=this;a.width=a.$obj.outerWidth(),a.storeData(a.blocks),a.triggerEvent("initStartRead"),a.triggerEvent("initStartWrite"),"slider"===a.options.layoutMode&&a.registerEvent("gridAdjust",function(){a.sliderMarkup()},!0),a.layoutAndAdjustment(),a.triggerEvent("initEndRead"),a.triggerEvent("initEndWrite"),a.$obj.addClass("cbp-ready"),a.runQueue("delayFrame",a.delayFrame)},delayFrame:function(){var a=this;requestAnimationFrame(function(){a.resizeEvent(),a.triggerEvent("initFinish"),a.isAnimating=!1,a.$obj.trigger("initComplete.cbp")})},resizeEvent:function(){var a,b=this;e.Private.initResizeEvent({instance:b,fn:function(){var b=this;b.triggerEvent("beforeResizeGrid"),a=b.$obj.outerWidth(),b.width!==a&&("alignCenter"===b.options.gridAdjustment&&(b.wrapper[0].style.maxWidth=""),b.width=a,b.layoutAndAdjustment(),"slider"===b.options.layoutMode&&b.updateSlider(),b.triggerEvent("resizeGrid")),b.triggerEvent("resizeWindow")}})},gridAdjust:function(){var b=this;"responsive"===b.options.gridAdjustment?b.responsiveLayout():(b.blocks.removeAttr("style"),b.blocks.each(function(c,d){var e=a(d).data("cbp"),f=d.getBoundingClientRect(),g=b.columnWidthTruncate(f.right-f.left),h=Math.round(f.bottom-f.top);e.height=h,e.heightAndGap=h+b.options.gapHorizontal,e.width=g,e.widthAndGap=g+b.options.gapVertical}),b.widthAvailable=b.width+b.options.gapVertical),b.triggerEvent("gridAdjust")},layoutAndAdjustment:function(){var a=this;a.gridAdjust(),a.layout()},layout:function(){var a=this;a.computeBlocks(a.filterConcat(a.defaultFilter)),"slider"===a.options.layoutMode?(a.sliderLayoutReset(),a.sliderLayout()):(a.mosaicLayoutReset(),a.mosaicLayout()),a.positionateItems(),a.resizeMainContainer()},computeFilter:function(a){var b=this;b.computeBlocks(a),b.mosaicLayoutReset(),b.mosaicLayout(),b.filterLayout()},filterLayout:function(){var b=this;b.blocksOff.addClass("cbp-item-off"),b.blocksOn.removeClass("cbp-item-off").each(function(b,c){var d=a(c).data("cbp");d.left=d.leftNew,d.top=d.topNew,c.style.left=d.left+"px",c.style.top=d.top+"px"}),b.resizeMainContainer(),b.filterFinish()},filterFinish:function(){var a=this;a.blocksAreSorted&&a.sortBlocks(a.blocks,"index"),a.isAnimating=!1,a.$obj.trigger("filterComplete.cbp"),a.triggerEvent("filterFinish")},computeBlocks:function(a){var b=this;b.blocksOnInitial=b.blocksOn,b.blocksOn=b.blocks.filter(a),b.blocksOff=b.blocks.not(a),b.triggerEvent("computeBlocksFinish",a)},responsiveLayout:function(){var b=this;b.cols=b[a.isArray(b.options.mediaQueries)?"getColumnsBreakpoints":"getColumnsAuto"](),b.columnWidth=b.columnWidthTruncate((b.width+b.options.gapVertical)/b.cols),b.widthAvailable=b.columnWidth*b.cols,"mosaic"===b.options.layoutMode&&b.getMosaicWidthReference(),b.blocks.each(function(c,d){var e,f=a(d).data("cbp"),g=1;"mosaic"===b.options.layoutMode&&(g=b.getColsMosaic(f.widthInitial)),e=b.columnWidth*g-b.options.gapVertical,d.style.width=e+"px",f.width=e,f.widthAndGap=e+b.options.gapVertical,d.style.height=""}),b.blocks.each(function(c,d){var e=a(d).data("cbp"),f=d.getBoundingClientRect(),g=Math.round(f.bottom-f.top);e.height=g,e.heightAndGap=g+b.options.gapHorizontal})},getMosaicWidthReference:function(){var b=this,c=[];b.blocks.each(function(b,d){var e=a(d).data("cbp");c.push(e.widthInitial)}),c.sort(function(a,b){return a-b}),b.mosaicWidthReference=c[0]?c[0]:b.columnWidth},getColsMosaic:function(a){var b=this;if(a===b.width)return b.cols;var c=a/b.mosaicWidthReference;return c=c%1>=.79?Math.ceil(c):Math.floor(c),Math.min(Math.max(c,1),b.cols)},getColumnsAuto:function(){var a=this;if(0===a.blocks.length)return 1;var b=a.blocks.first().data("cbp").widthInitial+a.options.gapVertical;return Math.max(Math.round(a.width/b),1)},getColumnsBreakpoints:function(){var b,c=this,e=c.width;return a.each(c.options.mediaQueries,function(a,c){return e>=c.width?(b=c.cols,!1):void 0}),b===d&&(b=c.options.mediaQueries[c.options.mediaQueries.length-1].cols),b},columnWidthTruncate:function(a){return Math.floor(a)},positionateItems:function(){var b,c=this;c.blocksOn.removeClass("cbp-item-off").each(function(c,d){b=a(d).data("cbp"),b.left=b.leftNew,b.top=b.topNew,d.style.left=b.left+"px",d.style.top=b.top+"px"}),c.blocksOff.addClass("cbp-item-off"),c.blocksAreSorted&&c.sortBlocks(c.blocks,"index")},resizeMainContainer:function(){var b,c=this,f=Math.max(c.freeSpaces.slice(-1)[0].topStart-c.options.gapHorizontal,0);"alignCenter"===c.options.gridAdjustment&&(b=0,c.blocksOn.each(function(c,d){var e=a(d).data("cbp"),f=e.left+e.width;f>b&&(b=f)}),c.wrapper[0].style.maxWidth=b+"px"),f!==c.height&&(c.obj.style.height=f+"px",c.height!==d&&(e.Private.modernBrowser?c.$obj.one(e.Private.transitionend,function(){c.$obj.trigger("pluginResize.cbp")}):c.$obj.trigger("pluginResize.cbp")),c.height=f,c.triggerEvent("resizeMainContainer"))},filterConcat:function(a){return a.replace(/\|/gi,"")},pushQueue:function(a,b){var c=this;c.queue[a]=c.queue[a]||[],c.queue[a].push(b)},runQueue:function(b,c){var d=this,e=d.queue[b]||[];a.when.apply(a,e).then(a.proxy(c,d))},clearQueue:function(a){var b=this;b.queue[a]=[]},registerEvent:function(a,b,c){var d=this;d.registeredEvents[a]||(d.registeredEvents[a]=[]),d.registeredEvents[a].push({func:b,oneTime:c||!1})},triggerEvent:function(a,b){var c,d,e=this;if(e.registeredEvents[a])for(c=0,d=e.registeredEvents[a].length;d>c;c++)e.registeredEvents[a][c].func.call(e,b),e.registeredEvents[a][c].oneTime&&(e.registeredEvents[a].splice(c,1),c--,d--)},addItems:function(b,c){var d=this;d.wrapInner(b,"cbp-item-wrapper"),b.addClass("cbp-item-loading").css({top:"100%",left:0}).appendTo(d.$ul),e.Private.modernBrowser?b.last().one(e.Private.animationend,function(){d.addItemsFinish(b,c)}):d.addItemsFinish(b,c),d.loadImages(b,function(){d.$obj.addClass("cbp-addItems"),d.storeData(b,d.blocks.length),a.merge(d.blocks,b),d.triggerEvent("addItemsToDOM",b),d.layoutAndAdjustment(),"slider"===d.options.layoutMode&&d.updateSlider(),d.elems&&e.Public.showCounter.call(d.obj,d.elems)})},addItemsFinish:function(b,c){var d=this;d.isAnimating=!1,d.$obj.removeClass("cbp-addItems"),b.removeClass("cbp-item-loading"),a.isFunction(c)&&c.call(d)}}),a.fn.cubeportfolio=function(a,b,c){return this.each(function(){if("object"==typeof a||!a)return e.Public.init.call(this,a,b);if(e.Public[a])return e.Public[a].call(this,b,c);throw new Error("Method "+a+" does not exist on jquery.cubeportfolio.js")})},e.Plugins={},a.fn.cubeportfolio.Constructor=e}(jQuery,window,document),function(a){"use strict";function b(b){var c=this;c.parent=b,c.filters=a(b.options.filters),c.filterData=[],c.filterFromUrl(),c.registerFilter()}var c=a.fn.cubeportfolio.Constructor;b.prototype.registerFilter=function(){var b=this,c=b.parent,d=c.defaultFilter.split("|");b.wrap=b.filters.find(".cbp-l-filters-dropdownWrap").on({"mouseover.cbp":function(){a(this).addClass("cbp-l-filters-dropdownWrap-open")},"mouseleave.cbp":function(){a(this).removeClass("cbp-l-filters-dropdownWrap-open")}}),b.filters.each(function(e,f){var g=a(f),h="*",i=g.find(".cbp-filter-item"),j={};g.hasClass("cbp-l-filters-dropdown")&&(j.wrap=g.find(".cbp-l-filters-dropdownWrap"),j.header=g.find(".cbp-l-filters-dropdownHeader"),j.headerText=j.header.text()),c.$obj.cubeportfolio("showCounter",i),a.each(d,function(a,b){return i.filter('[data-filter="'+b+'"]').length?(h=b,d.splice(a,1),!1):void 0}),a.data(f,"filterName",h),b.filterData.push(f),b.filtersCallback(j,i.filter('[data-filter="'+h+'"]')),i.on("click.cbp",function(){var d=a(this);if(!d.hasClass("cbp-filter-item-active")&&!c.isAnimating){b.filtersCallback(j,d),a.data(f,"filterName",d.data("filter"));var e=a.map(b.filterData,function(b){var c=a.data(b,"filterName");return""!==c&&"*"!==c?c:null});e.length<1&&(e=["*"]);var g=e.join("|");c.defaultFilter!==g&&c.$obj.cubeportfolio("filter",g)}})})},b.prototype.filtersCallback=function(b,c){a.isEmptyObject(b)||(b.wrap.trigger("mouseleave.cbp"),b.headerText?b.headerText="":b.header.text(c.text())),c.addClass("cbp-filter-item-active").siblings().removeClass("cbp-filter-item-active")},b.prototype.filterFromUrl=function(){var a=/#cbpf=(.*?)([#\?&]|$)/gi.exec(location.href);null!==a&&(this.parent.defaultFilter=decodeURIComponent(a[1]))},b.prototype.destroy=function(){var a=this;a.filters.find(".cbp-filter-item").off(".cbp"),a.wrap.off(".cbp")},c.Plugins.Filters=function(a){return""===a.options.filters?null:new b(a)}}(jQuery,window,document),function(a,b){"use strict";function c(b){var c=this;c.parent=b,c.loadMore=a(b.options.loadMore).find(".cbp-l-loadMore-link"),b.options.loadMoreAction.length&&c[b.options.loadMoreAction]()}var d=a.fn.cubeportfolio.Constructor;c.prototype.click=function(){var b=this,c=0;b.loadMore.on("click.cbp",function(d){var e=a(this);d.preventDefault(),b.parent.isAnimating||e.hasClass("cbp-l-loadMore-stop")||(e.addClass("cbp-l-loadMore-loading"),c++,a.ajax({url:b.loadMore.attr("href"),type:"GET",dataType:"HTML"}).done(function(d){var f,g;f=a(d).filter(function(){return a(this).is("div.cbp-loadMore-block"+c)}),b.parent.$obj.cubeportfolio("appendItems",f.children(),function(){e.removeClass("cbp-l-loadMore-loading"),g=a(d).filter(function(){return a(this).is("div.cbp-loadMore-block"+(c+1))}),0===g.length&&e.addClass("cbp-l-loadMore-stop")})}).fail(function(){}))})},c.prototype.auto=function(){var c=this;c.parent.$obj.on("initComplete.cbp",function(){Object.create({init:function(){var d=this;d.isActive=!1,d.numberOfClicks=0,c.loadMore.addClass("cbp-l-loadMore-loading"),d.window=a(b),d.addEvents(),d.getNewItems()},addEvents:function(){var a,b=this;c.loadMore.on("click.cbp",function(a){a.preventDefault()}),b.window.on("scroll.loadMoreObject",function(){clearTimeout(a),a=setTimeout(function(){c.parent.isAnimating||b.getNewItems()},80)}),c.parent.$obj.on("filterComplete.cbp",function(){b.getNewItems()})},getNewItems:function(){var b,d,e=this;e.isActive||c.loadMore.hasClass("cbp-l-loadMore-stop")||(b=c.loadMore.offset().top,d=e.window.scrollTop()+e.window.height(),b>d||(e.isActive=!0,e.numberOfClicks++,a.ajax({url:c.loadMore.attr("href"),type:"GET",dataType:"HTML",cache:!0}).done(function(b){var d,f;d=a(b).filter(function(){return a(this).is("div.cbp-loadMore-block"+e.numberOfClicks)}),c.parent.$obj.cubeportfolio("appendItems",d.html(),function(){f=a(b).filter(function(){return a(this).is("div.cbp-loadMore-block"+(e.numberOfClicks+1))}),0===f.length?(c.loadMore.addClass("cbp-l-loadMore-stop"),e.window.off("scroll.loadMoreObject"),c.parent.$obj.off("filterComplete.cbp")):(e.isActive=!1,e.window.trigger("scroll.loadMoreObject"))})}).fail(function(){e.isActive=!1})))}}).init()})},c.prototype.destroy=function(){var c=this;c.loadMore.off(".cbp"),a(b).off("scroll.loadMoreObject")},d.Plugins.LoadMore=function(a){return""===a.options.loadMore?null:new c(a)}}(jQuery,window,document),jQuery.fn.cubeportfolio.options={filters:"",loadMore:"",loadMoreAction:"click",search:"",layoutMode:"grid",sortToPreventGaps:!1,drag:!0,auto:!1,autoTimeout:5e3,autoPauseOnHover:!0,showNavigation:!0,showPagination:!0,rewindNav:!0,scrollByPage:!1,defaultFilter:"*",filterDeeplinking:!1,animationType:"fadeOut",gridAdjustment:"responsive",mediaQueries:!1,gapHorizontal:10,gapVertical:10,caption:"pushTop",displayType:"lazyLoading",displayTypeSpeed:400,lightboxDelegate:".cbp-lightbox",lightboxGallery:!0,lightboxTitleSrc:"data-title",lightboxCounter:'<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',singlePageDelegate:".cbp-singlePage",singlePageDeeplinking:!0,singlePageStickyNavigation:!0,singlePageCounter:'<div class="cbp-popup-singlePage-counter">{{current}} of {{total}}</div>',singlePageAnimation:"left",singlePageCallback:function(){},singlePageInlineDelegate:".cbp-singlePageInline",singlePageInlinePosition:"top",singlePageInlineInFocus:!0,singlePageInlineCallback:function(){}},function(a,b,c){"use strict";function d(a){var b=this;b.parent=a,a.options.lightboxShowCounter===!1&&(a.options.lightboxCounter=""),a.options.singlePageShowCounter===!1&&(a.options.singlePageCounter=""),a.registerEvent("initStartRead",function(){b.run()},!0)}var e=a.fn.cubeportfolio.Constructor,f={init:function(b,d){var e,f=this;if(f.cubeportfolio=b,f.type=d,f.isOpen=!1,f.options=f.cubeportfolio.options,"lightbox"===d&&f.cubeportfolio.registerEvent("resizeWindow",function(){f.resizeImage()}),"singlePageInline"===d)return f.startInline=-1,f.height=0,f.createMarkupSinglePageInline(),void f.cubeportfolio.registerEvent("resizeGrid",function(){f.isOpen&&f.close()});if(f.createMarkup(),"singlePage"===d&&(f.cubeportfolio.registerEvent("resizeWindow",function(){if(f.options.singlePageStickyNavigation){var a=f.wrap[0].clientWidth;a>0&&(f.navigationWrap.width(a),f.navigation.width(a))}}),f.options.singlePageDeeplinking)){f.url=location.href,"#"===f.url.slice(-1)&&(f.url=f.url.slice(0,-1));var g=f.url.split("#cbp="),h=g.shift();if(a.each(g,function(b,c){return f.cubeportfolio.blocksOn.each(function(b,d){var g=a(d).find(f.options.singlePageDelegate+'[href="'+c+'"]');return g.length?(e=g,!1):void 0}),e?!1:void 0}),e){f.url=h;var i=e,j=i.attr("data-cbp-singlePage"),k=[];j?k=i.closest(a(".cbp-item")).find('[data-cbp-singlePage="'+j+'"]'):f.cubeportfolio.blocksOn.each(function(b,c){var d=a(c);d.not(".cbp-item-off")&&d.find(f.options.singlePageDelegate).each(function(b,c){a(c).attr("data-cbp-singlePage")||k.push(c)})}),f.openSinglePage(k,e[0])}else if(g.length){var l=c.createElement("a");l.setAttribute("href",g[0]),f.openSinglePage([l],l)}}},createMarkup:function(){var b=this,d="";"singlePage"===b.type&&"left"!==b.options.singlePageAnimation&&(d=" cbp-popup-singlePage-"+b.options.singlePageAnimation),b.wrap=a("<div/>",{"class":"cbp-popup-wrap cbp-popup-"+b.type+d,"data-action":"lightbox"===b.type?"close":""}).on("click.cbp",function(c){if(!b.stopEvents){var d=a(c.target).attr("data-action");b[d]&&(b[d](),c.preventDefault())}}),b.content=a("<div/>",{"class":"cbp-popup-content"}).appendTo(b.wrap),a("<div/>",{"class":"cbp-popup-loadingBox"}).appendTo(b.wrap),"ie8"===e.Private.browser&&(b.bg=a("<div/>",{"class":"cbp-popup-ie8bg","data-action":"lightbox"===b.type?"close":""}).appendTo(b.wrap)),b.navigationWrap=a("<div/>",{"class":"cbp-popup-navigation-wrap"}).appendTo(b.wrap),b.navigation=a("<div/>",{"class":"cbp-popup-navigation"}).appendTo(b.navigationWrap),b.closeButton=a("<div/>",{"class":"cbp-popup-close",title:"Close (Esc arrow key)","data-action":"close"}).appendTo(b.navigation),b.nextButton=a("<div/>",{"class":"cbp-popup-next",title:"Next (Right arrow key)","data-action":"next"}).appendTo(b.navigation),b.prevButton=a("<div/>",{"class":"cbp-popup-prev",title:"Previous (Left arrow key)","data-action":"prev"}).appendTo(b.navigation),"singlePage"===b.type&&(b.options.singlePageCounter&&(b.counter=a(b.options.singlePageCounter).appendTo(b.navigation),b.counter.text("")),b.content.on("click.cbp",b.options.singlePageDelegate,function(a){a.preventDefault();var c,d=b.dataArray.length,e=this.getAttribute("href");for(c=0;d>c&&b.dataArray[c].url!==e;c++);b.singlePageJumpTo(c-b.current)}),b.wrap.on("mousewheel.cbp DOMMouseScroll.cbp",function(a){a.stopImmediatePropagation()})),a(c).on("keydown.cbp",function(a){b.isOpen&&(b.stopEvents||(37===a.keyCode?b.prev():39===a.keyCode?b.next():27===a.keyCode&&b.close()))})},createMarkupSinglePageInline:function(){var b=this;b.wrap=a("<div/>",{"class":"cbp-popup-singlePageInline"}).on("click.cbp",function(c){if(!b.stopEvents){var d=a(c.target).attr("data-action");d&&b[d]&&(b[d](),c.preventDefault())}}),b.content=a("<div/>",{"class":"cbp-popup-content"}).appendTo(b.wrap),b.navigation=a("<div/>",{"class":"cbp-popup-navigation"}).appendTo(b.wrap),b.closeButton=a("<div/>",{"class":"cbp-popup-close",title:"Close (Esc arrow key)","data-action":"close"}).appendTo(b.navigation)},destroy:function(){var b=this,d=a("body");a(c).off("keydown.cbp"),d.off("click.cbp",b.options.lightboxDelegate),d.off("click.cbp",b.options.singlePageDelegate),b.content.off("click.cbp",b.options.singlePageDelegate),b.cubeportfolio.$obj.off("click.cbp",b.options.singlePageInlineDelegate),b.cubeportfolio.$obj.off("click.cbp",b.options.lightboxDelegate),b.cubeportfolio.$obj.off("click.cbp",b.options.singlePageDelegate),b.cubeportfolio.$obj.removeClass("cbp-popup-isOpening"),b.cubeportfolio.$obj.find(".cbp-item").removeClass("cbp-singlePageInline-active"),b.wrap.remove()},openLightbox:function(d,e){var f,g,h=this,i=0,j=[];if(!h.isOpen){if(h.isOpen=!0,h.stopEvents=!1,h.dataArray=[],h.current=null,f=e.getAttribute("href"),null===f)throw new Error("HEI! Your clicked element doesn't have a href attribute.");a.each(d,function(b,c){var d,e=c.getAttribute("href"),g=e,k="isImage";if(-1===a.inArray(e,j)){if(f===e)h.current=i;else if(!h.options.lightboxGallery)return;/youtube/i.test(e)?(d=e.substring(e.lastIndexOf("v=")+2),/autoplay=/i.test(d)||(d+="&autoplay=1"),d=d.replace(/\?|&/,"?"),g="//www.youtube.com/embed/"+d,k="isYoutube"):/vimeo\.com/i.test(e)?(d=e.substring(e.lastIndexOf("/")+1),/autoplay=/i.test(d)||(d+="&autoplay=1"),d=d.replace(/\?|&/,"?"),g="//player.vimeo.com/video/"+d,k="isVimeo"):/www\.ted\.com/i.test(e)?(g="http://embed.ted.com/talks/"+e.substring(e.lastIndexOf("/")+1)+".html",k="isTed"):/soundcloud\.com/i.test(e)?(g=e,k="isSoundCloud"):/(\.mp4)|(\.ogg)|(\.ogv)|(\.webm)/i.test(e)?(g=e.split(-1!==e.indexOf("|")?"|":"%7C"),k="isSelfHostedVideo"):/\.mp3$/i.test(e)&&(g=e,k="isSelfHostedAudio"),h.dataArray.push({src:g,title:c.getAttribute(h.options.lightboxTitleSrc),type:k}),i++}j.push(e)}),h.counterTotal=h.dataArray.length,1===h.counterTotal?(h.nextButton.hide(),h.prevButton.hide(),h.dataActionImg=""):(h.nextButton.show(),h.prevButton.show(),h.dataActionImg='data-action="next"'),h.wrap.appendTo(c.body),h.scrollTop=a(b).scrollTop(),h.originalStyle=a("html").attr("style"),a("html").css({overflow:"hidden",paddingRight:b.innerWidth-a(c).width()}),h.wrap.show(),g=h.dataArray[h.current],h[g.type](g)}},openSinglePage:function(d,f){var g,h=this,i=0,j=[];if(!h.isOpen){if(h.cubeportfolio.singlePageInline&&h.cubeportfolio.singlePageInline.isOpen&&h.cubeportfolio.singlePageInline.close(),h.isOpen=!0,h.stopEvents=!1,h.dataArray=[],h.current=null,g=f.getAttribute("href"),null===g)throw new Error("HEI! Your clicked element doesn't have a href attribute.");if(a.each(d,function(b,c){var d=c.getAttribute("href");-1===a.inArray(d,j)&&(g===d&&(h.current=i),h.dataArray.push({url:d,element:c}),i++),j.push(d)}),h.counterTotal=h.dataArray.length,1===h.counterTotal?(h.nextButton.hide(),h.prevButton.hide()):(h.nextButton.show(),h.prevButton.show()),h.wrap.appendTo(c.body),h.scrollTop=a(b).scrollTop(),a("html").css({overflow:"hidden",paddingRight:b.innerWidth-a(c).width()}),h.wrap.scrollTop(0),h.wrap.show(),h.finishOpen=2,h.navigationMobile=a(),h.wrap.one(e.Private.transitionend,function(){var b;h.options.singlePageStickyNavigation&&(h.wrap.addClass("cbp-popup-singlePage-sticky"),b=h.wrap[0].clientWidth,h.navigationWrap.width(b),("android"===e.Private.browser||"ios"===e.Private.browser)&&(h.navigationMobile=a("<div/>",{"class":"cbp-popup-singlePage cbp-popup-singlePage-sticky",id:h.wrap.attr("id")}).on("click.cbp",function(b){if(!h.stopEvents){var c=a(b.target).attr("data-action");h[c]&&(h[c](),b.preventDefault())}}),h.navigationMobile.appendTo(c.body).append(h.navigationWrap))),h.finishOpen--,h.finishOpen<=0&&h.updateSinglePageIsOpen.call(h)}),"ie8"===e.Private.browser||"ie9"===e.Private.browser){if(h.options.singlePageStickyNavigation){var k=h.wrap[0].clientWidth;h.navigationWrap.width(k),setTimeout(function(){h.wrap.addClass("cbp-popup-singlePage-sticky")},1e3)}h.finishOpen--}h.wrap.addClass("cbp-popup-loading"),h.wrap.offset(),h.wrap.addClass("cbp-popup-singlePage-open"),h.options.singlePageDeeplinking&&(h.url=h.url.split("#cbp=")[0],location.href=h.url+"#cbp="+h.dataArray[h.current].url),a.isFunction(h.options.singlePageCallback)&&h.options.singlePageCallback.call(h,h.dataArray[h.current].url,h.dataArray[h.current].element)}},openSinglePageInline:function(c,d,e){var f,g,h,i,j=this;if(e=e||!1,j.fromOpen=e,j.storeBlocks=c,j.storeCurrentBlock=d,j.isOpen)return g=a(d).closest(".cbp-item").index(),void(j.dataArray[j.current].url!==d.getAttribute("href")||j.current!==g?j.cubeportfolio.singlePageInline.close("open",{blocks:c,currentBlock:d,fromOpen:!0}):j.close());if(j.isOpen=!0,j.stopEvents=!1,j.dataArray=[],j.current=null,f=d.getAttribute("href"),null===f)throw new Error("HEI! Your clicked element doesn't have a href attribute.");if(h=a(d).closest(".cbp-item")[0],c.each(function(a,b){h===b&&(j.current=a)}),j.dataArray[j.current]={url:f,element:d},i=a(j.dataArray[j.current].element).parents(".cbp-item").addClass("cbp-singlePageInline-active"),j.counterTotal=c.length,j.wrap.insertBefore(j.cubeportfolio.wrapper),"top"===j.options.singlePageInlinePosition?(j.startInline=0,j.top=0,j.firstRow=!0,j.lastRow=!1):"bottom"===j.options.singlePageInlinePosition?(j.startInline=j.counterTotal,j.top=j.cubeportfolio.height,j.firstRow=!1,j.lastRow=!0):"above"===j.options.singlePageInlinePosition?(j.startInline=j.cubeportfolio.cols*Math.floor(j.current/j.cubeportfolio.cols),j.top=a(c[j.current]).data("cbp").top,0===j.startInline?j.firstRow=!0:(j.top-=j.options.gapHorizontal,j.firstRow=!1),j.lastRow=!1):(j.top=a(c[j.current]).data("cbp").top+a(c[j.current]).data("cbp").height,j.startInline=Math.min(j.cubeportfolio.cols*(Math.floor(j.current/j.cubeportfolio.cols)+1),j.counterTotal),j.firstRow=!1,j.lastRow=j.startInline===j.counterTotal?!0:!1),j.wrap[0].style.height=j.wrap.outerHeight(!0)+"px",j.deferredInline=a.Deferred(),j.options.singlePageInlineInFocus){j.scrollTop=a(b).scrollTop();var k=j.cubeportfolio.$obj.offset().top+j.top-100;j.scrollTop!==k?a("html,body").animate({scrollTop:k},350).promise().then(function(){j.resizeSinglePageInline(),j.deferredInline.resolve()}):(j.resizeSinglePageInline(),j.deferredInline.resolve())}else j.resizeSinglePageInline(),j.deferredInline.resolve();j.cubeportfolio.$obj.addClass("cbp-popup-singlePageInline-open"),j.wrap.css({top:j.top}),a.isFunction(j.options.singlePageInlineCallback)&&j.options.singlePageInlineCallback.call(j,j.dataArray[j.current].url,j.dataArray[j.current].element)},resizeSinglePageInline:function(){var a=this;a.height=a.firstRow||a.lastRow?a.wrap.outerHeight(!0):a.wrap.outerHeight(!0)-a.options.gapHorizontal,a.storeBlocks.each(function(b,c){b<a.startInline?e.Private.modernBrowser?c.style[e.Private.transform]="":c.style.marginTop="":e.Private.modernBrowser?c.style[e.Private.transform]="translate3d(0px, "+a.height+"px, 0)":c.style.marginTop=a.height+"px"}),a.cubeportfolio.obj.style.height=a.cubeportfolio.height+a.height+"px"},revertResizeSinglePageInline:function(){var b=this;b.deferredInline=a.Deferred(),b.storeBlocks.each(function(a,b){e.Private.modernBrowser?b.style[e.Private.transform]="":b.style.marginTop=""}),b.cubeportfolio.obj.style.height=b.cubeportfolio.height+"px"},appendScriptsToWrap:function(a){var b=this,d=0,e=function(f){var g=c.createElement("script"),h=f.src;g.type="text/javascript",g.readyState?g.onreadystatechange=function(){("loaded"==g.readyState||"complete"==g.readyState)&&(g.onreadystatechange=null,d++,a[d]&&e(a[d]))}:g.onload=function(){d++,a[d]&&e(a[d])},h?g.src=h:g.text=f.text,b.content[0].appendChild(g)};e(a[0])},updateSinglePage:function(b,c,d){var e,f=this;f.content.addClass("cbp-popup-content").removeClass("cbp-popup-content-basic"),d===!1&&f.content.removeClass("cbp-popup-content").addClass("cbp-popup-content-basic"),f.counter&&(e=a(f.getCounterMarkup(f.options.singlePageCounter,f.current+1,f.counterTotal)),f.counter.text(e.text())),f.content.html(b),c&&f.appendScriptsToWrap(c),f.cubeportfolio.$obj.trigger("updateSinglePageStart.cbp"),f.finishOpen--,f.finishOpen<=0&&f.updateSinglePageIsOpen.call(f)},updateSinglePageIsOpen:function(){var b,c=this;c.wrap.addClass("cbp-popup-ready"),c.wrap.removeClass("cbp-popup-loading"),b=c.content.find(".cbp-slider"),b?(b.find(".cbp-slider-item").addClass("cbp-item"),c.slider=b.cubeportfolio({layoutMode:"slider",mediaQueries:[{width:1,cols:1}],gapHorizontal:0,gapVertical:0,caption:"",coverRatio:""})):c.slider=null,("android"===e.Private.browser||"ios"===e.Private.browser)&&a("html").css({position:"fixed"}),c.cubeportfolio.$obj.trigger("updateSinglePageComplete.cbp")},updateSinglePageInline:function(a,b){var c=this;c.content.html(a),b&&c.appendScriptsToWrap(b),c.cubeportfolio.$obj.trigger("updateSinglePageInlineStart.cbp"),c.singlePageInlineIsOpen.call(c)},singlePageInlineIsOpen:function(){function a(){b.wrap.addClass("cbp-popup-singlePageInline-ready"),b.wrap[0].style.height="",b.resizeSinglePageInline(),b.cubeportfolio.$obj.trigger("updateSinglePageInlineComplete.cbp")}var b=this;b.cubeportfolio.loadImages(b.wrap,function(){var c=b.content.find(".cbp-slider");c.length?(c.find(".cbp-slider-item").addClass("cbp-item"),c.one("initComplete.cbp",function(){b.deferredInline.done(a)}),c.on("pluginResize.cbp",function(){b.deferredInline.done(a)}),b.slider=c.cubeportfolio({layoutMode:"slider",displayType:"default",mediaQueries:[{width:1,cols:1}],gapHorizontal:0,gapVertical:0,caption:"",coverRatio:""})):(b.slider=null,b.deferredInline.done(a))})},isImage:function(b){{var c=this;new Image}c.tooggleLoading(!0),c.cubeportfolio.loadImages(a('<div><img src="'+b.src+'"></div>'),function(){c.updateImagesMarkup(b.src,b.title,c.getCounterMarkup(c.options.lightboxCounter,c.current+1,c.counterTotal)),c.tooggleLoading(!1)})},isVimeo:function(a){var b=this;b.updateVideoMarkup(a.src,a.title,b.getCounterMarkup(b.options.lightboxCounter,b.current+1,b.counterTotal))},isYoutube:function(a){var b=this;b.updateVideoMarkup(a.src,a.title,b.getCounterMarkup(b.options.lightboxCounter,b.current+1,b.counterTotal))},isTed:function(a){var b=this;b.updateVideoMarkup(a.src,a.title,b.getCounterMarkup(b.options.lightboxCounter,b.current+1,b.counterTotal))},isSoundCloud:function(a){var b=this;b.updateVideoMarkup(a.src,a.title,b.getCounterMarkup(b.options.lightboxCounter,b.current+1,b.counterTotal))},isSelfHostedVideo:function(a){var b=this;b.updateSelfHostedVideo(a.src,a.title,b.getCounterMarkup(b.options.lightboxCounter,b.current+1,b.counterTotal))},isSelfHostedAudio:function(a){var b=this;b.updateSelfHostedAudio(a.src,a.title,b.getCounterMarkup(b.options.lightboxCounter,b.current+1,b.counterTotal))},getCounterMarkup:function(a,b,c){if(!a.length)return"";var d={current:b,total:c};return a.replace(/\{\{current}}|\{\{total}}/gi,function(a){return d[a.slice(2,-2)]})},updateSelfHostedVideo:function(a,b,c){var d,e=this;e.wrap.addClass("cbp-popup-lightbox-isIframe");var f='<div class="cbp-popup-lightbox-iframe"><video controls="controls" height="auto" style="width: 100%">';for(d=0;d<a.length;d++)/(\.mp4)/i.test(a[d])?f+='<source src="'+a[d]+'" type="video/mp4">':/(\.ogg)|(\.ogv)/i.test(a[d])?f+='<source src="'+a[d]+'" type="video/ogg">':/(\.webm)/i.test(a[d])&&(f+='<source src="'+a[d]+'" type="video/webm">');f+='Your browser does not support the video tag.</video><div class="cbp-popup-lightbox-bottom">'+(b?'<div class="cbp-popup-lightbox-title">'+b+"</div>":"")+c+"</div></div>",e.content.html(f),e.wrap.addClass("cbp-popup-ready"),e.preloadNearbyImages()},updateSelfHostedAudio:function(a,b,c){var d=this;d.wrap.addClass("cbp-popup-lightbox-isIframe");var e='<div class="cbp-popup-lightbox-iframe"><audio controls="controls" height="auto" style="width: 100%"><source src="'+a+'" type="audio/mpeg">Your browser does not support the audio tag.</audio><div class="cbp-popup-lightbox-bottom">'+(b?'<div class="cbp-popup-lightbox-title">'+b+"</div>":"")+c+"</div></div>";d.content.html(e),d.wrap.addClass("cbp-popup-ready"),d.preloadNearbyImages()},updateVideoMarkup:function(a,b,c){var d=this;d.wrap.addClass("cbp-popup-lightbox-isIframe");var e='<div class="cbp-popup-lightbox-iframe"><iframe src="'+a+'" frameborder="0" allowfullscreen scrolling="no"></iframe><div class="cbp-popup-lightbox-bottom">'+(b?'<div class="cbp-popup-lightbox-title">'+b+"</div>":"")+c+"</div></div>";d.content.html(e),d.wrap.addClass("cbp-popup-ready"),d.preloadNearbyImages()},updateImagesMarkup:function(a,b,c){var d=this;d.wrap.removeClass("cbp-popup-lightbox-isIframe");var e='<div class="cbp-popup-lightbox-figure"><img src="'+a+'" class="cbp-popup-lightbox-img" '+d.dataActionImg+' /><div class="cbp-popup-lightbox-bottom">'+(b?'<div class="cbp-popup-lightbox-title">'+b+"</div>":"")+c+"</div></div>";d.content.html(e),d.wrap.addClass("cbp-popup-ready"),d.resizeImage(),d.preloadNearbyImages()},next:function(){var a=this;a[a.type+"JumpTo"](1)},prev:function(){var a=this;a[a.type+"JumpTo"](-1)},lightboxJumpTo:function(a){var b,c=this;c.current=c.getIndex(c.current+a),b=c.dataArray[c.current],c[b.type](b)},singlePageJumpTo:function(b){var c=this;c.current=c.getIndex(c.current+b),a.isFunction(c.options.singlePageCallback)&&(c.resetWrap(),c.wrap.scrollTop(0),c.wrap.addClass("cbp-popup-loading"),c.options.singlePageCallback.call(c,c.dataArray[c.current].url,c.dataArray[c.current].element),c.options.singlePageDeeplinking&&(location.href=c.url+"#cbp="+c.dataArray[c.current].url))},resetWrap:function(){var a=this;"singlePage"===a.type&&a.options.singlePageDeeplinking&&(location.href=a.url+"#")},getIndex:function(a){var b=this;return a%=b.counterTotal,0>a&&(a=b.counterTotal+a),a},close:function(c,d){function f(){h.content.html(""),h.wrap.detach(),h.cubeportfolio.$obj.removeClass("cbp-popup-singlePageInline-open cbp-popup-singlePageInline-close"),"promise"===c&&a.isFunction(d.callback)&&d.callback.call(h.cubeportfolio)}function g(){h.options.singlePageInlineInFocus&&"promise"!==c?a("html,body").animate({scrollTop:h.scrollTop},350).promise().then(function(){f()}):f()}var h=this;h.isOpen=!1,"singlePageInline"===h.type?"open"===c?(h.wrap.removeClass("cbp-popup-singlePageInline-ready"),a(h.dataArray[h.current].element).closest(".cbp-item").removeClass("cbp-singlePageInline-active"),h.openSinglePageInline(d.blocks,d.currentBlock,d.fromOpen)):(h.height=0,h.revertResizeSinglePageInline(),h.wrap.removeClass("cbp-popup-singlePageInline-ready"),h.cubeportfolio.$obj.addClass("cbp-popup-singlePageInline-close"),h.startInline=-1,h.cubeportfolio.$obj.find(".cbp-item").removeClass("cbp-singlePageInline-active"),e.Private.modernBrowser?h.wrap.one(e.Private.transitionend,function(){g()}):g()):"singlePage"===h.type?(h.resetWrap(),h.wrap.removeClass("cbp-popup-ready"),("android"===e.Private.browser||"ios"===e.Private.browser)&&(a("html").css({position:""}),h.navigationWrap.appendTo(h.wrap),h.navigationMobile.remove()),a(b).scrollTop(h.scrollTop),setTimeout(function(){h.stopScroll=!0,h.navigationWrap.css({top:h.wrap.scrollTop()}),h.wrap.removeClass("cbp-popup-singlePage-open cbp-popup-singlePage-sticky"),("ie8"===e.Private.browser||"ie9"===e.Private.browser)&&(h.content.html(""),h.wrap.detach(),a("html").css({overflow:"",paddingRight:"",position:""}),h.navigationWrap.removeAttr("style"))},0),h.wrap.one(e.Private.transitionend,function(){h.content.html(""),h.wrap.detach(),a("html").css({overflow:"",paddingRight:"",position:""}),h.navigationWrap.removeAttr("style")})):(h.originalStyle?a("html").attr("style",h.originalStyle):a("html").css({overflow:"",paddingRight:""}),a(b).scrollTop(h.scrollTop),h.content.html(""),h.wrap.detach())},tooggleLoading:function(a){var b=this;b.stopEvents=a,b.wrap[a?"addClass":"removeClass"]("cbp-popup-loading")},resizeImage:function(){if(this.isOpen){var c=a(b).height(),d=this.content.find("img"),e=parseInt(d.css("margin-top"),10)+parseInt(d.css("margin-bottom"),10);d.css("max-height",c-e+"px")}},preloadNearbyImages:function(){var a=[],b=this;a.push(b.getIndex(b.current+1)),a.push(b.getIndex(b.current+2)),a.push(b.getIndex(b.current+3)),a.push(b.getIndex(b.current-1)),a.push(b.getIndex(b.current-2)),a.push(b.getIndex(b.current-3));for(var c=a.length-1;c>=0;c--)"isImage"===b.dataArray[a[c]].type&&b.cubeportfolio.checkSrc(b.dataArray[a[c]].src)}},g=!1,h=!1;d.prototype.run=function(){var b=this,d=b.parent,e=a(c.body);d.lightbox=null,d.options.lightboxDelegate&&!g&&(g=!0,d.lightbox=Object.create(f),d.lightbox.init(d,"lightbox"),e.on("click.cbp",d.options.lightboxDelegate,function(c){c.preventDefault();var e=a(this),f=e.attr("data-cbp-lightbox"),g=b.detectScope(e),h=g.data("cubeportfolio"),i=[];h?h.blocksOn.each(function(b,c){var e=a(c);e.not(".cbp-item-off")&&e.find(d.options.lightboxDelegate).each(function(b,c){f?a(c).attr("data-cbp-lightbox")===f&&i.push(c):i.push(c)})}):i=g.find(f?d.options.lightboxDelegate+"[data-cbp-lightbox="+f+"]":d.options.lightboxDelegate),d.lightbox.openLightbox(i,e[0])})),d.singlePage=null,d.options.singlePageDelegate&&!h&&(h=!0,d.singlePage=Object.create(f),d.singlePage.init(d,"singlePage"),e.on("click.cbp",d.options.singlePageDelegate,function(c){c.preventDefault();var e=a(this),f=e.attr("data-cbp-singlePage"),g=b.detectScope(e),h=g.data("cubeportfolio"),i=[];h?h.blocksOn.each(function(b,c){var e=a(c);e.not(".cbp-item-off")&&e.find(d.options.singlePageDelegate).each(function(b,c){f?a(c).attr("data-cbp-singlePage")===f&&i.push(c):i.push(c)})}):i=g.find(f?d.options.singlePageDelegate+"[data-cbp-singlePage="+f+"]":d.options.singlePageDelegate),d.singlePage.openSinglePage(i,e[0])})),d.singlePageInline=null,d.options.singlePageDelegate&&(d.singlePageInline=Object.create(f),d.singlePageInline.init(d,"singlePageInline"),d.$obj.on("click.cbp",d.options.singlePageInlineDelegate,function(a){a.preventDefault(),d.singlePageInline.openSinglePageInline(d.blocksOn,this)}))},d.prototype.detectScope=function(b){var d,e,f;return d=b.closest(".cbp-popup-singlePageInline"),d.length?(f=b.closest(".cbp",d[0]),f.length?f:d):(e=b.closest(".cbp-popup-singlePage"),e.length?(f=b.closest(".cbp",e[0]),f.length?f:e):(f=b.closest(".cbp"),f.length?f:a(c.body)))},d.prototype.destroy=function(){var b=this.parent;a(c.body).off("click.cbp"),g=!1,h=!1,b.lightbox&&b.lightbox.destroy(),b.singlePage&&b.singlePage.destroy(),b.singlePageInline&&b.singlePageInline.destroy()},e.Plugins.PopUp=function(a){return new d(a)}}(jQuery,window,document),function(a,b,c,d){"use strict";var e=a.fn.cubeportfolio.Constructor;e.Private={resizeEventArray:[],initResizeEvent:function(a){var b=e.Private;0===b.resizeEventArray.length&&b.resizeEvent(),b.resizeEventArray.push(a)},destroyResizeEvent:function(c){var d=e.Private,f=a.map(d.resizeEventArray,function(a){return a.instance!==c?a:void 0});d.resizeEventArray=f,0===d.resizeEventArray.length&&a(b).off("resize.cbp")},resizeEvent:function(){var c,d=e.Private;a(b).on("resize.cbp",function(){clearTimeout(c),c=setTimeout(function(){b.innerHeight!=screen.height&&a.each(d.resizeEventArray,function(a,b){b.fn.call(b.instance)})},50)})},checkInstance:function(b){var c=a.data(this,"cubeportfolio");if(!c)throw new Error("cubeportfolio is not initialized. Initialize it before calling "+b+" method!");return c.triggerEvent("publicMethod"),c},browserInfo:function(){var a,c,f,g=e.Private,h=navigator.appVersion;g.browser=-1!==h.indexOf("MSIE 8.")?"ie8":-1!==h.indexOf("MSIE 9.")?"ie9":-1!==h.indexOf("MSIE 10.")?"ie10":b.ActiveXObject||"ActiveXObject"in b?"ie11":/android/gi.test(h)?"android":/iphone|ipad|ipod/gi.test(h)?"ios":/chrome/gi.test(h)?"chrome":"",f=g.styleSupport("perspective"),typeof f!==d&&(a=g.styleSupport("transition"),g.transitionend={WebkitTransition:"webkitTransitionEnd",transition:"transitionend"}[a],c=g.styleSupport("animation"),g.animationend={WebkitAnimation:"webkitAnimationEnd",animation:"animationend"}[c],g.animationDuration={WebkitAnimation:"webkitAnimationDuration",animation:"animationDuration"}[c],g.animationDelay={WebkitAnimation:"webkitAnimationDelay",animation:"animationDelay"}[c],g.transform=g.styleSupport("transform"),a&&c&&g.transform&&(g.modernBrowser=!0))},styleSupport:function(a){var b,d="Webkit"+a.charAt(0).toUpperCase()+a.slice(1),e=c.createElement("div");return a in e.style?b=a:d in e.style&&(b=d),e=null,b}},e.Private.browserInfo()}(jQuery,window,document),function(a,b,c,d){"use strict";var e=a.fn.cubeportfolio.Constructor;e.Public={init:function(a,b){new e(this,a,b)},destroy:function(b){var c=e.Private.checkInstance.call(this,"destroy");c.triggerEvent("beforeDestroy"),a.removeData(this,"cubeportfolio"),c.blocks.removeData("cbp"),c.$obj.removeClass("cbp-ready").removeAttr("style"),c.$ul.removeClass("cbp-wrapper"),e.Private.destroyResizeEvent(c),c.$obj.off(".cbp"),c.blocks.removeClass("cbp-item-off").removeAttr("style"),c.blocks.find(".cbp-item-wrapper").children().unwrap(),c.options.caption&&c.$obj.removeClass("cbp-caption-active cbp-caption-"+c.options.caption),c.destroySlider(),c.$ul.unwrap(),c.addedWrapp&&c.blocks.unwrap(),a.each(c.plugins,function(a,b){"function"==typeof b.destroy&&b.destroy()}),a.isFunction(b)&&b.call(c),c.triggerEvent("afterDestroy")},filter:function(b,c){var f,g=e.Private.checkInstance.call(this,"filter");if(!g.isAnimating){if(g.isAnimating=!0,a.isFunction(c)&&g.registerEvent("filterFinish",c,!0),a.isFunction(b)){if(f=b.call(g,g.blocks),f===d)throw new Error("When you call cubeportfolio API `filter` method with a param of type function you must return the blocks that will be visible.")}else{if(g.options.filterDeeplinking){var h=location.href.replace(/#cbpf=(.*?)([#\?&]|$)/gi,"");location.href=h+"#cbpf="+encodeURIComponent(b),g.singlePage&&g.singlePage.url&&(g.singlePage.url=location.href)}g.defaultFilter=b,f=g.filterConcat(g.defaultFilter)}g.singlePageInline&&g.singlePageInline.isOpen?g.singlePageInline.close("promise",{callback:function(){g.computeFilter(f)}}):g.computeFilter(f)}},showCounter:function(b,c){var d=e.Private.checkInstance.call(this,"showCounter");d.elems=b,a.each(b,function(){var b,c=a(this),e=c.data("filter");b=d.blocks.filter(e).length,c.find(".cbp-filter-counter").text(b)}),a.isFunction(c)&&c.call(d)},appendItems:function(b,c){var d=e.Private.checkInstance.call(this,"appendItems"),f=a(b).filter(".cbp-item");return d.isAnimating||f.length<1?void(a.isFunction(c)&&c.call(d)):(d.isAnimating=!0,void(d.singlePageInline&&d.singlePageInline.isOpen?d.singlePageInline.close("promise",{callback:function(){d.addItems(f,c)}}):d.addItems(f,c)))}}}(jQuery,window,document),function(a){"use strict";function b(b){var c=this;c.parent=b,c.searchInput=a(b.options.search),c.searchInput.each(function(b,c){var d=c.getAttribute("data-search");d||(d="*"),a.data(c,"searchData",{value:c.value,el:d})});var d=null;c.searchInput.on("keyup.cbp paste.cbp",function(b){b.preventDefault();var e=a(this);clearTimeout(d),d=setTimeout(function(){c.runEvent.call(c,e)},300)}),c.searchNothing=c.searchInput.siblings(".cbp-search-nothing").detach(),c.searchNothingHeight=null,c.searchNothingHTML=c.searchNothing.html(),c.searchInput.siblings(".cbp-search-icon").on("click.cbp",function(b){b.preventDefault(),c.runEvent.call(c,a(this).prev().val(""))})}var c=a.fn.cubeportfolio.Constructor;b.prototype.runEvent=function(b){var c=this,d=b.val(),e=b.data("searchData"),f=new RegExp(d,"i");e.value===d||c.parent.isAnimating||(e.value=d,d.length>0?b.attr("value",d):b.removeAttr("value"),c.parent.$obj.cubeportfolio("filter",function(b){var g=b.filter(function(b,c){var d=a(c).find(e.el).text();return d.search(f)>-1?!0:void 0});if(0===g.length&&c.searchNothing.length){var h=c.searchNothingHTML.replace("{{query}}",d);c.searchNothing.html(h),c.searchNothing.appendTo(c.parent.$obj),null===c.searchNothingHeight&&(c.searchNothingHeight=c.searchNothing.outerHeight(!0)),c.parent.registerEvent("resizeMainContainer",function(){c.parent.height=c.parent.height+c.searchNothingHeight,c.parent.obj.style.height=c.parent.height+"px"},!0)}else c.searchNothing.detach();return g},function(){b.trigger("keyup.cbp")}))},b.prototype.destroy=function(){var b=this;b.searchInput.off(".cbp"),b.searchInput.next(".cbp-search-icon").off(".cbp"),b.searchInput.each(function(b,c){a.removeData(c)})},c.Plugins.Search=function(a){return""===a.options.search?null:new b(a)}}(jQuery,window,document),"function"!=typeof Object.create&&(Object.create=function(a){function b(){}return b.prototype=a,new b}),function(){for(var a=0,b=["moz","webkit"],c=0;c<b.length&&!window.requestAnimationFrame;++c)window.requestAnimationFrame=window[b[c]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[b[c]+"CancelAnimationFrame"]||window[b[c]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(b){var c=(new Date).getTime(),d=Math.max(0,16-(c-a)),e=window.setTimeout(function(){b(c+d)},d);return a=c+d,e}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)})}(),function(a){"use strict";function b(a){var b=this;b.parent=a,a.filterLayout=b.filterLayout,a.registerEvent("computeBlocksFinish",function(b){a.blocksOn2On=a.blocksOnInitial.filter(b),a.blocksOn2Off=a.blocksOnInitial.not(b)})}var c=a.fn.cubeportfolio.Constructor;b.prototype.filterLayout=function(){function b(){d.blocks.removeClass("cbp-item-on2off cbp-item-off2on cbp-item-on2on").each(function(b,d){var e=a(d).data("cbp");e.left=e.leftNew,e.top=e.topNew,d.style.left=e.left+"px",d.style.top=e.top+"px",d.style[c.Private.transform]=""}),d.blocksOff.addClass("cbp-item-off"),d.$obj.removeClass("cbp-animation-"+d.options.animationType),d.filterFinish()}var d=this;d.$obj.addClass("cbp-animation-"+d.options.animationType),d.blocksOn2On.addClass("cbp-item-on2on").each(function(b,d){var e=a(d).data("cbp");d.style[c.Private.transform]="translate3d("+(e.leftNew-e.left)+"px, "+(e.topNew-e.top)+"px, 0)"}),d.blocksOn2Off.addClass("cbp-item-on2off"),d.blocksOff2On=d.blocksOn.filter(".cbp-item-off").removeClass("cbp-item-off").addClass("cbp-item-off2on").each(function(b,c){var d=a(c).data("cbp");c.style.left=d.leftNew+"px",c.style.top=d.topNew+"px"}),d.blocksOn2Off.length?d.blocksOn2Off.last().data("cbp").wrapper.one(c.Private.animationend,b):d.blocksOff2On.length?d.blocksOff2On.last().data("cbp").wrapper.one(c.Private.animationend,b):b(),d.resizeMainContainer()},b.prototype.destroy=function(){var a=this.parent;a.$obj.removeClass("cbp-animation-"+a.options.animationType)},c.Plugins.AnimationClassic=function(d){return!c.Private.modernBrowser||a.inArray(d.options.animationType,["boxShadow","fadeOut","flipBottom","flipOut","quicksand","scaleSides","skew"])<0?null:new b(d)}}(jQuery,window,document),function(a){"use strict";function b(a){var b=this;b.parent=a,a.filterLayout=b.filterLayout}var c=a.fn.cubeportfolio.Constructor;b.prototype.filterLayout=function(){function b(){d.wrapper[0].removeChild(e),"sequentially"===d.options.animationType&&d.blocksOn.each(function(b,d){a(d).data("cbp").wrapper[0].style[c.Private.animationDelay]=""}),d.$obj.removeClass("cbp-animation-"+d.options.animationType),d.filterFinish()}var d=this,e=d.$ul[0].cloneNode(!0);e.setAttribute("class","cbp-wrapper-helper"),d.wrapper[0].insertBefore(e,d.$ul[0]),requestAnimationFrame(function(){d.$obj.addClass("cbp-animation-"+d.options.animationType),d.blocksOff.addClass("cbp-item-off"),d.blocksOn.removeClass("cbp-item-off").each(function(b,e){var f=a(e).data("cbp");f.left=f.leftNew,f.top=f.topNew,e.style.left=f.left+"px",e.style.top=f.top+"px","sequentially"===d.options.animationType&&(f.wrapper[0].style[c.Private.animationDelay]=60*b+"ms")}),d.blocksOn.length?d.blocksOn.last().data("cbp").wrapper.one(c.Private.animationend,b):d.blocksOnInitial.length?d.blocksOnInitial.last().data("cbp").wrapper.one(c.Private.animationend,b):b(),d.resizeMainContainer()})},b.prototype.destroy=function(){var a=this.parent;a.$obj.removeClass("cbp-animation-"+a.options.animationType)},c.Plugins.AnimationClone=function(d){return!c.Private.modernBrowser||a.inArray(d.options.animationType,["fadeOutTop","slideLeft","sequentially"])<0?null:new b(d)}}(jQuery,window,document),function(a){"use strict";function b(a){var b=this;b.parent=a,a.filterLayout=b.filterLayout}var c=a.fn.cubeportfolio.Constructor;b.prototype.filterLayout=function(){function b(){d.wrapper[0].removeChild(e[0]),d.$obj.removeClass("cbp-animation-"+d.options.animationType),d.blocks.each(function(b,d){a(d).data("cbp").wrapper[0].style[c.Private.animationDelay]=""}),d.filterFinish()}var d=this,e=d.$ul.clone(!0,!0);e[0].setAttribute("class","cbp-wrapper-helper"),d.wrapper[0].insertBefore(e[0],d.$ul[0]);var f=e.find(".cbp-item").not(".cbp-item-off");d.sortBlocks(f,"top"),f.children(".cbp-item-wrapper").each(function(a,b){b.style[c.Private.animationDelay]=50*a+"ms"}),requestAnimationFrame(function(){d.$obj.addClass("cbp-animation-"+d.options.animationType),d.blocksOff.addClass("cbp-item-off"),d.blocksOn.removeClass("cbp-item-off").each(function(b,d){var e=a(d).data("cbp");e.left=e.leftNew,e.top=e.topNew,d.style.left=e.left+"px",d.style.top=e.top+"px",e.wrapper[0].style[c.Private.animationDelay]=50*b+"ms"});var e=d.blocksOn.length,g=f.length;0===e&&0===g?b():g>e?f.last().children(".cbp-item-wrapper").one(c.Private.animationend,b):d.blocksOn.last().data("cbp").wrapper.one(c.Private.animationend,b),d.resizeMainContainer()})},b.prototype.destroy=function(){var a=this.parent;a.$obj.removeClass("cbp-animation-"+a.options.animationType)},c.Plugins.AnimationCloneDelay=function(d){return!c.Private.modernBrowser||a.inArray(d.options.animationType,["3dflip","flipOutDelay","foldLeft","frontRow","rotateRoom","rotateSides","scaleDown","slideDelay","unfold"])<0?null:new b(d)}}(jQuery,window,document),function(a){"use strict";function b(a){var b=this;b.parent=a,a.filterLayout=b.filterLayout}var c=a.fn.cubeportfolio.Constructor;b.prototype.filterLayout=function(){function b(){d.wrapper[0].removeChild(e),d.$obj.removeClass("cbp-animation-"+d.options.animationType),d.filterFinish()}var d=this,e=d.$ul[0].cloneNode(!0);e.setAttribute("class","cbp-wrapper-helper"),d.wrapper[0].insertBefore(e,d.$ul[0]),requestAnimationFrame(function(){d.$obj.addClass("cbp-animation-"+d.options.animationType),d.blocksOff.addClass("cbp-item-off"),d.blocksOn.removeClass("cbp-item-off").each(function(b,c){var d=a(c).data("cbp");d.left=d.leftNew,d.top=d.topNew,c.style.left=d.left+"px",c.style.top=d.top+"px"}),d.blocksOn.length?d.$ul.one(c.Private.animationend,b):d.blocksOnInitial.length?a(e).one(c.Private.animationend,b):b(),d.resizeMainContainer()})},b.prototype.destroy=function(){var a=this.parent;a.$obj.removeClass("cbp-animation-"+a.options.animationType)},c.Plugins.AnimationWrapper=function(d){return!c.Private.modernBrowser||a.inArray(d.options.animationType,["bounceBottom","bounceLeft","bounceTop","moveLeft"])<0?null:new b(d)}}(jQuery,window,document),function(a){"use strict";function b(b){var c=this;c.parent=b,b.registerEvent("initFinish",function(){b.$obj.on("click.cbp",".cbp-caption-defaultWrap",function(c){if(c.preventDefault(),!b.isAnimating){b.isAnimating=!0;var d=a(this),e=d.next(),f=d.parent(),g={position:"relative",height:e.outerHeight(!0)},h={position:"relative",height:0};if(b.$obj.addClass("cbp-caption-expand-active"),f.hasClass("cbp-caption-expand-open")){var i=h;h=g,g=i,f.removeClass("cbp-caption-expand-open")}e.css(g),b.$obj.one("pluginResize.cbp",function(){b.isAnimating=!1,b.$obj.removeClass("cbp-caption-expand-active"),0===g.height&&(f.removeClass("cbp-caption-expand-open"),e.attr("style",""))}),b.layoutAndAdjustment(),e.css(h),requestAnimationFrame(function(){f.addClass("cbp-caption-expand-open"),e.css(g),"slider"===b.options.layoutMode&&b.updateSlider(),b.triggerEvent("resizeGrid")})}})},!0)}var c=a.fn.cubeportfolio.Constructor;b.prototype.destroy=function(){this.parent.$obj.find(".cbp-caption-defaultWrap").off("click.cbp").parent().removeClass("cbp-caption-expand-active")},c.Plugins.CaptionExpand=function(a){return"expand"!==a.options.caption?null:new b(a)}}(jQuery,window,document),function(a){"use strict";function b(b){var d=a.Deferred();b.pushQueue("delayFrame",d),b.registerEvent("initEndWrite",function(){b.blocksOn.each(function(a,d){d.style[c.Private.animationDelay]=a*b.options.displayTypeSpeed+"ms"}),b.$obj.addClass("cbp-displayType-bottomToTop"),b.blocksOn.last().one(c.Private.animationend,function(){b.$obj.removeClass("cbp-displayType-bottomToTop"),b.blocksOn.each(function(a,b){b.style[c.Private.animationDelay]=""}),d.resolve()})},!0)}var c=a.fn.cubeportfolio.Constructor;c.Plugins.BottomToTop=function(a){return c.Private.modernBrowser&&"bottomToTop"===a.options.displayType&&0!==a.blocksOn.length?new b(a):null}}(jQuery,window,document),function(a){"use strict";function b(b){var d=a.Deferred();b.pushQueue("delayFrame",d),b.registerEvent("initEndWrite",function(){b.obj.style[c.Private.animationDuration]=b.options.displayTypeSpeed+"ms",b.$obj.addClass("cbp-displayType-fadeInToTop"),b.$obj.one(c.Private.animationend,function(){b.$obj.removeClass("cbp-displayType-fadeInToTop"),b.obj.style[c.Private.animationDuration]="",d.resolve()})},!0)}var c=a.fn.cubeportfolio.Constructor;c.Plugins.FadeInToTop=function(a){return c.Private.modernBrowser&&"fadeInToTop"===a.options.displayType&&0!==a.blocksOn.length?new b(a):null}}(jQuery,window,document),function(a){"use strict";function b(b){var d=a.Deferred();b.pushQueue("delayFrame",d),b.registerEvent("initEndWrite",function(){b.obj.style[c.Private.animationDuration]=b.options.displayTypeSpeed+"ms",b.$obj.addClass("cbp-displayType-lazyLoading"),b.$obj.one(c.Private.animationend,function(){b.$obj.removeClass("cbp-displayType-lazyLoading"),b.obj.style[c.Private.animationDuration]="",d.resolve()})},!0)}var c=a.fn.cubeportfolio.Constructor;c.Plugins.LazyLoading=function(a){return!c.Private.modernBrowser||"lazyLoading"!==a.options.displayType&&"fadeIn"!==a.options.displayType||0===a.blocksOn.length?null:new b(a)}}(jQuery,window,document),function(a){"use strict";function b(b){var d=a.Deferred();b.pushQueue("delayFrame",d),b.registerEvent("initEndWrite",function(){b.blocksOn.each(function(a,d){d.style[c.Private.animationDelay]=a*b.options.displayTypeSpeed+"ms"}),b.$obj.addClass("cbp-displayType-sequentially"),b.blocksOn.last().one(c.Private.animationend,function(){b.$obj.removeClass("cbp-displayType-sequentially"),b.blocksOn.each(function(a,b){b.style[c.Private.animationDelay]=""}),d.resolve()})},!0)}var c=a.fn.cubeportfolio.Constructor;c.Plugins.DisplaySequentially=function(a){return c.Private.modernBrowser&&"sequentially"===a.options.displayType&&0!==a.blocksOn.length?new b(a):null}}(jQuery,window,document),function(a){"use strict";var b=a.fn.cubeportfolio.Constructor;a.extend(b.prototype,{mosaicLayoutReset:function(){var b=this;b.blocksAreSorted=!1,b.blocksOn.each(function(b,c){a(c).data("cbp").pack=!1})},mosaicLayout:function(){var a,b=this,c=b.blocksOn.length,d={};for(b.freeSpaces=[{leftStart:0,leftEnd:b.widthAvailable,topStart:0,topEnd:Math.pow(2,18)}],a=0;c>a;a++){if(d=b.getSpaceIndexAndBlock(),null===d)return b.sortBlocksToPreventGaps(),void b.mosaicLayout();b.generateF1F2(d.spaceIndex,d.dataBlock),b.generateG1G2G3G4(d.dataBlock),b.cleanFreeSpaces(),b.addHeightToBlocks()}b.blocksAreSorted&&b.sortBlocks(b.blocksOn,"topNew")},getSpaceIndexAndBlock:function(){var b=this,c=null;return a.each(b.freeSpaces,function(d,e){var f=e.leftEnd-e.leftStart,g=e.topEnd-e.topStart;return b.blocksOn.each(function(b,h){var i=a(h).data("cbp");if(i.pack!==!0)return i.widthAndGap<=f&&i.heightAndGap<=g?(i.pack=!0,c={spaceIndex:d,dataBlock:i},i.leftNew=e.leftStart,i.topNew=e.topStart,!1):void 0}),!b.blocksAreSorted&&b.options.sortToPreventGaps&&d>0?(c=null,!1):null!==c?!1:void 0}),c},generateF1F2:function(a,b){var c=this,d=c.freeSpaces[a],e={leftStart:d.leftStart+b.widthAndGap,leftEnd:d.leftEnd,topStart:d.topStart,topEnd:d.topEnd},f={leftStart:d.leftStart,leftEnd:d.leftEnd,topStart:d.topStart+b.heightAndGap,topEnd:d.topEnd};c.freeSpaces.splice(a,1),e.leftEnd>e.leftStart&&e.topEnd>e.topStart&&(c.freeSpaces.splice(a,0,e),a++),f.leftEnd>f.leftStart&&f.topEnd>f.topStart&&c.freeSpaces.splice(a,0,f)},generateG1G2G3G4:function(b){var c=this,d=[];a.each(c.freeSpaces,function(a,e){var f=c.intersectSpaces(e,b);return null===f?void d.push(e):(c.generateG1(e,f,d),c.generateG2(e,f,d),c.generateG3(e,f,d),void c.generateG4(e,f,d))}),c.freeSpaces=d},intersectSpaces:function(a,b){var c={leftStart:b.leftNew,leftEnd:b.leftNew+b.widthAndGap,topStart:b.topNew,topEnd:b.topNew+b.heightAndGap};if(a.leftStart===c.leftStart&&a.leftEnd===c.leftEnd&&a.topStart===c.topStart&&a.topEnd===c.topEnd)return null;var d=Math.max(a.leftStart,c.leftStart),e=Math.min(a.leftEnd,c.leftEnd),f=Math.max(a.topStart,c.topStart),g=Math.min(a.topEnd,c.topEnd);return d>=e||f>=g?null:{leftStart:d,leftEnd:e,topStart:f,topEnd:g}},generateG1:function(a,b,c){a.topStart!==b.topStart&&c.push({leftStart:a.leftStart,leftEnd:a.leftEnd,topStart:a.topStart,topEnd:b.topStart})},generateG2:function(a,b,c){a.leftEnd!==b.leftEnd&&c.push({leftStart:b.leftEnd,leftEnd:a.leftEnd,topStart:a.topStart,topEnd:a.topEnd})},generateG3:function(a,b,c){a.topEnd!==b.topEnd&&c.push({leftStart:a.leftStart,leftEnd:a.leftEnd,topStart:b.topEnd,topEnd:a.topEnd})},generateG4:function(a,b,c){a.leftStart!==b.leftStart&&c.push({leftStart:a.leftStart,leftEnd:b.leftStart,topStart:a.topStart,topEnd:a.topEnd})},cleanFreeSpaces:function(){var a=this;a.freeSpaces.sort(function(a,b){return a.topStart>b.topStart?1:a.topStart<b.topStart?-1:a.leftStart>b.leftStart?1:a.leftStart<b.leftStart?-1:0}),a.correctSubPixelValues(),a.removeNonMaximalFreeSpaces()},correctSubPixelValues:function(){var a,b,c,d,e=this;for(a=0,b=e.freeSpaces.length-1;b>a;a++)c=e.freeSpaces[a],d=e.freeSpaces[a+1],d.topStart-c.topStart<=1&&(d.topStart=c.topStart)},removeNonMaximalFreeSpaces:function(){var b=this;b.uniqueFreeSpaces(),b.freeSpaces=a.map(b.freeSpaces,function(c,d){return a.each(b.freeSpaces,function(a,b){return d!==a&&b.leftStart<=c.leftStart&&b.leftEnd>=c.leftEnd&&b.topStart<=c.topStart&&b.topEnd>=c.topEnd?(c=null,!1):void 0}),c})},uniqueFreeSpaces:function(){var b=this,c=[];a.each(b.freeSpaces,function(b,d){a.each(c,function(a,b){return b.leftStart===d.leftStart&&b.leftEnd===d.leftEnd&&b.topStart===d.topStart&&b.topEnd===d.topEnd?(d=null,!1):void 0}),null!==d&&c.push(d)}),b.freeSpaces=c},addHeightToBlocks:function(){var b=this;if(!(b.freeSpaces.length>1)){var c=b.freeSpaces[0].topStart;b.blocksOn.each(function(b,d){var e=a(d).data("cbp");if(e.pack===!0){var f=c-e.topNew-e.heightAndGap;0>f&&(d.style.height=e.height+f+"px")}})}},sortBlocksToPreventGaps:function(){var b=this;b.blocksAreSorted=!0,b.blocksOn.sort(function(b,c){var d=a(b).data("cbp"),e=a(c).data("cbp");return d.widthAndGap<e.widthAndGap?1:d.widthAndGap>e.widthAndGap?-1:d.heightAndGap<e.heightAndGap?1:d.heightAndGap>e.heightAndGap?-1:d.index>e.index?1:d.index<e.index?-1:void 0}),b.blocksOn.each(function(b,c){a(c).data("cbp").pack=!1,c.style.height=""})},sortBlocks:function(b,c){b.sort(function(b,d){var e=a(b).data("cbp"),f=a(d).data("cbp");return e[c]>f[c]?1:e[c]<f[c]?-1:e.leftNew>f.leftNew?1:e.leftNew<f.leftNew?-1:0})}})}(jQuery,window,document),function(a,b,c,d){"use strict";var e=a.fn.cubeportfolio.Constructor;a.extend(e.prototype,{sliderMarkup:function(){var b=this;b.sliderStopEvents=!1,b.sliderActive=0,b.$obj.one("initComplete.cbp",function(){b.$obj.addClass("cbp-mode-slider")}),b.nav=a("<div/>",{"class":"cbp-nav"}),b.nav.on("click.cbp","[data-slider-action]",function(c){if(c.preventDefault(),c.stopImmediatePropagation(),c.stopPropagation(),!b.sliderStopEvents){var d=a(this),e=d.attr("data-slider-action");b[e+"Slider"]&&b[e+"Slider"](d)}}),b.options.showNavigation&&(b.controls=a("<div/>",{"class":"cbp-nav-controls"}),b.navPrev=a("<div/>",{"class":"cbp-nav-prev","data-slider-action":"prev"}).appendTo(b.controls),b.navNext=a("<div/>",{"class":"cbp-nav-next","data-slider-action":"next"}).appendTo(b.controls),b.controls.appendTo(b.nav)),b.options.showPagination&&(b.navPagination=a("<div/>",{"class":"cbp-nav-pagination"}).appendTo(b.nav)),(b.controls||b.navPagination)&&b.nav.appendTo(b.$obj),b.updateSliderPagination(),b.options.auto&&(b.options.autoPauseOnHover&&(b.mouseIsEntered=!1,b.$obj.on("mouseenter.cbp",function(){b.mouseIsEntered=!0,b.stopSliderAuto()}).on("mouseleave.cbp",function(){b.mouseIsEntered=!1,b.startSliderAuto()})),b.startSliderAuto()),b.options.drag&&e.Private.modernBrowser&&b.dragSlider()},updateSlider:function(){var a=this;a.updateSliderPosition(),a.updateSliderPagination()},updateSliderPagination:function(){var b,c,d=this;if(d.options.showPagination){for(b=Math.ceil(d.blocksOn.length/d.cols),d.navPagination.empty(),c=b-1;c>=0;c--)a("<div/>",{"class":"cbp-nav-pagination-item","data-slider-action":"jumpTo"}).appendTo(d.navPagination);d.navPaginationItems=d.navPagination.children()}d.enableDisableNavSlider()},destroySlider:function(){var b=this;"slider"===b.options.layoutMode&&(b.$obj.off(".cbp"),b.$obj.removeClass("cbp-mode-slider"),b.options.showNavigation&&(b.nav.off(".cbp"),b.nav.remove()),b.navPagination&&b.navPagination.remove(),b.$ul.removeAttr("style"),b.$ul.off(".cbp"),a(c).off(".cbp"),b.options.auto&&b.stopSliderAuto())},nextSlider:function(){var a=this;if(a.isEndSlider()){if(!a.isRewindNav())return;a.sliderActive=0}else a.options.scrollByPage?a.sliderActive=Math.min(a.sliderActive+a.cols,a.blocksOn.length-a.cols):a.sliderActive+=1;a.goToSlider()},prevSlider:function(){var a=this;if(a.isStartSlider()){if(!a.isRewindNav())return;a.sliderActive=a.blocksOn.length-a.cols}else a.options.scrollByPage?a.sliderActive=Math.max(0,a.sliderActive-a.cols):a.sliderActive-=1;a.goToSlider()},jumpToSlider:function(a){var b=this,c=Math.min(a.index()*b.cols,b.blocksOn.length-b.cols);c!==b.sliderActive&&(b.sliderActive=c,b.goToSlider())},jumpDragToSlider:function(a){var b,c,d,e=this,f=a>0?!0:!1;e.options.scrollByPage?(b=e.cols*e.columnWidth,c=e.cols):(b=e.columnWidth,c=1),a=Math.abs(a),d=Math.floor(a/b)*c,a%b>20&&(d+=c),e.sliderActive=f?Math.min(e.sliderActive+d,e.blocksOn.length-e.cols):Math.max(0,e.sliderActive-d),e.goToSlider()},isStartSlider:function(){return 0===this.sliderActive},isEndSlider:function(){var a=this;return a.sliderActive+a.cols>a.blocksOn.length-1},goToSlider:function(){var a=this;a.enableDisableNavSlider(),a.updateSliderPosition()},startSliderAuto:function(){var a=this;return a.isDrag?void a.stopSliderAuto():void(a.timeout=setTimeout(function(){a.nextSlider(),a.startSliderAuto()},a.options.autoTimeout))},stopSliderAuto:function(){clearTimeout(this.timeout)},enableDisableNavSlider:function(){var a,b,c=this;c.isRewindNav()||(b=c.isStartSlider()?"addClass":"removeClass",c.navPrev[b]("cbp-nav-stop"),b=c.isEndSlider()?"addClass":"removeClass",c.navNext[b]("cbp-nav-stop")),c.options.showPagination&&(a=c.options.scrollByPage?Math.ceil(c.sliderActive/c.cols):c.isEndSlider()?c.navPaginationItems.length-1:Math.floor(c.sliderActive/c.cols),c.navPaginationItems.removeClass("cbp-nav-pagination-active").eq(a).addClass("cbp-nav-pagination-active"))},isRewindNav:function(){var a=this;return a.options.showNavigation?a.blocksOn.length<=a.cols?!1:a.options.rewindNav?!0:!1:!0},sliderItemsLength:function(){return this.blocksOn.length<=this.cols},sliderLayout:function(){var b=this;b.blocksOn.each(function(c,d){var e=a(d).data("cbp");e.leftNew=b.columnWidth*c,e.topNew=0,b.sliderFreeSpaces.push({topStart:e.heightAndGap})}),b.getFreeSpacesForSlider(),b.$ul.width(b.columnWidth*b.blocksOn.length-b.options.gapVertical)},getFreeSpacesForSlider:function(){var a=this;a.freeSpaces=a.sliderFreeSpaces.slice(a.sliderActive,a.sliderActive+a.cols),a.freeSpaces.sort(function(a,b){return a.topStart>b.topStart?1:a.topStart<b.topStart?-1:void 0})},updateSliderPosition:function(){var a=this,b=-a.sliderActive*a.columnWidth;e.Private.modernBrowser?a.$ul[0].style[e.Private.transform]="translate3d("+b+"px, 0px, 0)":a.$ul[0].style.left=b+"px",a.getFreeSpacesForSlider(),a.resizeMainContainer()},dragSlider:function(){function f(b){if(!q.sliderItemsLength()){if(u?p=b:b.preventDefault(),q.options.auto&&q.stopSliderAuto(),s)return void a(m).one("click.cbp",function(){return!1});m=a(b.target),k=j(b).x,l=0,n=-q.sliderActive*q.columnWidth,o=q.columnWidth*(q.blocksOn.length-q.cols),r.on(t.move,h),r.on(t.end,g),q.$obj.addClass("cbp-mode-slider-dragStart")}}function g(){q.$obj.removeClass("cbp-mode-slider-dragStart"),s=!0,0!==l?(m.one("click.cbp",function(){return!1}),q.jumpDragToSlider(l),q.$ul.one(e.Private.transitionend,i)):i.call(q),r.off(t.move),r.off(t.end)}function h(a){l=k-j(a).x,(l>8||-8>l)&&a.preventDefault(),q.isDrag=!0;var b=n-l;0>l&&n>l?b=(n-l)/5:l>0&&-o>n-l&&(b=-o+(o+n-l)/5),e.Private.modernBrowser?q.$ul[0].style[e.Private.transform]="translate3d("+b+"px, 0px, 0)":q.$ul[0].style.left=b+"px"}function i(){if(s=!1,q.isDrag=!1,q.options.auto){if(q.mouseIsEntered)return;q.startSliderAuto()}}function j(a){return a.originalEvent!==d&&a.originalEvent.touches!==d&&(a=a.originalEvent.touches[0]),{x:a.pageX,y:a.pageY}}var k,l,m,n,o,p,q=this,r=a(c),s=!1,t={},u=!1;q.isDrag=!1,"ontouchstart"in b||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0?(t={start:"touchstart.cbp",move:"touchmove.cbp",end:"touchend.cbp"},u=!0):t={start:"mousedown.cbp",move:"mousemove.cbp",end:"mouseup.cbp"},q.$ul.on(t.start,f)},sliderLayoutReset:function(){var a=this;a.freeSpaces=[],a.sliderFreeSpaces=[]}})}(jQuery,window,document);(function(e,t){"use strict";function n(e){var t=Array.prototype.slice.call(arguments,1);return e.prop?e.prop.apply(e,t):e.attr.apply(e,t)}function s(e,t,n){var s,a;for(s in n)n.hasOwnProperty(s)&&(a=s.replace(/ |$/g,t.eventNamespace),e.bind(a,n[s]))}function a(e,t,n){s(e,n,{focus:function(){t.addClass(n.focusClass)},blur:function(){t.removeClass(n.focusClass),t.removeClass(n.activeClass)},mouseenter:function(){t.addClass(n.hoverClass)},mouseleave:function(){t.removeClass(n.hoverClass),t.removeClass(n.activeClass)},"mousedown touchbegin":function(){e.is(":disabled")||t.addClass(n.activeClass)},"mouseup touchend":function(){t.removeClass(n.activeClass)}})}function i(e,t){e.removeClass(t.hoverClass+" "+t.focusClass+" "+t.activeClass)}function r(e,t,n){n?e.addClass(t):e.removeClass(t)}function l(e,t,n){var s="checked",a=t.is(":"+s);t.prop?t.prop(s,a):a?t.attr(s,s):t.removeAttr(s),r(e,n.checkedClass,a)}function u(e,t,n){r(e,n.disabledClass,t.is(":disabled"))}function o(e,t,n){switch(n){case"after":return e.after(t),e.next();case"before":return e.before(t),e.prev();case"wrap":return e.wrap(t),e.parent()}return null}function c(t,s,a){var i,r,l;return a||(a={}),a=e.extend({bind:{},divClass:null,divWrap:"wrap",spanClass:null,spanHtml:null,spanWrap:"wrap"},a),i=e("<div />"),r=e("<span />"),s.autoHide&&t.is(":hidden")&&"none"===t.css("display")&&i.hide(),a.divClass&&i.addClass(a.divClass),s.wrapperClass&&i.addClass(s.wrapperClass),a.spanClass&&r.addClass(a.spanClass),l=n(t,"id"),s.useID&&l&&n(i,"id",s.idPrefix+"-"+l),a.spanHtml&&r.html(a.spanHtml),i=o(t,i,a.divWrap),r=o(t,r,a.spanWrap),u(i,t,s),{div:i,span:r}}function d(t,n){var s;return n.wrapperClass?(s=e("<span />").addClass(n.wrapperClass),s=o(t,s,"wrap")):null}function f(){var t,n,s,a;return a="rgb(120,2,153)",n=e('<div style="width:0;height:0;color:'+a+'">'),e("body").append(n),s=n.get(0),t=window.getComputedStyle?window.getComputedStyle(s,"").color:(s.currentStyle||s.style||{}).color,n.remove(),t.replace(/ /g,"")!==a}function p(t){return t?e("<span />").text(t).html():""}function m(){return navigator.cpuClass&&!navigator.product}function v(){return window.XMLHttpRequest!==void 0?!0:!1}function h(e){var t;return e[0].multiple?!0:(t=n(e,"size"),!t||1>=t?!1:!0)}function C(){return!1}function w(e,t){var n="none";s(e,t,{"selectstart dragstart mousedown":C}),e.css({MozUserSelect:n,msUserSelect:n,webkitUserSelect:n,userSelect:n})}function b(e,t,n){var s=e.val();""===s?s=n.fileDefaultHtml:(s=s.split(/[\/\\]+/),s=s[s.length-1]),t.text(s)}function y(e,t,n){var s,a;for(s=[],e.each(function(){var e;for(e in t)Object.prototype.hasOwnProperty.call(t,e)&&(s.push({el:this,name:e,old:this.style[e]}),this.style[e]=t[e])}),n();s.length;)a=s.pop(),a.el.style[a.name]=a.old}function g(e,t){var n;n=e.parents(),n.push(e[0]),n=n.not(":visible"),y(n,{visibility:"hidden",display:"block",position:"absolute"},t)}function k(e,t){return function(){e.unwrap().unwrap().unbind(t.eventNamespace)}}var H=!0,x=!1,A=[{match:function(e){return e.is("a, button, :submit, :reset, input[type='button']")},apply:function(e,t){var r,l,o,d,f;return l=t.submitDefaultHtml,e.is(":reset")&&(l=t.resetDefaultHtml),d=e.is("a, button")?function(){return e.html()||l}:function(){return p(n(e,"value"))||l},o=c(e,t,{divClass:t.buttonClass,spanHtml:d()}),r=o.div,a(e,r,t),f=!1,s(r,t,{"click touchend":function(){var t,s,a,i;f||e.is(":disabled")||(f=!0,e[0].dispatchEvent?(t=document.createEvent("MouseEvents"),t.initEvent("click",!0,!0),s=e[0].dispatchEvent(t),e.is("a")&&s&&(a=n(e,"target"),i=n(e,"href"),a&&"_self"!==a?window.open(i,a):document.location.href=i)):e.click(),f=!1)}}),w(r,t),{remove:function(){return r.after(e),r.remove(),e.unbind(t.eventNamespace),e},update:function(){i(r,t),u(r,e,t),e.detach(),o.span.html(d()).append(e)}}}},{match:function(e){return e.is(":checkbox")},apply:function(e,t){var n,r,o;return n=c(e,t,{divClass:t.checkboxClass}),r=n.div,o=n.span,a(e,r,t),s(e,t,{"click touchend":function(){l(o,e,t)}}),l(o,e,t),{remove:k(e,t),update:function(){i(r,t),o.removeClass(t.checkedClass),l(o,e,t),u(r,e,t)}}}},{match:function(e){return e.is(":file")},apply:function(t,r){function l(){b(t,p,r)}var d,f,p,v;return d=c(t,r,{divClass:r.fileClass,spanClass:r.fileButtonClass,spanHtml:r.fileButtonHtml,spanWrap:"after"}),f=d.div,v=d.span,p=e("<span />").html(r.fileDefaultHtml),p.addClass(r.filenameClass),p=o(t,p,"after"),n(t,"size")||n(t,"size",f.width()/10),a(t,f,r),l(),m()?s(t,r,{click:function(){t.trigger("change"),setTimeout(l,0)}}):s(t,r,{change:l}),w(p,r),w(v,r),{remove:function(){return p.remove(),v.remove(),t.unwrap().unbind(r.eventNamespace)},update:function(){i(f,r),b(t,p,r),u(f,t,r)}}}},{match:function(e){if(e.is("input")){var t=(" "+n(e,"type")+" ").toLowerCase(),s=" color date datetime datetime-local email month number password search tel text time url week ";return s.indexOf(t)>=0}return!1},apply:function(e,t){var s,i;return s=n(e,"type"),e.addClass(t.inputClass),i=d(e,t),a(e,e,t),t.inputAddTypeAsClass&&e.addClass(s),{remove:function(){e.removeClass(t.inputClass),t.inputAddTypeAsClass&&e.removeClass(s),i&&e.unwrap()},update:C}}},{match:function(e){return e.is(":radio")},apply:function(t,r){var o,d,f;return o=c(t,r,{divClass:r.radioClass}),d=o.div,f=o.span,a(t,d,r),s(t,r,{"click touchend":function(){e.uniform.update(e(':radio[name="'+n(t,"name")+'"]'))}}),l(f,t,r),{remove:k(t,r),update:function(){i(d,r),l(f,t,r),u(d,t,r)}}}},{match:function(e){return e.is("select")&&!h(e)?!0:!1},apply:function(t,n){var r,l,o,d;return n.selectAutoWidth&&g(t,function(){d=t.width()}),r=c(t,n,{divClass:n.selectClass,spanHtml:(t.find(":selected:first")||t.find("option:first")).html(),spanWrap:"before"}),l=r.div,o=r.span,n.selectAutoWidth?g(t,function(){y(e([o[0],l[0]]),{display:"block"},function(){var e;e=o.outerWidth()-o.width(),l.width(d+e),o.width(d)})}):l.addClass("fixedWidth"),a(t,l,n),s(t,n,{change:function(){o.html(t.find(":selected").html()),l.removeClass(n.activeClass)},"click touchend":function(){var e=t.find(":selected").html();o.html()!==e&&t.trigger("change")},keyup:function(){o.html(t.find(":selected").html())}}),w(o,n),{remove:function(){return o.remove(),t.unwrap().unbind(n.eventNamespace),t},update:function(){n.selectAutoWidth?(e.uniform.restore(t),t.uniform(n)):(i(l,n),o.html(t.find(":selected").html()),u(l,t,n))}}}},{match:function(e){return e.is("select")&&h(e)?!0:!1},apply:function(e,t){var n;return e.addClass(t.selectMultiClass),n=d(e,t),a(e,e,t),{remove:function(){e.removeClass(t.selectMultiClass),n&&e.unwrap()},update:C}}},{match:function(e){return e.is("textarea")},apply:function(e,t){var n;return e.addClass(t.textareaClass),n=d(e,t),a(e,e,t),{remove:function(){e.removeClass(t.textareaClass),n&&e.unwrap()},update:C}}}];m()&&!v()&&(H=!1),e.uniform={defaults:{activeClass:"active",autoHide:!0,buttonClass:"button",checkboxClass:"checker",checkedClass:"checked",disabledClass:"disabled",eventNamespace:".uniform",fileButtonClass:"action",fileButtonHtml:"Choose File",fileClass:"uploader",fileDefaultHtml:"No file selected",filenameClass:"filename",focusClass:"focus",hoverClass:"hover",idPrefix:"uniform",inputAddTypeAsClass:!0,inputClass:"uniform-input",radioClass:"radio",resetDefaultHtml:"Reset",resetSelector:!1,selectAutoWidth:!0,selectClass:"selector",selectMultiClass:"uniform-multiselect",submitDefaultHtml:"Submit",textareaClass:"uniform",useID:!0,wrapperClass:null},elements:[]},e.fn.uniform=function(t){var n=this;return t=e.extend({},e.uniform.defaults,t),x||(x=!0,f()&&(H=!1)),H?(t.resetSelector&&e(t.resetSelector).mouseup(function(){window.setTimeout(function(){e.uniform.update(n)},10)}),this.each(function(){var n,s,a,i=e(this);if(i.data("uniformed"))return e.uniform.update(i),void 0;for(n=0;A.length>n;n+=1)if(s=A[n],s.match(i,t))return a=s.apply(i,t),i.data("uniformed",a),e.uniform.elements.push(i.get(0)),void 0})):this},e.uniform.restore=e.fn.uniform.restore=function(n){n===t&&(n=e.uniform.elements),e(n).each(function(){var t,n,s=e(this);n=s.data("uniformed"),n&&(n.remove(),t=e.inArray(this,e.uniform.elements),t>=0&&e.uniform.elements.splice(t,1),s.removeData("uniformed"))})},e.uniform.update=e.fn.uniform.update=function(n){n===t&&(n=e.uniform.elements),e(n).each(function(){var t,n=e(this);t=n.data("uniformed"),t&&t.update(n,t.options)})}})(jQuery);(function(){'use strict';var videojs=null;if(typeof window.videojs==='undefined'&&typeof require==='function'){videojs=require('video.js');}else{videojs=window.videojs;}
(function(window,videojs){var defaults={},videoJsResolutionSwitcher,currentResolution={},menuItemsHolder={};function setSourcesSanitized(player,sources,label,customSourcePicker){currentResolution={label:label,sources:sources};if(typeof customSourcePicker==='function'){return customSourcePicker(player,sources,label);}
return player.src(sources.map(function(src){return{src:src.src,type:src.type,res:src.res};}));}
var MenuItem=videojs.getComponent('MenuItem');var ResolutionMenuItem=videojs.extend(MenuItem,{constructor:function(player,options,onClickListener,label){this.onClickListener=onClickListener;this.label=label;MenuItem.call(this,player,options);this.src=options.src;this.on('click',this.onClick);this.on('touchstart',this.onClick);if(options.initialySelected){this.showAsLabel();this.selected(true);this.addClass('vjs-selected');}},showAsLabel:function(){if(this.label){this.label.innerHTML=this.options_.label;}},onClick:function(customSourcePicker){this.onClickListener(this);var currentTime=this.player_.currentTime();var isPaused=this.player_.paused();this.showAsLabel();this.addClass('vjs-selected');if(!isPaused){this.player_.bigPlayButton.hide();}
if(typeof customSourcePicker!=='function'&&typeof this.options_.customSourcePicker==='function'){customSourcePicker=this.options_.customSourcePicker;}
var handleSeekEvent='loadeddata';if(this.player_.techName_!=='Youtube'&&this.player_.preload()==='none'&&this.player_.techName_!=='Flash'){handleSeekEvent='timeupdate';}
setSourcesSanitized(this.player_,this.src,this.options_.label,customSourcePicker).one(handleSeekEvent,function(){this.player_.currentTime(currentTime);this.player_.handleTechSeeked_();if(!isPaused){this.player_.play().handleTechSeeked_();}
this.player_.trigger('resolutionchange');});}});var MenuButton=videojs.getComponent('MenuButton');var ResolutionMenuButton=videojs.extend(MenuButton,{constructor:function(player,options,settings,label){this.sources=options.sources;this.label=label;this.label.innerHTML=options.initialySelectedLabel;MenuButton.call(this,player,options,settings);this.controlText('Quality');if(settings.dynamicLabel){this.el().appendChild(label);}else{var staticLabel=document.createElement('span');videojs.addClass(staticLabel,'vjs-resolution-button-staticlabel');this.el().appendChild(staticLabel);}},createItems:function(){var menuItems=[];var labels=(this.sources&&this.sources.label)||{};var onClickUnselectOthers=function(clickedItem){menuItems.map(function(item){item.selected(item===clickedItem);item.removeClass('vjs-selected');});};for(var key in labels){if(labels.hasOwnProperty(key)){menuItems.push(new ResolutionMenuItem(this.player_,{label:key,src:labels[key],initialySelected:key===this.options_.initialySelectedLabel,customSourcePicker:this.options_.customSourcePicker},onClickUnselectOthers,this.label));menuItemsHolder[key]=menuItems[menuItems.length-1];}}
return menuItems;}});videoJsResolutionSwitcher=function(options){var settings=videojs.mergeOptions(defaults,options),player=this,label=document.createElement('span'),groupedSrc={};videojs.addClass(label,'vjs-resolution-button-label');player.updateSrc=function(src){if(!src){return player.src();}
if(player.controlBar.resolutionSwitcher){player.controlBar.resolutionSwitcher.dispose();delete player.controlBar.resolutionSwitcher;}
src=src.sort(compareResolutions);groupedSrc=bucketSources(src);var choosen=chooseSrc(groupedSrc,src);var menuButton=new ResolutionMenuButton(player,{sources:groupedSrc,initialySelectedLabel:choosen.label,initialySelectedRes:choosen.res,customSourcePicker:settings.customSourcePicker},settings,label);videojs.addClass(menuButton.el(),'vjs-resolution-button');player.controlBar.resolutionSwitcher=player.controlBar.el_.insertBefore(menuButton.el_,player.controlBar.getChild('fullscreenToggle').el_);player.controlBar.resolutionSwitcher.dispose=function(){this.parentNode.removeChild(this);};return setSourcesSanitized(player,choosen.sources,choosen.label);};player.currentResolution=function(label,customSourcePicker){if(label==null){return currentResolution;}
if(menuItemsHolder[label]!=null){menuItemsHolder[label].onClick(customSourcePicker);}
return player;};player.getGroupedSrc=function(){return groupedSrc;};function compareResolutions(a,b){if(!a.res||!b.res){return 0;}
return(+b.res)-(+a.res);}
function bucketSources(src){var resolutions={label:{},res:{},type:{}};src.map(function(source){initResolutionKey(resolutions,'label',source);initResolutionKey(resolutions,'res',source);initResolutionKey(resolutions,'type',source);appendSourceToKey(resolutions,'label',source);appendSourceToKey(resolutions,'res',source);appendSourceToKey(resolutions,'type',source);});return resolutions;}
function initResolutionKey(resolutions,key,source){if(resolutions[key][source[key]]==null){resolutions[key][source[key]]=[];}}
function appendSourceToKey(resolutions,key,source){resolutions[key][source[key]].push(source);}
function chooseSrc(groupedSrc,src){var selectedRes=settings['default'];var selectedLabel='';if(selectedRes==='high'){selectedRes=src[0].res;selectedLabel=src[0].label;}else if(selectedRes==='low'||selectedRes==null||!groupedSrc.res[selectedRes]){selectedRes=src[src.length-1].res;selectedLabel=src[src.length-1].label;}else if(groupedSrc.res[selectedRes]){selectedLabel=groupedSrc.res[selectedRes][0].label;}
return{res:selectedRes,label:selectedLabel,sources:groupedSrc.res[selectedRes]};}
function initResolutionForYt(player){player.tech_.ytPlayer.setPlaybackQuality('default');player.tech_.ytPlayer.addEventListener('onPlaybackQualityChange',function(){player.trigger('resolutionchange');});player.one('play',function(){var qualities=player.tech_.ytPlayer.getAvailableQualityLevels();var _yts={highres:{res:1080,label:'1080',yt:'highres'},hd1080:{res:1080,label:'1080',yt:'hd1080'},hd720:{res:720,label:'720',yt:'hd720'},large:{res:480,label:'480',yt:'large'},medium:{res:360,label:'360',yt:'medium'},small:{res:240,label:'240',yt:'small'},tiny:{res:144,label:'144',yt:'tiny'},auto:{res:0,label:'auto',yt:'default'}};var _sources=[];qualities.map(function(q){_sources.push({src:player.src().src,type:player.src().type,label:_yts[q].label,res:_yts[q].res,_yt:_yts[q].yt});});groupedSrc=bucketSources(_sources);var _customSourcePicker=function(_player,_sources,_label){player.tech_.ytPlayer.setPlaybackQuality(_sources[0]._yt);return player;};var choosen={label:'auto',res:0,sources:groupedSrc.label.auto};var menuButton=new ResolutionMenuButton(player,{sources:groupedSrc,initialySelectedLabel:choosen.label,initialySelectedRes:choosen.res,customSourcePicker:_customSourcePicker},settings,label);menuButton.el().classList.add('vjs-resolution-button');player.controlBar.resolutionSwitcher=player.controlBar.addChild(menuButton);});}
player.ready(function(){if(player.options_.sources.length>1){player.updateSrc(player.options_.sources);}
if(player.techName_==='Youtube'){initResolutionForYt(player);}});};videojs.plugin('videoJsResolutionSwitcher',videoJsResolutionSwitcher);})(window,videojs);})();
















/*!
 * typeahead.js 0.11.1
 * https://github.com/twitter/typeahead.js
 * Copyright 2013-2015 Twitter, Inc. and other contributors; Licensed MIT
 */

(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define("bloodhound", [ "jquery" ], function(a0) {
            return root["Bloodhound"] = factory(a0);
        });
    } else if (typeof exports === "object") {
        module.exports = factory(require("jquery"));
    } else {
        root["Bloodhound"] = factory(jQuery);
    }
})(this, function($) {
    var _ = function() {
        "use strict";
        return {
            isMsie: function() {
                return /(msie|trident)/i.test(navigator.userAgent) ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : false;
            },
            isBlankString: function(str) {
                return !str || /^\s*$/.test(str);
            },
            escapeRegExChars: function(str) {
                return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            },
            isString: function(obj) {
                return typeof obj === "string";
            },
            isNumber: function(obj) {
                return typeof obj === "number";
            },
            isArray: $.isArray,
            isFunction: $.isFunction,
            isObject: $.isPlainObject,
            isUndefined: function(obj) {
                return typeof obj === "undefined";
            },
            isElement: function(obj) {
                return !!(obj && obj.nodeType === 1);
            },
            isJQuery: function(obj) {
                return obj instanceof $;
            },
            toStr: function toStr(s) {
                return _.isUndefined(s) || s === null ? "" : s + "";
            },
            bind: $.proxy,
            each: function(collection, cb) {
                $.each(collection, reverseArgs);
                function reverseArgs(index, value) {
                    return cb(value, index);
                }
            },
            map: $.map,
            filter: $.grep,
            every: function(obj, test) {
                var result = true;
                if (!obj) {
                    return result;
                }
                $.each(obj, function(key, val) {
                    if (!(result = test.call(null, val, key, obj))) {
                        return false;
                    }
                });
                return !!result;
            },
            some: function(obj, test) {
                var result = false;
                if (!obj) {
                    return result;
                }
                $.each(obj, function(key, val) {
                    if (result = test.call(null, val, key, obj)) {
                        return false;
                    }
                });
                return !!result;
            },
            mixin: $.extend,
            identity: function(x) {
                return x;
            },
            clone: function(obj) {
                return $.extend(true, {}, obj);
            },
            getIdGenerator: function() {
                var counter = 0;
                return function() {
                    return counter++;
                };
            },
            templatify: function templatify(obj) {
                return $.isFunction(obj) ? obj : template;
                function template() {
                    return String(obj);
                }
            },
            defer: function(fn) {
                setTimeout(fn, 0);
            },
            debounce: function(func, wait, immediate) {
                var timeout, result;
                return function() {
                    var context = this, args = arguments, later, callNow;
                    later = function() {
                        timeout = null;
                        if (!immediate) {
                            result = func.apply(context, args);
                        }
                    };
                    callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) {
                        result = func.apply(context, args);
                    }
                    return result;
                };
            },
            throttle: function(func, wait) {
                var context, args, timeout, result, previous, later;
                previous = 0;
                later = function() {
                    previous = new Date();
                    timeout = null;
                    result = func.apply(context, args);
                };
                return function() {
                    var now = new Date(), remaining = wait - (now - previous);
                    context = this;
                    args = arguments;
                    if (remaining <= 0) {
                        clearTimeout(timeout);
                        timeout = null;
                        previous = now;
                        result = func.apply(context, args);
                    } else if (!timeout) {
                        timeout = setTimeout(later, remaining);
                    }
                    return result;
                };
            },
            stringify: function(val) {
                return _.isString(val) ? val : JSON.stringify(val);
            },
            noop: function() {}
        };
    }();
    var VERSION = "0.11.1";
    var tokenizers = function() {
        "use strict";
        return {
            nonword: nonword,
            whitespace: whitespace,
            obj: {
                nonword: getObjTokenizer(nonword),
                whitespace: getObjTokenizer(whitespace)
            }
        };
        function whitespace(str) {
            str = _.toStr(str);
            return str ? str.split(/\s+/) : [];
        }
        function nonword(str) {
            str = _.toStr(str);
            return str ? str.split(/\W+/) : [];
        }
        function getObjTokenizer(tokenizer) {
            return function setKey(keys) {
                keys = _.isArray(keys) ? keys : [].slice.call(arguments, 0);
                return function tokenize(o) {
                    var tokens = [];
                    _.each(keys, function(k) {
                        tokens = tokens.concat(tokenizer(_.toStr(o[k])));
                    });
                    return tokens;
                };
            };
        }
    }();
    var LruCache = function() {
        "use strict";
        function LruCache(maxSize) {
            this.maxSize = _.isNumber(maxSize) ? maxSize : 100;
            this.reset();
            if (this.maxSize <= 0) {
                this.set = this.get = $.noop;
            }
        }
        _.mixin(LruCache.prototype, {
            set: function set(key, val) {
                var tailItem = this.list.tail, node;
                if (this.size >= this.maxSize) {
                    this.list.remove(tailItem);
                    delete this.hash[tailItem.key];
                    this.size--;
                }
                if (node = this.hash[key]) {
                    node.val = val;
                    this.list.moveToFront(node);
                } else {
                    node = new Node(key, val);
                    this.list.add(node);
                    this.hash[key] = node;
                    this.size++;
                }
            },
            get: function get(key) {
                var node = this.hash[key];
                if (node) {
                    this.list.moveToFront(node);
                    return node.val;
                }
            },
            reset: function reset() {
                this.size = 0;
                this.hash = {};
                this.list = new List();
            }
        });
        function List() {
            this.head = this.tail = null;
        }
        _.mixin(List.prototype, {
            add: function add(node) {
                if (this.head) {
                    node.next = this.head;
                    this.head.prev = node;
                }
                this.head = node;
                this.tail = this.tail || node;
            },
            remove: function remove(node) {
                node.prev ? node.prev.next = node.next : this.head = node.next;
                node.next ? node.next.prev = node.prev : this.tail = node.prev;
            },
            moveToFront: function(node) {
                this.remove(node);
                this.add(node);
            }
        });
        function Node(key, val) {
            this.key = key;
            this.val = val;
            this.prev = this.next = null;
        }
        return LruCache;
    }();
    var PersistentStorage = function() {
        "use strict";
        var LOCAL_STORAGE;
        try {
            LOCAL_STORAGE = window.localStorage;
            LOCAL_STORAGE.setItem("~~~", "!");
            LOCAL_STORAGE.removeItem("~~~");
        } catch (err) {
            LOCAL_STORAGE = null;
        }
        function PersistentStorage(namespace, override) {
            this.prefix = [ "__", namespace, "__" ].join("");
            this.ttlKey = "__ttl__";
            this.keyMatcher = new RegExp("^" + _.escapeRegExChars(this.prefix));
            this.ls = override || LOCAL_STORAGE;
            !this.ls && this._noop();
        }
        _.mixin(PersistentStorage.prototype, {
            _prefix: function(key) {
                return this.prefix + key;
            },
            _ttlKey: function(key) {
                return this._prefix(key) + this.ttlKey;
            },
            _noop: function() {
                this.get = this.set = this.remove = this.clear = this.isExpired = _.noop;
            },
            _safeSet: function(key, val) {
                try {
                    this.ls.setItem(key, val);
                } catch (err) {
                    if (err.name === "QuotaExceededError") {
                        this.clear();
                        this._noop();
                    }
                }
            },
            get: function(key) {
                if (this.isExpired(key)) {
                    this.remove(key);
                }
                return decode(this.ls.getItem(this._prefix(key)));
            },
            set: function(key, val, ttl) {
                if (_.isNumber(ttl)) {
                    this._safeSet(this._ttlKey(key), encode(now() + ttl));
                } else {
                    this.ls.removeItem(this._ttlKey(key));
                }
                return this._safeSet(this._prefix(key), encode(val));
            },
            remove: function(key) {
                this.ls.removeItem(this._ttlKey(key));
                this.ls.removeItem(this._prefix(key));
                return this;
            },
            clear: function() {
                var i, keys = gatherMatchingKeys(this.keyMatcher);
                for (i = keys.length; i--; ) {
                    this.remove(keys[i]);
                }
                return this;
            },
            isExpired: function(key) {
                var ttl = decode(this.ls.getItem(this._ttlKey(key)));
                return _.isNumber(ttl) && now() > ttl ? true : false;
            }
        });
        return PersistentStorage;
        function now() {
            return new Date().getTime();
        }
        function encode(val) {
            return JSON.stringify(_.isUndefined(val) ? null : val);
        }
        function decode(val) {
            return $.parseJSON(val);
        }
        function gatherMatchingKeys(keyMatcher) {
            var i, key, keys = [], len = LOCAL_STORAGE.length;
            for (i = 0; i < len; i++) {
                if ((key = LOCAL_STORAGE.key(i)).match(keyMatcher)) {
                    keys.push(key.replace(keyMatcher, ""));
                }
            }
            return keys;
        }
    }();
    var Transport = function() {
        "use strict";
        var pendingRequestsCount = 0, pendingRequests = {}, maxPendingRequests = 6, sharedCache = new LruCache(10);
        function Transport(o) {
            o = o || {};
            this.cancelled = false;
            this.lastReq = null;
            this._send = o.transport;
            this._get = o.limiter ? o.limiter(this._get) : this._get;
            this._cache = o.cache === false ? new LruCache(0) : sharedCache;
        }
        Transport.setMaxPendingRequests = function setMaxPendingRequests(num) {
            maxPendingRequests = num;
        };
        Transport.resetCache = function resetCache() {
            sharedCache.reset();
        };
        _.mixin(Transport.prototype, {
            _fingerprint: function fingerprint(o) {
                o = o || {};
                return o.url + o.type + $.param(o.data || {});
            },
            _get: function(o, cb) {
                var that = this, fingerprint, jqXhr;
                fingerprint = this._fingerprint(o);
                if (this.cancelled || fingerprint !== this.lastReq) {
                    return;
                }
                if (jqXhr = pendingRequests[fingerprint]) {
                    jqXhr.done(done).fail(fail);
                } else if (pendingRequestsCount < maxPendingRequests) {
                    pendingRequestsCount++;
                    pendingRequests[fingerprint] = this._send(o).done(done).fail(fail).always(always);
                } else {
                    this.onDeckRequestArgs = [].slice.call(arguments, 0);
                }
                function done(resp) {
                    cb(null, resp);
                    that._cache.set(fingerprint, resp);
                }
                function fail() {
                    cb(true);
                }
                function always() {
                    pendingRequestsCount--;
                    delete pendingRequests[fingerprint];
                    if (that.onDeckRequestArgs) {
                        that._get.apply(that, that.onDeckRequestArgs);
                        that.onDeckRequestArgs = null;
                    }
                }
            },
            get: function(o, cb) {
                var resp, fingerprint;
                cb = cb || $.noop;
                o = _.isString(o) ? {
                    url: o
                } : o || {};
                fingerprint = this._fingerprint(o);
                this.cancelled = false;
                this.lastReq = fingerprint;
                if (resp = this._cache.get(fingerprint)) {
                    cb(null, resp);
                } else {
                    this._get(o, cb);
                }
            },
            cancel: function() {
                this.cancelled = true;
            }
        });
        return Transport;
    }();
    var SearchIndex = window.SearchIndex = function() {
        "use strict";
        var CHILDREN = "c", IDS = "i";
        function SearchIndex(o) {
            o = o || {};
            if (!o.datumTokenizer || !o.queryTokenizer) {
                $.error("datumTokenizer and queryTokenizer are both required");
            }
            this.identify = o.identify || _.stringify;
            this.datumTokenizer = o.datumTokenizer;
            this.queryTokenizer = o.queryTokenizer;
            this.reset();
        }
        _.mixin(SearchIndex.prototype, {
            bootstrap: function bootstrap(o) {
                this.datums = o.datums;
                this.trie = o.trie;
            },
            add: function(data) {
                var that = this;
                data = _.isArray(data) ? data : [ data ];
                _.each(data, function(datum) {
                    var id, tokens;
                    that.datums[id = that.identify(datum)] = datum;
                    tokens = normalizeTokens(that.datumTokenizer(datum));
                    _.each(tokens, function(token) {
                        var node, chars, ch;
                        node = that.trie;
                        chars = token.split("");
                        while (ch = chars.shift()) {
                            node = node[CHILDREN][ch] || (node[CHILDREN][ch] = newNode());
                            node[IDS].push(id);
                        }
                    });
                });
            },
            get: function get(ids) {
                var that = this;
                return _.map(ids, function(id) {
                    return that.datums[id];
                });
            },
            search: function search(query) {
                var that = this, tokens, matches;
                tokens = normalizeTokens(this.queryTokenizer(query));
                _.each(tokens, function(token) {
                    var node, chars, ch, ids;
                    if (matches && matches.length === 0) {
                        return false;
                    }
                    node = that.trie;
                    chars = token.split("");
                    while (node && (ch = chars.shift())) {
                        node = node[CHILDREN][ch];
                    }
                    if (node && chars.length === 0) {
                        ids = node[IDS].slice(0);
                        matches = matches ? getIntersection(matches, ids) : ids;
                    } else {
                        matches = [];
                        return false;
                    }
                });
                return matches ? _.map(unique(matches), function(id) {
                    return that.datums[id];
                }) : [];
            },
            all: function all() {
                var values = [];
                for (var key in this.datums) {
                    values.push(this.datums[key]);
                }
                return values;
            },
            reset: function reset() {
                this.datums = {};
                this.trie = newNode();
            },
            serialize: function serialize() {
                return {
                    datums: this.datums,
                    trie: this.trie
                };
            }
        });
        return SearchIndex;
        function normalizeTokens(tokens) {
            tokens = _.filter(tokens, function(token) {
                return !!token;
            });
            tokens = _.map(tokens, function(token) {
                return token.toLowerCase();
            });
            return tokens;
        }
        function newNode() {
            var node = {};
            node[IDS] = [];
            node[CHILDREN] = {};
            return node;
        }
        function unique(array) {
            var seen = {}, uniques = [];
            for (var i = 0, len = array.length; i < len; i++) {
                if (!seen[array[i]]) {
                    seen[array[i]] = true;
                    uniques.push(array[i]);
                }
            }
            return uniques;
        }
        function getIntersection(arrayA, arrayB) {
            var ai = 0, bi = 0, intersection = [];
            arrayA = arrayA.sort();
            arrayB = arrayB.sort();
            var lenArrayA = arrayA.length, lenArrayB = arrayB.length;
            while (ai < lenArrayA && bi < lenArrayB) {
                if (arrayA[ai] < arrayB[bi]) {
                    ai++;
                } else if (arrayA[ai] > arrayB[bi]) {
                    bi++;
                } else {
                    intersection.push(arrayA[ai]);
                    ai++;
                    bi++;
                }
            }
            return intersection;
        }
    }();
    var Prefetch = function() {
        "use strict";
        var keys;
        keys = {
            data: "data",
            protocol: "protocol",
            thumbprint: "thumbprint"
        };
        function Prefetch(o) {
            this.url = o.url;
            this.ttl = o.ttl;
            this.cache = o.cache;
            this.prepare = o.prepare;
            this.transform = o.transform;
            this.transport = o.transport;
            this.thumbprint = o.thumbprint;
            this.storage = new PersistentStorage(o.cacheKey);
        }
        _.mixin(Prefetch.prototype, {
            _settings: function settings() {
                return {
                    url: this.url,
                    type: "GET",
                    dataType: "json"
                };
            },
            store: function store(data) {
                if (!this.cache) {
                    return;
                }
                this.storage.set(keys.data, data, this.ttl);
                this.storage.set(keys.protocol, location.protocol, this.ttl);
                this.storage.set(keys.thumbprint, this.thumbprint, this.ttl);
            },
            fromCache: function fromCache() {
                var stored = {}, isExpired;
                if (!this.cache) {
                    return null;
                }
                stored.data = this.storage.get(keys.data);
                stored.protocol = this.storage.get(keys.protocol);
                stored.thumbprint = this.storage.get(keys.thumbprint);
                isExpired = stored.thumbprint !== this.thumbprint || stored.protocol !== location.protocol;
                return stored.data && !isExpired ? stored.data : null;
            },
            fromNetwork: function(cb) {
                var that = this, settings;
                if (!cb) {
                    return;
                }
                settings = this.prepare(this._settings());
                this.transport(settings).fail(onError).done(onResponse);
                function onError() {
                    cb(true);
                }
                function onResponse(resp) {
                    cb(null, that.transform(resp));
                }
            },
            clear: function clear() {
                this.storage.clear();
                return this;
            }
        });
        return Prefetch;
    }();
    var Remote = function() {
        "use strict";
        function Remote(o) {
            this.url = o.url;
            this.prepare = o.prepare;
            this.transform = o.transform;
            this.transport = new Transport({
                cache: o.cache,
                limiter: o.limiter,
                transport: o.transport
            });
        }
        _.mixin(Remote.prototype, {
            _settings: function settings() {
                return {
                    url: this.url,
                    type: "GET",
                    dataType: "json"
                };
            },
            get: function get(query, cb) {
                var that = this, settings;
                if (!cb) {
                    return;
                }
                query = query || "";
                settings = this.prepare(query, this._settings());
                return this.transport.get(settings, onResponse);
                function onResponse(err, resp) {
                    err ? cb([]) : cb(that.transform(resp));
                }
            },
            cancelLastRequest: function cancelLastRequest() {
                this.transport.cancel();
            }
        });
        return Remote;
    }();
    var oParser = function() {
        "use strict";
        return function parse(o) {
            var defaults, sorter;
            defaults = {
                initialize: true,
                identify: _.stringify,
                datumTokenizer: null,
                queryTokenizer: null,
                sufficient: 5,
                sorter: null,
                local: [],
                prefetch: null,
                remote: null
            };
            o = _.mixin(defaults, o || {});
            !o.datumTokenizer && $.error("datumTokenizer is required");
            !o.queryTokenizer && $.error("queryTokenizer is required");
            sorter = o.sorter;
            o.sorter = sorter ? function(x) {
                return x.sort(sorter);
            } : _.identity;
            o.local = _.isFunction(o.local) ? o.local() : o.local;
            o.prefetch = parsePrefetch(o.prefetch);
            o.remote = parseRemote(o.remote);
            return o;
        };
        function parsePrefetch(o) {
            var defaults;
            if (!o) {
                return null;
            }
            defaults = {
                url: null,
                ttl: 24 * 60 * 60 * 1e3,
                cache: true,
                cacheKey: null,
                thumbprint: "",
                prepare: _.identity,
                transform: _.identity,
                transport: null
            };
            o = _.isString(o) ? {
                url: o
            } : o;
            o = _.mixin(defaults, o);
            !o.url && $.error("prefetch requires url to be set");
            o.transform = o.filter || o.transform;
            o.cacheKey = o.cacheKey || o.url;
            o.thumbprint = VERSION + o.thumbprint;
            o.transport = o.transport ? callbackToDeferred(o.transport) : $.ajax;
            return o;
        }
        function parseRemote(o) {
            var defaults;
            if (!o) {
                return;
            }
            defaults = {
                url: null,
                cache: true,
                prepare: null,
                replace: null,
                wildcard: null,
                limiter: null,
                rateLimitBy: "debounce",
                rateLimitWait: 300,
                transform: _.identity,
                transport: null
            };
            o = _.isString(o) ? {
                url: o
            } : o;
            o = _.mixin(defaults, o);
            !o.url && $.error("remote requires url to be set");
            o.transform = o.filter || o.transform;
            o.prepare = toRemotePrepare(o);
            o.limiter = toLimiter(o);
            o.transport = o.transport ? callbackToDeferred(o.transport) : $.ajax;
            delete o.replace;
            delete o.wildcard;
            delete o.rateLimitBy;
            delete o.rateLimitWait;
            return o;
        }
        function toRemotePrepare(o) {
            var prepare, replace, wildcard;
            prepare = o.prepare;
            replace = o.replace;
            wildcard = o.wildcard;
            if (prepare) {
                return prepare;
            }
            if (replace) {
                prepare = prepareByReplace;
            } else if (o.wildcard) {
                prepare = prepareByWildcard;
            } else {
                prepare = idenityPrepare;
            }
            return prepare;
            function prepareByReplace(query, settings) {
                settings.url = replace(settings.url, query);
                return settings;
            }
            function prepareByWildcard(query, settings) {
                settings.url = settings.url.replace(wildcard, encodeURIComponent(query));
                return settings;
            }
            function idenityPrepare(query, settings) {
                return settings;
            }
        }
        function toLimiter(o) {
            var limiter, method, wait;
            limiter = o.limiter;
            method = o.rateLimitBy;
            wait = o.rateLimitWait;
            if (!limiter) {
                limiter = /^throttle$/i.test(method) ? throttle(wait) : debounce(wait);
            }
            return limiter;
            function debounce(wait) {
                return function debounce(fn) {
                    return _.debounce(fn, wait);
                };
            }
            function throttle(wait) {
                return function throttle(fn) {
                    return _.throttle(fn, wait);
                };
            }
        }
        function callbackToDeferred(fn) {
            return function wrapper(o) {
                var deferred = $.Deferred();
                fn(o, onSuccess, onError);
                return deferred;
                function onSuccess(resp) {
                    _.defer(function() {
                        deferred.resolve(resp);
                    });
                }
                function onError(err) {
                    _.defer(function() {
                        deferred.reject(err);
                    });
                }
            };
        }
    }();
    var Bloodhound = function() {
        "use strict";
        var old;
        old = window && window.Bloodhound;
        function Bloodhound(o) {
            o = oParser(o);
            this.sorter = o.sorter;
            this.identify = o.identify;
            this.sufficient = o.sufficient;
            this.local = o.local;
            this.remote = o.remote ? new Remote(o.remote) : null;
            this.prefetch = o.prefetch ? new Prefetch(o.prefetch) : null;
            this.index = new SearchIndex({
                identify: this.identify,
                datumTokenizer: o.datumTokenizer,
                queryTokenizer: o.queryTokenizer
            });
            o.initialize !== false && this.initialize();
        }
        Bloodhound.noConflict = function noConflict() {
            window && (window.Bloodhound = old);
            return Bloodhound;
        };
        Bloodhound.tokenizers = tokenizers;
        _.mixin(Bloodhound.prototype, {
            __ttAdapter: function ttAdapter() {
                var that = this;
                return this.remote ? withAsync : withoutAsync;
                function withAsync(query, sync, async) {
                    return that.search(query, sync, async);
                }
                function withoutAsync(query, sync) {
                    return that.search(query, sync);
                }
            },
            _loadPrefetch: function loadPrefetch() {
                var that = this, deferred, serialized;
                deferred = $.Deferred();
                if (!this.prefetch) {
                    deferred.resolve();
                } else if (serialized = this.prefetch.fromCache()) {
                    this.index.bootstrap(serialized);
                    deferred.resolve();
                } else {
                    this.prefetch.fromNetwork(done);
                }
                return deferred.promise();
                function done(err, data) {
                    if (err) {
                        return deferred.reject();
                    }
                    that.add(data);
                    that.prefetch.store(that.index.serialize());
                    deferred.resolve();
                }
            },
            _initialize: function initialize() {
                var that = this, deferred;
                this.clear();
                (this.initPromise = this._loadPrefetch()).done(addLocalToIndex);
                return this.initPromise;
                function addLocalToIndex() {
                    that.add(that.local);
                }
            },
            initialize: function initialize(force) {
                return !this.initPromise || force ? this._initialize() : this.initPromise;
            },
            add: function add(data) {
                this.index.add(data);
                return this;
            },
            get: function get(ids) {
                ids = _.isArray(ids) ? ids : [].slice.call(arguments);
                return this.index.get(ids);
            },
            search: function search(query, sync, async) {
                var that = this, local;
                local = this.sorter(this.index.search(query));
                sync(this.remote ? local.slice() : local);
                if (this.remote && local.length < this.sufficient) {
                    this.remote.get(query, processRemote);
                } else if (this.remote) {
                    this.remote.cancelLastRequest();
                }
                return this;
                function processRemote(remote) {
                    var nonDuplicates = [];
                    _.each(remote, function(r) {
                        !_.some(local, function(l) {
                            return that.identify(r) === that.identify(l);
                        }) && nonDuplicates.push(r);
                    });
                    async && async(nonDuplicates);
                }
            },
            all: function all() {
                return this.index.all();
            },
            clear: function clear() {
                this.index.reset();
                return this;
            },
            clearPrefetchCache: function clearPrefetchCache() {
                this.prefetch && this.prefetch.clear();
                return this;
            },
            clearRemoteCache: function clearRemoteCache() {
                Transport.resetCache();
                return this;
            },
            ttAdapter: function ttAdapter() {
                return this.__ttAdapter();
            }
        });
        return Bloodhound;
    }();
    return Bloodhound;
});

(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define("typeahead.js", [ "jquery" ], function(a0) {
            return factory(a0);
        });
    } else if (typeof exports === "object") {
        module.exports = factory(require("jquery"));
    } else {
        factory(jQuery);
    }
})(this, function($) {
    var _ = function() {
        "use strict";
        return {
            isMsie: function() {
                return /(msie|trident)/i.test(navigator.userAgent) ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : false;
            },
            isBlankString: function(str) {
                return !str || /^\s*$/.test(str);
            },
            escapeRegExChars: function(str) {
                return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            },
            isString: function(obj) {
                return typeof obj === "string";
            },
            isNumber: function(obj) {
                return typeof obj === "number";
            },
            isArray: $.isArray,
            isFunction: $.isFunction,
            isObject: $.isPlainObject,
            isUndefined: function(obj) {
                return typeof obj === "undefined";
            },
            isElement: function(obj) {
                return !!(obj && obj.nodeType === 1);
            },
            isJQuery: function(obj) {
                return obj instanceof $;
            },
            toStr: function toStr(s) {
                return _.isUndefined(s) || s === null ? "" : s + "";
            },
            bind: $.proxy,
            each: function(collection, cb) {
                $.each(collection, reverseArgs);
                function reverseArgs(index, value) {
                    return cb(value, index);
                }
            },
            map: $.map,
            filter: $.grep,
            every: function(obj, test) {
                var result = true;
                if (!obj) {
                    return result;
                }
                $.each(obj, function(key, val) {
                    if (!(result = test.call(null, val, key, obj))) {
                        return false;
                    }
                });
                return !!result;
            },
            some: function(obj, test) {
                var result = false;
                if (!obj) {
                    return result;
                }
                $.each(obj, function(key, val) {
                    if (result = test.call(null, val, key, obj)) {
                        return false;
                    }
                });
                return !!result;
            },
            mixin: $.extend,
            identity: function(x) {
                return x;
            },
            clone: function(obj) {
                return $.extend(true, {}, obj);
            },
            getIdGenerator: function() {
                var counter = 0;
                return function() {
                    return counter++;
                };
            },
            templatify: function templatify(obj) {
                return $.isFunction(obj) ? obj : template;
                function template() {
                    return String(obj);
                }
            },
            defer: function(fn) {
                setTimeout(fn, 0);
            },
            debounce: function(func, wait, immediate) {
                var timeout, result;
                return function() {
                    var context = this, args = arguments, later, callNow;
                    later = function() {
                        timeout = null;
                        if (!immediate) {
                            result = func.apply(context, args);
                        }
                    };
                    callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) {
                        result = func.apply(context, args);
                    }
                    return result;
                };
            },
            throttle: function(func, wait) {
                var context, args, timeout, result, previous, later;
                previous = 0;
                later = function() {
                    previous = new Date();
                    timeout = null;
                    result = func.apply(context, args);
                };
                return function() {
                    var now = new Date(), remaining = wait - (now - previous);
                    context = this;
                    args = arguments;
                    if (remaining <= 0) {
                        clearTimeout(timeout);
                        timeout = null;
                        previous = now;
                        result = func.apply(context, args);
                    } else if (!timeout) {
                        timeout = setTimeout(later, remaining);
                    }
                    return result;
                };
            },
            stringify: function(val) {
                return _.isString(val) ? val : JSON.stringify(val);
            },
            noop: function() {}
        };
    }();
    var WWW = function() {
        "use strict";
        var defaultClassNames = {
            wrapper: "twitter-typeahead",
            input: "tt-input",
            hint: "tt-hint",
            menu: "tt-menu",
            dataset: "tt-dataset",
            suggestion: "tt-suggestion",
            selectable: "tt-selectable",
            empty: "tt-empty",
            open: "tt-open",
            cursor: "tt-cursor",
            highlight: "tt-highlight"
        };
        return build;
        function build(o) {
            var www, classes;
            classes = _.mixin({}, defaultClassNames, o);
            www = {
                css: buildCss(),
                classes: classes,
                html: buildHtml(classes),
                selectors: buildSelectors(classes)
            };
            return {
                css: www.css,
                html: www.html,
                classes: www.classes,
                selectors: www.selectors,
                mixin: function(o) {
                    _.mixin(o, www);
                }
            };
        }
        function buildHtml(c) {
            return {
                wrapper: '<span class="' + c.wrapper + '"></span>',
                menu: '<div class="' + c.menu + '"></div>'
            };
        }
        function buildSelectors(classes) {
            var selectors = {};
            _.each(classes, function(v, k) {
                selectors[k] = "." + v;
            });
            return selectors;
        }
        function buildCss() {
            var css = {
                wrapper: {
                    position: "relative",
                    display: "inline-block"
                },
                hint: {
                    position: "absolute",
                    top: "0",
                    left: "0",
                    borderColor: "transparent",
                    boxShadow: "none",
                    opacity: "1"
                },
                input: {
                    position: "relative",
                    verticalAlign: "top",
                    backgroundColor: "transparent"
                },
                inputWithNoHint: {
                    position: "relative",
                    verticalAlign: "top"
                },
                menu: {
                    position: "absolute",
                    top: "100%",
                    left: "0",
                    zIndex: "100",
                    display: "none"
                },
                ltr: {
                    left: "0",
                    right: "auto"
                },
                rtl: {
                    left: "auto",
                    right: " 0"
                }
            };
            if (_.isMsie()) {
                _.mixin(css.input, {
                    backgroundImage: "url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)"
                });
            }
            return css;
        }
    }();
    var EventBus = function() {
        "use strict";
        var namespace, deprecationMap;
        namespace = "typeahead:";
        deprecationMap = {
            render: "rendered",
            cursorchange: "cursorchanged",
            select: "selected",
            autocomplete: "autocompleted"
        };
        function EventBus(o) {
            if (!o || !o.el) {
                $.error("EventBus initialized without el");
            }
            this.$el = $(o.el);
        }
        _.mixin(EventBus.prototype, {
            _trigger: function(type, args) {
                var $e;
                $e = $.Event(namespace + type);
                (args = args || []).unshift($e);
                this.$el.trigger.apply(this.$el, args);
                return $e;
            },
            before: function(type) {
                var args, $e;
                args = [].slice.call(arguments, 1);
                $e = this._trigger("before" + type, args);
                return $e.isDefaultPrevented();
            },
            trigger: function(type) {
                var deprecatedType;
                this._trigger(type, [].slice.call(arguments, 1));
                if (deprecatedType = deprecationMap[type]) {
                    this._trigger(deprecatedType, [].slice.call(arguments, 1));
                }
            }
        });
        return EventBus;
    }();
    var EventEmitter = function() {
        "use strict";
        var splitter = /\s+/, nextTick = getNextTick();
        return {
            onSync: onSync,
            onAsync: onAsync,
            off: off,
            trigger: trigger
        };
        function on(method, types, cb, context) {
            var type;
            if (!cb) {
                return this;
            }
            types = types.split(splitter);
            cb = context ? bindContext(cb, context) : cb;
            this._callbacks = this._callbacks || {};
            while (type = types.shift()) {
                this._callbacks[type] = this._callbacks[type] || {
                    sync: [],
                    async: []
                };
                this._callbacks[type][method].push(cb);
            }
            return this;
        }
        function onAsync(types, cb, context) {
            return on.call(this, "async", types, cb, context);
        }
        function onSync(types, cb, context) {
            return on.call(this, "sync", types, cb, context);
        }
        function off(types) {
            var type;
            if (!this._callbacks) {
                return this;
            }
            types = types.split(splitter);
            while (type = types.shift()) {
                delete this._callbacks[type];
            }
            return this;
        }
        function trigger(types) {
            var type, callbacks, args, syncFlush, asyncFlush;
            if (!this._callbacks) {
                return this;
            }
            types = types.split(splitter);
            args = [].slice.call(arguments, 1);
            while ((type = types.shift()) && (callbacks = this._callbacks[type])) {
                syncFlush = getFlush(callbacks.sync, this, [ type ].concat(args));
                asyncFlush = getFlush(callbacks.async, this, [ type ].concat(args));
                syncFlush() && nextTick(asyncFlush);
            }
            return this;
        }
        function getFlush(callbacks, context, args) {
            return flush;
            function flush() {
                var cancelled;
                for (var i = 0, len = callbacks.length; !cancelled && i < len; i += 1) {
                    cancelled = callbacks[i].apply(context, args) === false;
                }
                return !cancelled;
            }
        }
        function getNextTick() {
            var nextTickFn;
            if (window.setImmediate) {
                nextTickFn = function nextTickSetImmediate(fn) {
                    setImmediate(function() {
                        fn();
                    });
                };
            } else {
                nextTickFn = function nextTickSetTimeout(fn) {
                    setTimeout(function() {
                        fn();
                    }, 0);
                };
            }
            return nextTickFn;
        }
        function bindContext(fn, context) {
            return fn.bind ? fn.bind(context) : function() {
                fn.apply(context, [].slice.call(arguments, 0));
            };
        }
    }();
    var highlight = function(doc) {
        "use strict";
        var defaults = {
            node: null,
            pattern: null,
            tagName: "strong",
            className: null,
            wordsOnly: false,
            caseSensitive: false
        };
        return function hightlight(o) {
            var regex;
            o = _.mixin({}, defaults, o);
            if (!o.node || !o.pattern) {
                return;
            }
            o.pattern = _.isArray(o.pattern) ? o.pattern : [ o.pattern ];
            regex = getRegex(o.pattern, o.caseSensitive, o.wordsOnly);
            traverse(o.node, hightlightTextNode);
            function hightlightTextNode(textNode) {
                var match, patternNode, wrapperNode;
                if (match = regex.exec(textNode.data)) {
                    wrapperNode = doc.createElement(o.tagName);
                    o.className && (wrapperNode.className = o.className);
                    patternNode = textNode.splitText(match.index);
                    patternNode.splitText(match[0].length);
                    wrapperNode.appendChild(patternNode.cloneNode(true));
                    textNode.parentNode.replaceChild(wrapperNode, patternNode);
                }
                return !!match;
            }
            function traverse(el, hightlightTextNode) {
                var childNode, TEXT_NODE_TYPE = 3;
                for (var i = 0; i < el.childNodes.length; i++) {
                    childNode = el.childNodes[i];
                    if (childNode.nodeType === TEXT_NODE_TYPE) {
                        i += hightlightTextNode(childNode) ? 1 : 0;
                    } else {
                        traverse(childNode, hightlightTextNode);
                    }
                }
            }
        };
        function getRegex(patterns, caseSensitive, wordsOnly) {
            var escapedPatterns = [], regexStr;
            for (var i = 0, len = patterns.length; i < len; i++) {
                escapedPatterns.push(_.escapeRegExChars(patterns[i]));
            }
            regexStr = wordsOnly ? "\\b(" + escapedPatterns.join("|") + ")\\b" : "(" + escapedPatterns.join("|") + ")";
            return caseSensitive ? new RegExp(regexStr) : new RegExp(regexStr, "i");
        }
    }(window.document);
    var Input = function() {
        "use strict";
        var specialKeyCodeMap;
        specialKeyCodeMap = {
            9: "tab",
            27: "esc",
            37: "left",
            39: "right",
            13: "enter",
            38: "up",
            40: "down"
        };
        function Input(o, www) {
            o = o || {};
            if (!o.input) {
                $.error("input is missing");
            }
            www.mixin(this);
            this.$hint = $(o.hint);
            this.$input = $(o.input);
            this.query = this.$input.val();
            this.queryWhenFocused = this.hasFocus() ? this.query : null;
            this.$overflowHelper = buildOverflowHelper(this.$input);
            this._checkLanguageDirection();
            if (this.$hint.length === 0) {
                this.setHint = this.getHint = this.clearHint = this.clearHintIfInvalid = _.noop;
            }
        }
        Input.normalizeQuery = function(str) {
            return _.toStr(str).replace(/^\s*/g, "").replace(/\s{2,}/g, " ");
        };
        _.mixin(Input.prototype, EventEmitter, {
            _onBlur: function onBlur() {
                this.resetInputValue();
                this.trigger("blurred");
            },
            _onFocus: function onFocus() {
                this.queryWhenFocused = this.query;
                this.trigger("focused");
            },
            _onKeydown: function onKeydown($e) {
                var keyName = specialKeyCodeMap[$e.which || $e.keyCode];
                this._managePreventDefault(keyName, $e);
                if (keyName && this._shouldTrigger(keyName, $e)) {
                    this.trigger(keyName + "Keyed", $e);
                }
            },
            _onInput: function onInput() {
                this._setQuery(this.getInputValue());
                this.clearHintIfInvalid();
                this._checkLanguageDirection();
            },
            _managePreventDefault: function managePreventDefault(keyName, $e) {
                var preventDefault;
                switch (keyName) {
                  case "up":
                  case "down":
                    preventDefault = !withModifier($e);
                    break;

                  default:
                    preventDefault = false;
                }
                preventDefault && $e.preventDefault();
            },
            _shouldTrigger: function shouldTrigger(keyName, $e) {
                var trigger;
                switch (keyName) {
                  case "tab":
                    trigger = !withModifier($e);
                    break;

                  default:
                    trigger = true;
                }
                return trigger;
            },
            _checkLanguageDirection: function checkLanguageDirection() {
                var dir = (this.$input.css("direction") || "ltr").toLowerCase();
                if (this.dir !== dir) {
                    this.dir = dir;
                    this.$hint.attr("dir", dir);
                    this.trigger("langDirChanged", dir);
                }
            },
            _setQuery: function setQuery(val, silent) {
                var areEquivalent, hasDifferentWhitespace;
                areEquivalent = areQueriesEquivalent(val, this.query);
                hasDifferentWhitespace = areEquivalent ? this.query.length !== val.length : false;
                this.query = val;
                if (!silent && !areEquivalent) {
                    this.trigger("queryChanged", this.query);
                } else if (!silent && hasDifferentWhitespace) {
                    this.trigger("whitespaceChanged", this.query);
                }
            },
            bind: function() {
                var that = this, onBlur, onFocus, onKeydown, onInput;
                onBlur = _.bind(this._onBlur, this);
                onFocus = _.bind(this._onFocus, this);
                onKeydown = _.bind(this._onKeydown, this);
                onInput = _.bind(this._onInput, this);
                this.$input.on("blur.tt", onBlur).on("focus.tt", onFocus).on("keydown.tt", onKeydown);
                if (!_.isMsie() || _.isMsie() > 9) {
                    this.$input.on("input.tt", onInput);
                } else {
                    this.$input.on("keydown.tt keypress.tt cut.tt paste.tt", function($e) {
                        if (specialKeyCodeMap[$e.which || $e.keyCode]) {
                            return;
                        }
                        _.defer(_.bind(that._onInput, that, $e));
                    });
                }
                return this;
            },
            focus: function focus() {
                this.$input.focus();
            },
            blur: function blur() {
                this.$input.blur();
            },
            getLangDir: function getLangDir() {
                return this.dir;
            },
            getQuery: function getQuery() {
                return this.query || "";
            },
            setQuery: function setQuery(val, silent) {
                this.setInputValue(val);
                this._setQuery(val, silent);
            },
            hasQueryChangedSinceLastFocus: function hasQueryChangedSinceLastFocus() {
                return this.query !== this.queryWhenFocused;
            },
            getInputValue: function getInputValue() {
                return this.$input.val();
            },
            setInputValue: function setInputValue(value) {
                this.$input.val(value);
                this.clearHintIfInvalid();
                this._checkLanguageDirection();
            },
            resetInputValue: function resetInputValue() {
                this.setInputValue(this.query);
            },
            getHint: function getHint() {
                return this.$hint.val();
            },
            setHint: function setHint(value) {
                this.$hint.val(value);
            },
            clearHint: function clearHint() {
                this.setHint("");
            },
            clearHintIfInvalid: function clearHintIfInvalid() {
                var val, hint, valIsPrefixOfHint, isValid;
                val = this.getInputValue();
                hint = this.getHint();
                valIsPrefixOfHint = val !== hint && hint.indexOf(val) === 0;
                isValid = val !== "" && valIsPrefixOfHint && !this.hasOverflow();
                !isValid && this.clearHint();
            },
            hasFocus: function hasFocus() {
                return this.$input.is(":focus");
            },
            hasOverflow: function hasOverflow() {
                var constraint = this.$input.width() - 2;
                this.$overflowHelper.text(this.getInputValue());
                return this.$overflowHelper.width() >= constraint;
            },
            isCursorAtEnd: function() {
                var valueLength, selectionStart, range;
                valueLength = this.$input.val().length;
                selectionStart = this.$input[0].selectionStart;
                if (_.isNumber(selectionStart)) {
                    return selectionStart === valueLength;
                } else if (document.selection) {
                    range = document.selection.createRange();
                    range.moveStart("character", -valueLength);
                    return valueLength === range.text.length;
                }
                return true;
            },
            destroy: function destroy() {
                this.$hint.off(".tt");
                this.$input.off(".tt");
                this.$overflowHelper.remove();
                this.$hint = this.$input = this.$overflowHelper = $("<div>");
            }
        });
        return Input;
        function buildOverflowHelper($input) {
            return $('<pre aria-hidden="true"></pre>').css({
                position: "absolute",
                visibility: "hidden",
                whiteSpace: "pre",
                fontFamily: $input.css("font-family"),
                fontSize: $input.css("font-size"),
                fontStyle: $input.css("font-style"),
                fontVariant: $input.css("font-variant"),
                fontWeight: $input.css("font-weight"),
                wordSpacing: $input.css("word-spacing"),
                letterSpacing: $input.css("letter-spacing"),
                textIndent: $input.css("text-indent"),
                textRendering: $input.css("text-rendering"),
                textTransform: $input.css("text-transform")
            }).insertAfter($input);
        }
        function areQueriesEquivalent(a, b) {
            return Input.normalizeQuery(a) === Input.normalizeQuery(b);
        }
        function withModifier($e) {
            return $e.altKey || $e.ctrlKey || $e.metaKey || $e.shiftKey;
        }
    }();
    var Dataset = function() {
        "use strict";
        var keys, nameGenerator;
        keys = {
            val: "tt-selectable-display",
            obj: "tt-selectable-object"
        };
        nameGenerator = _.getIdGenerator();
        function Dataset(o, www) {
            o = o || {};
            o.templates = o.templates || {};
            o.templates.notFound = o.templates.notFound || o.templates.empty;
            if (!o.source) {
                $.error("missing source");
            }
            if (!o.node) {
                $.error("missing node");
            }
            if (o.name && !isValidName(o.name)) {
                $.error("invalid dataset name: " + o.name);
            }
            www.mixin(this);
            this.highlight = !!o.highlight;
            this.name = o.name || nameGenerator();
            this.limit = o.limit || 5;
            this.displayFn = getDisplayFn(o.display || o.displayKey);
            this.templates = getTemplates(o.templates, this.displayFn);
            this.source = o.source.__ttAdapter ? o.source.__ttAdapter() : o.source;
            this.async = _.isUndefined(o.async) ? this.source.length > 2 : !!o.async;
            this._resetLastSuggestion();
            this.$el = $(o.node).addClass(this.classes.dataset).addClass(this.classes.dataset + "-" + this.name);
        }
        Dataset.extractData = function extractData(el) {
            var $el = $(el);
            if ($el.data(keys.obj)) {
                return {
                    val: $el.data(keys.val) || "",
                    obj: $el.data(keys.obj) || null
                };
            }
            return null;
        };
        _.mixin(Dataset.prototype, EventEmitter, {
            _overwrite: function overwrite(query, suggestions) {
                suggestions = suggestions || [];
                if (suggestions.length) {
                    this._renderSuggestions(query, suggestions);
                } else if (this.async && this.templates.pending) {
                    this._renderPending(query);
                } else if (!this.async && this.templates.notFound) {
                    this._renderNotFound(query);
                } else {
                    this._empty();
                }
                this.trigger("rendered", this.name, suggestions, false);
            },
            _append: function append(query, suggestions) {
                suggestions = suggestions || [];
                if (suggestions.length && this.$lastSuggestion.length) {
                    this._appendSuggestions(query, suggestions);
                } else if (suggestions.length) {
                    this._renderSuggestions(query, suggestions);
                } else if (!this.$lastSuggestion.length && this.templates.notFound) {
                    this._renderNotFound(query);
                }
                this.trigger("rendered", this.name, suggestions, true);
            },
            _renderSuggestions: function renderSuggestions(query, suggestions) {
                var $fragment;
                $fragment = this._getSuggestionsFragment(query, suggestions);
                this.$lastSuggestion = $fragment.children().last();
                this.$el.html($fragment).prepend(this._getHeader(query, suggestions)).append(this._getFooter(query, suggestions));
            },
            _appendSuggestions: function appendSuggestions(query, suggestions) {
                var $fragment, $lastSuggestion;
                $fragment = this._getSuggestionsFragment(query, suggestions);
                $lastSuggestion = $fragment.children().last();
                this.$lastSuggestion.after($fragment);
                this.$lastSuggestion = $lastSuggestion;
            },
            _renderPending: function renderPending(query) {
                var template = this.templates.pending;
                this._resetLastSuggestion();
                template && this.$el.html(template({
                    query: query,
                    dataset: this.name
                }));
            },
            _renderNotFound: function renderNotFound(query) {
                var template = this.templates.notFound;
                this._resetLastSuggestion();
                template && this.$el.html(template({
                    query: query,
                    dataset: this.name
                }));
            },
            _empty: function empty() {
                this.$el.empty();
                this._resetLastSuggestion();
            },
            _getSuggestionsFragment: function getSuggestionsFragment(query, suggestions) {
                var that = this, fragment;
                fragment = document.createDocumentFragment();
                _.each(suggestions, function getSuggestionNode(suggestion) {
                    var $el, context;
                    context = that._injectQuery(query, suggestion);
                    $el = $(that.templates.suggestion(context)).data(keys.obj, suggestion).data(keys.val, that.displayFn(suggestion)).addClass(that.classes.suggestion + " " + that.classes.selectable);
                    fragment.appendChild($el[0]);
                });
                this.highlight && highlight({
                    className: this.classes.highlight,
                    node: fragment,
                    pattern: query
                });
                return $(fragment);
            },
            _getFooter: function getFooter(query, suggestions) {
                return this.templates.footer ? this.templates.footer({
                    query: query,
                    suggestions: suggestions,
                    dataset: this.name
                }) : null;
            },
            _getHeader: function getHeader(query, suggestions) {
                return this.templates.header ? this.templates.header({
                    query: query,
                    suggestions: suggestions,
                    dataset: this.name
                }) : null;
            },
            _resetLastSuggestion: function resetLastSuggestion() {
                this.$lastSuggestion = $();
            },
            _injectQuery: function injectQuery(query, obj) {
                return _.isObject(obj) ? _.mixin({
                    _query: query
                }, obj) : obj;
            },
            update: function update(query) {
                var that = this, canceled = false, syncCalled = false, rendered = 0;
                this.cancel();
                this.cancel = function cancel() {
                    canceled = true;
                    that.cancel = $.noop;
                    that.async && that.trigger("asyncCanceled", query);
                };
                this.source(query, sync, async);
                !syncCalled && sync([]);
                function sync(suggestions) {
                    if (syncCalled) {
                        return;
                    }
                    syncCalled = true;
                    suggestions = (suggestions || []).slice(0, that.limit);
                    rendered = suggestions.length;
                    that._overwrite(query, suggestions);
                    if (rendered < that.limit && that.async) {
                        that.trigger("asyncRequested", query);
                    }
                }
                function async(suggestions) {
                    suggestions = suggestions || [];
                    if (!canceled && rendered < that.limit) {
                        that.cancel = $.noop;
                        rendered += suggestions.length;
                        that._append(query, suggestions.slice(0, that.limit - rendered));
                        that.async && that.trigger("asyncReceived", query);
                    }
                }
            },
            cancel: $.noop,
            clear: function clear() {
                this._empty();
                this.cancel();
                this.trigger("cleared");
            },
            isEmpty: function isEmpty() {
                return this.$el.is(":empty");
            },
            destroy: function destroy() {
                this.$el = $("<div>");
            }
        });
        return Dataset;
        function getDisplayFn(display) {
            display = display || _.stringify;
            return _.isFunction(display) ? display : displayFn;
            function displayFn(obj) {
                return obj[display];
            }
        }
        function getTemplates(templates, displayFn) {
            return {
                notFound: templates.notFound && _.templatify(templates.notFound),
                pending: templates.pending && _.templatify(templates.pending),
                header: templates.header && _.templatify(templates.header),
                footer: templates.footer && _.templatify(templates.footer),
                suggestion: templates.suggestion || suggestionTemplate
            };
            function suggestionTemplate(context) {
                return $("<div>").text(displayFn(context));
            }
        }
        function isValidName(str) {
            return /^[_a-zA-Z0-9-]+$/.test(str);
        }
    }();
    var Menu = function() {
        "use strict";
        function Menu(o, www) {
            var that = this;
            o = o || {};
            if (!o.node) {
                $.error("node is required");
            }
            www.mixin(this);
            this.$node = $(o.node);
            this.query = null;
            this.datasets = _.map(o.datasets, initializeDataset);
            function initializeDataset(oDataset) {
                var node = that.$node.find(oDataset.node).first();
                oDataset.node = node.length ? node : $("<div>").appendTo(that.$node);
                return new Dataset(oDataset, www);
            }
        }
        _.mixin(Menu.prototype, EventEmitter, {
            _onSelectableClick: function onSelectableClick($e) {
                this.trigger("selectableClicked", $($e.currentTarget));
            },
            _onRendered: function onRendered(type, dataset, suggestions, async) {
                this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty());
                this.trigger("datasetRendered", dataset, suggestions, async);
            },
            _onCleared: function onCleared() {
                this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty());
                this.trigger("datasetCleared");
            },
            _propagate: function propagate() {
                this.trigger.apply(this, arguments);
            },
            _allDatasetsEmpty: function allDatasetsEmpty() {
                return _.every(this.datasets, isDatasetEmpty);
                function isDatasetEmpty(dataset) {
                    return dataset.isEmpty();
                }
            },
            _getSelectables: function getSelectables() {
                return this.$node.find(this.selectors.selectable);
            },
            _removeCursor: function _removeCursor() {
                var $selectable = this.getActiveSelectable();
                $selectable && $selectable.removeClass(this.classes.cursor);
            },
            _ensureVisible: function ensureVisible($el) {
                var elTop, elBottom, nodeScrollTop, nodeHeight;
                elTop = $el.position().top;
                elBottom = elTop + $el.outerHeight(true);
                nodeScrollTop = this.$node.scrollTop();
                nodeHeight = this.$node.height() + parseInt(this.$node.css("paddingTop"), 10) + parseInt(this.$node.css("paddingBottom"), 10);
                if (elTop < 0) {
                    this.$node.scrollTop(nodeScrollTop + elTop);
                } else if (nodeHeight < elBottom) {
                    this.$node.scrollTop(nodeScrollTop + (elBottom - nodeHeight));
                }
            },
            bind: function() {
                var that = this, onSelectableClick;
                onSelectableClick = _.bind(this._onSelectableClick, this);
                this.$node.on("click.tt", this.selectors.selectable, onSelectableClick);
                _.each(this.datasets, function(dataset) {
                    dataset.onSync("asyncRequested", that._propagate, that).onSync("asyncCanceled", that._propagate, that).onSync("asyncReceived", that._propagate, that).onSync("rendered", that._onRendered, that).onSync("cleared", that._onCleared, that);
                });
                return this;
            },
            isOpen: function isOpen() {
                return this.$node.hasClass(this.classes.open);
            },
            open: function open() {
                this.$node.addClass(this.classes.open);
            },
            close: function close() {
                this.$node.removeClass(this.classes.open);
                this._removeCursor();
            },
            setLanguageDirection: function setLanguageDirection(dir) {
                this.$node.attr("dir", dir);
            },
            selectableRelativeToCursor: function selectableRelativeToCursor(delta) {
                var $selectables, $oldCursor, oldIndex, newIndex;
                $oldCursor = this.getActiveSelectable();
                $selectables = this._getSelectables();
                oldIndex = $oldCursor ? $selectables.index($oldCursor) : -1;
                newIndex = oldIndex + delta;
                newIndex = (newIndex + 1) % ($selectables.length + 1) - 1;
                newIndex = newIndex < -1 ? $selectables.length - 1 : newIndex;
                return newIndex === -1 ? null : $selectables.eq(newIndex);
            },
            setCursor: function setCursor($selectable) {
                this._removeCursor();
                if ($selectable = $selectable && $selectable.first()) {
                    $selectable.addClass(this.classes.cursor);
                    this._ensureVisible($selectable);
                }
            },
            getSelectableData: function getSelectableData($el) {
                return $el && $el.length ? Dataset.extractData($el) : null;
            },
            getActiveSelectable: function getActiveSelectable() {
                var $selectable = this._getSelectables().filter(this.selectors.cursor).first();
                return $selectable.length ? $selectable : null;
            },
            getTopSelectable: function getTopSelectable() {
                var $selectable = this._getSelectables().first();
                return $selectable.length ? $selectable : null;
            },
            update: function update(query) {
                var isValidUpdate = query !== this.query;
                if (isValidUpdate) {
                    this.query = query;
                    _.each(this.datasets, updateDataset);
                }
                return isValidUpdate;
                function updateDataset(dataset) {
                    dataset.update(query);
                }
            },
            empty: function empty() {
                _.each(this.datasets, clearDataset);
                this.query = null;
                this.$node.addClass(this.classes.empty);
                function clearDataset(dataset) {
                    dataset.clear();
                }
            },
            destroy: function destroy() {
                this.$node.off(".tt");
                this.$node = $("<div>");
                _.each(this.datasets, destroyDataset);
                function destroyDataset(dataset) {
                    dataset.destroy();
                }
            }
        });
        return Menu;
    }();
    var DefaultMenu = function() {
        "use strict";
        var s = Menu.prototype;
        function DefaultMenu() {
            Menu.apply(this, [].slice.call(arguments, 0));
        }
        _.mixin(DefaultMenu.prototype, Menu.prototype, {
            open: function open() {
                !this._allDatasetsEmpty() && this._show();
                return s.open.apply(this, [].slice.call(arguments, 0));
            },
            close: function close() {
                this._hide();
                return s.close.apply(this, [].slice.call(arguments, 0));
            },
            _onRendered: function onRendered() {
                if (this._allDatasetsEmpty()) {
                    this._hide();
                } else {
                    this.isOpen() && this._show();
                }
                return s._onRendered.apply(this, [].slice.call(arguments, 0));
            },
            _onCleared: function onCleared() {
                if (this._allDatasetsEmpty()) {
                    this._hide();
                } else {
                    this.isOpen() && this._show();
                }
                return s._onCleared.apply(this, [].slice.call(arguments, 0));
            },
            setLanguageDirection: function setLanguageDirection(dir) {
                this.$node.css(dir === "ltr" ? this.css.ltr : this.css.rtl);
                return s.setLanguageDirection.apply(this, [].slice.call(arguments, 0));
            },
            _hide: function hide() {
                this.$node.hide();
            },
            _show: function show() {
                this.$node.css("display", "block");
            }
        });
        return DefaultMenu;
    }();
    var Typeahead = function() {
        "use strict";
        function Typeahead(o, www) {
            var onFocused, onBlurred, onEnterKeyed, onTabKeyed, onEscKeyed, onUpKeyed, onDownKeyed, onLeftKeyed, onRightKeyed, onQueryChanged, onWhitespaceChanged;
            o = o || {};
            if (!o.input) {
                $.error("missing input");
            }
            if (!o.menu) {
                $.error("missing menu");
            }
            if (!o.eventBus) {
                $.error("missing event bus");
            }
            www.mixin(this);
            this.eventBus = o.eventBus;
            this.minLength = _.isNumber(o.minLength) ? o.minLength : 1;
            this.input = o.input;
            this.menu = o.menu;
            this.enabled = true;
            this.active = false;
            this.input.hasFocus() && this.activate();
            this.dir = this.input.getLangDir();
            this._hacks();
            this.menu.bind().onSync("selectableClicked", this._onSelectableClicked, this).onSync("asyncRequested", this._onAsyncRequested, this).onSync("asyncCanceled", this._onAsyncCanceled, this).onSync("asyncReceived", this._onAsyncReceived, this).onSync("datasetRendered", this._onDatasetRendered, this).onSync("datasetCleared", this._onDatasetCleared, this);
            onFocused = c(this, "activate", "open", "_onFocused");
            onBlurred = c(this, "deactivate", "_onBlurred");
            onEnterKeyed = c(this, "isActive", "isOpen", "_onEnterKeyed");
            onTabKeyed = c(this, "isActive", "isOpen", "_onTabKeyed");
            onEscKeyed = c(this, "isActive", "_onEscKeyed");
            onUpKeyed = c(this, "isActive", "open", "_onUpKeyed");
            onDownKeyed = c(this, "isActive", "open", "_onDownKeyed");
            onLeftKeyed = c(this, "isActive", "isOpen", "_onLeftKeyed");
            onRightKeyed = c(this, "isActive", "isOpen", "_onRightKeyed");
            onQueryChanged = c(this, "_openIfActive", "_onQueryChanged");
            onWhitespaceChanged = c(this, "_openIfActive", "_onWhitespaceChanged");
            this.input.bind().onSync("focused", onFocused, this).onSync("blurred", onBlurred, this).onSync("enterKeyed", onEnterKeyed, this).onSync("tabKeyed", onTabKeyed, this).onSync("escKeyed", onEscKeyed, this).onSync("upKeyed", onUpKeyed, this).onSync("downKeyed", onDownKeyed, this).onSync("leftKeyed", onLeftKeyed, this).onSync("rightKeyed", onRightKeyed, this).onSync("queryChanged", onQueryChanged, this).onSync("whitespaceChanged", onWhitespaceChanged, this).onSync("langDirChanged", this._onLangDirChanged, this);
        }
        _.mixin(Typeahead.prototype, {
            _hacks: function hacks() {
                var $input, $menu;
                $input = this.input.$input || $("<div>");
                $menu = this.menu.$node || $("<div>");
                $input.on("blur.tt", function($e) {
                    var active, isActive, hasActive;
                    active = document.activeElement;
                    isActive = $menu.is(active);
                    hasActive = $menu.has(active).length > 0;
                    if (_.isMsie() && (isActive || hasActive)) {
                        $e.preventDefault();
                        $e.stopImmediatePropagation();
                        _.defer(function() {
                            $input.focus();
                        });
                    }
                });
                $menu.on("mousedown.tt", function($e) {
                    $e.preventDefault();
                });
            },
            _onSelectableClicked: function onSelectableClicked(type, $el) {
                this.select($el);
            },
            _onDatasetCleared: function onDatasetCleared() {
                this._updateHint();
            },
            _onDatasetRendered: function onDatasetRendered(type, dataset, suggestions, async) {
                this._updateHint();
                this.eventBus.trigger("render", suggestions, async, dataset);
            },
            _onAsyncRequested: function onAsyncRequested(type, dataset, query) {
                this.eventBus.trigger("asyncrequest", query, dataset);
            },
            _onAsyncCanceled: function onAsyncCanceled(type, dataset, query) {
                this.eventBus.trigger("asynccancel", query, dataset);
            },
            _onAsyncReceived: function onAsyncReceived(type, dataset, query) {
                this.eventBus.trigger("asyncreceive", query, dataset);
            },
            _onFocused: function onFocused() {
                this._minLengthMet() && this.menu.update(this.input.getQuery());
            },
            _onBlurred: function onBlurred() {
                if (this.input.hasQueryChangedSinceLastFocus()) {
                    this.eventBus.trigger("change", this.input.getQuery());
                }
            },
            _onEnterKeyed: function onEnterKeyed(type, $e) {
                var $selectable;
                if ($selectable = this.menu.getActiveSelectable()) {
                    this.select($selectable) && $e.preventDefault();
                }
            },
            _onTabKeyed: function onTabKeyed(type, $e) {
                var $selectable;
                if ($selectable = this.menu.getActiveSelectable()) {
                    this.select($selectable) && $e.preventDefault();
                } else if ($selectable = this.menu.getTopSelectable()) {
                    this.autocomplete($selectable) && $e.preventDefault();
                }
            },
            _onEscKeyed: function onEscKeyed() {
                this.close();
            },
            _onUpKeyed: function onUpKeyed() {
                this.moveCursor(-1);
            },
            _onDownKeyed: function onDownKeyed() {
                this.moveCursor(+1);
            },
            _onLeftKeyed: function onLeftKeyed() {
                if (this.dir === "rtl" && this.input.isCursorAtEnd()) {
                    this.autocomplete(this.menu.getTopSelectable());
                }
            },
            _onRightKeyed: function onRightKeyed() {
                if (this.dir === "ltr" && this.input.isCursorAtEnd()) {
                    this.autocomplete(this.menu.getTopSelectable());
                }
            },
            _onQueryChanged: function onQueryChanged(e, query) {
                this._minLengthMet(query) ? this.menu.update(query) : this.menu.empty();
            },
            _onWhitespaceChanged: function onWhitespaceChanged() {
                this._updateHint();
            },
            _onLangDirChanged: function onLangDirChanged(e, dir) {
                if (this.dir !== dir) {
                    this.dir = dir;
                    this.menu.setLanguageDirection(dir);
                }
            },
            _openIfActive: function openIfActive() {
                this.isActive() && this.open();
            },
            _minLengthMet: function minLengthMet(query) {
                query = _.isString(query) ? query : this.input.getQuery() || "";
                return query.length >= this.minLength;
            },
            _updateHint: function updateHint() {
                var $selectable, data, val, query, escapedQuery, frontMatchRegEx, match;
                $selectable = this.menu.getTopSelectable();
                data = this.menu.getSelectableData($selectable);
                val = this.input.getInputValue();
                if (data && !_.isBlankString(val) && !this.input.hasOverflow()) {
                    query = Input.normalizeQuery(val);
                    escapedQuery = _.escapeRegExChars(query);
                    frontMatchRegEx = new RegExp("^(?:" + escapedQuery + ")(.+$)", "i");
                    match = frontMatchRegEx.exec(data.val);
                    match && this.input.setHint(val + match[1]);
                } else {
                    this.input.clearHint();
                }
            },
            isEnabled: function isEnabled() {
                return this.enabled;
            },
            enable: function enable() {
                this.enabled = true;
            },
            disable: function disable() {
                this.enabled = false;
            },
            isActive: function isActive() {
                return this.active;
            },
            activate: function activate() {
                if (this.isActive()) {
                    return true;
                } else if (!this.isEnabled() || this.eventBus.before("active")) {
                    return false;
                } else {
                    this.active = true;
                    this.eventBus.trigger("active");
                    return true;
                }
            },
            deactivate: function deactivate() {
                if (!this.isActive()) {
                    return true;
                } else if (this.eventBus.before("idle")) {
                    return false;
                } else {
                    this.active = false;
                    this.close();
                    this.eventBus.trigger("idle");
                    return true;
                }
            },
            isOpen: function isOpen() {
                return this.menu.isOpen();
            },
            open: function open() {
                if (!this.isOpen() && !this.eventBus.before("open")) {
                    this.menu.open();
                    this._updateHint();
                    this.eventBus.trigger("open");
                }
                return this.isOpen();
            },
            close: function close() {
                if (this.isOpen() && !this.eventBus.before("close")) {
                    this.menu.close();
                    this.input.clearHint();
                    this.input.resetInputValue();
                    this.eventBus.trigger("close");
                }
                return !this.isOpen();
            },
            setVal: function setVal(val) {
                this.input.setQuery(_.toStr(val));
            },
            getVal: function getVal() {
                return this.input.getQuery();
            },
            select: function select($selectable) {
                var data = this.menu.getSelectableData($selectable);
                if (data && !this.eventBus.before("select", data.obj)) {
                    this.input.setQuery(data.val, true);
                    this.eventBus.trigger("select", data.obj);
                    this.close();
                    return true;
                }
                return false;
            },
            autocomplete: function autocomplete($selectable) {
                var query, data, isValid;
                query = this.input.getQuery();
                data = this.menu.getSelectableData($selectable);
                isValid = data && query !== data.val;
                if (isValid && !this.eventBus.before("autocomplete", data.obj)) {
                    this.input.setQuery(data.val);
                    this.eventBus.trigger("autocomplete", data.obj);
                    return true;
                }
                return false;
            },
            moveCursor: function moveCursor(delta) {
                var query, $candidate, data, payload, cancelMove;
                query = this.input.getQuery();
                $candidate = this.menu.selectableRelativeToCursor(delta);
                data = this.menu.getSelectableData($candidate);
                payload = data ? data.obj : null;
                cancelMove = this._minLengthMet() && this.menu.update(query);
                if (!cancelMove && !this.eventBus.before("cursorchange", payload)) {
                    this.menu.setCursor($candidate);
                    if (data) {
                        this.input.setInputValue(data.val);
                    } else {
                        this.input.resetInputValue();
                        this._updateHint();
                    }
                    this.eventBus.trigger("cursorchange", payload);
                    return true;
                }
                return false;
            },
            destroy: function destroy() {
                this.input.destroy();
                this.menu.destroy();
            }
        });
        return Typeahead;
        function c(ctx) {
            var methods = [].slice.call(arguments, 1);
            return function() {
                var args = [].slice.call(arguments);
                _.each(methods, function(method) {
                    return ctx[method].apply(ctx, args);
                });
            };
        }
    }();
    (function() {
        "use strict";
        var old, keys, methods;
        old = $.fn.typeahead;
        keys = {
            www: "tt-www",
            attrs: "tt-attrs",
            typeahead: "tt-typeahead"
        };
        methods = {
            initialize: function initialize(o, datasets) {
                var www;
                datasets = _.isArray(datasets) ? datasets : [].slice.call(arguments, 1);
                o = o || {};
                www = WWW(o.classNames);
                return this.each(attach);
                function attach() {
                    var $input, $wrapper, $hint, $menu, defaultHint, defaultMenu, eventBus, input, menu, typeahead, MenuConstructor;
                    _.each(datasets, function(d) {
                        d.highlight = !!o.highlight;
                    });
                    $input = $(this);
                    $wrapper = $(www.html.wrapper);
                    $hint = $elOrNull(o.hint);
                    $menu = $elOrNull(o.menu);
                    defaultHint = o.hint !== false && !$hint;
                    defaultMenu = o.menu !== false && !$menu;
                    defaultHint && ($hint = buildHintFromInput($input, www));
                    defaultMenu && ($menu = $(www.html.menu).css(www.css.menu));
                    $hint && $hint.val("");
                    $input = prepInput($input, www);
                    if (defaultHint || defaultMenu) {
                        $wrapper.css(www.css.wrapper);
                        $input.css(defaultHint ? www.css.input : www.css.inputWithNoHint);
                        $input.wrap($wrapper).parent().prepend(defaultHint ? $hint : null).append(defaultMenu ? $menu : null);
                    }
                    MenuConstructor = defaultMenu ? DefaultMenu : Menu;
                    eventBus = new EventBus({
                        el: $input
                    });
                    input = new Input({
                        hint: $hint,
                        input: $input
                    }, www);
                    menu = new MenuConstructor({
                        node: $menu,
                        datasets: datasets
                    }, www);
                    typeahead = new Typeahead({
                        input: input,
                        menu: menu,
                        eventBus: eventBus,
                        minLength: o.minLength
                    }, www);
                    $input.data(keys.www, www);
                    $input.data(keys.typeahead, typeahead);
                }
            },
            isEnabled: function isEnabled() {
                var enabled;
                ttEach(this.first(), function(t) {
                    enabled = t.isEnabled();
                });
                return enabled;
            },
            enable: function enable() {
                ttEach(this, function(t) {
                    t.enable();
                });
                return this;
            },
            disable: function disable() {
                ttEach(this, function(t) {
                    t.disable();
                });
                return this;
            },
            isActive: function isActive() {
                var active;
                ttEach(this.first(), function(t) {
                    active = t.isActive();
                });
                return active;
            },
            activate: function activate() {
                ttEach(this, function(t) {
                    t.activate();
                });
                return this;
            },
            deactivate: function deactivate() {
                ttEach(this, function(t) {
                    t.deactivate();
                });
                return this;
            },
            isOpen: function isOpen() {
                var open;
                ttEach(this.first(), function(t) {
                    open = t.isOpen();
                });
                return open;
            },
            open: function open() {
                ttEach(this, function(t) {
                    t.open();
                });
                return this;
            },
            close: function close() {
                ttEach(this, function(t) {
                    t.close();
                });
                return this;
            },
            select: function select(el) {
                var success = false, $el = $(el);
                ttEach(this.first(), function(t) {
                    success = t.select($el);
                });
                return success;
            },
            autocomplete: function autocomplete(el) {
                var success = false, $el = $(el);
                ttEach(this.first(), function(t) {
                    success = t.autocomplete($el);
                });
                return success;
            },
            moveCursor: function moveCursoe(delta) {
                var success = false;
                ttEach(this.first(), function(t) {
                    success = t.moveCursor(delta);
                });
                return success;
            },
            val: function val(newVal) {
                var query;
                if (!arguments.length) {
                    ttEach(this.first(), function(t) {
                        query = t.getVal();
                    });
                    return query;
                } else {
                    ttEach(this, function(t) {
                        t.setVal(newVal);
                    });
                    return this;
                }
            },
            destroy: function destroy() {
                ttEach(this, function(typeahead, $input) {
                    revert($input);
                    typeahead.destroy();
                });
                return this;
            }
        };
        $.fn.typeahead = function(method) {
            if (methods[method]) {
                return methods[method].apply(this, [].slice.call(arguments, 1));
            } else {
                return methods.initialize.apply(this, arguments);
            }
        };
        $.fn.typeahead.noConflict = function noConflict() {
            $.fn.typeahead = old;
            return this;
        };
        function ttEach($els, fn) {
            $els.each(function() {
                var $input = $(this), typeahead;
                (typeahead = $input.data(keys.typeahead)) && fn(typeahead, $input);
            });
        }
        function buildHintFromInput($input, www) {
            return $input.clone().addClass(www.classes.hint).removeData().css(www.css.hint).css(getBackgroundStyles($input)).prop("readonly", true).removeAttr("id name placeholder required").attr({
                autocomplete: "off",
                spellcheck: "false",
                tabindex: -1
            });
        }
        function prepInput($input, www) {
            $input.data(keys.attrs, {
                dir: $input.attr("dir"),
                autocomplete: $input.attr("autocomplete"),
                spellcheck: $input.attr("spellcheck"),
                style: $input.attr("style")
            });
            $input.addClass(www.classes.input).attr({
                autocomplete: "off",
                spellcheck: false
            });
            try {
                !$input.attr("dir") && $input.attr("dir", "auto");
            } catch (e) {}
            return $input;
        }
        function getBackgroundStyles($el) {
            return {
                backgroundAttachment: $el.css("background-attachment"),
                backgroundClip: $el.css("background-clip"),
                backgroundColor: $el.css("background-color"),
                backgroundImage: $el.css("background-image"),
                backgroundOrigin: $el.css("background-origin"),
                backgroundPosition: $el.css("background-position"),
                backgroundRepeat: $el.css("background-repeat"),
                backgroundSize: $el.css("background-size")
            };
        }
        function revert($input) {
            var www, $wrapper;
            www = $input.data(keys.www);
            $wrapper = $input.parent().filter(www.selectors.wrapper);
            _.each($input.data(keys.attrs), function(val, key) {
                _.isUndefined(val) ? $input.removeAttr(key) : $input.attr(key, val);
            });
            $input.removeData(keys.typeahead).removeData(keys.www).removeData(keys.attr).removeClass(www.classes.input);
            if ($wrapper.length) {
                $input.detach().insertAfter($wrapper);
                $wrapper.remove();
            }
        }
        function $elOrNull(obj) {
            var isValid, $el;
            isValid = _.isJQuery(obj) || _.isElement(obj);
            $el = isValid ? $(obj).first() : [];
            return $el.length ? $el : null;
        }
    })();
});