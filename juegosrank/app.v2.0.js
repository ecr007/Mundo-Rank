var Weare=function(){var soloNumeros=function(event){if(event.keyCode==46||event.keyCode==8||event.keyCode==13||event.keyCode==9||event.keyCode==110||event.keyCode==190){}
else{if(event.keyCode<95){if(event.keyCode<48||event.keyCode>57){event.preventDefault();}}else{if(event.keyCode<96||event.keyCode>105){event.preventDefault();}}}}
var activarSoloNumeros=function(){$(document).on("keydown",".onlyNumber",function(event){soloNumeros(event);});}
var contadorAutomatico=function(count,element){var div_by=100;var speed=count/div_by;var $display=$(element);var run_count=0.1;var int_speed=10;var int=setInterval(function(){if(parseFloat($display.text())<count){var curr_count=parseFloat($display.text())+0.1;var numero=curr_count.toFixed(1);$display.text(numero);}else if(parseFloat($display.text())>count){var curr_count=parseFloat($display.text())-0.1;var numero=curr_count.toFixed(1);$display.text(numero);}else{clearInterval(int);}},int_speed);}
var mostararAlerta=function(destino,tipo,ocultar,mensaje){$(destino).addClass(tipo);$(destino).removeClass(ocultar);$(destino).html(mensaje);$(destino).fadeIn('slow');}
var mostararAlertaSweet=function(titulo,mensaje,tipo){swal({title:titulo,text:mensaje,type:tipo});}
var vistaImagenes=function(file,imgContentClass,tipo){var reader=new FileReader();var image=new Image();reader.readAsDataURL(file);reader.onload=function(_file){image.src=_file.target.result;image.onload=function(){var w=this.width,h=this.height,t=this.type,n=this.name,s=~~(this.size/1024)+'KB';if(tipo==1)$(imgContentClass).html('<span><img src="'+this.src+'" class="img-responsive" alt=""></span>');if(tipo==8)$(imgContentClass).append('<div class="ecr-hover-img margin-bottom-20"><span><img src="'+this.src+'" class="img-responsive" alt=""></span></div>');};image.onerror=function(){mostararAlertaSweet('¡Hemos tenido un problema!','La imagen cargada es ivalida.','error');};};}
var validarFormularioDeContacto=function(){$("#ecr-btn-contacto").click(function(){$(this).prop('disabled',true);$("#ecr-contact-form").submit();});$("#ecr-contact-form").validate({invalidHandler:function(form,validator){var errors=validator.numberOfInvalids();if(errors){$("#ecr-btn-contacto").prop('disabled',false);}},rules:{nombre:"required",asunto:"required",email:{required:true,validarCorreo:true},descripcion:"required"},messages:{nombre:'Por favor escribe tu nombre completo.',asunto:'Por favor escribe el asunto',email:{required:'Por favor escribe tu correo electrónico',validarCorreo:'Por favor escribe un correo electrónico valido'},descripcion:'Por favor escribe la descripción del mensaje'}});}
var irA=function(donde){$('html, body').stop().animate({scrollTop:$(donde).offset().top},700,'easeInOutExpo');}
var activarScroll=function(){$('.ecr-scroll').bind('click',function(event){var $anchor=$(this);$('html, body').stop().animate({scrollTop:$($anchor.attr('href')).offset().top},700,'easeInOutExpo');event.preventDefault();});}
var mostrarModalesUsuarios=function(){$(document).on('click','.ecr-inisiar-sesion',function(){$('#ecr-modal-login .ecr-alerta').hide();$('#ecr-modal-registro').modal('hide');$('#ecr-modal-login').modal('show');return false;});$(document).on('click','.ecr-alert-registtto',function(){mostararAlerta('#ecr-modal-login .ecr-alerta','alert-warning','alert-success','Por favor iniciar sesión para continuar.');$('#ecr-modal-registro').modal('hide');$('#ecr-modal-login').modal('show');return false;});$(document).on('click','.ecr-registro',function(){$('#ecr-modal-login').modal('hide');$('#ecr-modal-pass').modal('hide');$('#ecr-modal-registro').modal('show');return false;});$(document).on('click','.ecr-olvido-pass',function(){$('#ecr-modal-login').modal('hide');$('#ecr-modal-pass').modal('show');return false;});$('#ecr-modal-login').on('hidden.bs.modal',function(e){$('body').removeAttr('style');});$('#ecr-modal-registro').on('hidden.bs.modal',function(e){$('body').removeAttr('style');});$('#ecr-modal-pass').on('hidden.bs.modal',function(e){$('body').removeAttr('style');});}
var enviarFormularioRegistro=function(){$("#ecr-btn-registro").click(function(){$(this).prop('disabled',true);$("#ecr-registro").submit();});$("#ecr-registro").validate({invalidHandler:function(form,validator){var errors=validator.numberOfInvalids();if(errors){$("#ecr-btn-registro").prop('disabled',false);}},rules:{nombre:"required",email:{required:true,validarCorreo:true},re_email:{required:true,validarCorreo:true,equalTo:"#email"},pass:"required",re_pass:{required:true,equalTo:"#pass"}},messages:{nombre:'Por favor escribe tu nombre completo',email:{required:'Por favor escribe tu correo electrónico',validarCorreo:'Por favor escribe un correo electrónico valido'},re_email:{required:'Por favor escribe tu correo electrónico',validarCorreo:'Por favor escribe un correo electrónico valido',equalTo:'Los correos no coinciden'},pass:'Por favor escribe tu contraseña',re_pass:{required:'Por favor escribe tu contraseña',equalTo:'Las contraseña no coinciden'}},submitHandler:function(){$('#ecr-modal-registro .ecr-loading').fadeIn('slow');$.ajax({url:URL+'/registro',type:'POST',dataType:'json',data:$('#ecr-registro').serialize()+'&_token='+token,success:function(dato){if(dato.code==200){mostararAlerta('#ecr-modal-registro .ecr-alerta','alert-success','alert-danger',dato.mensaje);document.getElementById('ecr-registro').reset();$("#ecr-btn-registro").prop('disabled',false);$('#ecr-modal-registro .ecr-loading').fadeOut('slow');}
if(dato.code==400){mostararAlerta('#ecr-modal-registro .ecr-alerta','alert-danger','alert-success',dato.mensaje);$("#ecr-btn-registro").prop('disabled',false);$('#ecr-modal-registro .ecr-loading').fadeOut('slow');}}});}});}
var enviarLogin=function(){$("#ecr-btn-inicio").click(function(){$(this).prop('disabled',true);$("#ecr-login").submit();});$("#ecr-login").validate({invalidHandler:function(form,validator){var errors=validator.numberOfInvalids();if(errors){$("#ecr-btn-inicio").prop('disabled',false);}},rules:{email:{required:true,validarCorreo:true},pass:"required"},messages:{email:{required:'Por favor escribe tu correo electrónico',validarCorreo:'Por favor escribe un correo electrónico valido'},pass:'Por favor escribe tu contraseña'},submitHandler:function(){$('#ecr-modal-login .ecr-loading').fadeIn('slow');$.ajax({url:URL+'/iniciar-sesion',type:'POST',dataType:'json',data:$('#ecr-login').serialize()+'&weare='+80+'&ax=ok&_token='+token,success:function(dato){if(dato.code==200){location.reload(true);}
if(dato.code==400){mostararAlerta('#ecr-modal-login .ecr-alerta','alert-danger','alert-success',dato.mensaje);$("#ecr-btn-inicio").prop('disabled',false);$('#ecr-modal-login .ecr-loading').fadeOut('slow');}}});}});}
var resetearClave=function(){$("#ecr-btn-pass").click(function(){$(this).prop('disabled',true);$("#ecr-pass-return").submit();});$("#ecr-pass-return").validate({invalidHandler:function(form,validator){var errors=validator.numberOfInvalids();if(errors){$("#ecr-btn-pass").prop('disabled',false);}},rules:{email:{required:true,validarCorreo:true}},messages:{email:{required:'Por favor escribe tu correo electrónico',validarCorreo:'Por favor escribe un correo electrónico valido'}},submitHandler:function(){$('#ecr-modal-pass .ecr-loading').fadeIn('slow');$.ajax({url:URL+'/recuperar-clave',type:'POST',dataType:'json',data:$('#ecr-pass-return').serialize()+'&ax=ok&_token='+token,success:function(dato){if(dato.code==200){mostararAlerta('#ecr-modal-pass .ecr-alerta','alert-success','alert-danger',dato.mensaje);document.getElementById('ecr-pass-return').reset();$("#ecr-btn-pass").prop('disabled',false);$('#ecr-modal-pass .ecr-loading').fadeOut('slow');}
if(dato.code==400){mostararAlerta('#ecr-modal-pass .ecr-alerta','alert-danger','alert-success',dato.mensaje);$("#ecr-btn-pass").prop('disabled',false);$('#ecr-modal-pass .ecr-loading').fadeOut('slow');}}});}});}
var vistaPreviaImg=function(){$("#ecr-main-img").change(function(e){if(this.disabled){return mostararAlertaSweet('¡Hemos tenido un problema!','La imagen cargada es ivalida.','error');}
$('.ecr-img-main i').addClass('fa-cloud-upload');$('.ecr-img-main i').removeClass('fa-check-circle');$('.ecr-img-main').removeClass('ecr-ok');var F=this.files;if(F&&F[0]){vistaImagenes(F[0],'.ecr-contenedor-img-main',1);$('.ecr-contenedor-img-main').show();$('.ecr-img-main i').removeClass('fa-cloud-upload');$('.ecr-img-main i').addClass('fa-check-circle');$('.ecr-img-main').addClass('ecr-ok');}});$("#ecr-clasif-galeria").change(function(e){if(this.disabled)return mostararAlertaSweet('¡Hemos tenido un problema!','La imagen cargada es ivalida.','error');var F=this.files;$('.ecr-contenedor-img-galeria').html('');if(F&&F[0]){var tamanioGaleria=F.length;if(tamanioGaleria>8){$("#ecr-clasif-galeria").val('');mostararAlertaSweet('¡Hemos tenido un problema!','No cargar más 8 imagenes por clasificado.','error');$('.ecr-img-galeria i').addClass('fa-cloud-upload');$('.ecr-img-galeria i').removeClass('fa-check-circle');$('.ecr-img-galeria').removeClass('ecr-ok');}else{for(var i=0;i<tamanioGaleria;i++){vistaImagenes(F[i],'.ecr-contenedor-img-galeria',8);}
$('.ecr-contenedor-img-galeria').show();$('.ecr-img-galeria i').removeClass('fa-cloud-upload');$('.ecr-img-galeria i').addClass('fa-check-circle');$('.ecr-img-galeria').addClass('ecr-ok');}}});}
var confirmarEliminado=function(){$('.eliminar-alert').click(function(){window.link=$(this).attr('href');swal({title:'¿Desea continuar?',text:'Se eliminará el contenido!',type:"error",showCancelButton:true,confirmButtonClass:"btn-danger",confirmButtonText:'Si, eliminar ahora!',cancelButtonText:'Cancelar',closeOnConfirm:true,closeOnCancel:true},function(isConfirm){if(isConfirm){document.location.href=link;}else{return false;}});return false;});}
var dropdownEffectData=function(target){var effectInDefault=null,effectOutDefault=null;var dropdown=$(target),dropdownMenu=$('.dropdown-menu',target);var parentUl=dropdown.parents('ul.nav');if(parentUl.size()>0){effectInDefault=parentUl.data('dropdown-in')||null;effectOutDefault=parentUl.data('dropdown-out')||null;}
return{target:target,dropdown:dropdown,dropdownMenu:dropdownMenu,effectIn:dropdownMenu.data('dropdown-in'),effectOut:dropdownMenu.data('dropdown-out'),};}
var dropdownEffectStart=function(data,effectToStart){if(effectToStart){data.dropdown.addClass('dropdown-animating');data.dropdownMenu.addClass('animated');data.dropdownMenu.addClass(effectToStart);}}
var dropdownEffectEnd=function(data,callbackFunc){var animationEnd='webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';data.dropdown.one(animationEnd,function(){data.dropdown.removeClass('dropdown-animating');data.dropdownMenu.removeClass('animated');data.dropdownMenu.removeClass(data.effectIn);data.dropdownMenu.removeClass(data.effectOut);if(typeof callbackFunc=='function'){callbackFunc();}});}
var dispararEfectosDropDown=function(){var dropdownSelectors=$('.dropdown, .dropup');dropdownSelectors.on('show.bs.dropdown',function(){var dropdown=dropdownEffectData(this);dropdownEffectStart(dropdown,dropdown.effectIn);});dropdownSelectors.on('shown.bs.dropdown',function(){var dropdown=dropdownEffectData(this);if(dropdown.effectIn&&dropdown.effectOut){dropdownEffectEnd(dropdown,function(){});}});dropdownSelectors.on('hide.bs.dropdown',function(e){var dropdown=dropdownEffectData(this);if(dropdown.effectOut){e.preventDefault();dropdownEffectStart(dropdown,dropdown.effectOut);dropdownEffectEnd(dropdown,function(){dropdown.dropdown.removeClass('open');});}});}
var adaptarImagenCover=function(){var img=document.getElementsByClassName('ecr-resize');for(var i=0;i<img.length;i++){imgCoverEffect(img[i],{alignX:'right',alignY:'bottom',watchResize:false});}}
var sinTeclado=function(event){event.preventDefault();}
var preCargaImagenes=function(){$(".ecr-pre-carga").lazyload({effect:"fadeIn",threshold:200});}
var validarNewsletter=function(){$("#ecr-btn-newsletter").click(function(){$(this).prop('disabled',true);$(".ecr-newsletter-form").submit();});$(".ecr-newsletter-form").validate({invalidHandler:function(form,validator){var errors=validator.numberOfInvalids();if(errors){$("#ecr-btn-newsletter").prop('disabled',false);}},rules:{EMAIL:{required:true,validarCorreo:true}},messages:{EMAIL:{required:'Por favor escribe tu correo electrónico',validarCorreo:'Por favor escribe un correo electrónico valido'}}});}
var validarFormComentarios=function(){$(document).on('click','#ecr-send-comentario',function(){$(this).prop('disabled',true);if(navigator.userAgent.match(/.net/i)){$(this).hide();}
$("#ecr-form-comentarios").submit();});$("#ecr-form-comentarios").validate({invalidHandler:function(form,validator){var errors=validator.numberOfInvalids();if(errors){$("#ecr-send-comentario").prop('disabled',false);if(navigator.userAgent.match(/.net/i)){$("#ecr-send-comentario").show();}}},rules:{texto:{required:true,minlength:60},},messages:{texto:{required:'Por favor escribe tu comentario.',minlength:'Tu comentario debe tener un mínimo de 60 carácteres'},}});}
var ejecutarRespuesta=function(){$('.ecr-respuesta').click(function(){var escritor=$(this).data('escrito');var id=$(this).data('ii');$('#ecr-comentario-text').val('@'+escritor+' ');$('#ecr-comentario-text').focus();$('#ecr-f-r').val(id);$('html, body').stop().animate({scrollTop:$('#ecr-fin-comment').offset().top},500,'easeInOutExpo');});}
var ejecutarParticulas=function(){$('.ecr-youtubers').particleground({dotColor:'#b4ff00',lineColor:'#b60246'});}
var pintarFondo=function(){var colores=['PuRd','Reds','Purples','Blues','GnBu','PRGn'];var pattern=Trianglify({height:1400,width:1920,cell_size:70,x_colors:colores[Math.floor(Math.random()*6)],palette:Trianglify.colorbrewer,});$('.seccionGanadores').prepend(pattern.canvas());}
var handleScrolling=function(){$(".ecr-scroll").on("click",function(event){event.preventDefault();var link=this.href.split("#")[1];$('html, body').stop().animate({scrollTop:$('#'+link).offset().top},600,'easeInOutExpo');});}
var irAlMenu=function(){$(".ecr-menu").onePageNav({currentClass:"ecr-active",scrollThreshold:0,scrollSpeed:480,filter:':not(.ecr-no-scroll)',end:function(){pintarRutas();},scrollChange:function(current){pintarRutas();}});}
var ocultarMenuMovil=function(){$(document).on('click','.ecr-scroll',function(){if($(this).attr('href')!='#inicio'){$('.navbar-default').addClass('navbar-fixed-top');}else{$('.navbar-default').removeClass('navbar-fixed-top');}
$('.navbar-toggle').click();});}
var fixedMenu=function(){var CurrentHeaderPosition=$(".ecr-main-menu nav").offset().top;var headerFix=function(){var CurrentWindowPosition=$(window).scrollTop();if(CurrentWindowPosition>CurrentHeaderPosition){$(".ecr-main-menu nav").addClass("navbar-fixed-top");}else{$(".ecr-main-menu nav").removeClass("navbar-fixed-top");}};headerFix();if(navigator.userAgent.match(/iPhone|iPad|iPod/i)){$(window).bind("touchend touchcancel touchleave",function(e){headerFix();});}else{$(window).scroll(function(){headerFix();});}}
var pintarRutas=function(){var menuTop=($(".ecr-main-menu nav").offset().top)+54+4;var link='/';if(menuTop>=Math.floor($('#ultimos-videos').offset().top)){link='ultimos-videos';}
if(menuTop>=Math.floor($('#top-youtubers').offset().top)){link='top-youtubers';}
if(menuTop>=Math.floor($('#noticias').offset().top)){link='noticias';}
if(menuTop>=Math.floor($('#top-rankers').offset().top)){link='top-rankers';}
history.pushState(null,null,link);}
var refrescarScroll=function(){window.onload=function(){var rutas=['/ultimos-videos','/top-youtubers','/noticias','/top-rankers'];if($.inArray(window.location.pathname,rutas)!=-1){setTimeout(function(){scrollTo(0,0);},100);}}}
var negocioCalificar=function(){$('#ecr-form-calificar button').click(function(){var tipo=$(this).data('tipo');$('button[data-tipo="'+tipo+'"]').removeClass('ecr-active');$(this).addClass('ecr-active');$('.'+tipo).val($(this).text());});}
var calificarVideo=function(){$('#ecr-btn-calificar').click(function(){$(this).prop('disabled',true);if(navigator.userAgent.match(/.net/i)){$(this).hide();var comentario=$('#ecr-comentario-text').val();var ecr_f_r=$('#ecr-f-r').val();var d5_vvii=$('#d5-vvii').val();var serializze=$('#ecr-form-calificar').serialize()+'&_token='+token;serializze+='&iii_rrr='+ecr_f_r+'&d5_vvii='+d5_vvii+'&texto='+comentario;}else{var serializze=$('#ecr-form-calificar').serialize()+'&_token='+token;}
$('.ecr-calificar .ecr-loading').fadeIn('slow');$.ajax({url:URL+'/calificar-video',type:'POST',dataType:'json',data:serializze,success:function(dato){if(dato.code==200){mostararAlerta('.ecr-calificar .ecr-alerta','alert-success','alert-danger',dato.mensaje);$('#ecr-form-calificar').remove();function pintarBarras(item,dato){$('.ecr-bar-'+item).data('valuenow',dato[item]);$('.ecr-bar-'+item).css('width',(dato[item])+'%');$('.ecr-bar-'+item+' span').text((dato[item])+'%');}
setTimeout(function(){contadorAutomatico(dato.promedio,'.ecr-promedio p');pintarBarras('diversion',dato);pintarBarras('youtuber',dato);pintarBarras('imagen',dato);pintarBarras('sonido',dato);pintarBarras('duracion',dato);},1000);$('.ecr-coment-rating').remove();$('#ecr-form-comentarios').show();$('.ecr-text-comment').attr('id','ecr-comentario-text');$('.ecr-f-r').attr('id','ecr-f-r');$('.ecr-count-letras').text('0 Caracteres');irA('.blog-post-meta');}
if(dato.code==400){mostararAlerta('.ecr-calificar .ecr-alerta','alert-danger','alert-success',dato.mensaje);$("#ecr-btn-calificar").prop('disabled',false);if(navigator.userAgent.match(/.net/i)){$("#ecr-btn-calificar").show();}
$('.ecr-calificar .ecr-loading').fadeOut('slow');irA('.ecr-calificar h2');}}});});}
var ejecutarSliderTopYoutubers=function(){$('.ecr-slider-top-youtubers, .ecr-ganadores').slick({slidesToShow:4,slidesToScroll:1,speed:300,infinite:false,});}
var ejecutarPortfolio=function(){$('#js-grid-mosaic').cubeportfolio({loadMore:'#js-loadMore-mosaic',loadMoreAction:'click',layoutMode:'grid',sortToPreventGaps:true,mediaQueries:[{width:1500,cols:2},{width:1100,cols:2},{width:800,cols:2},{width:480,cols:2},{width:320,cols:2}],defaultFilter:'*',animationType:'quicksand',gapHorizontal:20,gapVertical:20,gridAdjustment:'responsive',caption:'zoom',displayType:'sequentially',displayTypeSpeed:80,lightboxDelegate:'.cbp-lightbox',lightboxGallery:true,lightboxTitleSrc:'data-title',lightboxCounter:'<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',});$('#ecr-gallery-blog').cubeportfolio({loadMore:'#ecr-gallery-blog-read-more',loadMoreAction:'click',layoutMode:'grid',sortToPreventGaps:true,mediaQueries:[{width:1500,cols:4},{width:1100,cols:4},{width:800,cols:4},{width:480,cols:3},{width:320,cols:2}],defaultFilter:'*',animationType:'quicksand',gapHorizontal:20,gapVertical:20,gridAdjustment:'responsive',caption:'zoom',displayType:'sequentially',displayTypeSpeed:80,lightboxDelegate:'.cbp-lightbox',lightboxGallery:true,lightboxTitleSrc:'data-title',lightboxCounter:'<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',});}
var disenioInputs=function(){if(!$().uniform){return;}
var test=$("input[type=checkbox]:not(.toggle, .md-check, .md-radiobtn, .make-switch, .icheck), input[type=radio]:not(.toggle, .md-check, .md-radiobtn, .star, .make-switch, .icheck)");if(test.size()>0){test.each(function(){if($(this).parents(".checker").size()===0){$(this).show();$(this).uniform();}});}};var validarFormYoutuber=function(){$("#ecr-btn-registrar-youtuber").click(function(){$(this).prop('disabled',true);$("#ecr-form-youtuber").submit();});$("#ecr-form-youtuber").validate({invalidHandler:function(form,validator){var errors=validator.numberOfInvalids();if(errors){$("#ecr-btn-registrar-youtuber").prop('disabled',false);}},rules:{youtuber:"required",red:"required"},messages:{youtuber:'Por favor escribir el ID del canal',red:'Por favor seleccionar red a vincular',}});}
var normasDelRanking=function(){$('#ecr-btn-normas').click(function(){$('#ecr-normas-content').load(URL+'/normas-del-ranking',function(){$('.modal').modal('hide');$('#ecr-modal-normas').modal('show');});return false;});}
var tooltip=function(){$('[data-toggle="tooltip"]').tooltip();}
var handleGo2Top=function(){var Go2TopOperation=function(){var CurrentWindowPosition=$(window).scrollTop();if(CurrentWindowPosition>300){$(".go2top").show();}else{$(".go2top").hide();}};Go2TopOperation();if(navigator.userAgent.match(/iPhone|iPad|iPod/i)){$(window).bind("touchend touchcancel touchleave",function(e){Go2TopOperation();});}else{$(window).scroll(function(){Go2TopOperation();});}
$(document).on('click','.go2top',function(){$('html, body').stop().animate({scrollTop:$('.ecr-header').offset().top},600,'easeInOutExpo');return false;});}
var aceptarCookies=function(){$(document).on('click','.aceptar-cookies',function(){$('.content-cookies').hide();$.ajax({url:"/aceptar-cookies",dataType:"json",type:"POST",data:"cookies=ok&_token="+token,success:function(dato){if(dato.code==400){$('.content-cookies').hide();}}});return false;});}
var noPegar=function(){$('#re_email').on('paste',function(){return false;});}
var eliminarOpcions=function(){var ss=$('#ecr-play').contents().find('html').html();console.log(ss);}
var activarReproductor=function(){videojs('ecr-video-play',{controls:true,muted:false,width:1000,plugins:{videoJsResolutionSwitcher:{default:'720'}}},function(){});$('#ecr-video-play').on('contextmenu',function(e){e.preventDefault();});}
var eliminarParrafosVacios=function(){$('.ecr-blog-temp p, .ecr-blog-temp span').each(function(){var $this=$(this);if($this.html().replace(/\s|&nbsp;|<br>|<br class="Apple-interchange-newline">/g,'').length==0){$this.remove();}});$('.ecr-blog-temp p br').remove();}
var contarCaracteres=function(){$('.ecr-text-comment,.ecr-coment-ratingt').on('keyup',function(){var cc=$(this).val().length;$('.ecr-count-letras').text(cc+" Caracteres");});$('.ecr-text-comment,.ecr-coment-ratingt').on('keyup',function(){var cc=$(this).val().length;$('.ecr-count-letras').text(cc+" Caracteres");});}
var ocultarCalificaciones=function(){$('.ecr-promedio').each(function(key,value){var cm=$(value).data('cm');window.tm=$('.ecr-cm-'+cm).length-1;$('.ecr-cm-'+cm).each(function(index,el){if(index!=tm){$(el).hide();}});});}
var mostrarBuscador=function(){$('#ecr-link-buscar, a[href="#modal-buscar"]').click(function(){$('.ecr-content-buscar').addClass('ecr-content-buscar-show');return false;});$('.ecr-cerrar-bucador').click(function(){$('.ecr-content-buscar').removeClass('ecr-content-buscar-show');return false;});}
var autoCompletado=function(ruta){window.rutaBuscar=ruta;var informacion=new Bloodhound({datumTokenizer:Bloodhound.tokenizers.whitespace,queryTokenizer:Bloodhound.tokenizers.whitespace,prefetch:rutaBuscar});$('.ecr-main-bunscar').typeahead('destroy');$('.ecr-main-bunscar').typeahead(null,{name:'q',source:informacion,});}
var cambiarCodigoAutoCompletado=function(){$(document).on('change','#ecr-tipo-buscar',function(){var valor=$(this).val();switch(valor){case'canales':autoCompletado('/canales/list');break;case'noticias':autoCompletado('/noticias/list/list/list');break;default:autoCompletado('/videos/list');break;}});}
return{init:function(){activarSoloNumeros();validarFormularioDeContacto();mostrarModalesUsuarios();enviarFormularioRegistro();enviarLogin();resetearClave();confirmarEliminado();preCargaImagenes();validarNewsletter();eliminarParrafosVacios();disenioInputs();handleGo2Top();aceptarCookies();noPegar();normasDelRanking();mostrarBuscador();autoCompletado('/videos/list');cambiarCodigoAutoCompletado();},initLoad:function(){},initLoadBajar:function(){},onlyDescktop:function(){ejecutarParticulas();},onlyMovilInicio:function(){ocultarMenuMovil();},initInicio:function(){pintarFondo();irAlMenu();fixedMenu();pintarRutas();},initSecciones:function(){negocioCalificar();calificarVideo();validarFormComentarios();ejecutarRespuesta();refrescarScroll();ejecutarPortfolio();validarFormYoutuber();tooltip();contarCaracteres();ocultarCalificaciones();},play:function(){activarReproductor();}};}();