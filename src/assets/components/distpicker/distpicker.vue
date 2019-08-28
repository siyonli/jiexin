<template>
    <div class="layer-distpicker" v-show="visible">
        <div class="distpicker">
            <div class="distpicker-top">
                <label>所在地区</label>
                <div class="distpicker-close" @click="close()"></div>
            </div>
            <div class="distpicker-content">
                <div class="distpicker-bar" @click="up">
                    <span @click="getProvince()">{{province.value || '选择省'}}</span>
                    <span @click="getCityList(province.value,province.id)"
                          v-if="province.value">{{city.value || '选择市'}}</span>
                    <span v-if="city.value">{{area.value || '选择区'}}</span>
                </div>
                <ul class="distpicker-list" v-if="distpickerActive==1">
                    <li v-for="(val,index) in provinceList" :key="index" @click="getCityList(val)">{{val.region_name}}</li>
                </ul>
                <ul class="distpicker-list" v-if="distpickerActive==2">
                    <li v-for="(val,index) in cityList" :key="index" @click="getAreaList(val)">{{val.region_name}}</li>
                </ul>
                <ul class="distpicker-list" v-if="distpickerActive==3">
                    <li v-for="(val,index) in areaList" :key="index" @click="distpickerDone(val)">{{val.region_name}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import $api from '../../js/api.js'

    export default {
        name: "Distpicker",
        data() {
            return {
                distpickerActive: 1,
                provinceList: [],
                cityList: [],
                areaList: []
            }
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            province: {
                type: Object,
                default: {
                    id: '',
                    value: ''
                }
            },
            city: {
                type: Object,
                default: {
                    id: '',
                    value: ''
                }
            },
            area: {
                type: Object,
                default: {
                    id: '',
                    value: ''
                }
            },
            onselect: {
                type: Function,
                default: function () {
                }
            }
        },
        created() {
            this.getProvince();
            if (this.province.id && this.city.id && this.area.id) {
                this.getCityList(this.province.value, this.province.id);
                this.getAreaList(this.city.value, this.city.id);
            }
        },
        mounted() {

        },
        watch: {},
        methods: {
            up() {
                if (this.distpickerActive == 1) {
                    return
                }
                this.getProvince()
            },
            getProvince() {
                this.province = {};
                this.city = {};
                this.area = {};
                this.distpickerActive = 1;
                $api.queryAddressList({
                    region_type: 1
                }).then(res => {
                    if (res.code == 0) {
                        this.provinceList = res.data.list;
                    }
                })
            },
            getCityList(val) {
                this.province = {
                    id: val.region_id,
                    value: val.region_name
                };
                this.city = {};
                this.area = {};
                this.distpickerActive = 2;

                $api.queryAddressList({
                    region_type: this.distpickerActive,
                    parent_id: val.region_id
                }).then(res => {
                    if (res.code == 0) {
                        this.cityList = res.data.list;
                    }
                })
            },
            getAreaList(val, cb) {
                var that = this;
                this.city = {
                    id: val.region_id,
                    value: val.region_name
                };
                this.area = {};
                this.distpickerActive = 3;
                $api.queryAddressList({
                    region_type: this.distpickerActive,
                    parent_id: val.region_id
                }).then(res => {
                    if (res.code == 0) {
                        this.areaList = res.data.list;
                        if (cb) {
                            cb();
                        }
                    }
                })
            },
            distpickerDone(val) {
                this.area = {
                    id: val.region_id,
                    value: val.region_name
                };
                setTimeout(() => {
                    this.close();
                }, 500)
                this.onselect({
                    province: this.province,
                    city: this.city,
                    area: this.area
                })
            },
            close() {
                this.$emit('update:visible', false)
            }
        }
    }
</script>
<style lang="scss">
    .layer-distpicker {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        layout-flow: 0;
        background-color: rgba(0, 0, 0, .5);
        z-index: 99;
        .distpicker {
            position: absolute;
            width: 100%;
            bottom: 0;
            left: 0;
            background-color: #FFFFFF;
            .distpicker-top {
                height: 1.2rem;
                text-align: center;
                line-height: 1.2rem;
                font-size: 0.4rem;
                color: #333333;
                position: relative;
                border-bottom: 1px solid rgba(227, 227, 227, 1);
            }
            .distpicker-close {
                width: 0.32rem;
                height: 0.32rem;
                position: absolute;
                top: 0.44rem;
                right: 0.4rem;
                background: url(../../images/close.png) no-repeat;
                background-size: 100%;
            }
        }
        .distpicker-content {
            overflow: hidden;
            .distpicker-bar {
                height: 1.2rem;
                line-height: 1.2rem;
                font-size: 0.3733rem;
                color: #333333;
                border-bottom: 1px solid rgba(227, 227, 227, 1);
                overflow: hidden;
                span {
                    display: block;
                    height: 100%;
                    float: left;
                    margin-left: 0.4rem;
                }
            }
            .distpicker-list {
                height: 10.25rem;
                overflow: hidden;
                overflow-y: auto;
                padding: 0 0.4rem;
                li {
                    color: #666666;
                    font-size: 0.3733rem;
                    height: 1.09rem;
                    line-height: 1.09rem;
                    border-top: 1px solid rgba(227, 227, 227, 1);
                }
                li:first-child {
                    border-top: none;
                }
            }
        }
    }
</style>
