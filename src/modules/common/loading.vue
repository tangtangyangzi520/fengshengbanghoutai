<template>
    <div class="loading" v-show="show">
        <div class="page-spinner-bar">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            show: {
                type: Boolean,
                default: false
            }
        }
    };
</script>
<style lang="less" scoped>
 .loading{
    position: fixed;
    top: 50%;
    left: 50%;
    margin: 0 auto;
    margin-top: -75px;
    margin-top: -10px;
    width: 100px;
    height: 15px;
}
.loading span{
    display: inline-block;
    width: 15px;
    height: 100%;
    margin-right: 5px;
    border-radius: 50%!important;
    background: #36c6d3;
    -webkit-animation: load 1.04s ease infinite;
}
.loading span:last-child{
    margin-right: 0px; 
}
@-webkit-keyframes load{
    0%{
        opacity: 1;
        -webkit-transform: scale(1.3);
    }
    100%{
        opacity: 0.2;
        -webkit-transform: scale(.3);
    }
}
.loading span:nth-child(1){
    -webkit-animation-delay:0.13s;
}
.loading span:nth-child(2){
    -webkit-animation-delay:0.26s;
}
.loading span:nth-child(3){
    -webkit-animation-delay:0.39s;
}
.loading span:nth-child(4){
    -webkit-animation-delay:0.52s;
}
.loading span:nth-child(5){
    -webkit-animation-delay:0.65s;
}
</style>