<template>
  <q-page class="q-pa-md">
    <div class="text-center q-mb-md">
      <q-icon name="local_parking" size="44px" color="primary" />
      <div class="text-h6 text-white q-mt-sm">Pregled Parking Mjesta</div>
      <div class="text-grey-6 text-caption">Trenutni status svih parking mjesta</div>
    </div>

    <q-card class="glass-card q-pa-md">
      <div class="parking-grid">
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
  data() {
    return {
      parking: [],
      currentUser: JSON.parse(localStorage.getItem('user')) || null,
      interval: null
    }
  },
  mounted() {
    this.loadParking()
    this.interval = setInterval(this.loadParking, 1000)
  },
  beforeUnmount() {
    clearInterval(this.interval)
  },
  methods: {
    async loadParking() {
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

.glass-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  border-radius: 18px;
}


.parking-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}


@media (min-width: 420px) {
  .parking-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
}


@media (min-width: 900px) {
  .parking-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
}
</style>
