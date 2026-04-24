export const ui = {
    button: {
        primary: 'inline-flex rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed',
        secondary: 'inline-flex rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 border disabled:opacity-50 disabled:cursor-not-allowed',
        danger: 'inline-flex rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-100 border disabled:opacity-50 disabled:cursor-not-allowed'
    },

    card: {
        base: 'rounded-xl border bg-white shadow-sm',
        section: 'rounded-xl border bg-white p-6 shadow-sm',
        stat: 'rounded-xl border bg-white p-5 shadow-sm',
        statLabel: 'text-sm text-gray-500',
        statValue: 'mt-2 text-3xl font-bold',
        actions: 'mt-4',
        detail: 'rounded-xl border bg-white p-5 shadow-sm space-y-4',
        nested: 'rounded-lg border p-4'
    },

    input: {
        wrapper: 'rounded-xl border bg-white p-4 shadow-sm',
        base: 'w-full rounded-lg border px-3 py-2 outline-none'
    },

    badge: {
        base: 'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
        roleAdmin: 'bg-purple-100 text-purple-700',
        roleEmployee: 'bg-blue-100 text-blue-700',
        statusActive: 'bg-green-100 text-green-700',
        statusInactive: 'bg-gray-100 text-gray-700',
        leavePending: 'bg-yellow-100 text-yellow-700',
        leaveApproved: 'bg-green-100 text-green-700',
        leaveRejected: 'bg-red-100 text-red-700'
    },

    emptyState: {
        base: 'rounded-xl border bg-white p-10 text-center shadow-sm',
        title: 'text-lg font-semibold',
        text: 'mt-2 text-sm text-gray-500',
        actions: 'mt-4 flex justify-center'
    },

    table: {
        wrapper: 'overflow-hidden rounded-xl border bg-white shadow-sm',
        table: 'min-w-full text-sm',
        thead: 'bg-gray-50 text-left',
        th: 'px-4 py-3',
        td: 'px-4 py-3',
        row: 'border-t'
    },
    page: {
        wrapper: 'space-y-6',
        header: 'flex items-start justify-between',
        title: 'text-2xl font-bold',
        description: 'text-sm text-gray-500',
        narrow: 'max-w-2xl space-y-6'
    },
    section: {
        title: 'text-lg font-semibold',
        description: 'mt-1 text-sm text-gray-500',
    },
    actions: {
        row: 'flex items-center gap-2',
        end: 'flex items-center justify-end gap-2'
    },
    form: {
        field: 'space-y-1',
        label: 'block text-sm font-medium',
        error: 'mt-1 text-sm text-red-600',
        actions: 'flex gap-3 pt-2'
    },
    details: {
        grid: 'grid gap-4 md:grid-cols-2',
        item: 'space-y-1',
        label: 'text-sm text-gray-500',
        value: 'font-medium'
    }
}