import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function AdminCourseDetailPage() {
    const [course, setCourse] = useState(null)
    const [registrations, setRegistrations] = useState([])
    const [toast, setToast] = useState(null)
    const router = useRouter()
    const { id } = router.query

    useEffect(() => {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('role')
        if (!token || role !== 'admin') {
            window.location.href = '/login'
            return
        }
        if (id) {
            fetchData()
        }
    }, [id])

    const fetchData = async () => {
        const token = localStorage.getItem('token')
        try {
            const courseRes = await axios.get(`http://127.0.0.1:8000/api/courses/${id}/`)
            setCourse(courseRes.data)

            const regRes = await axios.get('http://127.0.0.1:8000/api/registrations/', {
                headers: { Authorization: `Bearer ${token}` }
            })
            const courseRegs = regRes.data.filter(reg => reg.course === parseInt(id))
            setRegistrations(courseRegs)
        } catch (err) {
            console.error('Error:', err)
        }
    }

    const showToast = (message, type) => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const getStatusColor = (status) => {
        if (status === 'accepted') return 'bg-green-100 text-green-600'
        if (status === 'rejected') return 'bg-red-100 text-red-600'
        return 'bg-blue-100 text-blue-600'
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

    return (
        <div className="min-h-screen bg-gray-100 p-8">

            {toast && (
                <div className={`fixed top-6 right-6 px-6 py-3 rounded-lg shadow-lg text-white font-medium z-50 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}>
                    {toast.message}
                </div>
            )}

            <div className="mb-6 flex justify-between items-center">
                <a href="/admin/courses" className="text-green-600 font-medium">← Back to Courses</a>
                <button
                    onClick={() => { localStorage.clear(); window.location.href = '/login' }}
                    className="text-red-500 font-medium">
                    Logout
                </button>
            </div>

            {course ? (
                <>
                    <div className="bg-white rounded-lg shadow p-8 mb-6">
                        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                        <p className="text-gray-500 mb-4">👨‍🏫 {course.instructor}</p>
                        <p className="text-gray-700 mb-6">{course.description}</p>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-xs font-bold text-gray-400 uppercase mb-1">Schedule</div>
                                <div className="font-medium">{course.schedule}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-xs font-bold text-gray-400 uppercase mb-1">Capacity</div>
                                <div className="font-medium">{course.capacity} seats</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-xs font-bold text-gray-400 uppercase mb-1">Enrolled</div>
                                <div className="font-medium">{course.enrolled_students} students</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold">Registered Students</h2>
                        </div>
                        {registrations.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                No registrations yet for this course
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left p-4 text-sm font-bold text-gray-500 uppercase">Student</th>
                                        <th className="text-left p-4 text-sm font-bold text-gray-500 uppercase">Applied On</th>
                                        <th className="text-left p-4 text-sm font-bold text-gray-500 uppercase">Status</th>
                                        <th className="text-left p-4 text-sm font-bold text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registrations.map((reg) => (
                                        <tr key={reg.id} className="border-t border-gray-100 hover:bg-gray-50">
                                            <td className="p-4 font-medium">
                                                {reg.user_details ? `${reg.user_details.first_name} ${reg.user_details.last_name}` : `User ${reg.user}`}
                                            </td>
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
                </>
            ) : (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-xl">Loading...</p>
                </div>
            )}
        </div>
    )
}