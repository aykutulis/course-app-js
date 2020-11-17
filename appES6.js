// Course Class
class Course {
    constructor(title, instructor, image) {
        this.courseId = Math.floor(Math.random() * 10000);
        this.title = title;
        this.instructor = instructor;
        this.image = image;
    }
}

// UI Class
class UI {
    addCourseToList(course) {
        const list = document.getElementById('course-list');
        let html = `
            <tr>
            <td><img class="img-fluid" src="images/${course.image}"/></td>
            <td>${course.title}</td>
            <td>${course.instructor}</td>
            <td><a href="#" data-id="${course.courseId}" class="btn btn-danger btn-sm delete">Delete</a></td>
            </tr>
        `;
        list.innerHTML += html;
    }

    clearControls() {
        const title = document.getElementById('title').value = "";
        const instructor = document.getElementById('instructor').value = "";
        const image = document.getElementById('image').value = "";
    }

    deleteCourse(element) {
        if (element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
            return true;
        }
    }

    showAlert(message, className) {
        let alert = `
        <div class="alert alert-${className}">
        ${message}
        </div>
    `;
        const row = document.querySelector('.row');

        // beforeBegin afterBegin beforeEnd afterEnd
        row.insertAdjacentHTML('beforeBegin', alert);

        setTimeout(() => {
            $('.alert').fadeOut('slow');
        }, 3000);
    }
}

// Storage Class
class Storage {
    static getCourses() {
        let courses;

        if (localStorage.getItem('courses') === null) {
            courses = [];
        } else {
            courses = JSON.parse(localStorage.getItem('courses'));
        }
        return courses;
    }

    static displayCourses() {
        let courses = Storage.getCourses();
        courses.forEach(course => {
            const ui = new UI();
            ui.addCourseToList(course);
        });
    }

    static addCourse(course) {
        let courses = Storage.getCourses();
        courses.push(course);
        localStorage.setItem('courses', JSON.stringify(courses));
    }

    static deleteCourse(element) {
        if (element.classList.contains('delete')) {
            const id = element.getAttribute('data-id');
            const courses = Storage.getCourses();
            courses.forEach((course, index) => {
                if (course.courseId == id) {
                    courses.splice(index, 1);
                }
            });
            localStorage.setItem('courses', JSON.stringify(courses));
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', Storage.displayCourses)

document.getElementById('new-course').addEventListener('submit', function (e) {
    const title = document.getElementById('title').value;
    const instructor = document.getElementById('instructor').value;
    const image = document.getElementById('image').value;

    // Create Course Object
    const course = new Course(title, instructor, image);

    // Create UI
    const ui = new UI();

    if (title === '' || instructor === '' || image === '') {
        ui.showAlert('Please complete the form', 'warning');
    } else {
        // Add Course To List
        ui.addCourseToList(course);

        // Save To LS
        Storage.addCourse(course);

        // Clear Controls
        ui.clearControls();

        ui.showAlert('The course has been added', 'success');
    }

    e.preventDefault();
});

document.getElementById('course-list').addEventListener('click', function (e) {
    const ui = new UI();

    // Delete Course
    if (ui.deleteCourse(e.target)) {

        // Delete From LS
        Storage.deleteCourse(e.target);

        ui.showAlert('The course has been deleted', 'danger');
    }
});

