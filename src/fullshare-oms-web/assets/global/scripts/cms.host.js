if (/http:\/\/t/.test(location.href)) {
    var CMS_API_BASE = "http://tapi.fshtop.com/cms-manager",
        MEMBER_API_BASE = "http://tapi.fshtop.com/member-api/",
        STORE_API_BASE = "http://prevideo.fshtop.com/",
        File_Upload = "http://prevideo.fshtop.com/common/";
} else if (/http:\/\/m/.test(location.href)) {
    var CMS_API_BASE = "http://api.fshtop.com/cms-manager",
        MEMBER_API_BASE = "http://api.fshtop.com/member-api/",
        STORE_API_BASE = "http://video.fshtop.com/",
        File_Upload = "http://video.fshtop.com/common/";
} else if (/http:\/\/cms/.test(location.href)) {
    var CMS_API_BASE = "http://api.fshtop.com/cms-manager",
        MEMBER_API_BASE = "http://api.fshtop.com/member-api/",
        STORE_API_BASE = "http://video.fshtop.com/",
        File_Upload = "http://video.fshtop.com/common/";
} else {
    var CMS_API_BASE = "http://tmanagerapi.fshtop.com/cms-manager",
        MEMBER_API_BASE = "http://tapi.fshtop.com/member-api/",
        STORE_API_BASE = "http://prevideo.fshtop.com/",
        File_Upload = "http://prevideo.fshtop.com/common/";
        ///////////////////////////////////
        ERP_TEST  =  "http://192.168.4.250:8086/eb-manager";
        APP_TEST  =  "http://192.168.4.249:8086/eb-manager";
        ////////////////////////////////////
}