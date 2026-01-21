<template>
  <q-page class="q-pa-md bg-grey-2">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">Upravljanje korisnicima</div>

      <q-btn
        label="Logout"
        color="negative"
        icon="logout"
        flat
        dense
        @click="logOutUser"
      />
    </div>

    <q-card flat bordered>
      <q-card-section class="q-pa-none scroll-container">

        <q-table
          :rows="users"
          :columns="columns"
          row-key="id"
          flat
          dense
          wrap-cells
          separator="horizontal"
          :rows-per-page-options="[5, 10, 20]"
          :grid="$q.screen.lt.sm"
        >
          <!-- dropdown meni -->
          <template v-if="!$q.screen.lt.sm" v-slot:body-cell-role="props">
            <q-td :props="props" align="center">
              <q-select
                v-model="props.row.role"
                :options="roleOptions"
                emit-value
                map-options
                dense
                outlined
                rounded
                color="primary"
                style="min-width: 110px"
                @update:model-value="newRole => confirmRoleChange(props.row.id, newRole)"
              />
            </q-td>
          </template>

          <template v-if="!$q.screen.lt.sm" v-slot:body-cell-actions="props">
            <q-td :props="props" align="center">
              <q-btn
                icon="delete"
                color="negative"
                flat
                round
                dense
                @click="confirmDelete(props.row.id)"
              >
                <q-tooltip>Delete user</q-tooltip>
              </q-btn>
            </q-td>
          </template>

          <!-- layout posložen za mobitel -->
          <template v-slot:item="props">
            <div class="q-pa-sm col-12">
              <q-card bordered class="user-card">
                <q-card-section class="q-pb-sm">
                  <div class="row items-start justify-between">
                    <div class="col">
                      <div class="text-subtitle1 text-weight-bold">
                        {{ props.row.username }}
                      </div>
                      <div class="text-caption text-grey-7">
                        {{ props.row.email }}
                      </div>
                      <div class="text-caption text-grey-7 q-mt-xs">
                        ID: {{ props.row.id }}
                      </div>
                    </div>

                    <q-btn
                      icon="delete"
                      color="negative"
                      flat
                      round
                      dense
                      @click="confirmDelete(props.row.id)"
                    />
                  </div>
                </q-card-section>

                <q-separator />

                <q-card-section class="q-pt-sm">
                  <div class="text-caption text-grey-7 q-mb-xs">Role</div>
                  <q-select
                    v-model="props.row.role"
                    :options="roleOptions"
                    emit-value
                    map-options
                    dense
                    outlined
                    rounded
                    color="primary"
                    @update:model-value="newRole => confirmRoleChange(props.row.id, newRole)"
                  />
                </q-card-section>
              </q-card>
            </div>
          </template>

        </q-table>

      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const users = ref([])

const roleOptions = [
  { label: 'Student', value: 'student' },
  { label: 'Invalid', value: 'invalid' },
  { label: 'VIP', value: 'vip' }
]

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'username', label: 'Username', field: 'username', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'role', label: 'Role', field: 'role', align: 'center' },
  { name: 'actions', label: 'Actions', align: 'center', sortable: false }
]

async function fetchUsers () {
  try {
    const res = await axios.get('http://10.0.2.2:3000/api/users')
    users.value = res.data
  } catch (err) {
    console.error('Failed to fetch users:', err)
  }
}

onMounted(fetchUsers)

async function confirmDelete (userId) {
  if (!window.confirm('Delete this user?')) return

  try {
    await axios.delete(`http://10.0.2.2:3000/api/users/${userId}`)
    users.value = users.value.filter(u => u.id !== userId)
  } catch (err) {
    console.error('Neuspješno brisanje korisnika:', err)
  }
}

async function confirmRoleChange (userId, newRole) {
  if (!window.confirm(`Promjeniti ulogu u "${newRole}"?`)) {
    await fetchUsers()
    return
  }

  try {
    await axios.put(`http://10.0.2.2:3000/api/users/${userId}/role`, {
      role: newRole
    })
  } catch (err) {
    console.error('Neuspješna promjena statusa:', err)
    await fetchUsers()
  }
}

function logOutUser () {
  localStorage.removeItem('adminToken')
  router.push('/adminlogin')
}
</script>

<style scoped>
.scroll-container {
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.user-card {
  border-radius: 14px;
}

.text-h5 {
  font-size: 1.35rem;
}

@media (max-width: 400px) {
  .text-h5 {
    font-size: 1.2rem;
  }
}
</style>
