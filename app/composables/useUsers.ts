export const useUsers = () => {
    const users = [
        { id: 1, name: 'John One', role: 'employee' },
        { id: 2, name: 'Jane Two', role: 'admin' }
    ]

    const getUser = (id: number) => {
        return users.find(u => u.id === id)
    }

    return { users, getUser }
}