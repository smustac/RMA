<template>
  <q-page class="q-pa-xl">
    <div class="text-center q-mb-xl">
      <q-icon name="local_parking" size="56px" color="primary" />
      <h4 class="q-mt-sm q-mb-xs text-white">Pregled Parking Mjesta</h4>
      <div class="text-grey-6">Trenutni status svih parking mjesta</div>
    </div>

    <q-card class="glass-card q-pa-lg shadow-4">
      <div class="row wrap justify-center q-gutter-lg">
        <ParkingSpot
          v-for="p in parking"
          :key="p.id"
          :spot="p"
          :current-user="currentUser"
          @refresh="loadParking"
          
        />
      </div>
    </q-card>
  </q-page>
</template>

<script>
import ParkingSpot from './ParkingSpot.vue'

export default {
  components: { ParkingSpot },
  data () {
    return {
      parking: [],
      currentUser: JSON.parse(localStorage.getItem('user')) || null,
      interval: null
    }
  },
  mounted () {
    this.loadParking()
    this.interval = setInterval(this.loadParking, 1000)
  },
  beforeUnmount() {
    clearInterval(this.interval)
  },
  methods: {
    async loadParking () {
      try {
        const res = await this.$api.get('/parking')
        this.parking = res.data
      } catch (err) {
        console.error('Greška pri dohvaćanju parkinga:', err)
      }
    }
  }
}
</script>
<style scoped>
.parking-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
}
</style>