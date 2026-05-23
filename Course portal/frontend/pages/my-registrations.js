import {useState, useEffect} from 'react'
import axios from 'axios'

export default function MyRegistrationsPage() {
    const [registrations, setRegistrations] = useState([])

    useEffect(() => {
        const fetchRegistrations = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                window.location.href = '/login'
                return
            }
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/registrations/', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const regs = response.data
                const courseResponse = await axios.get('http://127.0.0.1:8000/api/courses/')
                const courses = courseResponse.data
                const combined = regs.map(reg => ({
                    ...reg,
                    course_name: courses.find(c => c.id === reg.course)?.title || 'Unknown Course'
                }))
                setRegistrations(combined)
            } catch (err) {
                console.error('Error fetching registrations:', err)
            }
        }
        fetchRegistrations()
    }, [])
    const getStatusColor = (status) => {
        if (status === 'accepted') return 'bg-green-100 text-green-600'
        if (status === 'rejected') return 'bg-red-100 text-red-600'
        return 'bg-blue-100 text-blue-600'
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Registrations</h1>
                <div className="flex gap-4">
                    <a href="/courses" className="text-green-600 font-medium">Browse Courses</a>
                    <button
                        onClick={() => { localStorage.clear(); window.location.href = '/login' }}
                        className="text-red-500 font-medium">
                        Logout
                    </button>
                </div>
            </div>

            {registrations.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-xl">No registrations yet</p>
                    <a href="/courses" className="text-green-600 font-medium mt-4 block">Browse Courses →</a>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {registrations.map((reg) => (
                        <div key={reg.id} className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold mb-1">Course: {reg.course_name}</h2>
                                <p className="text-sm text-gray-500">Applied on: {reg.applied_at}</p>
                            </div>
                            <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(reg.status)}`}>
                                {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}