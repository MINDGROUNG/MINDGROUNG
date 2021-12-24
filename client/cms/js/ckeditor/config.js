/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */
CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';
    config.filebrowserUploadUrl = '/protocol/ckImageUpload';
    config.ignoreEmptyParagraph = true;
    config.fillEmptyBlocks = false;
    config.entities = false;
    config.basicEntities = false;
    config.height = '450px';
    config.language = 'ko'; // 언어설정 툴바 메뉴가 한글로 출력됨(대소문자 구별)

    config.font_names = '맑은 고딕; 돋움; 바탕; 돋음; 궁서; Nanum Gothic Coding; Quattrocento Sans;' + CKEDITOR.config.font_names; //기본 글꼴에 +기호로 한글 글꼴을 추가 한다.

    config.uiColor = '#EEEEEE'; //ui 색상

    config.font_defaultLabel = 'Gulim';

    config.fontSize_defaultLabel = '12px';

    config.fontSize_sizes = '8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;';

    config.enterMode = CKEDITOR.ENTER_BR; //엔터키 입력시 br 태그 변경
    config.allowedContent = true;

    config.shiftEnterMode = CKEDITOR.ENTER_BR; //엔터키 입력시 p 태그로 변경

    config.docType = '<!DOCTYPE html>'; //문서타입 설정

    config.extraPlugins = 'image2,youtubevideo'; //youtubevideo : 유튜브 동영상 삽입 커스텀 플러그인

    config.image2_alignClasses = ['image-left', 'image-center', 'image-right'];
    config.image2_captionedClass = 'image-captioned';

    config.toolbarGroups = [
        { name: 'document', groups: ['mode', 'document', 'doctools'] },

        { name: 'clipboard', groups: ['clipboard', 'undo'] },

        { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },

        { name: 'forms', groups: ['forms'] },

        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },

        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },

        { name: 'links', groups: ['links'] },
        { name: 'check', groups: ['sup'] },
        '/',

        { name: 'insert', groups: ['insert'] },

        { name: 'colors', groups: ['colors'] },

        { name: 'tools', groups: ['tools'] },

        { name: 'styles', groups: ['styles'] },

        '/',

        { name: 'others', groups: ['others'] },

        { name: 'about', groups: ['about'] },
    ]; //여기까지는 사용되는 모든 툴바의 그룹이 설정되어 있다.

    config.removeButtons =
        'Maximize,CopyFormatting,RemoveFormat,Smiley,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Strike,Subscript,Checkbox,NumberedList,BulletedList,Indent,Outdent,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Anchor,Flash,HorizontalRule,PageBreak,Iframe,ShowBlocks,About';
};
