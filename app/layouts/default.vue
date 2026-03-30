<script setup>
    
    import AppHeader from '~/components/layout/AppHeader.vue';
    import AppSidebar from '~/components/layout/AppSidebar.vue';
    
    definePageMeta({
        middleware: 'auth'
    })
    
</script>

<template>
    
    <div class="flex h-screen">
        <AppSidebar />

        <div class="flex-1 flex flex-col">
            <AppHeader />

            <main class="p-6 bg-gray-100 flex-1 overflow-y-auto">
                    <slot />
            </main>

        </div>

    </div>

</template>