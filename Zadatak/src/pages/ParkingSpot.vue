<template>
  <q-card
    flat
    bordered
    class="parking-card"
    :class="spot.taken ? 'busy' : 'free'"
    @click="handleClick"
  >
    <div class="row items-center no-wrap">
      <q-avatar
        size="40px"
        class="q-mr-sm"
        :class="spot.taken ? 'ava-busy' : 'ava-free'"
      >
        <q-icon :name="icon" color="white" size="22px" />
      </q-avatar>

      <div class="col">
        <div class="row items-center justify-between">
          <div class="text-subtitle2 text-weight-bold">
            {{ typeLabel }}
          </div>

          <q-badge :color="badgeColor" rounded class="q-ml-sm">
            {{ statusLabel }}
          </q-badge>
        </div>

        <div
          v-if="spot.taken && spot.taken_at"
          class="text-caption text-grey-2 q-mt-xs"
        >
          {{ timePassed(spot.taken_at) }}
        </div>
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
  props: {
    spot: { type: Object, required: true },
    currentUser: { type: Object, default: null }
  },

  data () {
    return {
      timer: null,
      baseDiff: null
    }
  },

  computed: {
    userId () {
      return this.currentUser?.id || null
    },

    isMine () {
      return this.spot.taken_by === this.userId
    },

    icon () {
      return this.spot.taken ? 'directions_car' : 'local_parking'
    },

    badgeColor () {
      return this.spot.taken ? 'red-5' : 'green-5'
    },

    statusLabel () {
      return this.spot.taken
        ? (this.isMine ? 'Vaše' : 'Zauzeto')
        : 'Slobodno'
    },

    typeLabel () {
      if (this.spot.type === 'vip') return 'VIP'
      if (this.spot.type === 'invalid') return 'Invalid'
      return 'Student'
    }
  },

  methods: {
    timePassed (takenAt) {
      const takenTime = new Date(takenAt).getTime()
      const now = Date.now()
      let diff = Math.floor((now - takenTime) / 1000)

      if (this.baseDiff === null) {
        this.baseDiff = diff
      }

      diff -= this.baseDiff
      if (diff < 0) diff = 0

      const hours = String(Math.floor(diff / 36000)).padStart(2, '0')
      diff %= 3600

      const minutes = String(Math.floor(diff / 60)).padStart(2, '0')
      const seconds = String(diff % 60).padStart(2, '0')

      return `${hours}:${minutes}:${seconds}`
    },

    async handleClick () {
      try {
        if (!this.userId) {
          return this.$q.notify({
            type: 'warning',
            message: 'Uđi kroz Login ili Gost ulaz'
          })
        }

        if (!this.spot.taken) {
          if (this.spot.type === 'vip' && this.currentUser?.role !== 'vip') {
            return this.$q.notify({
              type: 'warning',
              message: 'Nemate pravo na VIP mjesto'
            })
          }

          if (this.spot.type === 'invalid' && this.currentUser?.role !== 'invalid') {
            return this.$q.notify({
              type: 'warning',
              message: 'Nemate pravo na invalid mjesto'
            })
          }

          await this.$api.post(`/parking/${this.spot.id}/occupy`)
        } else if (this.isMine) {
          await this.$api.post(`/parking/${this.spot.id}/release`)
        } else {
          this.$q.notify({
            type: 'warning',
            message: 'Mjesto je zauzeto'
          })
        }

        this.$emit('refresh')
      } catch (err) {
        this.$q.notify({
          type: 'negative',
          message: err.response?.data?.message || 'Greška'
        })
      }
    }
  },

  mounted () {
    this.timer = setInterval(() => {
      if (this.spot.taken && this.spot.taken_at) {
        this.$forceUpdate()
      }
    }, 1000)
  },

  beforeUnmount () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
.parking-card {
  width: 100%;
  border-radius: 16px;
  padding: 12px;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.parking-card:active {
  transform: scale(0.99);
}

.free {
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.95),
    rgba(22, 163, 74, 0.95)
  );
}

.busy {
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.95),
    rgba(185, 28, 28, 0.95)
  );
}

.ava-free,
.ava-busy {
  background: rgba(255, 255, 255, 0.2);
}

@media (hover: hover) {
  .parking-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 26px rgba(0, 0, 0, 0.35);
  }
}
</style>
