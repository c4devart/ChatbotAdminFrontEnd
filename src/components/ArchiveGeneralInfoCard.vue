<template>
  <detail-card v-if="generalinfo.name" :title="$t('generalInfo')">
    <div slot="content">
      <div class="general-info">
        <div class="user-account my-2">
          <!-- <img src="@/assets/imgs/avatar.png" class="avatar" /> -->
          <div class="user_symbol_container mr-2">
            <span class="symbol-content">{{ nameShortCut }}</span>
          </div>
          <div class="customer-name">
            {{ generalinfo.name }}<br />{{ generalinfo.email }}
          </div>
        </div>
        <!--<b-icon icon="clock"></b-icon><span class="info">Local Time</span><br />-->
        <div class="mb-2">
          <b-icon icon="geo-alt"></b-icon
          ><span class="info">{{
            generalinfo.location ? generalinfo.location : "N/A"
          }}</span>
        </div>
        <GmapMap
          v-if="generalinfo.lat && typeof generalinfo.lat == 'number'"
          :center="{ lat: generalinfo.lat, lng: generalinfo.lng }"
          :zoom="15"
          :options="{
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            disableDefaultUI: true,
            draggable: false
          }"
          map-type-id="terrain"
          style="width: 100%; height: 200px"
        >
          <GmapMarker
            :position="{
              lat: generalinfo.lat,
              lng: generalinfo.lng
            }"
            :clickable="false"
            :draggable="false"
          />
        </GmapMap>
      </div>
    </div>
  </detail-card>
</template>

<script>
import DetailCard from "@/components/DetailCard";

export default {
  name: "ArchiveGeneralInfoCard",
  components: {
    DetailCard
  },
  props: {
    generalinfo: Object
  },
  computed: {
    nameShortCut() {
      return this.generalinfo.name.substring(0, 2).toUpperCase();
    }
  },
  data() {
    return {};
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.general-info {
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  color: $specColor;
  .info {
    padding: 3px 5px;
  }
  .user-account {
    height: 50px;
    display: flex;
    .user_symbol_container {
      float: left;
      text-align: center;
      line-height: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 16px;
      opacity: 0.7;
      span.symbol-content {
        display: block;
        width: 40px;
        height: 40px;
        color: rgb(255, 255, 255);
        overflow: hidden;
        border-radius: 50%;
        background: rgb(103, 172, 162);
      }
    }
    .customer-name {
      margin-top: -4px;
    }
  }
}
</style>
