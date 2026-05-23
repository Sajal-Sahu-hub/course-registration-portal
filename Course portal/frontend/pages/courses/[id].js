import {useState, useEffect} from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function CourseDetailPage() {
    const [course, setCourse] = useState(null)
    const [enrolled, setEnrolled] = useState(false)
    const router = useRouter()
    const { id } = router.query

    useEffect(() => {
    const fetchCourse = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/courses/${id}/`)
            setCourse(response.data)

            const token = localStorage.getItem('token')
            if (token) {
                const regResponse = await axios.get('http://127.0.0.1:8000/api/registrations/', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const alreadyEnrolled = regResponse.data.some(reg => reg.course === parseInt(id))
                setEnrolled(alreadyEnrolled)
            }
        } catch (err) {
            console.error('Error fetching course:', err)
        }
    }
    if (id) {
        fetchCourse()
    }
}, [id])
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
        setEnrolled(true)
    } catch (err) {
        alert('You have already enrolled or something went wrong')
    }
}

    return (
    <div className="min-h-screen bg-gray-100 p-8">
        
        <div className="mb-6">
            <a href="/courses" className="text-green-600 font-medium">← Back to Courses</a>
        </div>

        {course ? (
            <div className="bg-white rounded-lg shadow p-8 max-w-3xl mx-auto">
                
                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                <p className="text-gray-500 mb-6">👨‍🏫 {course.instructor}</p>

                <p className="text-gray-700 mb-8 leading-relaxed">{course.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
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
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-xs font-bold text-gray-400 uppercase mb-1">Available Seats</div>
                        <div className="font-medium">{course.capacity - course.enrolled_students} remaining</div>
                    </div>
                </div>

                <button
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrolled}
                    className={`w-full py-3 rounded-lg font-medium text-lg ${enrolled ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                    {enrolled ? 'Already Applied' : 'Enroll Now'}
                </button>

            </div>
        ) : (
            <div className="text-center py-20 text-gray-400">
                <p className="text-xl">Loading course...</p>
            </div>
        )}

    </div>
)
}