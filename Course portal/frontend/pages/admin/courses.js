import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editCourse, setEditCourse] = useState(null)
    const [toast, setToast] = useState(null)
    const [showConfirm, setShowConfirm] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [form, setForm] = useState({
        title: '', description: '', instructor: '', schedule: '', capacity: ''
    })

    useEffect(() => {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('role')
        if (!token || role !== 'admin') {
            window.location.href = '/login'
            return
        }
        fetchCourses()
    }, [])

    const showToast = (message, type) => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/courses/')
            setCourses(response.data)
        } catch (err) {
            console.error('Error fetching courses:', err)
        }
    }

    const handleSubmit = async () => {
        const token = localStorage.getItem('token')
        try {
            if (editCourse) {
                await axios.put(`http://127.0.0.1:8000/api/courses/${editCourse.id}/`, form, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                showToast('Course updated!', 'success')
            } else {
                await axios.post('http://127.0.0.1:8000/api/courses/', form, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                showToast('Course added!', 'success')
            }
            setShowForm(false)
            setEditCourse(null)
            setForm({ title: '', description: '', instructor: '', schedule: '', capacity: '' })
            fetchCourses()
        } catch (err) {
            showToast('Something went wrong', 'error')
        }
    }

    const handleEdit = (course) => {
        setEditCourse(course)
        setForm({
            title: course.title,
            description: course.description,
            instructor: course.instructor,
            schedule: course.schedule,
            capacity: course.capacity
        })
        setShowForm(true)
    }

    const confirmDelete = (id) => {
        setDeleteId(id)
        setShowConfirm(true)
    }

    const handleDelete = async () => {
        const token = localStorage.getItem('token')
        try {
            await axios.delete(`http://127.0.0.1:8000/api/courses/${deleteId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            showToast('Course deleted!', 'error')
            setShowConfirm(false)
            setDeleteId(null)
            fetchCourses()
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

            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
                        <div className="text-4xl mb-4">🗑️</div>
                        <h2 className="text-xl font-bold mb-2">Delete Course?</h2>
                        <p className="text-gray-500 mb-6">This will permanently delete the course and all its registrations.</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => { setShowConfirm(false); setDeleteId(null) }}
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300">
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600">
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Courses</h1>
                <div className="flex gap-4">
                    <a href="/admin/registrations" className="text-green-600 font-medium">Registrations</a>
                    <button
                        onClick={() => { localStorage.clear(); window.location.href = '/login' }}
                        className="text-red-500 font-medium">
                        Logout
                    </button>
                </div>
            </div>

            <button
                onClick={() => { setShowForm(true); setEditCourse(null); setForm({ title: '', description: '', instructor: '', schedule: '', capacity: '' }) }}
                className="mb-6 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700">
                + Add New Course
            </button>

            {showForm && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">{editCourse ? 'Edit Course' : 'Add New Course'}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="Course title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Instructor</label>
                            <input
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
                                value={form.instructor}
                                onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                                placeholder="Instructor name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Schedule</label>
                            <input
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
                                value={form.schedule}
                                onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                                placeholder="e.g. Mon/Wed 3pm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Capacity</label>
                            <input
                                type="number"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
                                value={form.capacity}
                                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                                placeholder="30"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Course description"
                                rows={3}
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={handleSubmit}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700">
                            {editCourse ? 'Update Course' : 'Save Course'}
                        </button>
                        <button
                            onClick={() => { setShowForm(false); setEditCourse(null) }}
                            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left p-4 text-sm font-bold text-gray-500 uppercase">Title</th>
                            <th className="text-left p-4 text-sm font-bold text-gray-500 uppercase">Instructor</th>
                            <th className="text-left p-4 text-sm font-bold text-gray-500 uppercase">Schedule</th>
                            <th className="text-left p-4 text-sm font-bold text-gray-500 uppercase">Description</th>
                            <th className="text-left p-4 text-sm font-bold text-gray-500 uppercase">Capacity</th>
                            <th className="text-left p-4 text-sm font-bold text-gray-500 uppercase">Enrolled</th>
                            <th className="text-left p-4 text-sm font-bold text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.id} className="border-t border-gray-100 hover:bg-gray-50">
                                <td className="p-4 font-medium">
                                    <a href={`/admin/courses/${course.id}`} className="text-green-600 hover:underline">
                                        {course.title}
                                    </a>
                                </td>
                                <td className="p-4 text-gray-600">{course.instructor}</td>
                                <td className="p-4 text-gray-600">{course.schedule}</td>
                                <td className="p-4 text-gray-600 max-w-xs truncate">{course.description}</td>
                                <td className="p-4 text-gray-600">{course.capacity}</td>
                                <td className="p-4 text-gray-600">{course.enrolled_students}</td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(course)}
                                            className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-200">
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => confirmDelete(course.id)}
                                            className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-200">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}