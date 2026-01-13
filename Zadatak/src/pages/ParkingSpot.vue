<template>
  <q-card flat bordered class="column items-center q-pa-xs parking-card parking-spot"
    :class="spot.taken ? 'busy' : 'free'"
    @click="handleClick"
  >
    <q-icon :name="icon" :color="color" size="32px" class="q-mb-sm"/>
    <div class="text-subtitle1 text-bold">{{ typeLabel }}</div>

    <q-badge :color="badgeColor" class="q-mt-xs" align="middle">
      {{ statusLabel }}
    </q-badge>

    <div v-if="spot.taken && spot.taken_at" class="text-caption q-mt-xs">
      {{ timePassed(spot.taken_at) }}
    </div>
  </q-card>
</template>

<script>
export default {
  props: {
    spot: { type: Object, required: true },
    currentUser: { type: Object, default: null }
  },
  data() {
    return {
      timer: null
    }
  },
  computed: {
    userId() {
      return this.currentUser?.id || null
    },
    isMine() {
      return this.spot.taken_by == this.userId
    },
    icon() { return this.spot.taken ? 'directions_car' : 'local_parking' },
    color() { return this.spot.taken ? 'negative' : 'positive' },
    badgeColor() { return this.spot.taken ? 'red-5' : 'green-5' },
    statusLabel() { return this.spot.taken ? (this.isMine ? 'Vaše' : 'Zauzeto') : 'Slobodno' },
    typeLabel() {
      if (this.spot.type === 'vip') return 'VIP'
      if (this.spot.type === 'invalid') return 'Invalid'
      return 'Student'
    }
  },
  methods: {
    timePassed(takenAt) {
      const takenTime = new Date(takenAt).getTime()
      const now = Date.now()
      let diff = Math.floor((now - takenTime) / 1000) 

      const hours = String(Math.floor(diff / 36000)).padStart(2, '0')
      diff %= 3600
      const minutes = String(Math.floor(diff / 60)).padStart(2, '0')
      const seconds = String(diff % 60).padStart(2, '0')

      return `${hours}:${minutes}:${seconds}`
    },
    async handleClick() {
      try {
        if (!this.userId) {
          return this.$q.notify({ type: 'warning', message: 'Uđi kroz Login ili Gost ulaz' })
        }
        if (!this.spot.taken) {
          if (this.spot.type === 'vip' && this.currentUser?.role !== 'vip') {
            return this.$q.notify({ type: 'warning', message: 'Nemate pravo na VIP mjesto' })
          }
          if (this.spot.type === 'invalid' && this.currentUser?.role !== 'invalid') {
            return this.$q.notify({ type: 'warning', message: 'Nemate pravo na invalid mjesto' })
          }
          await this.$api.post(`/parking/${this.spot.id}/occupy`)
        } else if (this.isMine) {
          await this.$api.post(`/parking/${this.spot.id}/release`)
        } else {
          this.$q.notify({ type: 'warning', message: 'Mjesto je zauzeto' })
        }

        this.$emit('refresh')
      } catch (err) {
        this.$q.notify({ type: 'negative', message: err.response?.data?.message || 'Greška' })
      }
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      if (this.spot.taken && this.spot.taken_at) {
        this.$forceUpdate()
      }
    }, 1000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
.parking-card {
  width: 100%;
  min-height: 160px;
  border-radius: 18px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.parking-card:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
}

.free {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.busy {
  background: linear-gradient(135deg, #ef4444, #b91c1c);
}

.time {
  margin-top: 8px;
  font-size: 14px;
  opacity: 0.9;
}
.parking-spot{width:170px;height:120px;border-radius:12px;}
</style>
