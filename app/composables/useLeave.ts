import { ref } from "vue";

const leaveRequests = ref([
    {
        id: 1,
        userId: 1,
        name: 'John One',
        start: '2026-04-01',
        end: '2026-04-05',
        status: 'pending'
    },
    {
        id: 2,
        userId: 2,
        name: 'Jane Two',
        start: '2026-04-10',
        end: '2026-04-12',
        status: 'approved'
    },
    {
        id: 3,
        userId: 3,
        name: 'Mike Three',
        start: '2026-04-01',
        end: '2025-04-05',
        status: 'pending'
    }
])

export const useLeave = () => {
    const approve = (id: number) => {
        const item = leaveRequests.value.find(l => l.id === id)
        if (item) item.status = 'approved'
    }

    const reject = (id: number) => {
        const item = leaveRequests.value.find(l => l.id === id)
        if (item) item.status = 'rejected'
    }

    return {
        leaveRequests,
        approve,
        reject
    }
}