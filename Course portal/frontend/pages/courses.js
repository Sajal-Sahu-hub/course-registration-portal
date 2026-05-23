import { useState, useEffect } from 'react'
import axios from 'axios'

export default function CoursesPage() {
    const [courses, setCourses] = useState([])
    const [enrolledCourses, setEnrolledCourses] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const coursesResponse = await axios.get('http://127.0.0.1:8000/api/courses/')
                setCourses(coursesResponse.data)

                const token = localStorage.getItem('token')
                if (token) {
                    const regResponse = await axios.get('http://127.0.0.1:8000/api/registrations/', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    const enrolledIds = regResponse.data.map(reg => reg.course)
                    setEnrolledCourses(enrolledIds)
                }
            } catch (err) {
                console.error('Error fetching data:', err)
            }
        }
        fetchData()
    }, [])

    const handleEnroll = async (courseId) => {
        const token = localStorage.getItem('token')
        if (!token) {
            window.location.href = '/login'
            return
        }
        try {
            await axios.post(
                'http://127.0.0.1:8000/api/registrations/',
                { course: courseId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            alert('Successfully enrolled! Status is pending.')
            setEnrolledCourses([...enrolledCourses, courseId])
        } catch (err) {
            if (err.response && err.response.data) {
                alert('You have already enrolled in this course')
            } else {
                alert('Something went wrong')
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Available Courses</h1>
                <div className="flex gap-4">
                    <a href="/my-registrations" className="text-green-600 font-medium">My Registrations</a>
                    <button
                        onClick={() => { localStorage.clear(); window.location.href = '/login' }}
                        className="text-red-500 font-medium">
                        Logout
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-lg shadow p-6">
                        <a href={`/courses/${course.id}`}>
                            <h2 className="text-xl font-bold mb-2 hover:text-green-600 cursor-pointer">{course.title}</h2>
                        </a>
                        <div className="text-sm text-gray-600 mb-1">👨‍🏫 {course.instructor}</div>
                        <div className="text-sm text-gray-600 mb-1">🕒 {course.schedule}</div>
                        <div className="text-sm text-gray-600 mb-4">💺 {course.enrolled_students} / {course.capacity} seats</div>
                        <button
                            onClick={() => handleEnroll(course.id)}
                            disabled={enrolledCourses.includes(course.id)}
                            className={`w-full py-2 rounded-lg font-medium ${enrolledCourses.includes(course.id) ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                            {enrolledCourses.includes(course.id) ? 'Enrolled' : 'Enroll'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}