


var courseAPI = "http://localhost:3000/courses";

function start() {
    getCourses(renderCourses);
    handleCreateForm();
}



start()


// Functions
function getCourses(callback) {
    fetch(courseAPI)
        .then(function(response) {
            return response.json();
        })
        .then(callback);

}

function createCourse (data, callback) {
    var options = {
        method :"POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(data)
    }
    fetch(courseAPI, options)
        .then(function(response){
            response.json();
        })
        .then(callback);
}

function updateCourse (data, id, callback) {
    var options = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(data)
    };
    fetch(courseAPI + "/" + id, options) 
        .then(function(response) {
            return response.json();
        })
        .then(callback);
}

function handleUpdateCourse(id) {
    var nameTag = document.querySelector(`.course-item-${id} h4`);
    var descriptionTag = document.querySelector(`.course-item-${id} p`);

    var name = document.querySelector("input[name='name']");
    var description = document.querySelector("input[name='description']");
    
    name.value = nameTag.innerText;
    description.value = descriptionTag.innerText;

    var putCourse = document.querySelector("#create");
    putCourse.innerText = "Save";

    putCourse.onclick = function() {
        var data = {
            name: name.value,
            description: description.value
        };
        updateCourse(data, id, function(){
            getCourses(renderCourses);
        })
    }
}

function handleDeleteCourse(id) {
    var options = {
        method :"DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
    }
    fetch(courseAPI + "/" + id, options)
        .then(function(response){
            response.json();
        })
        .then(function() {
            var courseItem = document.querySelector(".course-item-" + id);
            if (courseItem)
                courseItem.remove();
        });
};

function renderCourses(courses) {
    var listCoursesBlock = document.querySelector("#list-courses");
    var htmls = courses.map(function(course) {
        return `
            <li class="course-item-${course.id}">
                <h4>${course.name} </h4>
                <p> ${course.description} </p>
                <button onclick="handleUpdateCourse(${course.id})">UPDATE</button>
                <button onclick="handleDeleteCourse(${course.id})">DELETE</button>
            </li>
        `;
    });
    listCoursesBlock.innerHTML = htmls.join("");
}

function handleCreateForm() {
    var createBtn = document.querySelector("#create");

    createBtn.onclick = (function(){
        var name = document.querySelector("input[name='name']").value;
        var description = document.querySelector("input[name='description']").value;
        var formData = {
            name: name,
            description: description
        };
        createCourse(formData, function(){
            getCourses(renderCourses());
        });
     
    })
}
