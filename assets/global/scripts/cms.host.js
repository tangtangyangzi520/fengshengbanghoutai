if (/http:\/\/t/.test(location.href)) {
    var CMS_API_BASE = "http://tapi.fshtop.com/cms-manager",
        MEMBER_API_BASE = "http://tapi.fshtop.com/member-api/",
        STORE_API_BASE = "http://prevideo.fshtop.com/",
        File_Upload = "http://prevideo.fshtop.com/common/";
    OMS_TEST = "http://192.168.7.208:8087/eb-manager";
    APP_TEST = "http://192.168.7.208:8087/eb-manager";
} else if (/http:\/\/m/.test(location.href)) {
    var CMS_API_BASE = "http://api.fshtop.com/cms-manager",
        MEMBER_API_BASE = "http://api.fshtop.com/member-api/",
        STORE_API_BASE = "http://video.fshtop.com/",
        File_Upload = "http://video.fshtop.com/common/";
} else if (/http:\/\/oms/.test(location.href)) {
    var CMS_API_BASE = "http://api.fshtop.com/cms-manager",
        MEMBER_API_BASE = "http://api.fshtop.com/member-api/",
        STORE_API_BASE = "http://video.fshtop.com/",
        File_Upload = "http://video.fshtop.com/common/";

    OMS_TEST = "http://api.fshtop.com/eb-manager"
    APP_TEST = "http://api.fshtop.com/eb-manager"
} else {
    var CMS_API_BASE = "http://tapi.fshtop.com/cms-manager",
        MEMBER_API_BASE = "http://tapi.fshtop.com/member-api/",
        STORE_API_BASE = "http://prevideo.fshtop.com/",
        File_Upload = "http://prevideo.fshtop.com/common/";

    OMS_TEST = "http://tapi.fshtop.com/eb-manager"
    APP_TEST = "http://tapi.fshtop.com/eb-manager"
}