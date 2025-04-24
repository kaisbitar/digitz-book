<template>
  <div>
    <AppNav />

    <div class="home-container">
      <div class="content-wrapper">
        <div class="welcome-section">
          <h1 class="main-title">كيف تريد أن تتفاعل مع القرآن اليوم؟</h1>
        </div>

        <div class="search-section">
          <div class="search-container">
            <AutoBoard :showDeleteButton="false" />
          </div>
        </div>

        <div class="interaction-options">
          <button
            v-for="option in interactionOptions"
            :key="option.id"
            class="option-button"
            @click="navigateTo(option.route)"
          >
            <v-icon size="x-large">{{ option.icon }}</v-icon>
            <span class="option-text">{{ option.text }}</span>
          </button>
        </div>

        <!-- <div class="recent-section" v-if="recentActivities.length">
          <h3>نشاطات سابقة</h3>
          <div class="recent-items">
            <button
              v-for="activity in recentActivities"
              :key="activity.id"
              class="recent-item"
              @click="handleRecentActivity(activity)"
            >
              <v-icon>{{ activity.icon }}</v-icon>
              <span>{{ activity.text }}</span>
            </button>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const searchQuery = ref("")
const drawer = ref(false)

const interactionOptions = [
  {
    id: 1,
    text: "السور",
    icon: "mdi-book-open-outline",
    route: "/sura",
  },
  {
    id: 2,
    text: "ترتيل",
    icon: "mdi-database-search-outline",
    route: "/tarteel",
  },
  {
    id: 3,
    text: "تدبري",
    icon: "mdi-account-outline",
    route: "/tafsiri",
  },
]

const recentActivities = ref([
  {
    id: 1,
    text: "سورة البقرة",
    icon: "mdi-history",
    route: "/suar/2",
  },
  {
    id: 2,
    text: 'آخر بحث: "الرحمن"',
    icon: "mdi-magnify",
    route: "/search?q=الرحمن",
  },
])

const navigateTo = (path) => {
  router.push(path)
}

const handleRecentActivity = (activity) => {
  router.push(activity.route)
}
</script>

<style scoped>
.home-container {
  min-height: calc(100vh - 64px); /* Adjust for app bar height */
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(var(--v-theme-background));
  padding: 1rem;
}

.content-wrapper {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.welcome-section {
  margin-bottom: 2.5rem;
}

.main-title {
  font-size: 2rem;
  color: rgb(var(--v-theme-on-background));
  margin-bottom: 1rem;
  font-family: "Almarai", sans-serif;
}

.search-section {
  margin-bottom: 3rem;
}

.search-container {
  /* display: flex; */
  align-items: center;
  max-width: 650px;
  margin: 0 auto;
  background: rgb(var(--v-theme-surface));
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  transition: box-shadow 0.3s ease;
}

.search-container:focus-within {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.search-input {
  flex: 1;
  padding: 1rem;
  border: none;
  font-size: 1.1rem;
  background: transparent;
  color: rgb(var(--v-theme-on-surface));
  font-family: "Almarai", sans-serif;
}

.search-input:focus {
  outline: none;
}

.search-button {
  background: transparent;
  color: rgb(var(--v-theme-primary));
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.search-button:hover {
  color: rgb(var(--v-theme-secondary));
}

.interaction-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.option-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 1rem;
  background: rgb(var(--v-theme-surface));
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.option-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.option-text {
  font-family: "Almarai", sans-serif;
  color: rgb(var(--v-theme-on-surface));
  font-size: 1.2rem;
}

.recent-section {
  margin-top: 2rem;
}

.recent-section h3 {
  font-family: "Almarai", sans-serif;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.recent-items {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.2rem;
  background: rgb(var(--v-theme-surface-light));
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgb(var(--v-theme-on-surface));
}

.recent-item:hover {
  background: rgb(var(--v-theme-surface));
}

@media (max-width: 768px) {
  .main-title {
    font-size: 1.75rem;
  }

  .search-container {
    margin: 0 1rem;
  }

  .interaction-options {
    grid-template-columns: repeat(2, 1fr);
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .interaction-options {
    grid-template-columns: 1fr;
  }
}
</style>
