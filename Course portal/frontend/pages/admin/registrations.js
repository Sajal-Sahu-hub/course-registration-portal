import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminRegistrationsPage() {
    const [registrations, setRegistrations] = useState([])
    const [filtered, setFiltered] = useState([])
    const [courses, setCourses] = useState([])
    const [statusFilter, setStatusFilter] = useState('all')
    const [courseFilter, setCourseFilter] = useState('all')
    const [toast, setToast] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('role')
        if (!token || role !== 'admin') {
            window.location.href = '/login'
            return
        }
        fetchData()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [registrations, statusFilter, courseFilter])

    const showToast = (message, type) => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const fetchData = async () => {
        const token = localStorage.getItem('token')
        try {
            const regRes = await axios.get('http://127.0.0.1:8000/api/registrations/', {
                headers: { Authorization: `Bearer ${token}` }
            })
            const courseRes = await axios.get('http://127.0.0.1:8000/api/courses/')
            setCourses(courseRes.data)

            const combined = regRes.data.map(reg => ({
                ...reg,
                course_name: courseRes.data.find(c => c.id === reg.course)?.title || 'Unknown'
            }))
            setRegistrations(combined)
        } catch (err) {
            console.error('Error fetching data:', err)
        }
    }

    const applyFilters = () => {
        let result = registrations
        if (statusFilter !== 'all') {
            result = result.filter(r => r.status === statusFilter)
        }
        if (courseFilter !== 'all') {
            result = result.filter(r => r.course === parseInt(courseFilter))
        }
        setFiltered(result)
    }

    const handleStatus = async (regId, status, courseId) => {
        const token = localStorage.getItem('token')
        try {
            await axios.patch(
                `http://127.0.0.1:8000/api/registrations/${regId}/`,
                { status: status, course: courseId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            showToast(
                status === 'accepted' ? '✅ Student accepted!' : '❌ Student rejected!',
                status === 'accepted' ? 'success' : 'error'
            )
            fetchData()
        } catch (err) {
            showToast('Something went wrong', 'error')
        }
    }

    const getStatusColor = (status) => {
        if (status === 'accepted') return 'bg-green-100 text-green-600'
        if (status === 'rejected') return 'bg-red-100 text-red-600'
        return 'bg-blue-100 text-blue-600'
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">

            {toast && (
                <div className={`fixed top-6 right-6 px-6 py-3 rounded-lg shadow-lg text-white font-medium z-50 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}>
                    {toast.message}
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">All Registrations</h1>
                <div className="flex gap-4">
                    <a href="/admin/courses" className="text-green-600 font-medium">Manage Courses</a>
                    <button
                        onClick={() => { localStorage.clear(); window.location.href = '/login' }}
                        className="text-red-500 font-medium">
                        Logout
                    </button>
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 outline-none bg-white">
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                </select>

                <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 outline-none bg-white">
                    <option value="all">All Courses</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                </select>

                <div className="ml-auto text-gray-500 text-sm flex items-center">
                    Showing {filtered.length} of {registrations.length} registrations
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-xl">No registrations found</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-4 text-sm font-bold text-gray-500 uppercase">Student</th>
                                <th className="text-left p-4 text-sm font-bold text-gray-500 uppercase">Email</th>
                                <th className="text-left p-4 text-sm font-bold text-gray-500 uppercase">Course</th>
                                <th className="text-left p-4 text-sm font-bold text-gray-500 uppercase">Applied On</th>
                                <th className="text-left p-4 text-sm font-bold text-gray-500 uppercase">Status</th>
                                <th className="text-left p-4 text-sm font-bold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((reg) => (
                                <tr key={reg.id} className="border-t border-gray-100 hover:bg-gray-50">
                                    <td className="p-4 font-medium">
                                        {reg.user_details
                                            ? `${reg.user_details.first_name} ${reg.user_details.last_name}`
                                            : `User ${reg.user}`}
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {reg.user_details ? reg.user_details.email : '-'}
                                    </td>
                                    <td className="p-4 text-gray-600">{reg.course_name}</td>
                                    <td className="p-4 text-gray-600">{reg.applied_at}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reg.status)}`}>
                                            {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {reg.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleStatus(reg.id, 'accepted', reg.course)}
                                                    className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-200">
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleStatus(reg.id, 'rejected', reg.course)}
                                                    className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-200">
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}