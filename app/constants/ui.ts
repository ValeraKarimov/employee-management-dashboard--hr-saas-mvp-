export const ui = {
    button: {
        primary: 'inline-flex rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90',
        secondary: 'inline-flex rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 border',
        danger: 'inline-flex rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-100 border'
    },

    card: {
        base: 'rounded-xl border bg-white shadow-sm',
        section: 'rounded-xl border bg-white p-6 shadow-sm',
        stat: 'rounded-xl border bg-white p-5 shadow-sm'
    },

    input: {
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
        text: 'mt-2 text-sm text-gray-500'
    },

    table: {
        wrapper: 'overflow-hidden rounded-xl border bg-white shadow-sm',
        table: 'min-w-full text-sm',
        thead: 'bg-gray-50 text-left',
        th: 'px-4 py-3',
        td: 'px-4 py-3',
        row: 'border-t'
    }
}