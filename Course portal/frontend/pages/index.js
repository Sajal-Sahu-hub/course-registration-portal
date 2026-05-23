import { useEffect } from 'react'

export default function Home() {
    useEffect(() => {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('role')

        if (!token) {
            window.location.href = '/login'
            return
        }

        if (role === 'admin') {
            window.location.href = '/admin/courses'
        } else {
            window.location.href = '/courses'
        }
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <p className="text-gray-400">Redirecting...</p>
        </div>
    )
}